import { NextResponse } from "next/server"
import { Resend } from "resend"

// Inisialisasi Resend dengan API key dari environment variable
const resend = new Resend(process.env.RESEND_API_KEY)

// Simple in-memory rate limiting
// Catatan: Untuk aplikasi produksi dengan multiple instances, 
// sebaiknya gunakan Redis atau database untuk rate limiting
const submissionCache = new Map()

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
  const currentTime = Date.now()
  const rateLimitWindow = 10 * 60 * 1000 // 10 menit
  
  try {
    // Rate limiting check
    if (ip && submissionCache.has(ip)) {
      const lastSubmission = submissionCache.get(ip)
      if (currentTime - lastSubmission < rateLimitWindow) {
        return NextResponse.json(
          { success: false, message: "Anda hanya dapat mengirim pesan sekali setiap 10 menit" },
          { status: 429 },
        )
      }
    }

    const { name, email, phone, message } = await request.json()

    // Input validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json({ success: false, message: "Semua field harus diisi" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "Format email tidak valid" }, { status: 400 })
    }

    // Phone validation
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ success: false, message: "Format nomor telepon tidak valid" }, { status: 400 })
    }

    // Pastikan environment variables tersedia
    const fromEmail = process.env.RESEND_FROM_EMAIL
    const adminEmail = process.env.ADMIN_EMAIL
    
    if (!fromEmail || !adminEmail) {
      console.error("Missing required environment variables: RESEND_FROM_EMAIL or ADMIN_EMAIL")
      return NextResponse.json(
        { success: false, message: "Konfigurasi email server tidak lengkap" },
        { status: 500 }
      )
    }

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Konfirmasi Pesan Anda - ${name}`,
      html: buildUserEmailTemplate(name, message),
    })

    if (userEmailResponse.error) {
      console.error("Email error:", userEmailResponse.error)
      throw new Error("Gagal mengirim email konfirmasi")
    }

    // Send notification to admin
    const adminEmailResponse = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `Pesan Baru dari ${name}`,
      html: buildAdminEmailTemplate(name, email, phone, message),
    })

    if (adminEmailResponse.error) {
      console.error("Admin email error:", adminEmailResponse.error)
      throw new Error("Gagal mengirim notifikasi ke admin")
    }

    // Update rate limit
    if (ip) {
      submissionCache.set(ip, currentTime)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Pesan berhasil dikirim. Anda akan menerima email konfirmasi.",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan server",
      },
      { status: 500 },
    )
  }
}

// Helper functions for email templates
function buildUserEmailTemplate(name: string, message: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://kubahcmp.id/images/logo.png" alt="Cipta Mandiri Perkasa" style="max-width: 200px; height: auto;">
      </div>
      <h2 style="color: #2563eb; text-align: center;">Terima kasih ${name}!</h2>
      <p>Kami telah menerima pesan Anda:</p>
      <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
        ${message.replace(/\n/g, "<br>")}
      </div>
      <p>Tim kami akan segera menghubungi Anda.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center; color: #666; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Cipta Mandiri Perkasa. Semua Hak Dilindungi.</p>
        <p>Kp.pisang, batu, Jl. Raya Tambelang No.RT.02, Kertamukti, Kec. Cibitung, Kabupaten Bekasi, Jawa Barat 17520</p>
        <p>
          <a href="https://kubahcmp.id" style="color: #2563eb; text-decoration: none;">kubahcmp.id</a> | 
          <a href="tel:+62 813-8622-5702" style="color: #2563eb; text-decoration: none;">+62 812-3456-7890</a> | 
          <a href="mailto:kubah.cmp@gmail.com" style="color: #2563eb; text-decoration: none;">info@kubahcmp.id</a>
        </p>
      </div>
    </div>
  `
}

function buildAdminEmailTemplate(name: string, email: string, phone: string, message: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://kubahcmp.id/images/logo.png" alt="Cipta Mandiri Perkasa" style="max-width: 200px; height: auto;">
      </div>
      <h2 style="color: #dc2626; text-align: center;">Pesan Baru dari ${name}</h2>
      <div style="margin: 20px 0; padding: 15px; background-color: #f9fafb; border-radius: 5px;">
        <p><strong>Nama:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
        <p><strong>Telepon:</strong> <a href="tel:${phone}" style="color: #2563eb;">${phone}</a></p>
      </div>
      <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
        <strong>Pesan:</strong><br>
        ${message.replace(/\n/g, "<br>")}
      </div>
      <div style="margin-top: 20px; text-align: center;">
        <a href="mailto:${email}?subject=Re: Pesan Anda - Cipta Mandiri Perkasa&body=Halo ${name}," 
           style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">
          Balas Email
        </a>
        <a href="tel:${phone}" 
           style="display: inline-block; margin-left: 10px; padding: 10px 20px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px;">
          Hubungi via Telepon
        </a>
      </div>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center; color: #666; font-size: 12px;">
        <p>Pesan ini diterima pada ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</p>
        <p>© ${new Date().getFullYear()} Cipta Mandiri Perkasa. Admin Panel.</p>
      </div>
    </div>
  `
}