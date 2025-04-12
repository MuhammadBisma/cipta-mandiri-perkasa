import { NextResponse } from "next/server"
import sgMail from "@sendgrid/mail"
import { MailDataRequired } from "@sendgrid/helpers/classes/mail"

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json()

    // Validate input
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, message: "Semua field harus diisi" },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Format email tidak valid" },
        { status: 400 }
      )
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Format nomor telepon tidak valid" },
        { status: 400 }
      )
    }

    // Check if SendGrid API key is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.error("SendGrid API key is not configured")
      return NextResponse.json(
        { success: false, message: "Konfigurasi email belum diatur dengan benar" },
        { status: 500 }
      )
    }

    // Email content with proper typing
    const emailData: MailDataRequired = {
      to: "devourbisma@gmail.com",
      from: process.env.SENDGRID_VERIFIED_SENDER || "noreply@ciptamandiriperkasa.com",
      subject: `Pesan Kontak Baru dari ${name}`,
      text: `Nama: ${name}\nEmail: ${email}\nTelepon: ${phone}\n\nPesan:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Pesan Kontak Baru</h2>
          <p><strong>Nama:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telepon:</strong> ${phone}</p>
          <div style="margin-top: 20px;">
            <p><strong>Pesan:</strong></p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 5px;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">
            Pesan ini dikirim dari form kontak website Cipta Mandiri Perkasa.
          </p>
        </div>
      `,
      replyTo: email,
      mailSettings: {
        sandboxMode: {
          enable: process.env.NODE_ENV === "development" // Enable sandbox in development
        }
      }
    }

    // Send email using SendGrid
    await sgMail.send(emailData)

    // Return success response
    return NextResponse.json(
      { success: true, message: "Pesan berhasil dikirim" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error sending email:", error)
    
    // Provide more specific error messages
    let errorMessage = "Terjadi kesalahan saat mengirim pesan"
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === "string") {
      errorMessage = error
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    )
  }
}