"use client"

import * as React from "react"
import { PhoneMissed } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function NoAnswerPage() {
  return (
    <AppShell
      title="Log No-Answer"
      description="Record calls that weren't answered"
      icon={<PhoneMissed className="h-4 w-4" />}
    >
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg border border-[#26262a] bg-[#161618] p-6">
          <h3 className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#f5f5f5]">
            <PhoneMissed className="h-4 w-4 text-[#e5484d]" />
            Log No-Answer Call
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                Order ID
              </label>
              <Input
                placeholder="e.g. ORD-4821"
                className="h-10 border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] placeholder:text-[#5b5b5e] focus-visible:ring-[#5e6ad2]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                Customer Name
              </label>
              <Input
                placeholder="Customer name"
                className="h-10 border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] placeholder:text-[#5b5b5e] focus-visible:ring-[#5e6ad2]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                Reason
              </label>
              <Select defaultValue="switched-off">
                <SelectTrigger className="h-10 border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] focus:ring-[#5e6ad2]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[#26262a] bg-[#1a1a1c]">
                  <SelectItem value="switched-off" className="text-[#f5f5f5] focus:bg-[#26262a] focus:text-[#f5f5f5]">
                    Switched Off
                  </SelectItem>
                  <SelectItem value="no-answer" className="text-[#f5f5f5] focus:bg-[#26262a] focus:text-[#f5f5f5]">
                    No Answer
                  </SelectItem>
                  <SelectItem value="busy" className="text-[#f5f5f5] focus:bg-[#26262a] focus:text-[#f5f5f5]">
                    Line Busy
                  </SelectItem>
                  <SelectItem value="wrong-number" className="text-[#f5f5f5] focus:bg-[#26262a] focus:text-[#f5f5f5]">
                    Wrong Number
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                Attempts
              </label>
              <Select defaultValue="1">
                <SelectTrigger className="h-10 border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] focus:ring-[#5e6ad2]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[#26262a] bg-[#1a1a1c]">
                  <SelectItem value="1" className="text-[#f5f5f5] focus:bg-[#26262a] focus:text-[#f5f5f5]">
                    1 attempt
                  </SelectItem>
                  <SelectItem value="2" className="text-[#f5f5f5] focus:bg-[#26262a] focus:text-[#f5f5f5]">
                    2 attempts
                  </SelectItem>
                  <SelectItem value="3" className="text-[#f5f5f5] focus:bg-[#26262a] focus:text-[#f5f5f5]">
                    3 attempts
                  </SelectItem>
                  <SelectItem value="4" className="text-[#f5f5f5] focus:bg-[#26262a] focus:text-[#f5f5f5]">
                    4+ attempts
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                Schedule Callback (Optional)
              </label>
              <Input
                type="datetime-local"
                className="h-10 border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] placeholder:text-[#5b5b5e] focus-visible:ring-[#5e6ad2]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                Notes
              </label>
              <Textarea
                placeholder="Additional notes..."
                className="min-h-[40px] resize-none border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] placeholder:text-[#5b5b5e] focus-visible:ring-[#5e6ad2]"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button className="bg-[#5e6ad2] text-white hover:bg-[#6b77db]">
              Log No-Answer
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
