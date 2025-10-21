import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUp, ArrowDown, MoreHorizontal } from "lucide-react"

export type InstanceRecord = {
  code: string
  name: string
  status: string          // ACT / DEACT
  profileCode: string
  createdTime: string
  lastUpdateTime: string
}

const DateCell: React.FC<{ value?: string }> = ({ value }) => {
  if (!value) return <span>—</span>
  const d = new Date(value)
  return <span>{isNaN(d.getTime()) ? value : d.toLocaleString()}</span>
}

const SortHeader: React.FC<{ column: any; label: string }> = ({ column, label }) => (
  <div className="text-center">
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      {label}
      {column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : null}
    </Button>
  </div>
)

export function createColumns(): ColumnDef<InstanceRecord>[] {
  return [
    { accessorKey: "code",
      header: ({ column }) => <SortHeader column={column} label="Code" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.code}</div> },
    { accessorKey: "name",
      header: ({ column }) => <SortHeader column={column} label="Name" />,
      cell: ({ row }) => <div className="text-center">{row.original.name}</div> },
    {
      accessorKey: "status",
      header: ({ column }) => <SortHeader column={column} label="Status" />,
      // ✅ black badge for Active; white badge for Deactive
      cell: ({ row }) => {
        const s = row.original.status?.toUpperCase()
        const active = s === "ACT" || s === "ACTIVE"
        return (
          <div className="text-center">
            <Badge
              className={
                active
                  ? "bg-black text-white hover:bg-black"
                  : "bg-white text-black border border-gray-300 hover:bg-white"
              }
            >
              {active ? "Active" : "Deactive"}
            </Badge>
          </div>
        )
      },
    },
    { accessorKey: "profileCode",
      header: ({ column }) => <SortHeader column={column} label="Profile" />,
      cell: ({ row }) => <div className="text-center">{row.original.profileCode}</div> },
    { accessorKey: "createdTime",
      header: ({ column }) => <SortHeader column={column} label="Create Time" />,
      cell: ({ row }) => <div className="text-center tabular-nums"><DateCell value={row.original.createdTime} /></div> },
    { accessorKey: "lastUpdateTime",
      header: ({ column }) => <SortHeader column={column} label="Last Update Time" />,
      cell: ({ row }) => <div className="text-center tabular-nums"><DateCell value={row.original.lastUpdateTime} /></div> },

    // ✅ Action column stays last
    {
      id: "actions",
      header: () => <div className="text-center">Action</div>,
      cell: ({ row }) => {
        const rec = row.original
        return (
          <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => alert(`Editing ${rec.code}`)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert(`Deleting ${rec.code}`)}>Delete</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert(`Viewing ${rec.code}`)}>View</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
