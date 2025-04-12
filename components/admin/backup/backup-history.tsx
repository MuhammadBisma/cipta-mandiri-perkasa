"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Search, CheckCircle, AlertCircle, Clock, FileJson, ChevronDown, ChevronUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import DeleteBackupDialog from "@/components/admin/backup/delete-backup-dialog"

interface Backup {
  id: string
  name: string
  description?: string
  date: string
  size: string
  type: string
  status: string
  tables: string[]
  createdBy?: string
}

interface BackupHistoryTableProps {
  backups: Backup[]
  onDownload: (id: string) => void
  onDelete: (id: string) => void
  isLoading: boolean
}

export default function BackupHistoryTable({ backups, onDownload, onDelete, isLoading }: BackupHistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Backup>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (field: keyof Backup) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const filteredBackups = backups.filter(
    (backup) =>
      backup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (backup.description && backup.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      backup.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      backup.tables.some((table) => table.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const sortedBackups = [...filteredBackups].sort((a, b) => {
    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    }

    if (sortField === "size") {
      const sizeA = Number.parseFloat(a.size.replace(/[^0-9.]/g, ""))
      const sizeB = Number.parseFloat(b.size.replace(/[^0-9.]/g, ""))
      return sortDirection === "asc" ? sizeA - sizeB : sizeB - sizeA
    }

    const valueA = String(a[sortField]).toLowerCase()
    const valueB = String(b[sortField]).toLowerCase()

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center">
              <FileJson className="mr-2 h-5 w-5 text-primary" />
              Riwayat Backup
            </CardTitle>
            <CardDescription>Daftar backup yang telah dibuat</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari backup..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <button className="flex items-center space-x-1 hover:text-primary" onClick={() => handleSort("name")}>
                    <span>Nama</span>
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </button>
                </TableHead>
                <TableHead>
                  <button className="flex items-center space-x-1 hover:text-primary" onClick={() => handleSort("date")}>
                    <span>Tanggal</span>
                    {sortField === "date" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </button>
                </TableHead>
                <TableHead>
                  <button className="flex items-center space-x-1 hover:text-primary" onClick={() => handleSort("size")}>
                    <span>Ukuran</span>
                    {sortField === "size" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </button>
                </TableHead>
                <TableHead>
                  <button className="flex items-center space-x-1 hover:text-primary" onClick={() => handleSort("type")}>
                    <span>Tipe</span>
                    {sortField === "type" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center space-x-1 hover:text-primary"
                    onClick={() => handleSort("status")}
                  >
                    <span>Status</span>
                    {sortField === "status" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </button>
                </TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : sortedBackups.length > 0 ? (
                sortedBackups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{backup.name}</span>
                        {backup.description && <span className="text-xs text-gray-500">{backup.description}</span>}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {backup.tables.map((table) => (
                            <Badge key={table} variant="outline" className="text-xs">
                              {table}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(backup.date).toLocaleDateString()} {new Date(backup.date).toLocaleTimeString()}
                      {backup.createdBy && <div className="text-xs text-gray-500">oleh {backup.createdBy}</div>}
                    </TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          backup.type === "FULL" || backup.type === "SCHEDULED"
                            ? "default"
                            : backup.type === "MANUAL"
                              ? "secondary"
                              : "outline"
                        }
                        className={
                          backup.type === "FULL" ? "bg-blue-500" : backup.type === "SCHEDULED" ? "bg-purple-500" : ""
                        }
                      >
                        {backup.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {backup.status === "COMPLETED" ? (
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-600">Selesai</span>
                        </div>
                      ) : backup.status === "IN_PROGRESS" ? (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-amber-500 mr-1 animate-pulse" />
                          <span className="text-amber-600">Sedang Berjalan</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-red-600">Gagal</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onDownload(backup.id)}
                                disabled={backup.status !== "COMPLETED"}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Unduh Backup</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <DeleteBackupDialog
                          backupName={backup.name}
                          backupSize={backup.size}
                          backupDate={new Date(backup.date).toLocaleString()}
                          onConfirm={() => onDelete(backup.id)}
                          onCancel={() => {}}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    {searchTerm ? "Tidak ada backup yang sesuai dengan pencarian" : "Belum ada backup yang dibuat"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
