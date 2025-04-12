"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface StatItem {
  label: string
  value: string | number
  change?: number
}

interface StatsCardProps {
  title: string
  description: string
  stats: StatItem[]
  delay?: number
}

export default function StatsCard({ title, description, stats, delay = 0 }: StatsCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
      <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="flex justify-between border-b pb-4 last:border-b-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: delay + index * 0.1 }}
              >
                <div>
                  <p className="font-medium">{stat.label}</p>
                  <p className="text-sm text-gray-500">
                    {stat.change !== undefined && (
                      <span className={`inline-block mr-1 ${stat.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {stat.change >= 0 ? "↑" : "↓"} {Math.abs(stat.change)}%
                      </span>
                    )}
                    vs. previous period
                  </p>
                </div>
                <p className="font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
