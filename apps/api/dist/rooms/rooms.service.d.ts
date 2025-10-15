import { PrismaService } from '../prisma/prisma.service';
export declare class RoomsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: any): import(".prisma/client").Prisma.Prisma__RoomClient<{
        id: string;
        createdAt: Date;
        description: string | null;
        images: string;
        title: string;
        roomType: string;
        pricePerNight: import("@prisma/client/runtime/library").Decimal;
        maxGuests: number;
        totalInventory: number;
        hotelId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: any): import(".prisma/client").Prisma.Prisma__RoomClient<{
        id: string;
        createdAt: Date;
        description: string | null;
        images: string;
        title: string;
        roomType: string;
        pricePerNight: import("@prisma/client/runtime/library").Decimal;
        maxGuests: number;
        totalInventory: number;
        hotelId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__RoomClient<{
        id: string;
        createdAt: Date;
        description: string | null;
        images: string;
        title: string;
        roomType: string;
        pricePerNight: import("@prisma/client/runtime/library").Decimal;
        maxGuests: number;
        totalInventory: number;
        hotelId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
