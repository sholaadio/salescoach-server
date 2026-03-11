import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  subtext?: string
  accentColor?: string
  className?: string
}

export function StatCard({ 
  label, 
  value, 
  subtext, 
  accentColor = "#5e6ad2",
  className 
}: StatCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg border border-[#26262a] bg-[#161618] p-4",
      className
    )}>
      <div 
        className="absolute left-0 right-0 top-0 h-0.5" 
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
      />
      <p className="text-[11px] font-medium uppercase tracking-wider text-[#5b5b5e]">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-[#f5f5f5]" style={{ color: accentColor === "#5e6ad2" ? "#f5f5f5" : accentColor }}>
        {value}
      </p>
      {subtext && (
        <p className="mt-0.5 text-[11px] text-[#5b5b5e]">{subtext}</p>
      )}
    </div>
  )
}
