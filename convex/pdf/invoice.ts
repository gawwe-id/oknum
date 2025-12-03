'use node';

import { internalAction } from '../_generated/server';
import { api } from '../_generated/api';
import { Id } from '../_generated/dataModel';
import PDFDocument from 'pdfkit';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { v } from 'convex/values';

/**
 * Generate PDF Invoice for a booking
 */
export const generateInvoice = internalAction({
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

      // Get payment details
      const payment = booking.paymentId
        ? await ctx.runQuery(api.payments.getPaymentById, {
            paymentId: booking.paymentId
          })
        : null;

      if (!payment) {
        return { success: false, error: 'Payment not found' };
      }

      // Get user details
      const user = await ctx.runQuery(api.users.getUserProfile, {
        userId: booking.userId
      });

      // Generate invoice number (format: INV-YYYYMMDD-{bookingId.slice(-6)})
      const invoiceDate = new Date(booking.createdAt);
      const invoiceNumber = `INV-${format(
        invoiceDate,
        'yyyyMMdd'
      )}-${args.bookingId.slice(-6).toUpperCase()}`;

      // Create PDF document
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {});

      // Header
      doc.fontSize(24).text('INVOICE', { align: 'center' });
      doc.moveDown();

      // Invoice details
      doc.fontSize(10);
      doc.text(`Invoice Number: ${invoiceNumber}`, { align: 'right' });
      doc.text(
        `Date: ${format(invoiceDate, 'dd MMMM yyyy', { locale: idLocale })}`,
        {
          align: 'right'
        }
      );
      if (payment.paidAt) {
        doc.text(
          `Payment Date: ${format(new Date(payment.paidAt), 'dd MMMM yyyy', {
            locale: idLocale
          })}`,
          { align: 'right' }
        );
      }
      doc.moveDown(2);

      // Company/From info
      doc.fontSize(12).font('Helvetica-Bold').text('Dari:', 50, doc.y);
      doc.font('Helvetica');
      doc.fontSize(10);
      doc.text('Oknum Studio');
      doc.text('Email: support@oknum.studio');
      doc.text('Website: https://oknum.studio');
      doc.moveDown();

      // Customer/To info
      const customerY = doc.y;
      doc.fontSize(12).font('Helvetica-Bold').text('Kepada:', 300, customerY);
      doc.font('Helvetica');
      doc.fontSize(10);
      doc.text(user?.name || 'Customer', 300, doc.y);
      doc.text(user?.email || '', 300, doc.y);
      if (user?.phone) {
        doc.text(user.phone, 300, doc.y);
      }
      doc.moveDown(2);

      // Line separator
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Items table header
      doc.fontSize(11).font('Helvetica-Bold');
      doc.text('Item', 50, doc.y);
      doc.text('Deskripsi', 150, doc.y);
      doc.text('Jumlah', 450, doc.y, { align: 'right' });
      doc.text('Total', 500, doc.y, { align: 'right' });
      doc.moveDown(0.5);

      // Line separator
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);

      // Item row
      doc.font('Helvetica').fontSize(10);
      const itemY = doc.y;
      doc.text('Kelas', 50, itemY);
      doc.text(booking.classItem?.title || 'Kelas', 150, itemY, {
        width: 280,
        ellipsis: true
      });
      doc.text('1', 450, doc.y, { align: 'right' });
      doc.text(
        `${booking.currency} ${booking.totalAmount.toLocaleString('id-ID')}`,
        500,
        doc.y,
        { align: 'right' }
      );
      doc.text(
        `${booking.currency} ${booking.totalAmount.toLocaleString('id-ID')}`,
        500,
        doc.y,
        { align: 'right' }
      );
      doc.moveDown();

      // Expert info
      if (booking.classItem?.expertId) {
        const expert = await ctx.runQuery(api.experts.getExpertById, {
          expertId: booking.classItem?.expertId
        });
        if (expert) {
          doc.fontSize(9).fillColor('gray');
          doc.text(`Expert: ${expert.name}`, 150, doc.y, {
            width: 280
          });
          doc.fillColor('black');
          doc.moveDown();
        }
      }

      // Schedules info
      if (booking.schedules && booking.schedules.length > 0) {
        doc.fontSize(9).fillColor('gray');
        doc.text('Jadwal:', 150, doc.y, { width: 280 });
        booking.schedules.forEach((schedule, index) => {
          if (schedule) {
            doc.text(
              `  ${index + 1}. ${schedule.sessionNumber}${
                schedule.sessionTitle ? ` - ${schedule.sessionTitle}` : ''
              } - ${schedule.startDate} ${schedule.startTime}`,
              150,
              doc.y,
              { width: 280 }
            );
          }
        });
        doc.fillColor('black');
        doc.moveDown();
      }

      // Line separator
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Totals
      doc.fontSize(10);
      const subtotalY = doc.y;
      doc.text('Subtotal:', 450, doc.y, { align: 'right' });
      doc.text(
        `${booking.currency} ${booking.totalAmount.toLocaleString('id-ID')}`,
        500,
        doc.y,
        { align: 'right' }
      );
      doc.moveDown(0.5);

      doc.text('Total:', 450, doc.y, { align: 'right' });
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text(
        `${booking.currency} ${booking.totalAmount.toLocaleString('id-ID')}`,
        500,
        doc.y,
        { align: 'right' }
      );
      doc.moveDown(2);

      // Payment info
      doc.font('Helvetica').fontSize(10);
      doc.text('Metode Pembayaran:', 50, doc.y);
      doc.text(payment.paymentMethod || 'N/A', 200, doc.y);
      doc.moveDown(0.5);

      doc.text('Status Pembayaran:', 50, doc.y);
      const statusText =
        payment.status === 'success'
          ? 'Lunas'
          : payment.status === 'pending'
          ? 'Menunggu Pembayaran'
          : payment.status === 'processing'
          ? 'Sedang Diproses'
          : 'Gagal';
      doc.text(statusText, 200, doc.y);
      doc.moveDown(0.5);

      if (payment.gatewayTransactionId) {
        doc.text('Transaction ID:', 50, doc.y);
        doc.text(payment.gatewayTransactionId, 200, doc.y);
        doc.moveDown();
      }

      // Footer
      doc.fontSize(9).fillColor('gray');
      doc.text(
        'Terima kasih telah menggunakan layanan Oknum Studio.',
        50,
        750,
        { align: 'center', width: 500 }
      );
      doc.text('Invoice ini adalah bukti pembayaran yang sah.', 50, doc.y + 5, {
        align: 'center',
        width: 500
      });

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
        invoiceNumber
      };
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
});
