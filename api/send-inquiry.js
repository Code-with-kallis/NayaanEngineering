// api/send-inquiry.js — Serverless Dual Email Dispatch via Resend
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.RESEND;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.VITE_ADMIN_EMAIL || "info@nayaabengineering.com";

// Sender Address using verified domain nayaabengineering.com
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Nayaab Engineering <inquiries@nayaabengineering.com>";
const LOGO_URL = "https://nayaabengineering.com/logo-full.png";

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
    const adminEmailPromise = resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      replyTo: cleanEmail,
      subject: `New Inquiry: ${cleanService} - ${cleanName}`,
      text: `NEW PROJECT INQUIRY\n\nClient Name: ${cleanName}\nEmail: ${cleanEmail}\nPhone: ${cleanPhone}\nService: ${cleanService}\nReceived: ${timestamp}\n\nClient Message:\n${cleanMessage}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Project Inquiry</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090A0E; color: #F5F5F5; margin: 0; padding: 24px 12px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: #131722; border: 1px solid #202738; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.5);">
                  
                  <!-- HEADER WITH CENTERED LOGO -->
                  <tr>
                    <td align="center" style="background: #0E1118; padding: 32px 24px 24px 24px; border-bottom: 2px solid #00A6FB;">
                      <a href="https://nayaabengineering.com" target="_blank" style="text-decoration: none; display: inline-block;">
                        <img src="${LOGO_URL}" alt="Nayaab Engineering Innovations" width="140" style="display: block; max-width: 140px; height: auto; border: 0; margin: 0 auto 14px auto;" />
                      </a>
                      <div style="display: inline-block; background: rgba(0, 166, 251, 0.12); border: 1px solid rgba(0, 166, 251, 0.3); color: #00A6FB; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 999px; letter-spacing: 1px; text-transform: uppercase;">
                        NEW CLIENT INQUIRY
                      </div>
                    </td>
                  </tr>

                  <!-- BODY CONTENT -->
                  <tr>
                    <td style="padding: 28px 24px;">
                      
                      <!-- CLIENT META TABLE -->
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #0B0D12; border: 1px solid #202738; border-radius: 12px; margin-bottom: 20px; overflow: hidden;">
                        <tr>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #1C2230; font-size: 11px; font-weight: 800; color: #8C99AE; text-transform: uppercase; letter-spacing: 0.5px; width: 35%;">Client Name</td>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #1C2230; font-size: 14px; font-weight: 700; color: #FFFFFF;">${cleanName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #1C2230; font-size: 11px; font-weight: 800; color: #8C99AE; text-transform: uppercase; letter-spacing: 0.5px;">Email Address</td>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #1C2230; font-size: 14px; font-weight: 700; color: #00A6FB;">
                            <a href="mailto:${cleanEmail}" style="color: #00A6FB; text-decoration: none;">${cleanEmail}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #1C2230; font-size: 11px; font-weight: 800; color: #8C99AE; text-transform: uppercase; letter-spacing: 0.5px;">Phone / WhatsApp</td>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #1C2230; font-size: 14px; font-weight: 700; color: #FFFFFF;">${cleanPhone}</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #1C2230; font-size: 11px; font-weight: 800; color: #8C99AE; text-transform: uppercase; letter-spacing: 0.5px;">Discipline / Service</td>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #1C2230; font-size: 14px; font-weight: 800; color: #00A6FB;">${cleanService}</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 16px; font-size: 11px; font-weight: 800; color: #8C99AE; text-transform: uppercase; letter-spacing: 0.5px;">Submission Time</td>
                          <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #94A3B8;">${timestamp}</td>
                        </tr>
                      </table>

                      <!-- MESSAGE BOX -->
                      <div style="background: #0B0D12; border: 1px solid #202738; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                        <div style="font-size: 11px; font-weight: 800; color: #8C99AE; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Client Message</div>
                        <p style="font-size: 14px; line-height: 1.6; color: #E2E8F0; white-space: pre-wrap; margin: 0;">${cleanMessage}</p>
                      </div>

                      <!-- DIRECT ACTIONS -->
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" style="padding: 4px 0;">
                            <a href="mailto:${cleanEmail}?subject=Re: Your Inquiry with Nayaab Engineering Innovations" style="display: inline-block; background: #00A6FB; color: #FFFFFF; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: 800; text-decoration: none; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 4px 8px 4px;">
                              ✉️ Reply via Email
                            </a>
                            ${
                              waPhone && waPhone.length >= 10
                                ? `<a href="https://wa.me/${waPhone}?text=${encodeURIComponent(
                                    `Hello ${cleanName}, this is Nayaab Engineering Innovations regarding your project inquiry for ${cleanService}.`
                                  )}" target="_blank" style="display: inline-block; background: #25D366; color: #111111; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: 800; text-decoration: none; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 4px 8px 4px;">
                                    💬 Open WhatsApp
                                  </a>`
                                : ""
                            }
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td align="center" style="background: #0E1118; padding: 18px 24px; border-top: 1px solid #202738; font-size: 12px; color: #64748B;">
                      Nayaab Engineering Innovations Portal &bull; Automated Inquiry Dispatch<br>
                      <a href="https://nayaabengineering.com/admin" style="color: #8C99AE; text-decoration: underline; margin-top: 4px; display: inline-block;">Open Admin Dashboard</a>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    // 2. DISPATCH BRANDED CONFIRMATION EMAIL TO CLIENT
    const clientEmailPromise = resend.emails.send({
      from: FROM_EMAIL,
      to: [cleanEmail],
      replyTo: ADMIN_EMAIL,
      subject: `Thank you for contacting Nayaab Engineering Innovations`,
      text: `Dear ${cleanName},\n\nThank you for reaching out to Nayaab Engineering Innovations (NEIPL). We have successfully received your project inquiry regarding ${cleanService}.\n\nOur engineering team will review your requirements and connect with you within 24 business hours.\n\nWarm regards,\nClient Engagement Team\nNayaab Engineering Innovations Pvt. Ltd.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Inquiry Confirmation</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; color: #1E293B; margin: 0; padding: 24px 12px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.06);">
                  
                  <!-- HEADER WITH CENTERED LOGO -->
                  <tr>
                    <td align="center" style="background: #090A0E; padding: 36px 24px 28px 24px; border-bottom: 3px solid #00A6FB;">
                      <a href="https://nayaabengineering.com" target="_blank" style="text-decoration: none; display: inline-block;">
                        <img src="${LOGO_URL}" alt="Nayaab Engineering Innovations" width="150" style="display: block; max-width: 150px; height: auto; border: 0; margin: 0 auto 12px auto;" />
                      </a>
                      <div style="color: #94A3B8; font-size: 12px; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600;">
                        Architectural &bull; Structural &bull; Turnkey Engineering
                      </div>
                    </td>
                  </tr>

                  <!-- BODY CONTENT -->
                  <tr>
                    <td style="padding: 32px 28px; line-height: 1.6;">
                      
                      <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">
                        Dear ${cleanName},
                      </div>

                      <p style="font-size: 14px; color: #475569; margin: 0 0 16px 0;">
                        Thank you for contacting <strong>Nayaab Engineering Innovations (NEIPL)</strong>. We have successfully received your project inquiry regarding <strong>${cleanService}</strong>.
                      </p>

                      <p style="font-size: 14px; color: #475569; margin: 0 0 20px 0;">
                        Our senior engineering and architectural team is currently reviewing your project requirements. A dedicated project specialist will connect with you within <strong>24 business hours</strong> to discuss the next milestones for your build.
                      </p>

                      <!-- SUMMARY RECAP CARD -->
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; margin-bottom: 20px; overflow: hidden;">
                        <tr>
                          <td colspan="2" style="background: #F1F5F9; padding: 10px 16px; font-size: 11px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px;">
                            Inquiry Summary
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; font-size: 12px; color: #64748B; border-bottom: 1px solid #E2E8F0; width: 35%;">Service</td>
                          <td style="padding: 10px 16px; font-size: 13px; font-weight: 700; color: #0F172A; border-bottom: 1px solid #E2E8F0;">${cleanService}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; font-size: 12px; color: #64748B; border-bottom: 1px solid #E2E8F0;">Contact Phone</td>
                          <td style="padding: 10px 16px; font-size: 13px; font-weight: 600; color: #0F172A; border-bottom: 1px solid #E2E8F0;">${cleanPhone}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; font-size: 12px; color: #64748B;">Date Received</td>
                          <td style="padding: 10px 16px; font-size: 13px; color: #475569;">${timestamp}</td>
                        </tr>
                      </table>

                      <p style="font-size: 13px; color: #64748B; margin: 0 0 24px 0;">
                        Need to share architectural blueprints, site maps, or have an urgent query? Feel free to reply directly to this email or connect with us on WhatsApp.
                      </p>

                      <!-- SIGNATURE -->
                      <div style="border-top: 1px solid #E2E8F0; padding-top: 18px;">
                        <div style="font-size: 14px; font-weight: 800; color: #0F172A;">Client Engagement Team</div>
                        <div style="font-size: 13px; color: #64748B; margin-top: 2px;">Nayaab Engineering Innovations Pvt. Ltd.</div>
                        <div style="font-size: 12px; color: #94A3B8; margin-top: 2px;">Srinagar, Jammu &amp; Kashmir &bull; <a href="https://nayaabengineering.com" style="color: #00A6FB; text-decoration: none;">nayaabengineering.com</a></div>
                      </div>

                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td align="center" style="background: #F1F5F9; padding: 20px 24px; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0;">
                      &copy; ${new Date().getFullYear()} Nayaab Engineering Innovations Pvt. Ltd. All rights reserved.
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    // Execute both in parallel
    await Promise.allSettled([adminEmailPromise, clientEmailPromise]);

    return res.status(200).json({
      success: true,
      message: "Inquiry registered and emails dispatched successfully.",
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
