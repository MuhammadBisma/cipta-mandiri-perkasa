"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import type { ReactNode } from "react"

interface Activity {
  id: string
  title: string
  time: string
  icon: ReactNode
  isNew?: boolean
}

interface ActivityCardProps {
  title: string
  description: string
  activities: Activity[]
  delay?: number
}

export default function ActivityCard({ title, description, activities, delay = 0 }: ActivityCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
      <Card className="border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Clock className="mr-2 h-5 w-5 text-indigo-500" />
            {title}
          </CardTitle>
          <p className="text-sm text-gray-500">{description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities && activities.length > 0 ? (
              activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={activity.isNew ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    activity.isNew ? "bg-indigo-50 border border-indigo-100" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="mt-0.5">{activity.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium truncate pr-2">
                        {activity.title}
                        {activity.isNew && (
                          <span className="ml-2 text-xs bg-indigo-500 text-white px-1.5 py-0.5 rounded-full">New</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent activities</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
