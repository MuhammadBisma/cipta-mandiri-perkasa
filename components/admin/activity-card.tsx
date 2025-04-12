"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

interface ActivityCardProps {
  title: string
  description: string
  activities: {
    id: string
    title: string
    time: string
    icon: React.ReactNode
    isNew?: boolean
  }[]
  delay: number
}

export default function ActivityCard({ title, description, activities, delay }: ActivityCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
      <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500 mb-4">{description}</p>
          <div className="space-y-4">
            {activities.map((activity,) => (
              <motion.div
                key={activity.id}
                initial={activity.isNew ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-3 ${activity.isNew ? "bg-amber-50 p-2 rounded-md" : ""}`}
              >
                <div className="mt-0.5">{activity.icon}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">
                      {activity.title}
                      {activity.isNew && (
                        <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">Baru!</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
