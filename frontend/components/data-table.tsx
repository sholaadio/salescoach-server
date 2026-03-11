import { cn } from "@/lib/utils"

interface Column<T> {
  header: string
  accessorKey?: keyof T
  cell?: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  className?: string
  emptyMessage?: string
}

export function DataTable<T extends Record<string, unknown>>({ 
  columns, 
  data, 
  className,
  emptyMessage = "No data available"
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-[#26262a] bg-[#161618]", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#26262a]">
            {columns.map((column, i) => (
              <th
                key={i}
                className={cn(
                  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5b5b5e]",
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className="px-4 py-8 text-center text-sm text-[#5b5b5e]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className="border-b border-[#1f1f22] last:border-0 hover:bg-[#1a1a1c]"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn(
                      "px-4 py-3 text-sm text-[#c8c8c8]",
                      column.className
                    )}
                  >
                    {column.cell 
                      ? column.cell(row)
                      : column.accessorKey 
                        ? String(row[column.accessorKey] ?? "")
                        : null
                    }
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
