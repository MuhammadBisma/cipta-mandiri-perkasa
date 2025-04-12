"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Save, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

export default function ScheduleBackupForm() {
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false)
  const [backupFrequency, setBackupFrequency] = useState("DAILY")
  const [backupTime, setBackupTime] = useState("00:00")
  const [retentionDays, setRetentionDays] = useState("30")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch the current schedule on component mount
  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    try {
      const response = await fetch("/api/backup/schedule")
      if (!response.ok) {
        throw new Error("Failed to fetch backup schedule")
      }
      const data = await response.json()

      setAutoBackupEnabled(data.enabled)
      setBackupFrequency(data.frequency)
      setBackupTime(data.time)
      setRetentionDays(data.retentionDays.toString())
    } catch (error) {
      console.error("Error fetching backup schedule:", error)
      toast({
        title: "Error",
        description: "Failed to fetch backup schedule",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSchedule = async () => {
    setIsSaving(true)

    try {
      const response = await fetch("/api/backup/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: autoBackupEnabled,
          frequency: backupFrequency,
          time: backupTime,
          retentionDays: Number.parseInt(retentionDays),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update backup schedule")
      }

      toast({
        title: "Jadwal tersimpan",
        description: "Pengaturan jadwal backup berhasil disimpan",
      })
    } catch (error) {
      console.error("Error saving backup schedule:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update backup schedule",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            Jadwal Backup Otomatis
          </CardTitle>
          <CardDescription>Atur jadwal backup otomatis untuk database aplikasi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-full"></div>
            <div className="h-24 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          Jadwal Backup Otomatis
        </CardTitle>
        <CardDescription>Atur jadwal backup otomatis untuk database aplikasi</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-backup">Backup Otomatis</Label>
            <p className="text-sm text-gray-500">Aktifkan untuk membuat backup secara otomatis sesuai jadwal</p>
          </div>
          <Switch id="auto-backup" checked={autoBackupEnabled} onCheckedChange={setAutoBackupEnabled} />
        </div>

        {autoBackupEnabled && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Frekuensi Backup</Label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency}>
  <SelectTrigger id="backup-frequency">
    <SelectValue placeholder="Pilih frekuensi" />
  </SelectTrigger>
  <SelectContent className="bg-white border border-gray-200 shadow-lg">
    <SelectItem value="HOURLY" className="data-[state=checked]:bg-gray-100">Setiap Jam</SelectItem>
    <SelectItem value="DAILY" className="data-[state=checked]:bg-gray-100">Harian</SelectItem>
    <SelectItem value="WEEKLY" className="data-[state=checked]:bg-gray-100">Mingguan</SelectItem>
    <SelectItem value="MONTHLY" className="data-[state=checked]:bg-gray-100">Bulanan</SelectItem>
  </SelectContent>
</Select>

              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-time">Waktu Backup</Label>
                <Input
                  id="backup-time"
                  type="time"
                  value={backupTime}
                  onChange={(e) => setBackupTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="retention-days">Retensi Backup (hari)</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="retention-days"
                  type="number"
                  min="1"
                  max="365"
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(e.target.value)}
                  className="w-32"
                />
                <span className="text-sm text-gray-500">
                  Backup yang lebih lama dari {retentionDays} hari akan dihapus secara otomatis
                </span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800">Jadwal Backup Berikutnya</h4>
                  <p className="text-sm text-blue-700">
                    {backupFrequency === "HOURLY" && "Setiap jam pada menit 00"}
                    {backupFrequency === "DAILY" && `Setiap hari pada pukul ${backupTime}`}
                    {backupFrequency === "WEEKLY" && `Setiap hari Minggu pada pukul ${backupTime}`}
                    {backupFrequency === "MONTHLY" && `Setiap tanggal 1 pada pukul ${backupTime}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-800">Catatan Penting</h4>
                  <p className="text-sm text-amber-700">
                    Pastikan server memiliki ruang penyimpanan yang cukup untuk backup otomatis. Backup yang gagal akan
                    dicoba ulang pada jadwal berikutnya.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSaveSchedule} disabled={isSaving}>
          {isSaving ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Pengaturan
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
