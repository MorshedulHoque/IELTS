import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  token: string,
  username: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const verifyLink = `${baseUrl}/api/auth/verify?token=${token}`;
  const year = new Date().getFullYear();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f2937;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f6f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#dc2626 0%,#991b1b 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">BandGrowth</h1>
              <p style="margin:8px 0 0;font-size:14px;color:#fecaca;">Your path to IELTS success</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;font-size:22px;font-weight:600;color:#111827;">Welcome aboard, ${username}! 👋</h2>
              <p style="margin:0 0 16px;font-size:16px;line-height:24px;color:#374151;">
                Thanks for signing up for <strong>BandGrowth</strong>. We're excited to help you achieve your target IELTS band score.
              </p>
              <p style="margin:0 0 24px;font-size:16px;line-height:24px;color:#374151;">
                To get started, please verify your email address by clicking the button below:
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <a href="${verifyLink}" target="_blank" style="display:inline-block;background-color:#dc2626;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;font-size:14px;line-height:22px;color:#6b7280;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 24px;font-size:13px;line-height:20px;color:#dc2626;word-break:break-all;background-color:#fef2f2;padding:12px 16px;border-radius:6px;border:1px solid #fecaca;">
                ${verifyLink}
              </p>

              <!-- Info Box -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#fef3c7;border-left:4px solid #f59e0b;border-radius:6px;margin:0 0 24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:14px;line-height:20px;color:#78350f;">
                      ⏰ <strong>This link expires in 24 hours.</strong> If you don't verify in time, you can request a new verification email from your account settings.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:14px;line-height:22px;color:#6b7280;">
                Didn't create an account? You can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;text-align:center;">
              <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#111827;">BandGrowth</p>
              <p style="margin:0 0 16px;font-size:13px;line-height:20px;color:#6b7280;">
                Helping you achieve your dream IELTS band score.
              </p>
              <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;">
                <a href="${baseUrl}/contact" style="color:#6b7280;text-decoration:underline;">Contact</a>
                &nbsp;·&nbsp;
                <a href="${baseUrl}/privacy-policy" style="color:#6b7280;text-decoration:underline;">Privacy</a>
                &nbsp;·&nbsp;
                <a href="${baseUrl}/terms-of-service" style="color:#6b7280;text-decoration:underline;">Terms</a>
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">
                © ${year} BandGrowth. All rights reserved.
              </p>
            </td>
          </tr>
        </table>

        <!-- Outer footer -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;">
          <tr>
            <td style="padding:16px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                This is an automated message. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Verify your email — BandGrowth",
    html,
  });
}

// Resend

// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendVerificationEmail(
//   email: string,
//   token: string,
//   username: string
// ) {
//   // Check API key
//   if (!process.env.RESEND_API_KEY) {
//     console.error("❌ RESEND_API_KEY is not set in environment variables");
//     throw new Error("Resend API key missing");
//   }

//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//   if (!baseUrl) {
//     console.error("❌ NEXT_PUBLIC_BASE_URL is not set");
//     throw new Error("Base URL missing");
//   }

//   const verifyLink = `${baseUrl}/api/auth/verify?token=${token}`;

//   console.log(`📧 Attempting to send email to: ${email}`);
//   console.log(`📧 Verification link: ${verifyLink}`);

//   try {
//     const { data, error } = await resend.emails.send({
//       from: "onboarding@resend.dev",
//       to: email,
//       subject: "Verify your email for IELTS Prep",
//       html: `
//         <h1>Welcome to IELTS Prep!</h1>
//         <p>Hi ${username},</p>
//         <p>Please verify your email address by clicking the link below:</p>
//         <a href="${verifyLink}">${verifyLink}</a>
//         <p>This link will expire in 24 hours.</p>
//         <p>If you didn't create an account, please ignore this email.</p>
//       `,
//     });

//     if (error) {
//       console.error("❌ Resend API error:", error);
//       throw new Error(`Resend error: ${error.message || JSON.stringify(error)}`);
//     }

//     console.log("✅ Email sent successfully! Response:", data);
//     return data;
//   } catch (error) {
//     console.error("❌ Failed to send verification email:", error);
//     throw error; // rethrow so the caller can handle it
//   }
// }
