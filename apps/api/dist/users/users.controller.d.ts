import { PrismaService } from '../prisma/prisma.service';
export declare class UsersController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    bookings(req: any, userId: string): Promise<{
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
    }[]>;
}
