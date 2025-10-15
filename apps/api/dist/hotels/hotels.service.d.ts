import { PrismaService } from '../prisma/prisma.service';
export declare class HotelsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(params: {
        city?: string;
        priceMin?: number;
        priceMax?: number;
        page?: number;
        pageSize?: number;
    }): Promise<{
        items: {
            id: string;
            name: string;
            createdAt: Date;
            city: string;
            description: string | null;
            address: string;
            country: string;
            images: string;
            rating: number | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    byId(id: string): Promise<({
        rooms: {
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
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        city: string;
        description: string | null;
        address: string;
        country: string;
        images: string;
        rating: number | null;
    }) | null>;
    create(data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        city: string;
        description: string | null;
        address: string;
        country: string;
        images: string;
        rating: number | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        city: string;
        description: string | null;
        address: string;
        country: string;
        images: string;
        rating: number | null;
    }>;
}
