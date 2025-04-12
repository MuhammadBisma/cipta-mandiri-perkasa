"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { Download, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExportAnalyticsButtonProps {
  startDate: Date
  endDate: Date
}

export default function ExportAnalyticsButton({ startDate, endDate }: ExportAnalyticsButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportType, setExportType] = useState("visitors")
  const [exportStartDate, setExportStartDate] = useState<Date>(startDate)
  const [exportEndDate, setExportEndDate] = useState<Date>(endDate)
  const [isOpen, setIsOpen] = useState(false)

  const handleExport = async () => {
    try {
      setIsExporting(true)

      const exportUrl = `/api/analytics/export?type=${exportType}&startDate=${exportStartDate.toISOString()}&endDate=${exportEndDate.toISOString()}`

      const link = document.createElement("a")
      link.href = exportUrl
      link.download = `analytics-${exportType}-${format(exportStartDate, "yyyy-MM-dd")}-to-${format(exportEndDate, "yyyy-MM-dd")}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsOpen(false)
    } catch (error) {
      console.error("Error exporting analytics:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
        variant="outline"
        className="rounded-xl">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white shadow-lg rounded-md border">
        <div className="space-y-4">
          <h4 className="font-medium">Export Analytics Data</h4>

          <div className="space-y-2">
            <label className="text-sm font-medium">Export Type</label>
            <Select value={exportType} onValueChange={setExportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select export type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="visitors">Visitors</SelectItem>
                <SelectItem value="pageviews">Page Views</SelectItem>
                <SelectItem value="daily">Daily Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !exportStartDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {exportStartDate ? format(exportStartDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border rounded-md shadow-lg" align="start">
                <Calendar
                  mode="single"
                  selected={exportStartDate}
                  onSelect={(date) => date && setExportStartDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !exportEndDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {exportEndDate ? format(exportEndDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border rounded-md shadow-lg" align="start">
                <Calendar
                  mode="single"
                  selected={exportEndDate}
                  onSelect={(date) => date && setExportEndDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            className="w-full"
            onClick={handleExport}
            disabled={isExporting || !exportStartDate || !exportEndDate}
          >
            {isExporting ? "Exporting..." : "Export Data"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
