import { action } from './_generated/server';
import { Resend } from 'resend';
import { api, internal } from './_generated/api';
import { Id } from './_generated/dataModel';
import { v } from 'convex/values';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send welcome email to new user
 */
export const sendWelcomeEmail = action({
  args: {
    email: v.string(),
    name: v.string()
  },
  handler: async (ctx, args) => {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping welcome email');
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }

    try {
      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Oknum <noreply@oknum.studio>',
        to: args.email,
        subject: 'Selamat Datang di Oknum! 🎉',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Selamat Datang di Oknum</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563eb; margin: 0;">Selamat Datang di Oknum! 🎉</h1>
              </div>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 15px 0;">Halo <strong>${
                  args.name
                }</strong>,</p>
                <p style="margin: 0 0 15px 0;">
                  Terima kasih telah bergabung dengan Oknum! Kami sangat senang memiliki Anda sebagai bagian dari komunitas kami.
                </p>
                <p style="margin: 0;">
                  Di Oknum, Anda dapat mengakses berbagai kelas eksklusif dari para expert terbaik, belajar dengan metode yang terstruktur, dan berkembang bersama komunitas yang solid.
                </p>
              </div>

              <div style="margin: 30px 0;">
                <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 15px;">Apa yang bisa Anda lakukan?</h2>
                <ul style="padding-left: 20px;">
                  <li style="margin-bottom: 10px;">Jelajahi berbagai kelas eksklusif dari expert terbaik</li>
                  <li style="margin-bottom: 10px;">Daftar dan ikuti kelas sesuai minat Anda</li>
                  <li style="margin-bottom: 10px;">Akses materi pembelajaran yang terstruktur</li>
                  <li style="margin-bottom: 10px;">Bergabung dengan komunitas pembelajar</li>
                </ul>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL || 'https://oknum.studio'
                }/login" 
                   style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  Mulai Jelajahi Kelas
                </a>
              </div>

              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">
                <p style="margin: 0 0 10px 0;">Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami.</p>
                <p style="margin: 0;">Salam hangat,<br><strong>Tim Oknum</strong></p>
              </div>
            </body>
          </html>
        `
      });

      if (result.error) {
        console.error('Error sending welcome email:', result.error);
        return { success: false, error: result.error };
      }

      console.log('Welcome email sent successfully to:', args.email);
      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
});

/**
 * Send enrollment email with PDF attachments (Invoice and Ticket)
 */
export const sendEnrollmentEmail = action({
  args: {
    bookingId: v.id('bookings'),
    userEmail: v.string(),
    userName: v.string()
  },
  handler: async (ctx, args) => {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping enrollment email');
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }

    try {
      // Get booking details with all related data
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

      if (!payment || payment.status !== 'success') {
        return {
          success: false,
          error: 'Payment not found or not successful'
        };
      }

      // Generate PDFs
      // Note: After running `npx convex dev`, these will be available in internal.pdfInvoice and internal.pdfTicket
      // Using type assertion until API types are regenerated
      const invoicePdf = await ctx.runAction(
        (internal as any).pdfInvoice.generateInvoice,
        {
          bookingId: args.bookingId
        }
      );

      const ticketPdf = await ctx.runAction(
        (internal as any).pdfTicket.generateTicket,
        {
          bookingId: args.bookingId
        }
      );

      if (!invoicePdf.success || !ticketPdf.success) {
        return {
          success: false,
          error: 'Failed to generate PDFs'
        };
      }

      // Get expert details if available
      let expertName = 'N/A';
      if (booking.classItem?.expertId) {
        const expert = await ctx.runQuery(api.experts.getExpertById, {
          expertId: booking.classItem.expertId
        });
        if (expert) {
          expertName = expert.name;
        }
      }

      // Format schedules for email
      const schedulesList = booking.schedules
        .map((schedule) => {
          if (!schedule) return '';
          return `
            <li style="margin-bottom: 10px;">
              <strong>${schedule.sessionNumber}</strong>${
            schedule.sessionTitle ? ` - ${schedule.sessionTitle}` : ''
          }<br>
              📅 ${schedule.startDate} ${schedule.startTime} - ${
            schedule.endTime
          }<br>
              ${
                schedule.location.type === 'online'
                  ? `🌐 Online: ${
                      schedule.location.onlineLink ||
                      'Link akan dikirim sebelum kelas'
                    }`
                  : `📍 ${
                      schedule.location.address || 'Lokasi akan diinformasikan'
                    }`
              }
            </li>
          `;
        })
        .join('');

      // Send email with attachments
      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Oknum <noreply@oknum.studio>',
        to: args.userEmail,
        subject: `Pendaftaran Berhasil - ${
          booking.classItem?.title || 'Kelas'
        }`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Pendaftaran Berhasil</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #10b981; margin: 0;">Pendaftaran Berhasil! ✅</h1>
              </div>
              
              <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #10b981;">
                <p style="margin: 0 0 15px 0;">Halo <strong>${
                  args.userName
                }</strong>,</p>
                <p style="margin: 0;">
                  Terima kasih! Pendaftaran Anda untuk kelas <strong>${
                    booking.classItem?.title || 'Kelas'
                  }</strong> telah berhasil dikonfirmasi.
                </p>
              </div>

              <div style="margin: 30px 0;">
                <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 15px;">Detail Kelas</h2>
                <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px;">
                  <p style="margin: 0 0 10px 0;"><strong>Kelas:</strong> ${
                    booking.classItem?.title || 'N/A'
                  }</p>
                  <p style="margin: 0 0 10px 0;"><strong>Expert:</strong> ${expertName}</p>
                  <p style="margin: 0 0 10px 0;"><strong>Kategori:</strong> ${
                    booking.classItem?.category || 'N/A'
                  }</p>
                  <p style="margin: 0;"><strong>Total Pembayaran:</strong> ${
                    booking.currency
                  } ${booking.totalAmount.toLocaleString('id-ID')}</p>
                </div>
              </div>

              <div style="margin: 30px 0;">
                <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 15px;">Jadwal Kelas</h2>
                <ul style="padding-left: 20px; list-style: none;">
                  ${schedulesList}
                </ul>
              </div>

              <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; font-weight: 600; color: #92400e;">📎 Lampiran Email</p>
                <p style="margin: 10px 0 0 0; font-size: 14px;">
                  Kami telah melampirkan 2 dokumen penting:
                </p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px;">
                  <li><strong>Invoice PDF</strong> - Bukti pembayaran Anda</li>
                  <li><strong>Ticket PDF</strong> - Tiket masuk dengan QR code untuk verifikasi</li>
                </ul>
              </div>

              <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #3b82f6;">
                <p style="margin: 0; font-weight: 600; color: #1e40af;">💡 Informasi Penting</p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px;">
                  <li>Simpan ticket PDF Anda untuk verifikasi saat hari H</li>
                  <li>Link kelas online akan dikirim melalui email sebelum jadwal dimulai</li>
                  <li>Jika ada pertanyaan, silakan hubungi tim support kami</li>
                </ul>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL || 'https://oknum.studio'
                }/enrollments" 
                   style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  Lihat Pendaftaran Saya
                </a>
              </div>

              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">
                <p style="margin: 0 0 10px 0;">Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami.</p>
                <p style="margin: 0;">Salam hangat,<br><strong>Tim Oknum</strong></p>
              </div>
            </body>
          </html>
        `,
        attachments: [
          {
            filename: `Invoice-${args.bookingId}.pdf`,
            content: invoicePdf.pdfBuffer
          },
          {
            filename: `Ticket-${args.bookingId}.pdf`,
            content: ticketPdf.pdfBuffer
          }
        ]
      });

      if (result.error) {
        console.error('Error sending enrollment email:', result.error);
        return { success: false, error: result.error };
      }

      console.log('Enrollment email sent successfully to:', args.userEmail);
      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error sending enrollment email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
});
