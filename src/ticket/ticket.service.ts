import { Injectable, BadRequestException } from '@nestjs/common';
import { TicketEntity } from './domain/entities/ticket.entity';
import { TicketCode } from './domain/value-objects/ticket-code.value-object';
// Import Class dan Enum (ValidStatuses)
import { TicketStatus, ValidStatuses } from './domain/value-objects/ticket-status.value-object'; 

@Injectable()
export class TicketService {
  // Constructor untuk inject Repository nantinya
  constructor() {}

  async checkInTicket(rawTicketCode: string, eventId: string): Promise<void> {
    try {
      // 1. Buat Value Object untuk kode tiket
      const ticketCode = TicketCode.create(rawTicketCode);

      // 2. Simulasi Entity rehydration (merakit ulang dari data database)
      const ticket = TicketEntity.create({
        ticketCode: ticketCode,
        eventId: eventId,
        bookingId: 'BKG-999888',
        // --- PERUBAHAN UTAMA DI SINI ---
        // Kita menggunakan factory method .create() dari Value Object
        status: TicketStatus.create(ValidStatuses.ACTIVE), 
      });

      // 3. Eksekusi Domain Behavior
      ticket.checkIn(eventId);

      // 4. Save ke database (simulasi)
      // await this.ticketRepo.save(ticket);
      
    } catch (error: any) {
      // Tangkap error validasi dari Value Object atau Entity dan ubah jadi Bad Request
      throw new BadRequestException(error.message);
    }
  }
}
