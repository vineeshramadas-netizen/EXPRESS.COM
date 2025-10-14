import { HotelsService } from './hotels.service';
export declare class HotelsController {
    private readonly hotels;
    constructor(hotels: HotelsService);
    list(city?: string, priceMin?: string, priceMax?: string, page?: string, pageSize?: string): Promise<{
        items: {
            id: string;
            name: string;
            createdAt: Date;
            city: string;
            description: string | null;
            address: string;
            country: string;
            images: string[];
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
            images: string[];
            title: string;
            roomType: import(".prisma/client").$Enums.RoomType;
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
        images: string[];
        rating: number | null;
    }) | null>;
}
export declare class AdminHotelsController {
    private readonly hotels;
    constructor(hotels: HotelsService);
    create(body: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        city: string;
        description: string | null;
        address: string;
        country: string;
        images: string[];
        rating: number | null;
    }>;
    update(id: string, body: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        city: string;
        description: string | null;
        address: string;
        country: string;
        images: string[];
        rating: number | null;
    }>;
}
