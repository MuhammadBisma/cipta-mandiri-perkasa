import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10)

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: adminPassword,
      name: "Administrator",
      role: "ADMIN",
    },
  })

  console.log({ admin })

  // Add sample blog post
  const blogPost = await prisma.blogPost.upsert({
    where: { slug: "sejarah-kubah-masjid" },
    update: {},
    create: {
      title: "Sejarah dan Perkembangan Kubah Masjid di Indonesia",
      slug: "sejarah-kubah-masjid",
      excerpt: "Mengenal sejarah dan perkembangan desain kubah masjid di Indonesia dari masa ke masa.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
      imageUrl: "/placeholder.svg?height=400&width=600",
      category: "Sejarah",
      published: true,
      authorId: admin.id,
    },
  })

  console.log({ blogPost })

  // Add sample gallery item
  const galleryItem = await prisma.gallery.upsert({
    where: { id: "sample-gallery-item" },
    update: {},
    create: {
      id: "sample-gallery-item",
      title: "Kubah Masjid Al-Hidayah",
      description: "Kubah masjid dengan desain modern dan material berkualitas tinggi.",
      imageUrl: "/placeholder.svg?height=600&width=800",
      category: "kubah",
      authorId: admin.id,
    },
  })

  console.log({ galleryItem })

  // Add sample testimonial
  const testimonial = await prisma.testimonial.upsert({
    where: { id: "sample-testimonial" },
    update: {},
    create: {
      id: "sample-testimonial",
      name: "H. Ahmad Fauzi",
      position: "Ketua DKM Masjid Al-Hidayah",
      message:
        "Alhamdulillah, kubah masjid kami yang dibuat oleh Cipta Mandiri Perkasa sangat indah dan berkualitas. Proses pengerjaan cepat dan hasilnya memuaskan.",
      rating: 5,
      imageUrl: "/placeholder.svg?height=100&width=100",
      approved: true,
    },
  })

  console.log({ testimonial })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
