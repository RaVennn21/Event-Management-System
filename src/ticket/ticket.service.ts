import { Injectable, BadRequestException } from '@nestjs/common';
import { TicketEntity } from './domain/entities/ticket.entity';
import { TicketCode } from './domain/value-objects/ticket-code.value-object';
import { TicketStatus } from './domain/value-objects/ticket-status.value-object'; // Import Enum baru

@Injectable()
export class TicketService {
    // Nantinya di sini kita meng-inject ITicketRepository
    constructor() { }

    async checkInTicket(rawTicketCode: string, eventId: string): Promise<void> {
        try {
            // 1. Validasi format kode tiket dengan Value Object
            const ticketCode = TicketCode.create(rawTicketCode);

            // 2. Simulasi mengambil tiket dari database (Repository)
            // Aslinya akan seperti ini: const ticket = await this.ticketRepo.findByCode(ticketCode);

            // Karena masih simulasi, kita buat entitas dummy dengan struktur YANG BARU
            const ticket = TicketEntity.create({
                ticketCode: ticketCode,
                eventId: eventId,
                bookingId: 'BKG-999888', // <-- WAJIB ADA: Tambahan primitif referensi booking
                status: TicketStatus.ACTIVE, // <-- Menggunakan Enum
            });

            // 3. Eksekusi Domain Behavior
            // Validasi bisnis (apakah status Active, eventId cocok, dll) akan berjalan di sini
            ticket.checkIn(eventId);

            // 4. Simpan kembali state yang sudah berubah ke database
            // Aslinya: await this.ticketRepo.save(ticket);

        } catch (error: any) {
            // Jika terjadi pelanggaran business rules (Domain Error), 
            // kita tangkap dan ubah menjadi HTTP 400 Bad Request
            throw new BadRequestException(error.message);
        }
    }
}