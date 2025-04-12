import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

export async function uploadImage(file: File): Promise<string> {
  // Convert file to base64
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const base64 = buffer.toString("base64")
  const dataURI = `data:${file.type};base64,${base64}`

  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(dataURI, {
    folder: "cipta-mandiri-perkasa",
  })

  return result.secure_url
}
