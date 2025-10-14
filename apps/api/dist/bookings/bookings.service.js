"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const date_fns_1 = require("date-fns");
const stripe_1 = __importDefault(require("stripe"));
const email_service_1 = require("../common/email/email.service");
let BookingsService = class BookingsService {
    constructor(prisma, email) {
        this.prisma = prisma;
        this.email = email;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_xxx', { apiVersion: '2024-06-20' });
        this.holdMinutes = 15;
    }
    async isAvailable(roomId, startDate, endDate) {
        if (!(0, date_fns_1.isBefore)(startDate, endDate))
            throw new common_1.BadRequestException('Invalid date range');
        const overlappingBookings = await this.prisma.booking.count({
            where: {
                roomId,
                status: { in: ['PENDING', 'CONFIRMED'] },
                NOT: [{ endDate: { lte: startDate } }, { startDate: { gte: endDate } }],
            },
        });
        const now = new Date();
        const overlappingHolds = await this.prisma.bookingHold.count({
            where: {
                roomId,
                expiresAt: { gt: now },
                NOT: [{ endDate: { lte: startDate } }, { startDate: { gte: endDate } }],
            },
        });
        return overlappingBookings === 0 && overlappingHolds === 0;
    }
    async hold(roomId, startDate, endDate, guests) {
        const room = await this.prisma.room.findUnique({ where: { id: roomId } });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        if (guests > room.maxGuests)
            throw new common_1.BadRequestException('Too many guests');
        const available = await this.isAvailable(roomId, startDate, endDate);
        if (!available)
            throw new common_1.BadRequestException('Room not available');
        const expiresAt = (0, date_fns_1.addDays)(new Date(), 0);
        expiresAt.setMinutes(expiresAt.getMinutes() + this.holdMinutes);
        const hold = await this.prisma.bookingHold.create({ data: { roomId, startDate, endDate, expiresAt, guests } });
        return { holdId: hold.id, expiresAt };
    }
    async confirm(holdId, userId) {
        const hold = await this.prisma.bookingHold.findUnique({ where: { id: holdId } });
        if (!hold || hold.expiresAt < new Date())
            throw new common_1.BadRequestException('Hold expired');
        const room = await this.prisma.room.findUnique({ where: { id: hold.roomId } });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        const nights = (0, date_fns_1.differenceInCalendarDays)(hold.endDate, hold.startDate);
        const totalPrice = room.pricePerNight.mul(nights);
        const booking = await this.prisma.booking.create({
            data: {
                userId,
                hotelId: room.hotelId,
                roomId: room.id,
                startDate: hold.startDate,
                endDate: hold.endDate,
                nights,
                guests: hold.guests ?? 1,
                totalPrice,
                status: 'PENDING',
            },
        });
        const pi = await this.stripe.paymentIntents.create({
            amount: Math.round(Number(totalPrice) * 100),
            currency: 'usd',
            metadata: { bookingId: booking.id, holdId },
            automatic_payment_methods: { enabled: true },
        });
        await this.prisma.booking.update({ where: { id: booking.id }, data: { stripePaymentId: pi.id } });
        return { clientSecret: pi.client_secret };
    }
    async finalizeFromWebhook(event) {
        if (event.type === 'payment_intent.succeeded') {
            const pi = event.data.object;
            const bookingId = pi.metadata?.bookingId;
            if (bookingId) {
                const updated = await this.prisma.booking.update({ where: { id: bookingId }, data: { status: 'CONFIRMED' } });
                const booking = await this.prisma.booking.findUnique({ where: { id: bookingId }, include: { user: true, room: true, hotel: true } });
                if (booking) {
                    this.email
                        .sendBookingConfirmation(booking.user.email, {
                        bookingId: booking.id,
                        hotelName: booking.hotel.name,
                        roomTitle: booking.room.title,
                        startDate: booking.startDate,
                        endDate: booking.endDate,
                        totalPrice: booking.totalPrice.toString(),
                    })
                        .catch(() => undefined);
                }
            }
        }
        if (event.type === 'payment_intent.canceled') {
            const pi = event.data.object;
            const bookingId = pi.metadata?.bookingId;
            if (bookingId)
                await this.prisma.booking.update({ where: { id: bookingId }, data: { status: 'CANCELLED' } });
        }
    }
    async get(bookingId, requesterId, isAdmin) {
        const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (!isAdmin && booking.userId !== requesterId)
            throw new common_1.UnauthorizedException();
        return booking;
    }
    async listForUser(userId) {
        return this.prisma.booking.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    }
    async cancel(bookingId, requesterId, isAdmin) {
        const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (!isAdmin && booking.userId !== requesterId)
            throw new common_1.UnauthorizedException();
        await this.prisma.booking.update({ where: { id: bookingId }, data: { status: 'REFUNDED' } });
        // In test env we simulate refund; in prod use stripe.refunds.create
        return { success: true };
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, email_service_1.EmailService])
], BookingsService);
