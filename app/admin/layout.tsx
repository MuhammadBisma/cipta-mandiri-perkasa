import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Sidebar from "@/components/admin/sidebar"
import { getSession } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Admin Dashboard - Cipta Mandiri Perkasa",
  description: "Panel admin untuk mengelola konten website Cipta Mandiri Perkasa",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="lg:ml-64 min-h-screen">
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
