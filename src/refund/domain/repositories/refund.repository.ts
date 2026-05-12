import { RefundEntity } from '../entities/refund.entity';

export interface IRefundRepository {
    save(refund: RefundEntity): Promise<void>;
    findById(id: string): Promise<RefundEntity | null>;
    findByBookingId(bookingId: string): Promise<RefundEntity | null>;
}
