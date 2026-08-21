// api/send-inquiry.js — Serverless Dual Email Dispatch via Resend
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.RESEND;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@nayaabengineering.com";

// Default sender address
const SENDER_EMAIL = process.env.RESEND_FROM_EMAIL_ADDRESS || "info@nayaabengineering.com";

function cleanPhoneNumber(phone) {
  if (!phone) return "";
  const cleaned = phone.replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+")) return cleaned.replace("+", "");
  if (cleaned.length === 10) return `91${cleaned}`;
  return cleaned;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { name, email, phone, service, message, botcheck } = req.body || {};

  // Honeypot bot protection
  if (botcheck) {
    return res.status(200).json({ success: true, message: "Inquiry received." });
  }

  // Validate required inputs
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields: name, email, or message." });
  }

  const cleanName = String(name).trim();
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPhone = String(phone || "Not Provided").trim();
  const cleanService = String(service || "General Engineering Consultation").trim();
  const cleanMessage = String(message).trim().slice(0, 900);
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const waPhone = cleanPhoneNumber(cleanPhone);

  if (!resend) {
    console.warn("Resend API key missing. Skipping email dispatch.");
    return res.status(200).json({ success: true, warning: "Resend API key not configured." });
  }

  try {
    // 1. DISPATCH NOTIFICATION EMAIL TO ADMIN
    // Sent from inquiry@nayaabengineering.com so the inbox shows the client name instead of "me"
    const adminEmailPromise = resend.emails.send({
      from: `${cleanName} [Website Contact] <inquiry@nayaabengineering.com>`,
      to: [ADMIN_EMAIL],
      replyTo: cleanEmail,
      subject: `New Inquiry: ${cleanService} - ${cleanName}`,
      headers: {
        "X-Entity-Ref-ID": `inquiry-${Date.now()}`,
      },
      text: `NEW INQUIRY NOTIFICATION\n\nClient Name: ${cleanName}\nEmail: ${cleanEmail}\nPhone: ${cleanPhone}\nDiscipline: ${cleanService}\nReceived: ${timestamp}\n\nMessage:\n${cleanMessage}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Inquiry Notification</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAFAFA; color: #1E293B;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 32px 28px; border-radius: 8px; border: 1px solid #E2E8F0;">
            
            <!-- BRANDING HEADER -->
            <div style="margin-bottom: 24px; border-bottom: 2px solid #00A6FB; padding-bottom: 16px;">
              <div style="font-size: 28px; font-weight: 900; color: #00A6FB; letter-spacing: 2px; line-height: 1;">NEI</div>
              <div style="font-size: 13px; font-weight: 700; color: #475569; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 4px;">
                NAYAAB ENGINEERING INNOVATIONS &bull; NEW INQUIRY
              </div>
            </div>

            <!-- INQUIRY DETAILS -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #64748B; font-weight: 600; width: 32%;">Client Name:</td>
                <td style="padding: 8px 0; color: #0F172A; font-weight: 700;">${cleanName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Email:</td>
                <td style="padding: 8px 0; color: #00A6FB; font-weight: 700;">
                  <a href="mailto:${cleanEmail}" style="color: #00A6FB; text-decoration: none;">${cleanEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Phone / WhatsApp:</td>
                <td style="padding: 8px 0; color: #0F172A; font-weight: 700;">${cleanPhone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Service / Discipline:</td>
                <td style="padding: 8px 0; color: #00A6FB; font-weight: 800;">${cleanService}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Received Time:</td>
                <td style="padding: 8px 0; color: #475569;">${timestamp}</td>
              </tr>
            </table>

            <!-- CLIENT MESSAGE -->
            <div style="margin-bottom: 28px;">
              <div style="font-size: 12px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                Client Message:
              </div>
              <div style="border-left: 3px solid #00A6FB; padding: 12px 16px; background-color: #F8FAFC; border-radius: 0 6px 6px 0; font-size: 14px; line-height: 1.6; color: #1E293B; white-space: pre-wrap;">${cleanMessage}</div>
            </div>

            <!-- ACTION BUTTONS -->
            <div style="padding-top: 12px; margin-bottom: 24px;">
              <a href="mailto:${cleanEmail}?subject=Re: Your Inquiry with Nayaab Engineering Innovations" style="display: inline-block; background-color: #00A6FB; color: #FFFFFF; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 700; text-decoration: none; margin-right: 8px; margin-bottom: 8px;">
                Reply via Email
              </a>
              ${waPhone && waPhone.length >= 10
          ? `<a href="https://wa.me/${waPhone}?text=${encodeURIComponent(
            `Hello ${cleanName}, this is Nayaab Engineering Innovations regarding your project inquiry for ${cleanService}.`
          )}" target="_blank" style="display: inline-block; background-color: #25D366; color: #FFFFFF; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 700; text-decoration: none; margin-bottom: 8px;">
                      Open WhatsApp
                    </a>`
          : ""
        }
            </div>

            <!-- FOOTER -->
            <div style="border-top: 1px solid #E2E8F0; padding-top: 16px; font-size: 12px; color: #94A3B8;">
              This notification was generated automatically by the <a href="https://nayaabengineering.com" style="color: #64748B; text-decoration: underline;">Nayaab Engineering Website</a>.
            </div>

          </div>
        </body>
        </html>
      `,
    });

    // 2. DISPATCH BRANDED CONFIRMATION EMAIL TO CLIENT (Clean, zero-image, text-first)
    const clientEmailPromise = resend.emails.send({
      from: `Nayaab Engineering Innovations <${SENDER_EMAIL}>`,
      to: [cleanEmail],
      replyTo: ADMIN_EMAIL,
      subject: `Thank you for contacting Nayaab Engineering Innovations`,
      headers: {
        "X-Entity-Ref-ID": `client-inquiry-${Date.now()}`,
      },
      text: `Dear ${cleanName},\n\nThank you for reaching out to Nayaab Engineering Innovations (NEIPL). We have successfully received your inquiry regarding ${cleanService}.\n\nOur engineering and architectural team is reviewing your requirements and will connect with you within 24 business hours.\n\nSummary:\nService: ${cleanService}\nPhone: ${cleanPhone}\nDate: ${timestamp}\n\nWarm regards,\nClient Engagement Team\nNayaab Engineering Innovations Pvt. Ltd.\nSrinagar, Jammu & Kashmir\nhttps://nayaabengineering.com`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Inquiry Confirmation</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAFAFA; color: #1E293B;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 32px 28px; border-radius: 8px; border: 1px solid #E2E8F0;">
            
            <!-- BRANDING HEADER -->
            <div style="margin-bottom: 24px; border-bottom: 2px solid #00A6FB; padding-bottom: 16px;">
              <div style="font-size: 28px; font-weight: 900; color: #00A6FB; letter-spacing: 2px; line-height: 1;">NEI</div>
              <div style="font-size: 13px; font-weight: 700; color: #475569; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 4px;">
                NAYAAB ENGINEERING INNOVATIONS
              </div>
            </div>

            <!-- GREETING & BODY -->
            <div style="font-size: 16px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">
              Dear ${cleanName},
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 16px 0;">
              Thank you for contacting <strong>Nayaab Engineering Innovations (NEIPL)</strong>. We have successfully received your project inquiry regarding <strong>${cleanService}</strong>.
            </p>

            <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
              Our senior engineering and architectural team is reviewing your project details. A dedicated specialist will reach out to you within <strong>24 business hours</strong> to discuss the next steps for your build.
            </p>

            <!-- SUBMISSION RECAP -->
            <div style="border-left: 3px solid #00A6FB; padding: 12px 16px; background-color: #F8FAFC; border-radius: 0 6px 6px 0; margin-bottom: 20px; font-size: 13px; line-height: 1.7; color: #475569;">
              <strong style="color: #0F172A;">Inquiry Summary:</strong><br>
              &bull; <strong>Service:</strong> ${cleanService}<br>
              &bull; <strong>Contact Phone:</strong> ${cleanPhone}<br>
              &bull; <strong>Submitted On:</strong> ${timestamp}
            </div>

            <p style="font-size: 13px; line-height: 1.6; color: #64748B; margin: 0 0 24px 0;">
              If you have site plans, architectural drawings, or urgent questions, feel free to reply directly to this email or reach us on WhatsApp.
            </p>

            <!-- SIGNATURE -->
            <div style="border-top: 1px solid #E2E8F0; padding-top: 18px; font-size: 13px; color: #475569; line-height: 1.6;">
              <strong style="color: #0F172A;">Client Engagement Team</strong><br>
              Nayaab Engineering Innovations Pvt. Ltd.<br>
              Srinagar, Jammu &amp; Kashmir &bull; <a href="https://nayaabengineering.com" style="color: #00A6FB; text-decoration: none;">nayaabengineering.com</a>
            </div>

          </div>
        </body>
        </html>
      `,
    });

    // Execute both in parallel
    const [adminResult, clientResult] = await Promise.allSettled([adminEmailPromise, clientEmailPromise]);

    if (adminResult.status === "rejected" || adminResult.value?.error) {
      console.error("Admin email dispatch error:", adminResult.reason || adminResult.value?.error);
    }
    if (clientResult.status === "rejected" || clientResult.value?.error) {
      console.error("Client email dispatch error:", clientResult.reason || clientResult.value?.error);
    }

    return res.status(200).json({
      success: true,
      message: "Inquiry registered and emails dispatched successfully.",
      adminSent: adminResult.status === "fulfilled" && !adminResult.value?.error,
      clientSent: clientResult.status === "fulfilled" && !clientResult.value?.error,
    });
  } catch (err) {
    console.error("Resend execution error:", err);
    return res.status(200).json({
      success: true,
      warning: "Inquiry saved, but email notification had an error.",
      error: err.message,
    });
  }
}
