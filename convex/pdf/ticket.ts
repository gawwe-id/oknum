'use node';

import { internalAction } from '../_generated/server';
import { api } from '../_generated/api';
import { Id } from '../_generated/dataModel';
import PDFDocument from 'pdfkit';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import QRCode from 'qrcode';
import { v } from 'convex/values';

/**
 * Generate PDF Ticket for a booking with QR code
 */
export const generateTicket = internalAction({
  args: {
    bookingId: v.id('bookings')
  },
  handler: async (ctx, args) => {
    try {
      // Get booking details
      const booking = await ctx.runQuery(api.bookings.getBookingByIdInternal, {
        bookingId: args.bookingId
      });

      if (!booking) {
        return { success: false, error: 'Booking not found' };
      }

      // Get user details
      const user = await ctx.runQuery(api.users.getUserProfile, {
        userId: booking.userId
      });

      // Generate ticket number (format: TKT-{bookingId.slice(-8).toUpperCase()})
      const ticketNumber = `TKT-${args.bookingId.slice(-8).toUpperCase()}`;

      // Generate verification URL
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://oknum.studio';
      const verificationUrl = `${baseUrl}/event/${args.bookingId}`;

      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        width: 200,
        margin: 1
      });

      // Create PDF document
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {});

      // Header with ticket number
      doc
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('TIKET KELAS', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(16).font('Helvetica').fillColor('gray');
      doc.text(`No. Tiket: ${ticketNumber}`, { align: 'center' });
      doc.fillColor('black');
      doc.moveDown(2);

      // QR Code (centered)
      const qrImageBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
      const qrSize = 150;
      const qrX = (doc.page.width - qrSize) / 2;
      doc.image(qrImageBuffer, qrX, doc.y, { width: qrSize, height: qrSize });
      doc.moveDown(2);

      // Ticket details section
      doc.fontSize(14).font('Helvetica-Bold').text('Detail Kelas', 50, doc.y);
      doc.moveDown(0.5);

      doc.font('Helvetica').fontSize(11);
      doc.text('Kelas:', 50, doc.y);
      doc.font('Helvetica-Bold');
      doc.text(booking.classItem?.title || 'N/A', 120, doc.y);
      doc.moveDown(0.8);

      doc.font('Helvetica');
      doc.text('Expert:', 50, doc.y);
      const expert = await ctx.runQuery(api.experts.getExpertById, {
        expertId: booking.classItem?.expertId as Id<'experts'>
      });
      if (expert) {
        doc.text(expert.name, 120, doc.y);
      } else {
        doc.text('N/A', 120, doc.y);
      }
      doc.moveDown(0.8);

      doc.text('Kategori:', 50, doc.y);
      doc.text(booking.classItem?.category || 'N/A', 120, doc.y);
      doc.moveDown(0.8);

      doc.text('Tipe:', 50, doc.y);
      const typeText =
        booking.classItem?.type === 'online'
          ? 'Online'
          : booking.classItem?.type === 'offline'
          ? 'Offline'
          : 'Hybrid';
      doc.text(typeText, 120, doc.y);
      doc.moveDown(2);

      // Schedules section
      doc.fontSize(14).font('Helvetica-Bold').text('Jadwal Kelas', 50, doc.y);
      doc.moveDown(0.5);

      if (booking.schedules && booking.schedules.length > 0) {
        doc.font('Helvetica').fontSize(10);
        booking.schedules.forEach((schedule, index) => {
          if (schedule) {
            const sessionTitle = schedule.sessionTitle
              ? ` - ${schedule.sessionTitle}`
              : '';
            doc.text(
              `${index + 1}. ${schedule.sessionNumber}${sessionTitle}`,
              50,
              doc.y
            );
            doc.moveDown(0.5);

            doc.fillColor('gray');
            doc.text(
              `   📅 ${schedule.startDate} ${schedule.startTime} - ${schedule.endTime}`,
              50,
              doc.y
            );
            doc.moveDown(0.3);

            if (schedule.location.type === 'online') {
              doc.text(
                `   🌐 Online: ${
                  schedule.location.onlineLink ||
                  'Link akan dikirim sebelum kelas'
                }`,
                50,
                doc.y
              );
            } else if (schedule.location.type === 'offline') {
              doc.text(
                `   📍 ${
                  schedule.location.address || 'Lokasi akan diinformasikan'
                }`,
                50,
                doc.y
              );
              if (schedule.location.city) {
                doc.text(
                  `   ${schedule.location.city}${
                    schedule.location.province
                      ? `, ${schedule.location.province}`
                      : ''
                  }`,
                  50,
                  doc.y
                );
              }
            } else {
              // Hybrid
              doc.text(
                `   🌐 Online: ${
                  schedule.location.onlineLink || 'Link akan dikirim'
                }`,
                50,
                doc.y
              );
              doc.moveDown(0.3);
              doc.text(
                `   📍 ${
                  schedule.location.address || 'Lokasi akan diinformasikan'
                }`,
                50,
                doc.y
              );
            }
            doc.fillColor('black');
            doc.moveDown(1);
          }
        });
      } else {
        doc.font('Helvetica').fontSize(10).fillColor('gray');
        doc.text('Jadwal belum tersedia', 50, doc.y);
        doc.fillColor('black');
        doc.moveDown();
      }

      // Customer info section
      doc.moveDown(1);
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Informasi Peserta', 50, doc.y);
      doc.moveDown(0.5);

      doc.font('Helvetica').fontSize(10);
      doc.text('Nama:', 50, doc.y);
      doc.text(user?.name || 'N/A', 120, doc.y);
      doc.moveDown(0.8);

      doc.text('Email:', 50, doc.y);
      doc.text(user?.email || 'N/A', 120, doc.y);
      doc.moveDown(0.8);

      if (user?.phone) {
        doc.text('Telepon:', 50, doc.y);
        doc.text(user.phone, 120, doc.y);
        doc.moveDown(0.8);
      }

      // Booking date
      const bookingDate = new Date(booking.bookingDate);
      doc.text('Tanggal Pemesanan:', 50, doc.y);
      doc.text(
        format(bookingDate, 'dd MMMM yyyy HH:mm', { locale: idLocale }),
        120,
        doc.y
      );
      doc.moveDown(2);

      // Important notes
      doc.fontSize(10).fillColor('#dc2626');
      doc.font('Helvetica-Bold').text('PENTING:', 50, doc.y);
      doc.moveDown(0.5);
      doc.font('Helvetica').fillColor('black');
      doc.text('• Bawa tiket ini (digital atau print) saat hari H', 50, doc.y, {
        width: 500
      });
      doc.moveDown(0.3);
      doc.text(
        '• QR code akan digunakan untuk verifikasi kehadiran',
        50,
        doc.y,
        {
          width: 500
        }
      );
      doc.moveDown(0.3);
      doc.text('• Pastikan QR code dapat di-scan dengan jelas', 50, doc.y, {
        width: 500
      });
      doc.moveDown(0.3);
      if (
        booking.classItem?.type === 'online' ||
        booking.classItem?.type === 'hybrid'
      ) {
        doc.text(
          '• Link kelas online akan dikirim melalui email sebelum jadwal',
          50,
          doc.y,
          {
            width: 500
          }
        );
      }
      doc.moveDown(2);

      // Footer
      doc.fontSize(9).fillColor('gray');
      doc.text('Tiket ini adalah bukti pendaftaran yang sah.', 50, 750, {
        align: 'center',
        width: 500
      });
      doc.text(
        'Jika ada pertanyaan, hubungi support@oknum.studio',
        50,
        doc.y + 5,
        { align: 'center', width: 500 }
      );

      // Finalize PDF
      doc.end();

      // Wait for PDF to be generated
      const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('PDF generation timeout'));
        }, 10000);

        doc.on('end', () => {
          clearTimeout(timeout);
          resolve(Buffer.concat(chunks));
        });

        doc.on('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      return {
        success: true,
        pdfBuffer: pdfBuffer.toString('base64'),
        ticketNumber,
        verificationUrl
      };
    } catch (error) {
      console.error('Error generating ticket PDF:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
});
