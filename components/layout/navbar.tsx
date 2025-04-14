"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, User, ChevronDown, ArrowRight } from "lucide-react"

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Tentang Kami", href: "/#about"},
  { name: "Layanan", href: "/#services",
    subLinks: [
      { name: "Masjid", href: "/services/masjid" },
      { name: "Kubah Masjid", href: "/services/kubah" },
      { name: "Mimbar Masjid", href: "/services/mimbar" },
      { name: "Menara Masjid", href: "/services/menara" },
      { name: "Kerawangan", href: "/services/kerawangan" },
      { name: "Ornamen Masjid", href: "/services/ornamen" },
      { name: "Awan Kaligrafi", href: "/services/kaligrafi" }
    ]
  },
  { name: "Galeri", href: "/gallery" },
  { name: "Blog", href: "/blog" },
  { name: "Kontak", href: "/contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleSubmenu = (name: string) => {
    setActiveSubmenu(activeSubmenu === name ? null : name)
  }

      return (
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
            scrolled 
              ? "bg-white/95 backdrop-blur-md shadow-sm py-2" 
              : "bg-transparent py-4"
          }`}
        >
          <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-200">
      {/* Logo diperbesar */}
      <div className="flex-shrink-0">
        <Image
          src={scrolled ? "/logo.svg" : "/logo.svg"}
          alt="Cipta Mandiri Perkasa Logo"
          width={50} 
          height={50}
          className="h-12 w-auto" 
          priority
        />
        </div>
        <div className="flex flex-col">
        <span className="ml-2 font-semibold text-[18px] leading-tight">
          <span className="text-blue-600">Cipta Mandiri</span>{' '}
          <span className="text-yellow-500">Perkasa</span>
        </span>
        <span className="ml-2 text-[10px] text-gray-500 leading-tight">
          Glassfibre Reinforced Cement Interior & Exterior Finishing
        </span>
      </div>
      </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            <div 
              key={link.name} 
              className="relative group"
              onMouseEnter={() => link.subLinks && setActiveSubmenu(link.name)}
              onMouseLeave={() => link.subLinks && setActiveSubmenu(null)}
            >
              <div className="flex items-center">
                <Link
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                    scrolled 
                      ? "text-gray-800 hover:text-primary" 
                      : "text-white hover:text-primary-light"
                  }`}
                >
                  {link.name}
                </Link>
                {link.subLinks && (
                  <ChevronDown 
                    size={16} 
                    className={`ml-1 transition-transform ${
                      activeSubmenu === link.name ? 'rotate-180' : ''
                    } ${
                      scrolled ? 'text-gray-600' : 'text-white/80'
                    }`}
                  />
                )}
              </div>
              
              {link.subLinks && (
                <div 
                  className={`absolute left-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5 transition-all duration-300 ${
                    activeSubmenu === link.name 
                      ? "opacity-100 scale-100" 
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="p-2">
                    {link.subLinks.map((subLink) => (
                      <Link
                        key={`${link.name}-${subLink.name}`}
                        href={subLink.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                      >
                        {subLink.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <Link href="/login">
          <Button 
            className={`ml-4 group relative overflow-hidden transition-all duration-300 rounded-full px-6 h-10 ${
              scrolled ? "bg-blue-600 text-white" : "bg-transparent text-white border border-white"
            }`}
          >
            <span className="absolute inset-0 w-0 bg-white/10 transition-all duration-300 group-hover:w-full rounded-full"></span>
            <span className="relative flex items-center">
              <User size={16} className="mr-2" />
              <span>Login</span>
              <ArrowRight 
                size={16} 
                className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0" 
              />
            </span>
          </Button>
        </Link>
        </nav>

        {/* Mobile Navigation Toggle */}
        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${
            scrolled 
              ? "text-gray-800 hover:bg-gray-100" 
              : "text-white hover:bg-white/10"
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-4 transition-all duration-300 ease-out">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <div key={link.name}>
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href}
                    className="px-4 py-3 text-gray-800 text-sm font-medium transition-colors hover:text-primary w-full rounded-lg"
                    onClick={() => !link.subLinks && setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                  {link.subLinks && (
                    <button 
                      onClick={() => toggleSubmenu(link.name)}
                      className="p-2"
                    >
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform ${
                          activeSubmenu === link.name ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>
                
                {link.subLinks && activeSubmenu === link.name && (
                  <div className="ml-4 mt-1 space-y-1">
                    {link.subLinks.map((subLink) => (
                      <Link
                        key={`mobile-${link.name}-${subLink.name}`}
                        href={subLink.href}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-primary rounded-lg transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {subLink.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <Link 
      href="/login" 
        className="mt-4"
          onClick={() => setIsOpen(false)}
          >
            <Button className="w-full justify-center group rounded-full h-10">
              <User size={16} className="mr-2" />
              <span>Login</span>
              <ArrowRight 
                size={16} 
                className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0" 
            />
            </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}