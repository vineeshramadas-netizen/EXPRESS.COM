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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = exports.StripeWebhookController = exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const bookings_service_1 = require("./bookings.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const stripe_1 = __importDefault(require("stripe"));
const prisma_service_1 = require("../prisma/prisma.service");
class HoldDto {
}
let BookingsController = class BookingsController {
    constructor(bookings, prisma) {
        this.bookings = bookings;
        this.prisma = prisma;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_xxx', { apiVersion: '2024-06-20' });
    }
    async hold(body) {
        const { roomId, startDate, endDate, guests } = body;
        const res = await this.bookings.hold(roomId, new Date(startDate), new Date(endDate), guests);
        return res;
    }
    async confirm(req, body) {
        const userId = req.user.userId;
        return this.bookings.confirm(body.holdId, userId);
    }
    cancel(req, id) {
        return this.bookings.cancel(id, req.user.userId, !!req.user.isAdmin);
    }
    get(req, id) {
        return this.bookings.get(id, req.user.userId, !!req.user.isAdmin);
    }
    myBookings(req, userId) {
        if (userId !== req.user.userId && !req.user.isAdmin) {
            return [];
        }
        return this.bookings.listForUser(userId);
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)('hold'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [HoldDto]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "hold", null);
__decorate([
    (0, common_1.Post)('confirm'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "confirm", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "get", null);
__decorate([
    (0, common_1.Get)('/users/:userId/bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "myBookings", null);
exports.BookingsController = BookingsController = __decorate([
    (0, swagger_1.ApiTags)('bookings'),
    (0, common_1.Controller)('api/bookings'),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService, prisma_service_1.PrismaService])
], BookingsController);
let StripeWebhookController = class StripeWebhookController {
    constructor(bookings) {
        this.bookings = bookings;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_xxx', { apiVersion: '2024-06-20' });
    }
    async handle(req, sig) {
        const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
        const event = this.stripe.webhooks.constructEvent(req.rawBody, sig, secret);
        await this.bookings.finalizeFromWebhook(event);
        return { received: true };
    }
};
exports.StripeWebhookController = StripeWebhookController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StripeWebhookController.prototype, "handle", null);
exports.StripeWebhookController = StripeWebhookController = __decorate([
    (0, swagger_1.ApiTags)('webhooks'),
    (0, common_1.Controller)('api/webhooks/stripe'),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], StripeWebhookController);
let TestController = class TestController {
    constructor(bookings) {
        this.bookings = bookings;
    }
    async forceConfirm(holdId, req) {
        if (process.env.NODE_ENV !== 'e2e' && process.env.NODE_ENV !== 'development') {
            return { ok: false };
        }
        const userId = (req.user && req.user.userId) || 'test-user';
        return this.bookings.confirm(holdId, userId);
    }
};
exports.TestController = TestController;
__decorate([
    (0, common_1.Post)('force-confirm'),
    __param(0, (0, common_1.Query)('holdId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TestController.prototype, "forceConfirm", null);
exports.TestController = TestController = __decorate([
    (0, swagger_1.ApiTags)('test'),
    (0, common_1.Controller)('api/test'),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], TestController);
