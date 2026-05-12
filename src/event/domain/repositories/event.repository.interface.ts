import { Event } from '../entities/event.entity';

// Konstanta ini sangat berguna untuk Dependency Injection (DI) di NestJS nanti
export const I_EVENT_REPOSITORY = 'IEventRepository';

export interface IEventRepository {
    /**
     * Menyimpan entitas Event baru atau memperbarui yang sudah ada
     * ke dalam database.
     */
    save(event: Event): Promise<void>;

    /**
     * Mengambil entitas Event berdasarkan ID.
     * Ini belum terpakai di User Story 1, tapi pasti akan sangat
     * dibutuhkan di User Story selanjutnya (misal untuk Publish Event).
     */
    findById(id: string): Promise<Event | null>;
}