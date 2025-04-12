"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowDown, ArrowUp } from "lucide-react"
import type { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string
  icon: ReactNode
  trend: string
  trendUp: boolean
}

export default function StatsCard({ title, value, icon, trend, trendUp }: StatsCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <p className="text-3xl font-bold mt-2">{value}</p>
              <div className="flex items-center mt-2">
                <span className={`flex items-center text-sm ${trendUp ? "text-green-500" : "text-red-500"}`}>
                  {trendUp ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                  {trend}
                </span>
                <span className="text-xs text-gray-500 ml-2">vs. last period</span>
              </div>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
