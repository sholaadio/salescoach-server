"use client"

import * as React from "react"
import { Mic, Upload, FileAudio } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function UploadCallPage() {
  const [isDragging, setIsDragging] = React.useState(false)

  return (
    <AppShell
      title="Upload a Call"
      description="Paste your transcript — Claude AI will coach you and recommend learning resources"
      icon={<Mic className="h-4 w-4" />}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-lg border border-[#26262a] bg-[#161618] p-6">
          {/* Form fields */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                Call Type
              </label>
              <Select defaultValue="phone">
                <SelectTrigger className="h-10 border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] focus:ring-[#5e6ad2]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[#26262a] bg-[#1a1a1c]">
                  <SelectItem value="phone" className="text-[#f5f5f5] focus:bg-[#26262a] focus:text-[#f5f5f5]">
                    Phone Call
                  </SelectItem>
                  <SelectItem value="whatsapp" className="text-[#f5f5f5] focus:bg-[#26262a] focus:text-[#f5f5f5]">
                    WhatsApp Call
                  </SelectItem>
                  <SelectItem value="video" className="text-[#f5f5f5] focus:bg-[#26262a] focus:text-[#f5f5f5]">
                    Video Call
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                Product Pitched
              </label>
              <Input
                placeholder="e.g. Weight Loss Bundle"
                className="h-10 border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] placeholder:text-[#5b5b5e] focus-visible:ring-[#5e6ad2]"
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
              Call Outcome
            </label>
            <Select defaultValue="unknown">
              <SelectTrigger className="h-10 border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] focus:ring-[#5e6ad2]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-[#26262a] bg-[#1a1a1c]">
                <SelectItem value="unknown" className="text-[#f5f5f5] focus:bg-[#26262a] focus:text-[#f5f5f5]">
                  Unknown
                </SelectItem>
                <SelectItem value="confirmed" className="text-[#f5f5f5] focus:bg-[#26262a] focus:text-[#f5f5f5]">
                  Confirmed
                </SelectItem>
                <SelectItem value="pending" className="text-[#f5f5f5] focus:bg-[#26262a] focus:text-[#f5f5f5]">
                  Pending
                </SelectItem>
                <SelectItem value="rejected" className="text-[#f5f5f5] focus:bg-[#26262a] focus:text-[#f5f5f5]">
                  Rejected
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upload area */}
          <div className="mt-6 space-y-2">
            <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
              Call Recording
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
              }}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors",
                isDragging
                  ? "border-[#5e6ad2] bg-[#5e6ad2]/5"
                  : "border-[#26262a] bg-[#1a1a1c] hover:border-[#5b5b5e]"
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#26262a]">
                <FileAudio className="h-6 w-6 text-[#8b8b8e]" />
              </div>
              <p className="mt-4 text-sm font-medium text-[#f5f5f5]">
                Tap to upload your call recording
              </p>
              <p className="mt-1 text-xs text-[#5b5b5e]">
                Supports MP3, M4A, WAV, AAC, OGG · Max 25MB
              </p>
              <p className="mt-1 text-xs text-[#5e6ad2]">
                Whisper AI will transcribe it automatically
              </p>
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-6">
            <Button className="w-full bg-gradient-to-r from-[#10b981] to-[#5e6ad2] text-white hover:opacity-90">
              <Upload className="mr-2 h-4 w-4" />
              Transcribe & Analyze Call
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
