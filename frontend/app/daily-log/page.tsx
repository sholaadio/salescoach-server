"use client"

import * as React from "react"
import { FileText, X } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const pastLogs = [
  {
    date: "2026-03-07",
    assigned: 20,
    delivered: 17,
    rate: 85,
    commission: "₦4,350",
    status: "rejected",
  },
  {
    date: "2026-03-07",
    assigned: 30,
    delivered: 15,
    rate: 50,
    commission: "₦3,300",
    status: "rejected",
  },
  {
    date: "2026-03-07",
    assigned: 20,
    delivered: 18,
    rate: 90,
    commission: "₦5,400",
    status: "rejected",
  },
  {
    date: "2026-03-07",
    assigned: 30,
    delivered: 25,
    rate: 83,
    commission: "₦6,150",
    status: "rejected",
  },
]

function getRateColor(rate: number) {
  if (rate >= 90) return "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20"
  if (rate >= 65) return "bg-[#f5a623]/10 text-[#f5a623] border-[#f5a623]/20"
  return "bg-[#e5484d]/10 text-[#e5484d] border-[#e5484d]/20"
}

export default function DailyLogPage() {
  return (
    <AppShell
      title="Daily Log"
      description="Submit your daily order statistics"
      icon={<FileText className="h-4 w-4" />}
    >
      <div className="space-y-6">
        {/* Form */}
        <div className="rounded-lg border border-[#26262a] bg-[#161618] p-6">
          <h3 className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#f5f5f5]">
            <FileText className="h-4 w-4 text-[#5e6ad2]" />
            Daily Order Log
          </h3>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                Orders Assigned
              </label>
              <Input
                type="number"
                placeholder="0"
                className="h-10 border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] placeholder:text-[#5b5b5e] focus-visible:ring-[#5e6ad2]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                Orders Confirmed
              </label>
              <Input
                type="number"
                placeholder="0"
                className="h-10 border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] placeholder:text-[#5b5b5e] focus-visible:ring-[#5e6ad2]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                Orders Delivered
              </label>
              <Input
                type="number"
                placeholder="0"
                className="h-10 border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] placeholder:text-[#5b5b5e] focus-visible:ring-[#5e6ad2]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                {"Upsells (₦600 if ≥50%)"}
              </label>
              <Input
                type="number"
                placeholder="0"
                className="h-10 border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] placeholder:text-[#5b5b5e] focus-visible:ring-[#5e6ad2]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                Repeat Customers (₦300)
              </label>
              <Input
                type="number"
                placeholder="0"
                className="h-10 border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] placeholder:text-[#5b5b5e] focus-visible:ring-[#5e6ad2]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                Referrals Converted (₦300)
              </label>
              <Input
                type="number"
                placeholder="0"
                className="h-10 border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] placeholder:text-[#5b5b5e] focus-visible:ring-[#5e6ad2]"
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
              Notes
            </label>
            <Textarea
              placeholder="Any notes..."
              className="min-h-[80px] border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] placeholder:text-[#5b5b5e] focus-visible:ring-[#5e6ad2]"
            />
          </div>

          <div className="mt-6">
            <Button className="bg-[#5e6ad2] text-white hover:bg-[#6b77db]">
              Submit Daily Log
            </Button>
          </div>
        </div>

        {/* Past Logs */}
        <div className="rounded-lg border border-[#26262a] bg-[#161618] p-6">
          <h3 className="mb-4 text-sm font-semibold text-[#f5f5f5]">Past Logs</h3>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#26262a] hover:bg-transparent">
                  <TableHead className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">Date</TableHead>
                  <TableHead className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">Assigned</TableHead>
                  <TableHead className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">Delivered</TableHead>
                  <TableHead className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">Rate</TableHead>
                  <TableHead className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">Commission</TableHead>
                  <TableHead className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastLogs.map((log, index) => (
                  <TableRow key={index} className="border-[#26262a] hover:bg-[#1a1a1c]">
                    <TableCell className="text-sm text-[#f5f5f5]">{log.date}</TableCell>
                    <TableCell className="text-sm text-[#8b8b8e]">{log.assigned}</TableCell>
                    <TableCell className="text-sm text-[#8b8b8e]">{log.delivered}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", getRateColor(log.rate))}>
                        {log.rate}%
                      </Badge>
                    </TableCell>
                    <TableCell className={cn(
                      "text-sm font-medium",
                      log.rate >= 90 ? "text-[#10b981]" : "text-[#f5f5f5]"
                    )}>
                      {log.commission}
                    </TableCell>
                    <TableCell>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e5484d]/10">
                        <X className="h-3.5 w-3.5 text-[#e5484d]" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
