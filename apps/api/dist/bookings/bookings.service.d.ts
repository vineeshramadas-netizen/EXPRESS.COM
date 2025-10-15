import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { EmailService } from '../common/email/email.service';
export declare class BookingsService {
    private readonly prisma;
    private readonly email;
    private stripe;
    private holdMinutes;
    constructor(prisma: PrismaService, email: EmailService);
    isAvailable(roomId: string, startDate: Date, endDate: Date): Promise<boolean>;
    hold(roomId: string, startDate: Date, endDate: Date, guests: number): Promise<{
        holdId: string;
        expiresAt: Date;
    }>;
    confirm(holdId: string, userId: string): Promise<{
        clientSecret: string | null;
    }>;
    finalizeFromWebhook(event: Stripe.Event): Promise<void>;
    get(bookingId: string, requesterId: string, isAdmin: boolean): Promise<{
        id: string;
        createdAt: Date;
        hotelId: string;
        roomId: string;
        startDate: Date;
        endDate: Date;
        guests: number;
        nights: number;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        status: string;
        stripePaymentId: string | null;
        userId: string;
    }>;
    listForUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        hotelId: string;
        roomId: string;
        startDate: Date;
        endDate: Date;
        guests: number;
        nights: number;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        status: string;
        stripePaymentId: string | null;
        userId: string;
    }[]>;
    cancel(bookingId: string, requesterId: string, isAdmin: boolean): Promise<{
        success: boolean;
    }>;
}
