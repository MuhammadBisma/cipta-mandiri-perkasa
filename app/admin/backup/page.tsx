"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Database,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Info,
  FileJson,
  FileArchive,
  ArrowUpCircle,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import BackupHistoryTable from "@/components/admin/backup/backup-history"
import BackupStats from "@/components/admin/backup/backup-stats"
import ScheduleBackupForm from "@/components/admin/backup/schedule-backup-form"
import { Progress } from "@/components/ui/progress"

// Tambahkan interface untuk data backup di bagian atas file
interface Backup {
  id: string
  name: string
  description?: string
  date: string
  size: string
  sizeBytes: number
  type: string
  status: string
  tables: string[]
  createdBy: string
}

interface TableInfo {
  id: string
  name: string
  count: number
  size: string
}

interface BackupStatsInterface {
  totalBackups: number
  completedBackups: number
  failedBackups: number
  totalSize: string
  totalSizeBytes: number
  latestBackup: string | null
  nextScheduledBackup: string | null
}

// Tambahkan fungsi helper untuk mengelola backup
const handleBackupProgress = (
  setBackupProgress: React.Dispatch<React.SetStateAction<number>>,
  progressInterval: NodeJS.Timeout,
): void => {
  setBackupProgress((prev) => {
    const newProgress = prev + 5
    if (newProgress >= 90) {
      clearInterval(progressInterval)
      return 90
    }
    return newProgress
  })
}

// Tambahkan fungsi helper untuk validasi form
const validateBackupForm = (selectedTables: string[], backupName: string, toast: any): boolean => {
  if (selectedTables.length === 0) {
    toast({
      title: "Pilih tabel",
      description: "Pilih setidaknya satu tabel untuk backup",
      variant: "destructive",
    })
    return false
  }

  if (!backupName.trim()) {
    toast({
      title: "Nama backup diperlukan",
      description: "Berikan nama untuk backup ini",
      variant: "destructive",
    })
    return false
  }

  return true
}

// Tambahkan fungsi helper untuk validasi file
const validateBackupFile = (file: File | undefined, toast: any): boolean => {
  if (!file) return false

  // Check file type
  if (!file.name.endsWith(".json") && !file.name.endsWith(".json.gz")) {
    toast({
      title: "Format file tidak didukung",
      description: "Hanya file JSON atau JSON.GZ yang didukung",
      variant: "destructive",
    })
    return false
  }

  return true
}

export default function BackupPage() {
  const [backups, setBackups] = useState<any[]>([])
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [backupName, setBackupName] = useState("")
  const [backupDescription, setBackupDescription] = useState("")
  const [availableTables, setAvailableTables] = useState<TableInfo[]>([])
  const [stats, setStats] = useState<BackupStatsInterface | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)
  const [selectedBackupForRestore, setSelectedBackupForRestore] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const { toast } = useToast()

  // Fetch backups and options on component mount
  useEffect(() => {
    fetchBackups()
    fetchOptions()
  }, [])

  // Refactor fetchBackups function untuk lebih modular
  const fetchBackups = async () => {
    try {
      const response = await fetch("/api/backup")
      if (!response.ok) {
        throw new Error("Failed to fetch backups")
      }
      const data = await response.json()
      setBackups(data)
    } catch (error) {
      console.error("Error fetching backups:", error)
      toast({
        title: "Error",
        description: "Failed to fetch backups",
        variant: "destructive",
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  // Refactor fetchOptions function untuk lebih modular
  const fetchOptions = async () => {
    try {
      const response = await fetch("/api/backup", {
        method: "OPTIONS",
      })
      if (!response.ok) {
        throw new Error("Failed to fetch backup options")
      }
      const data = await response.json()
      setAvailableTables(data.tables)
      setStats(data.stats)
    } catch (error) {
      console.error("Error fetching backup options:", error)
      toast({
        title: "Error",
        description: "Failed to fetch backup options",
        variant: "destructive",
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  const toggleTableSelection = (tableId: string) => {
    if (selectedTables.includes(tableId)) {
      setSelectedTables(selectedTables.filter((id) => id !== tableId))
    } else {
      setSelectedTables([...selectedTables, tableId])
    }
  }

  const selectAllTables = () => {
    setSelectedTables(availableTables.map((table) => table.id))
  }

  const deselectAllTables = () => {
    setSelectedTables([])
  }

  // Refactor createBackup function untuk lebih modular
  const createBackup = async () => {
    if (!validateBackupForm(selectedTables, backupName, toast)) {
      return
    }

    setIsCreatingBackup(true)
    setBackupProgress(0)

    // Simulate progress while the actual backup is being created
    const progressInterval = setInterval(() => {
      handleBackupProgress(setBackupProgress, progressInterval)
    }, 300)

    try {
      const response = await fetch("/api/backup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: backupName,
          description: backupDescription,
          tables: selectedTables,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create backup")
      }

      const newBackup = await response.json()

      // Complete the progress
      clearInterval(progressInterval)
      setBackupProgress(100)

      // Add the new backup to the list
      setBackups([newBackup, ...backups])

      // Reset form
      setBackupName("")
      setBackupDescription("")
      setSelectedTables([])

      // Refresh stats
      fetchOptions()

      toast({
        title: "Backup berhasil",
        description: "Backup data telah berhasil dibuat",
      })
    } catch (error) {
      clearInterval(progressInterval)
      console.error("Error creating backup:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create backup",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setIsCreatingBackup(false)
        setBackupProgress(0)
      }, 1000)
    }
  }

  const downloadBackup = async (backupId: string) => {
    try {
      // Get the backup details
      const response = await fetch(`/api/backup/${backupId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch backup details")
      }
      const backup = await response.json()

      // Create a download link
      const downloadUrl = `/api/backup/${backupId}/download`
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `${backup.name}.json.gz`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Mengunduh backup",
        description: `Mengunduh ${backup.name}...`,
      })
    } catch (error) {
      console.error("Error downloading backup:", error)
      toast({
        title: "Error",
        description: "Failed to download backup",
        variant: "destructive",
      })
    }
  }

  // Replace the deleteBackup function to use the new modal dialog
  const deleteBackup = async (backupId: string) => {
    // Find the backup in the list
    const backup = backups.find((b) => b.id === backupId)
    if (!backup) return

    try {
      const response = await fetch(`/api/backup/${backupId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete backup")
      }

      // Remove the backup from the list
      setBackups(backups.filter((b) => b.id !== backupId))

      // Refresh stats
      fetchOptions()

      toast({
        title: "Backup dihapus",
        description: `${backup.name} telah dihapus`,
      })
    } catch (error) {
      console.error("Error deleting backup:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete backup",
        variant: "destructive",
      })
    }
  }

  // Refactor handleFileUpload function untuk lebih modular
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      toast({
        title: "Error",
        description: "Tidak ada file yang dipilih",
        variant: "destructive",
      })
      return
    }

    if (!validateBackupFile(file, toast)) {
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file as Blob) // Tambahkan type assertion untuk mengatasi error TypeScript

      const response = await fetch("/api/backup/restore", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to upload backup file")
      }

      const result = await response.json()

      // Refresh the backup list
      fetchBackups()
      fetchOptions()

      // Tampilkan pesan sukses yang lebih informatif
      toast({
        title: "Unggahan berhasil",
        description: `File backup "${file.name}" berhasil diunggah dan siap untuk dipulihkan.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error uploading backup file:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload backup file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Clear the file input
      e.target.value = ""
    }
  }

  // Refactor restoreBackup function untuk lebih modular
  const restoreBackup = async () => {
    if (!selectedBackupForRestore) {
      toast({
        title: "Pilih backup",
        description: "Pilih backup yang ingin dipulihkan",
        variant: "destructive",
      })
      return
    }

    // Confirm restoration
    if (!confirm("Apakah Anda yakin ingin memulihkan database dari backup ini? Data yang ada akan ditimpa.")) {
      return
    }

    setIsRestoring(true)

    try {
      const response = await fetch(`/api/backup/restore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          backupId: selectedBackupForRestore,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to restore backup")
      }

      toast({
        title: "Pemulihan berhasil",
        description: "Database berhasil dipulihkan dari backup",
      })
    } catch (error) {
      console.error("Error restoring backup:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to restore backup",
        variant: "destructive",
      })
    } finally {
      setIsRestoring(false)
      setSelectedBackupForRestore(null)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold">Backup & Restore</h1>
        <p className="text-gray-500">Kelola backup dan restore database aplikasi</p>
      </motion.div>

      <Tabs defaultValue="backup" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="restore">Restore</TabsTrigger>
          <TabsTrigger value="schedule">Jadwal</TabsTrigger>
        </TabsList>

        <TabsContent value="backup" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2 h-5 w-5 text-primary" />
                    Buat Backup Baru
                  </CardTitle>
                  <CardDescription>
                    Pilih tabel yang ingin di-backup dan berikan nama untuk backup tersebut
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="backup-name">Nama Backup</Label>
                      <Input
                        id="backup-name"
                        placeholder="Contoh: Full Backup 2025-04-10"
                        value={backupName}
                        onChange={(e) => setBackupName(e.target.value)}
                        disabled={isCreatingBackup}
                      />
                    </div>

                    <div>
                      <Label htmlFor="backup-description">Deskripsi (Opsional)</Label>
                      <Input
                        id="backup-description"
                        placeholder="Deskripsi backup ini"
                        value={backupDescription}
                        onChange={(e) => setBackupDescription(e.target.value)}
                        disabled={isCreatingBackup}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Pilih Tabel</Label>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm" onClick={selectAllTables} disabled={isCreatingBackup}>
                            Pilih Semua
                          </Button>
                          <Button variant="outline" size="sm" onClick={deselectAllTables} disabled={isCreatingBackup}>
                            Batalkan Semua
                          </Button>
                        </div>
                      </div>

                      {isLoadingData ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-3 border rounded-md animate-pulse bg-gray-100 h-12"></div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {availableTables.map((table) => (
                            <div
                              key={table.id}
                              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                                selectedTables.includes(table.id) ? "bg-primary/10 border-primary" : "hover:bg-gray-50"
                              }`}
                              onClick={() => toggleTableSelection(table.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div
                                    className={`w-4 h-4 rounded-sm mr-2 ${
                                      selectedTables.includes(table.id) ? "bg-primary" : "border border-gray-300"
                                    }`}
                                  >
                                    {selectedTables.includes(table.id) && (
                                      <CheckCircle2 className="h-4 w-4 text-white" />
                                    )}
                                  </div>
                                  <span className="font-medium">{table.name}</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {table.count} records ({table.size})
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {isCreatingBackup && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Backup dalam proses...</span>
                          <span>{Math.round(backupProgress)}%</span>
                        </div>
                        <Progress value={backupProgress} className="h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={createBackup}
                    disabled={isCreatingBackup || selectedTables.length === 0 || !backupName.trim()}
                  >
                    {isCreatingBackup ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Membuat Backup...
                      </>
                    ) : (
                      <>
                        <Database className="mr-2 h-4 w-4" />
                        Buat Backup
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <BackupStats stats={stats} isLoading={isLoadingData} />
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <BackupHistoryTable
              backups={backups}
              onDownload={downloadBackup}
              onDelete={deleteBackup}
              isLoading={isLoadingData}
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="restore" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ArrowUpCircle className="mr-2 h-5 w-5 text-primary" />
                    Pulihkan dari Backup
                  </CardTitle>
                  <CardDescription>Pilih backup yang ingin dipulihkan ke database</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="restore-backup">Pilih Backup</Label>
                      <Select
                        value={selectedBackupForRestore || ""}
                        onValueChange={setSelectedBackupForRestore}
                        disabled={isRestoring}
                        >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih backup untuk dipulihkan" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black shadow-md">
                          {backups
                            .filter((backup) => backup.status === "COMPLETED")
                            .map((backup) => (
                              <SelectItem key={backup.id} value={backup.id}>
                                {backup.name} ({new Date(backup.date).toLocaleDateString()}) - {backup.size}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                    </div>

                    {selectedBackupForRestore && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-amber-800">Perhatian</h4>
                            <p className="text-sm text-amber-700">
                              Memulihkan database akan menimpa data yang ada saat ini. Pastikan Anda telah membuat
                              backup terbaru sebelum melanjutkan.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {isRestoring && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Pemulihan dalam proses...</span>
                          <span>Mohon tunggu</span>
                        </div>
                        <Progress value={undefined} className="h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={restoreBackup}
                    disabled={isRestoring || !selectedBackupForRestore}
                  >
                    {isRestoring ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Memulihkan Database...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Pulihkan Database
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileJson className="mr-2 h-5 w-5 text-primary" />
                    Unggah File Backup
                  </CardTitle>
                  <CardDescription>Unggah file backup JSON atau JSON.GZ untuk dipulihkan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileArchive className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Unggah File Backup</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Seret dan lepas file backup di sini, atau klik untuk memilih file
                      </p>
                      <Input
                        id="backup-file"
                        type="file"
                        accept=".json,.json.gz"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("backup-file")?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Mengunggah...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Pilih File
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-gray-500 mt-4">Format yang didukung: JSON, JSON.GZ (max 50MB)</p>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-blue-800">Informasi</h4>
                          <p className="text-sm text-blue-700">
                            File backup harus dalam format yang valid dan dihasilkan oleh sistem ini. File yang rusak
                            atau tidak kompatibel dapat menyebabkan kegagalan pemulihan.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <motion.div variants={itemVariants}>
            <ScheduleBackupForm />
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
