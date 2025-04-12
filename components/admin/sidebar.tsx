"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, ImageIcon, MessageSquare, LogOut, Menu, X, Database, Settings } from "lucide-react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Blog",
    href: "/admin/blog",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Galeri",
    href: "/admin/gallery",
    icon: <ImageIcon className="h-5 w-5" />,
  },
  {
    title: "Testimoni",
    href: "/admin/testimonials",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Backup",
    href: "/admin/backup",
    icon: <Database className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: <Settings className="h-5 w-5" />,
  },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // Remove the auth token cookie
    Cookies.remove("auth_token")

    // Redirect to login page
    router.push("/login")
  }

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
  }

  const itemVariants = {
    open: { opacity: 1, x: 0, transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
    closed: { opacity: 0, x: -20, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  }

  const itemTransition = {
    type: "spring",
    stiffness: 400,
    damping: 40,
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="bg-white shadow-md hover:bg-gray-100"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar for desktop */}
      <motion.div
        className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg hidden lg:block lg:translate-x-0"
        initial={{ x: 0 }}
        animate={{ x: 0 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b">
            <Image
              src="/placeholder.svg?height=40&width=180"
              alt="Cipta Mandiri Perkasa Logo"
              width={180}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.title}>
                  <Link href={item.href}>
                    <div
                      className={`flex items-center px-4 py-3 rounded-md transition-all duration-200 ${
                        pathname === item.href || pathname?.startsWith(item.href + "/")
                          ? "bg-primary text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                      {pathname === item.href && (
                        <motion.div
                          className="absolute left-0 w-1 h-full bg-secondary rounded-r-md"
                          layoutId="sidebar-indicator"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center group hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors duration-300 rounded-xl"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2 group-hover:text-red-600" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Mobile sidebar */}
      <motion.div
        className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg lg:hidden"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b">
            <Image
              src="/logo.svg" 
              alt="Cipta Mandiri Perkasa Logo"
              width={100}    
              height={40}   
              className="h-auto w-[180px]" 
              priority       
            />
          </div>
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <motion.ul className="space-y-2" variants={itemVariants} initial="closed" animate="open">
              {navItems.map((item) => (
                <motion.li key={item.title} variants={itemVariants} transition={itemTransition}>
                  <Link href={item.href}>
                    <div
                      className={`flex items-center px-4 py-3 rounded-md transition-all duration-200 ${
                        pathname === item.href || pathname?.startsWith(item.href + "/")
                          ? "bg-primary text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                      {pathname === item.href && (
                        <motion.div
                          className="absolute left-0 w-1 h-full bg-secondary rounded-r-md"
                          layoutId="sidebar-indicator-mobile"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </div>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center group hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors duration-300"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2 group-hover:text-red-600" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </>
  )
}
