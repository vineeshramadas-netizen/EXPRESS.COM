type BookingEmail = {
    bookingId: string;
    hotelName: string;
    roomTitle: string;
    startDate: Date;
    endDate: Date;
    totalPrice: string;
};
export declare class EmailService {
    constructor();
    sendBookingConfirmation(to: string, info: BookingEmail): Promise<void>;
}
export {};
