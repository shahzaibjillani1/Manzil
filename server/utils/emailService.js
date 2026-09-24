import nodemailer from 'nodemailer';

let transporterPromise = null;

/**
 * Initialize or reuse Nodemailer Transporter
 * Supports production SMTP configuration via environment variables,
 * with automatic fallback to Ethereal Email for instant testing.
 */
const getTransporter = async () => {
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    // 1. If real SMTP credentials are provided in .env
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }

    // 2. Otherwise generate Ethereal test account for local testing
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log('📧 [Email Service] Using Ethereal Email test account for development:');
      console.log(`   User: ${testAccount.user}`);
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (err) {
      console.warn('⚠️ [Email Service] Ethereal account creation failed, using console transport fallback.');
      return nodemailer.createTransport({
        jsonTransport: true,
      });
    }
  })();

  return transporterPromise;
};

/**
 * Send Booking Confirmation Email to User
 * @param {Object} booking - Fully populated booking document
 */
export const sendBookingConfirmationEmail = async (booking) => {
  try {
    const transporter = await getTransporter();

    const guestEmail = booking.guestDetails?.email || booking.user?.email;
    const guestName = booking.guestDetails?.fullName || booking.user?.name || 'Valued Guest';
    const hotelName = booking.hotel?.name || 'Luxury Hotel Property';
    const hotelCity = booking.hotel?.city || '';
    const hotelAddress = booking.hotel?.address || '';
    const roomTitle = booking.room?.title || 'Luxury Suite';
    const checkIn = new Date(booking.checkInDate).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const checkOut = new Date(booking.checkOutDate).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const fromAddress = process.env.SMTP_FROM || '"QuickStay Luxury Suites" <reservations@quickstay.com>';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your QuickStay Reservation Confirmation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; }
    .header { background: linear-gradient(135deg, #18181b 0%, #27272a 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
    .logo { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; margin: 0; }
    .logo span { color: #d97706; }
    .subtitle { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #a1a1aa; margin-top: 6px; }
    .content { padding: 32px 30px; }
    .hero-badge { display: inline-block; padding: 6px 14px; background: #ecfdf5; color: #047857; font-weight: 700; font-size: 12px; border-radius: 9999px; margin-bottom: 16px; border: 1px solid #a7f3d0; }
    .greeting { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0; }
    .message { font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .ref-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 12px; margin-bottom: 14px; }
    .ref-label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b; }
    .ref-code { font-family: monospace; font-size: 16px; font-weight: 700; color: #d97706; }
    .detail-item { margin-bottom: 10px; font-size: 13px; }
    .detail-label { font-weight: 600; color: #334155; }
    .detail-val { color: #0f172a; }
    .price-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 16px; text-align: center; margin-bottom: 24px; }
    .price-label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #92400e; margin-bottom: 4px; }
    .price-amount { font-size: 28px; font-weight: 800; color: #b45309; }
    .price-sub { font-size: 11px; color: #a16207; margin-top: 4px; }
    .footer { background: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
    .footer a { color: #d97706; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">QuickStay<span>.</span></div>
      <div class="subtitle">Luxury Suites & Resorts</div>
    </div>
    
    <div class="content">
      <div class="hero-badge">✓ Reservation Confirmed</div>
      <h1 class="greeting">Hello, ${guestName}!</h1>
      <p class="message">
        Thank you for choosing QuickStay. Your luxury suite reservation has been verified and confirmed.
        Below are your official booking details and check-in voucher reference.
      </p>

      <div class="card">
        <div class="ref-row">
          <span class="ref-label">Booking Reference:</span>
          <span class="ref-code">${booking.bookingReference}</span>
        </div>
        <div class="detail-item"><span class="detail-label">Property:</span> <span class="detail-val"><strong>${hotelName}</strong> (${hotelCity})</span></div>
        <div class="detail-item"><span class="detail-label">Address:</span> <span class="detail-val">${hotelAddress}</span></div>
        <div class="detail-item"><span class="detail-label">Suite:</span> <span class="detail-val">${roomTitle}</span></div>
        <div class="detail-item"><span class="detail-label">Check-In:</span> <span class="detail-val">${checkIn} (from 3:00 PM)</span></div>
        <div class="detail-item"><span class="detail-label">Check-Out:</span> <span class="detail-val">${checkOut} (until 11:00 AM)</span></div>
        <div class="detail-item"><span class="detail-label">Duration:</span> <span class="detail-val">${booking.nights} night(s) • ${booking.guests} guest(s)</span></div>
        <div class="detail-item"><span class="detail-label">Payment Status:</span> <span class="detail-val">${booking.isPaid ? 'Paid in Full' : 'Pay At Hotel'} (${booking.paymentMethod})</span></div>
      </div>

      <div class="price-box">
        <div class="price-label">Total Amount Paid / Due</div>
        <div class="price-amount">$${booking.totalPrice.toLocaleString()}</div>
        <div class="price-sub">Includes 12% Hospitality Taxes & Service Surcharges</div>
      </div>

      <p class="message" style="font-size: 13px; text-align: center; color: #64748b;">
        Need to make changes or have special requests? Simply reply to this email or visit your 
        <strong>My Reservations</strong> page on the portal.
      </p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} QuickStay Luxury Hospitality Group. All rights reserved.<br>
      High-end bespoke hospitality across premier global destinations.
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
QuickStay - Luxury Suites & Resorts
Reservation Confirmation: ${booking.bookingReference}

Hello ${guestName},

Your reservation has been confirmed!

Property: ${hotelName} (${hotelCity})
Address: ${hotelAddress}
Suite: ${roomTitle}
Check-In: ${checkIn} (from 3:00 PM)
Check-Out: ${checkOut} (until 11:00 AM)
Duration: ${booking.nights} nights, ${booking.guests} guest(s)
Total Price: $${booking.totalPrice} (includes taxes)
Payment Status: ${booking.isPaid ? 'Paid' : 'Pay At Hotel'} via ${booking.paymentMethod}

Thank you for choosing QuickStay!
    `;

    const mailOptions = {
      from: fromAddress,
      to: guestEmail,
      subject: `Booking Confirmed: ${hotelName} - Ref #${booking.bookingReference}`,
      text: textContent,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Email Service] Confirmation email sent to ${guestEmail} for Ref #${booking.bookingReference} (MessageID: ${info.messageId})`);

    // If Ethereal Email was used, print the interactive preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`🔗 [Email Service] Live Email Preview URL: ${previewUrl}`);
    }

    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error('❌ [Email Service] Error dispatching booking email:', error.message);
    // Return gracefully so booking flow is never blocked
    return { success: false, error: error.message };
  }
};

export default {
  sendBookingConfirmationEmail,
};
