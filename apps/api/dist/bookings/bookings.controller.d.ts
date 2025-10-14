import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
declare class HoldDto {
    roomId: string;
    startDate: string;
    endDate: string;
    guests: number;
}
export declare class BookingsController {
    private readonly bookings;
    private readonly prisma;
    private stripe;
    constructor(bookings: BookingsService, prisma: PrismaService);
    hold(body: HoldDto): Promise<{
        holdId: string;
        expiresAt: Date;
    }>;
    confirm(req: any, body: {
        holdId: string;
    }): Promise<{
        clientSecret: string | null;
    }>;
    cancel(req: any, id: string): Promise<{
        success: boolean;
    }>;
    get(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        hotelId: string;
        roomId: string;
        startDate: Date;
        endDate: Date;
        guests: number;
        nights: number;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.BookingStatus;
        stripePaymentId: string | null;
        userId: string;
    }>;
    myBookings(req: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        hotelId: string;
        roomId: string;
        startDate: Date;
        endDate: Date;
        guests: number;
        nights: number;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.BookingStatus;
        stripePaymentId: string | null;
        userId: string;
    }[]> | never[];
}
export declare class StripeWebhookController {
    private readonly bookings;
    private stripe;
    constructor(bookings: BookingsService);
    handle(req: any, sig: string): Promise<{
        received: boolean;
    }>;
}
export {};
