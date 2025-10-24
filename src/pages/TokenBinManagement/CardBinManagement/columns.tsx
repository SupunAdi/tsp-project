import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUp, ArrowDown, MoreHorizontal } from "lucide-react"

export type TokenBinRecord = {
  id: string
  tokenBin: string
  cardAssociation: string
  bankCode: string
  status: "active" | "deactive"
  createdAt: string
  updatedAt: string
  updatedBy: string
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

export function createColumns(): ColumnDef<TokenBinRecord>[] {
  return [
    {
      accessorKey: "tokenBin",
      header: ({ column }) => <SortHeader column={column} label="Token BIN" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.tokenBin}</div>,
    },
    {
      accessorKey: "cardAssociation",
      header: ({ column }) => <SortHeader column={column} label="Card Association" />,
      cell: ({ row }) => <div className="text-center">{row.original.cardAssociation}</div>,
    },
    {
      accessorKey: "bankCode",
      header: ({ column }) => <SortHeader column={column} label="Bank Code" />,
      cell: ({ row }) => <div className="text-center tabular-nums">{row.original.bankCode}</div>,
    },
    {
      id: "binSize",
      header: () => <div className="text-center">BIN Size</div>,
      cell: ({ row }) => {
        const t = row.original.tokenBin || ""
        return <div className="text-center">{t.replace(/\D/g, "").length}</div>
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => <SortHeader column={column} label="Status" />,
      cell: ({ row }) => {
        const active = row.original.status === "active"
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
    {
      accessorKey: "createdAt",
      header: ({ column }) => <SortHeader column={column} label="Create Time" />,
      cell: ({ row }) => <div className="text-center tabular-nums"><DateCell value={row.original.createdAt} /></div>,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => <SortHeader column={column} label="Update Time" />,
      cell: ({ row }) => <div className="text-center tabular-nums"><DateCell value={row.original.updatedAt} /></div>,
    },
    {
      accessorKey: "updatedBy",
      header: ({ column }) => <SortHeader column={column} label="Last Update User" />,
      cell: ({ row }) => <div className="text-center">{row.original.updatedBy || "—"}</div>,
    },
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

                <DropdownMenuItem onClick={() => alert(`Toggling ${rec.tokenBin}`)}>
                  {rec.status === "active" ? "Deactivate" : "Activate"}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert(`Editing BIN ${rec.tokenBin}`)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert(`Deleting BIN ${rec.tokenBin}`)}>Delete</DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert(`Viewing BIN ${rec.tokenBin}`)}>View</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
