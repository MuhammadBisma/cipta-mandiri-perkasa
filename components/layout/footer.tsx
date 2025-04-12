import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Image
              src="/logo.svg?height=40&width=180"
              alt="Cipta Mandiri Perkasa Logo"
              width={180}
              height={40}
              className="h-10 w-auto mb-4"
            />
            <p className="text-sm mt-4 mb-6">
              Spesialis pembuatan kubah masjid, mimbar, menara, kerawangan, dan awan kaligrafi dengan kualitas terbaik
              dan harga terjangkau.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                className="hover:text-secondary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="https://instagram.com"
                className="hover:text-secondary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </Link>
              <Link href="https://twitter.com" className="hover:text-secondary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#about" className="text-sm hover:text-secondary transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-sm hover:text-secondary transition-colors">
                  Layanan
                </Link>
              </li>
              <li>
                <Link href="/#gallery" className="text-sm hover:text-secondary transition-colors">
                  Galeri
                </Link>
              </li>
              <li>
                <Link href="/#blog" className="text-sm hover:text-secondary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="text-sm hover:text-secondary transition-colors">
                  Testimoni
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Layanan Kami</h3>
            <ul className="space-y-2">
            <li>
                <Link href="/#services/masjid" className="text-sm hover:text-secondary transition-colors">
                  Masjid
                </Link>
              </li>
              <li>
                <Link href="/services/kubah-masjid" className="text-sm hover:text-secondary transition-colors">
                  Kubah Masjid
                </Link>
              </li>
              <li>
                <Link href="/services/mimbar-masjid" className="text-sm hover:text-secondary transition-colors">
                  Mimbar Masjid
                </Link>
              </li>
              <li>
                <Link href="/services/menara-masjid" className="text-sm hover:text-secondary transition-colors">
                  Menara Masjid
                </Link>
              </li>
              <li>
                <Link href="/services/kerawangan" className="text-sm hover:text-secondary transition-colors">
                  Kerawangan
                </Link>
              </li>
              <li>
                <Link href="/services/awan-kaligrafi" className="text-sm hover:text-secondary transition-colors">
                  Awan Kaligrafi
                </Link>
              </li>
              <li>
                <Link href="/services/ornamen-masjid" className="text-sm hover:text-secondary transition-colors">
                  Ornamen Masjid
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 flex-shrink-0" />
                <span className="text-sm">Jl. Contoh No. 123, Kota, Provinsi, Indonesia</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0" />
                <span className="text-sm">+62 812-3456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0" />
                <span className="text-sm">info@ciptamandiriperkasa.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Cipta Mandiri Perkasa. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}
