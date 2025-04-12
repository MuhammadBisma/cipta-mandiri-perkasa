"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, HardDrive, Clock, Calendar } from "lucide-react"

interface BackupStatsProps {
  stats: {
    totalBackups: number
    completedBackups: number
    failedBackups: number
    totalSize: string
    totalSizeBytes: number
    latestBackup: string | null
    nextScheduledBackup: string | null
  } | null
  isLoading: boolean
}

export default function BackupStats({ stats, isLoading }: BackupStatsProps) {
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Belum ada backup"
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <HardDrive className="mr-2 h-5 w-5 text-primary" />
          Statistik Backup
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center">
                <Database className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium">Total Ukuran Backup</span>
              </div>
              <span className="font-bold">{stats?.totalSize || "0 B"}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">Backup Terakhir</span>
              </div>
              <span className="font-bold">{formatDate(stats?.latestBackup)}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center">
                <Database className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-sm font-medium">Jumlah Backup</span>
              </div>
              <span className="font-bold">{stats?.completedBackups || 0}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-sm font-medium">Backup Terjadwal Berikutnya</span>
              </div>
              <span className="font-bold">
                {stats?.nextScheduledBackup ? formatDate(stats.nextScheduledBackup) : "Tidak terjadwal"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
