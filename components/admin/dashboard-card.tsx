"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface DashboardCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  description: string;
  color: string;
  index: number;
  badge?: string;
  isAnimating?: boolean;
  onClick?: () => void;
  className?: string; 
}

export default function DashboardCard({
  title,
  value,
  icon,
  description,
  color,
  index,
  badge,
  isAnimating = false,
  onClick,
}: DashboardCardProps) {
  const colorVariants = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    red: "bg-red-50 text-red-700 border-red-200",
  }

  const iconColorVariants = {
    blue: "bg-blue-100 text-blue-500",
    green: "bg-green-100 text-green-500",
    yellow: "bg-yellow-100 text-yellow-500",
    red: "bg-red-100 text-red-500",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`cursor-pointer group ${onClick ? "hover:shadow-lg" : ""} transition-all duration-300`}
      onClick={onClick}
    >
      <div
        className={`relative rounded-lg border p-5 ${colorVariants[color as keyof typeof colorVariants]} ${
          isAnimating ? "animate-pulse" : ""
        }`}
      >
        {badge && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
            {badge}
          </div>
        )}
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium">{title}</p>
            <motion.p
              key={value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold mt-1"
            >
              {value}
            </motion.p>
          </div>
          <div
            className={`h-12 w-12 rounded-lg flex items-center justify-center ${
              iconColorVariants[color as keyof typeof iconColorVariants]
            }`}
          >
            {icon}
          </div>
        </div>
        <p className="text-sm mt-3">{description}</p>
      </div>
    </motion.div>
  )
}
