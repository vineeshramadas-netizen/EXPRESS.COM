import { PrismaService } from '../prisma/prisma.service';
export declare class AdminController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listBookings(): import(".prisma/client").Prisma.PrismaPromise<{
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
    refund(body: {
        bookingId: string;
    }): Promise<{
        success: boolean;
    }>;
}
