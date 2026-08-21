// api/subscribe.js — Serverless Newsletter Subscription & Unsubscription via Resend
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.RESEND;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@nayaabengineering.com";
const SENDER_EMAIL = process.env.RESEND_FROM_EMAIL_ADDRESS || "info@nayaabengineering.com";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { email, action = "subscribe" } = req.body || {};
  const cleanEmail = String(email || "").trim().toLowerCase();
  const isUnsubscribe = action === "unsubscribe";

  if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // 1. Register event in Supabase inquiries table
  if (supabase) {
    try {
      await supabase.from("inquiries").insert([
        {
          name: isUnsubscribe ? "Unsubscribed User" : "Newsletter Subscriber",
          email: cleanEmail,
          phone: null,
          service: isUnsubscribe ? "Newsletter Unsubscribe" : "Newsletter Subscription",
          message: isUnsubscribe
            ? `User unsubscribed from newsletter updates at ${timestamp}.`
            : `Subscriber registered via website footer at ${timestamp}.`,
          status: "unread",
        },
      ]);
    } catch (dbErr) {
      console.warn("Supabase subscription insert notice:", dbErr);
    }
  }

  if (!resend) {
    console.warn("Resend API key missing. Skipping email dispatch.");
    return res.status(200).json({ success: true, warning: "Resend API key not configured." });
  }

  try {
    if (isUnsubscribe) {
      // -------------------------------------------------------------
      // UN-SUBSCRIPTION FLOW
      // -------------------------------------------------------------

      // Email 1: Notify Admin about Unsubscription
      const adminUnsubPromise = resend.emails.send({
        from: `Newsletter Update <${SENDER_EMAIL}>`,
        to: [ADMIN_EMAIL],
        replyTo: cleanEmail,
        subject: `Newsletter Unsubscription: ${cleanEmail}`,
        headers: { "X-Entity-Ref-ID": `unsub-${Date.now()}` },
        text: `NEWSLETTER UN-SUBSCRIPTION\n\nUser Email: ${cleanEmail}\nUnsubscribed At: ${timestamp}\nSource: Website Footer\n\nDatabase record has been updated.`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Newsletter Unsubscription</title>
          </head>
          <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAFAFA; color: #1E293B;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 32px 28px; border-radius: 8px; border: 1px solid #E2E8F0;">
              <div style="margin-bottom: 24px; border-bottom: 2px solid #EF4444; padding-bottom: 16px;">
                <div style="font-size: 28px; font-weight: 900; color: #00A6FB; letter-spacing: 2px; line-height: 1;">NEI</div>
                <div style="font-size: 13px; font-weight: 700; color: #EF4444; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 4px;">
                  NAYAAB ENGINEERING INNOVATIONS &bull; UN-SUBSCRIPTION NOTICE
                </div>
              </div>
              <p style="font-size: 15px; color: #0F172A; margin: 0 0 16px 0;">
                The following user has unsubscribed from newsletter communications:
              </p>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; color: #64748B; font-weight: 600; width: 32%;">Email:</td>
                  <td style="padding: 8px 0; color: #0F172A; font-weight: 700;">${cleanEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Date:</td>
                  <td style="padding: 8px 0; color: #475569;">${timestamp}</td>
                </tr>
              </table>
              <div style="border-top: 1px solid #E2E8F0; padding-top: 16px; font-size: 12px; color: #94A3B8;">
                Automatic notice from <a href="https://nayaabengineering.com" style="color: #64748B;">Nayaab Engineering</a>.
              </div>
            </div>
          </body>
          </html>
        `,
      });

      // Email 2: Confirm to User
      const userUnsubPromise = resend.emails.send({
        from: `Nayaab Engineering Innovations <${SENDER_EMAIL}>`,
        to: [cleanEmail],
        replyTo: ADMIN_EMAIL,
        subject: `You have been unsubscribed — Nayaab Engineering Innovations`,
        headers: { "X-Entity-Ref-ID": `unsub-confirm-${Date.now()}` },
        text: `Hello,\n\nYou have been successfully unsubscribed from the Nayaab Engineering Innovations (NEIPL) newsletter.\n\nYou will no longer receive newsletter announcements from us. If this was done by mistake, you can resubscribe anytime at https://nayaabengineering.com\n\nWarm regards,\nNayaab Engineering Innovations Pvt. Ltd.`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Unsubscribed Successfully</title>
          </head>
          <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAFAFA; color: #1E293B;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 32px 28px; border-radius: 8px; border: 1px solid #E2E8F0;">
              <div style="margin-bottom: 24px; border-bottom: 2px solid #64748B; padding-bottom: 16px;">
                <div style="font-size: 28px; font-weight: 900; color: #00A6FB; letter-spacing: 2px; line-height: 1;">NEI</div>
                <div style="font-size: 13px; font-weight: 700; color: #475569; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 4px;">
                  NAYAAB ENGINEERING INNOVATIONS
                </div>
              </div>
              <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">
                You Have Been Unsubscribed
              </div>
              <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 16px 0;">
                You have been successfully removed from our newsletter distribution list. You will no longer receive architectural updates or periodic newsletter emails from <strong>Nayaab Engineering Innovations</strong>.
              </p>
              <p style="font-size: 13px; line-height: 1.6; color: #64748B; margin: 0 0 24px 0;">
                If you unsubscribed by accident, you can re-subscribe anytime directly on our website.
              </p>
              <div style="border-top: 1px solid #E2E8F0; padding-top: 18px; font-size: 13px; color: #475569; line-height: 1.6;">
                <strong style="color: #0F172A;">Nayaab Engineering Innovations Pvt. Ltd.</strong><br>
                Srinagar, Jammu &amp; Kashmir &bull; <a href="https://nayaabengineering.com" style="color: #00A6FB; text-decoration: none;">nayaabengineering.com</a>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      await Promise.allSettled([adminUnsubPromise, userUnsubPromise]);

      return res.status(200).json({
        success: true,
        action: "unsubscribe",
        message: "You have been successfully unsubscribed from our newsletter.",
      });
    }

    // -------------------------------------------------------------
    // SUBSCRIPTION FLOW (Default)
    // -------------------------------------------------------------

    // 2. DISPATCH NOTIFICATION EMAIL TO ADMIN
    const adminEmailPromise = resend.emails.send({
      from: `Newsletter Subscriber <${SENDER_EMAIL}>`,
      to: [ADMIN_EMAIL],
      replyTo: cleanEmail,
      subject: `New Newsletter Subscriber: ${cleanEmail}`,
      headers: {
        "X-Entity-Ref-ID": `sub-${Date.now()}`,
      },
      text: `NEW NEWSLETTER SUBSCRIBER\n\nSubscriber Email: ${cleanEmail}\nRegistered At: ${timestamp}\nSource: Website Footer\n\nTo view all subscriptions, check your Admin Dashboard at https://nayaabengineering.com/admin`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Newsletter Subscriber</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAFAFA; color: #1E293B;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 32px 28px; border-radius: 8px; border: 1px solid #E2E8F0;">
            
            <!-- BRANDING HEADER -->
            <div style="margin-bottom: 24px; border-bottom: 2px solid #00A6FB; padding-bottom: 16px;">
              <div style="font-size: 28px; font-weight: 900; color: #00A6FB; letter-spacing: 2px; line-height: 1;">NEI</div>
              <div style="font-size: 13px; font-weight: 700; color: #475569; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 4px;">
                NAYAAB ENGINEERING INNOVATIONS &bull; NEWSLETTER ALERT
              </div>
            </div>

            <p style="font-size: 15px; line-height: 1.6; color: #0F172A; margin: 0 0 16px 0;">
              A new visitor has subscribed to your newsletter updates:
            </p>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #64748B; font-weight: 600; width: 32%;">Subscriber Email:</td>
                <td style="padding: 8px 0; color: #00A6FB; font-weight: 700;">
                  <a href="mailto:${cleanEmail}" style="color: #00A6FB; text-decoration: none;">${cleanEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Subscribed On:</td>
                <td style="padding: 8px 0; color: #475569;">${timestamp}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Source:</td>
                <td style="padding: 8px 0; color: #0F172A; font-weight: 600;">Website Footer Subscription</td>
              </tr>
            </table>

            <div style="padding-top: 8px; margin-bottom: 24px;">
              <a href="mailto:${cleanEmail}?subject=Welcome to Nayaab Engineering Innovations" style="display: inline-block; background-color: #00A6FB; color: #FFFFFF; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 700; text-decoration: none; margin-right: 8px; margin-bottom: 8px;">
                Send Direct Message
              </a>
              <a href="https://nayaabengineering.com/admin" style="display: inline-block; background-color: #0F172A; color: #FFFFFF; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 700; text-decoration: none; margin-bottom: 8px;">
                Open Admin Dashboard
              </a>
            </div>

            <div style="border-top: 1px solid #E2E8F0; padding-top: 16px; font-size: 12px; color: #94A3B8;">
              This notification was generated automatically by the <a href="https://nayaabengineering.com" style="color: #64748B; text-decoration: underline;">Nayaab Engineering Website</a>.
            </div>

          </div>
        </body>
        </html>
      `,
    });

    // 3. DISPATCH WELCOME CONFIRMATION EMAIL TO SUBSCRIBER
    const subscriberEmailPromise = resend.emails.send({
      from: `Nayaab Engineering Innovations <${SENDER_EMAIL}>`,
      to: [cleanEmail],
      replyTo: ADMIN_EMAIL,
      subject: `Welcome to Nayaab Engineering Innovations`,
      headers: {
        "X-Entity-Ref-ID": `welcome-${Date.now()}`,
      },
      text: `Welcome to Nayaab Engineering Innovations (NEIPL)!\n\nThank you for subscribing to our newsletter and project updates. You will be the first to receive our latest engineering case studies, architectural showcases, and construction industry insights.\n\nExplore our portfolio: https://nayaabengineering.com/projects\nGet in touch: info@nayaabengineering.com\n\nWarm regards,\nEditorial & Client Engagement Team\nNayaab Engineering Innovations Pvt. Ltd.\nSrinagar, Jammu & Kashmir`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Nayaab Engineering Innovations</title>
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

            <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">
              Welcome to Our Newsletter Community!
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 16px 0;">
              Thank you for subscribing to <strong>Nayaab Engineering Innovations (NEIPL)</strong>. You have successfully joined our network of architects, builders, developers, and engineering enthusiasts.
            </p>

            <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
              Here is what you can look forward to:
            </p>

            <div style="border-left: 3px solid #00A6FB; padding: 14px 18px; background-color: #F8FAFC; border-radius: 0 6px 6px 0; margin-bottom: 24px; font-size: 13px; line-height: 1.8; color: #334155;">
              &bull; <strong>Architectural Showcases:</strong> Exclusive walkthroughs of high-end residential & commercial builds.<br>
              &bull; <strong>Structural Engineering Insights:</strong> Seismic-resilient engineering & sustainable construction innovations.<br>
              &bull; <strong>Project Milestones:</strong> Real-time case studies and progress updates across Kashmir and Northern India.
            </div>

            <p style="font-size: 13px; line-height: 1.6; color: #64748B; margin: 0 0 24px 0;">
              Planning a new project or looking for structural consultancy? Feel free to reply directly to this email or visit our website anytime.
            </p>

            <!-- ACTION BUTTON -->
            <div style="margin-bottom: 28px;">
              <a href="https://nayaabengineering.com/projects" style="display: inline-block; background-color: #00A6FB; color: #FFFFFF; padding: 11px 22px; border-radius: 6px; font-size: 13px; font-weight: 700; text-decoration: none;">
                Explore Our Project Portfolio
              </a>
            </div>

            <!-- SIGNATURE -->
            <div style="border-top: 1px solid #E2E8F0; padding-top: 18px; font-size: 13px; color: #475569; line-height: 1.6;">
              <strong style="color: #0F172A;">Editorial &amp; Client Engagement Team</strong><br>
              Nayaab Engineering Innovations Pvt. Ltd.<br>
              Srinagar, Jammu &amp; Kashmir &bull; <a href="https://nayaabengineering.com" style="color: #00A6FB; text-decoration: none;">nayaabengineering.com</a>
            </div>

          </div>
        </body>
        </html>
      `,
    });

    // 4. Execute both in parallel
    const [adminResult, subscriberResult] = await Promise.allSettled([adminEmailPromise, subscriberEmailPromise]);

    if (adminResult.status === "rejected" || adminResult.value?.error) {
      console.error("Admin subscription notification error:", adminResult.reason || adminResult.value?.error);
    }
    if (subscriberResult.status === "rejected" || subscriberResult.value?.error) {
      console.error("Subscriber welcome email error:", subscriberResult.reason || subscriberResult.value?.error);
    }

    return res.status(200).json({
      success: true,
      action: "subscribe",
      message: "Subscribed successfully and confirmation dispatched.",
      adminSent: adminResult.status === "fulfilled" && !adminResult.value?.error,
      subscriberSent: subscriberResult.status === "fulfilled" && !subscriberResult.value?.error,
    });
  } catch (err) {
    console.error("Subscribe execution error:", err);
    return res.status(200).json({
      success: true,
      warning: "Subscription processed, but email notification had an error.",
      error: err.message,
    });
  }
}
