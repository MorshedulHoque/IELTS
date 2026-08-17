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

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Verify your email for IELTS Prep",
    html: `
      <h1>Welcome to IELTS Prep!</h1>
      <p>Hi ${username},</p>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verifyLink}">${verifyLink}</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
    `,
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
