import { NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiting
const submissionCache = new Map();

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
  const currentTime = Date.now();
  const rateLimitWindow = 10 * 60 * 1000; // 10 minutes
  const TEST_MODE = true; // Set to false in production
  const TEST_EMAIL = "muhammadbismaa3@gmail.com"; // Your verified email

  try {
    // Rate limiting check
    if (ip && submissionCache.has(ip)) {
      const lastSubmission = submissionCache.get(ip);
      if (currentTime - lastSubmission < rateLimitWindow) {
        return NextResponse.json(
          { success: false, message: "Anda hanya dapat mengirim pesan sekali setiap 10 menit" },
          { status: 429 }
        );
      }
    }

    const { name, email, phone, message } = await request.json();

    // Input validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Format email tidak valid" },
        { status: 400 }
      );
    }

    // Phone validation
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Format nomor telepon tidak valid" },
        { status: 400 }
      );
    }

    // In test mode, we'll send all emails to the test email address
    const recipientEmail = TEST_MODE ? TEST_EMAIL : email;
    const adminEmail = TEST_MODE ? TEST_EMAIL : (process.env.ADMIN_EMAIL || TEST_EMAIL);

    // Send confirmation email (to user or test email)
    const userEmailResponse = await resend.emails.send({
      from: TEST_MODE 
        ? "onboarding@resend.dev" 
        : process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
      to: recipientEmail,
      subject: TEST_MODE 
        ? `[TEST] Konfirmasi Pesan dari ${name}` 
        : `Konfirmasi Pesan Anda - ${name}`,
      html: buildUserEmailTemplate(name, message, TEST_MODE),
    });

    if (userEmailResponse.error) {
      console.error("Email error:", userEmailResponse.error);
      throw new Error("Gagal mengirim email konfirmasi");
    }

    // Send notification to admin (or test email)
    const adminEmailResponse = await resend.emails.send({
      from: TEST_MODE 
        ? "onboarding@resend.dev" 
        : process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
      to: adminEmail,
      subject: TEST_MODE 
        ? `[TEST] Pesan Baru dari ${name}` 
        : `Pesan Baru dari ${name}`,
      html: buildAdminEmailTemplate(name, email, phone, message, TEST_MODE),
    });

    if (adminEmailResponse.error) {
      console.error("Admin email error:", adminEmailResponse.error);
      throw new Error("Gagal mengirim notifikasi ke admin");
    }

    // Update rate limit
    if (ip) {
      submissionCache.set(ip, currentTime);
    }

    return NextResponse.json(
      { 
        success: true, 
        message: TEST_MODE
          ? "Pesan test berhasil dikirim (hanya ke alamat test)"
          : "Pesan berhasil dikirim. Anda akan menerima email konfirmasi."
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error 
          ? error.message 
          : "Terjadi kesalahan server" 
      },
      { status: 500 }
    );
  }
}

// Helper functions for email templates
function buildUserEmailTemplate(name: string, message: string, isTest: boolean = false) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${isTest ? `<div style="background: #ffeb3b; color: #000; padding: 10px; margin-bottom: 20px; border-radius: 5px;">
        <strong>TEST EMAIL</strong> - In production, this would be sent to the user
      </div>` : ''}
      <h2 style="color: #2563eb;">Terima kasih ${name}!</h2>
      <p>Kami telah menerima pesan Anda:</p>
      <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
        ${message.replace(/\n/g, "<br>")}
      </div>
      ${isTest ? `<p><em>In production, this would be sent to the user's email (${name})</em></p>` : ''}
      <p>Tim kami akan segera menghubungi Anda.</p>
    </div>
  `;
}

function buildAdminEmailTemplate(name: string, email: string, phone: string, message: string, isTest: boolean = false) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${isTest ? `<div style="background: #ffeb3b; color: #000; padding: 10px; margin-bottom: 20px; border-radius: 5px;">
        <strong>TEST EMAIL</strong> - In production, this would be sent to admin
      </div>` : ''}
      <h2 style="color: #dc2626;">${isTest ? '[TEST] ' : ''}Pesan Baru dari ${name}</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telepon:</strong> ${phone}</p>
      <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
        <strong>Pesan:</strong><br>
        ${message.replace(/\n/g, "<br>")}
      </div>
      ${isTest ? `<p><em>In production, this would be sent to admin email</em></p>` : ''}
    </div>
  `;
}


// Untuk Real User nanti
// import { NextResponse } from "next/server";
// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);

// // Simple in-memory rate limiting
// const submissionCache = new Map();

// export async function POST(request: Request) {
//   const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
//   const currentTime = Date.now();
//   const rateLimitWindow = 10 * 60 * 1000; // 10 minutes

//   try {
//     // Rate limiting check
//     if (ip && submissionCache.has(ip)) {
//       const lastSubmission = submissionCache.get(ip);
//       if (currentTime - lastSubmission < rateLimitWindow) {
//         return NextResponse.json(
//           { success: false, message: "Anda hanya dapat mengirim pesan sekali setiap 10 menit" },
//           { status: 429 }
//         );
//       }
//     }

//     const { name, email, phone, message } = await request.json();

//     // Input validation
//     if (!name || !email || !phone || !message) {
//       return NextResponse.json(
//         { success: false, message: "Semua field harus diisi" },
//         { status: 400 }
//       );
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { success: false, message: "Format email tidak valid" },
//         { status: 400 }
//       );
//     }

//     // Phone validation
//     const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
//     if (!phoneRegex.test(phone)) {
//       return NextResponse.json(
//         { success: false, message: "Format nomor telepon tidak valid" },
//         { status: 400 }
//       );
//     }

//     // Send confirmation email to user
//     const userEmailResponse = await resend.emails.send({
//       from: process.env.RESEND_FROM_EMAIL || "delivered@resend.dev",
//       to: email,
//       subject: `Konfirmasi Pesan Anda - ${name}`,
//       html: buildUserEmailTemplate(name, message),
//     });

//     if (userEmailResponse.error) {
//       console.error("Failed to send user email:", userEmailResponse.error);
//       throw new Error("Gagal mengirim email konfirmasi");
//     }

//     // Send notification to admin
//     const adminEmailResponse = await resend.emails.send({
//       from: process.env.RESEND_FROM_EMAIL || "delivered@resend.dev",
//       to: process.env.ADMIN_EMAIL || "muhammadbismaa3@gmail.com",
//       subject: `Pesan Baru dari ${name}`,
//       html: buildAdminEmailTemplate(name, email, phone, message),
//     });

//     if (adminEmailResponse.error) {
//       console.error("Failed to send admin email:", adminEmailResponse.error);
//       throw new Error("Gagal mengirim notifikasi ke admin");
//     }

//     // Update rate limit
//     if (ip) {
//       submissionCache.set(ip, currentTime);
//     }

//     return NextResponse.json(
//       { 
//         success: true, 
//         message: "Pesan berhasil dikirim. Anda akan menerima email konfirmasi." 
//       },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: error instanceof Error 
//           ? error.message 
//           : "Terjadi kesalahan server" 
//       },
//       { status: 500 }
//     );
//   }
// }

// // Helper functions for email templates
// function buildUserEmailTemplate(name: string, message: string) {
//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #2563eb;">Terima kasih ${name}!</h2>
//       <p>Kami telah menerima pesan Anda:</p>
//       <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
//         ${message.replace(/\n/g, "<br>")}
//       </div>
//       <p>Tim kami akan segera menghubungi Anda.</p>
//     </div>
//   `;
// }

// function buildAdminEmailTemplate(name: string, email: string, phone: string, message: string) {
//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #dc2626;">Pesan Baru dari ${name}</h2>
//       <p><strong>Email:</strong> ${email}</p>
//       <p><strong>Telepon:</strong> ${phone}</p>
//       <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
//         <strong>Pesan:</strong><br>
//         ${message.replace(/\n/g, "<br>")}
//       </div>
//     </div>
//   `;
// }