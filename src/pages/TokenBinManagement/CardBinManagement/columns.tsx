import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowUp, ArrowDown, MoreHorizontal } from "lucide-react"

export type TokenBinRecord = {
  id: string
  tokenBin: string
  cardAssociation: string
  bankCode: string
  binSize: string
  status: "active" | "deactive"
  createTime: string
  updateTime: string
  lastUpdatedUser: string
}

export type TokenBinRowActions = {
  onEdit: (row: TokenBinRecord) => void
  onActivate: (row: TokenBinRecord) => void
  onDeactivate: (row: TokenBinRecord) => void
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

export function createColumns(actions: TokenBinRowActions): ColumnDef<TokenBinRecord>[] {
  return [
    {
      accessorKey: "tokenBin",
      header: ({ column }) => <SortHeader column={column} label="Token BIN" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.tokenBin}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "cardAssociation",
      header: ({ column }) => <SortHeader column={column} label="Card Association" />,
      cell: ({ row }) => <div className="text-center">{row.original.cardAssociation}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "bankCode",
      header: ({ column }) => <SortHeader column={column} label="Bank Code" />,
      cell: ({ row }) => <div className="text-center tabular-nums">{row.original.bankCode}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "binSize",
      header: ({ column }) => <SortHeader column={column} label="BIN Size" />,
      cell: ({ row }) => <div className="text-center tabular-nums">{row.original.binSize}</div>,
      enableSorting: true,
      enableHiding: true,
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
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "createTime",
      header: ({ column }) => <SortHeader column={column} label="Create Time" />,
      cell: ({ row }) => <div className="text-center tabular-nums"><DateCell value={row.original.createTime} /></div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "updateTime",
      header: ({ column }) => <SortHeader column={column} label="Update Time" />,
      cell: ({ row }) => <div className="text-center tabular-nums"><DateCell value={row.original.updateTime} /></div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "lastUpdatedUser",
      header: ({ column }) => <SortHeader column={column} label="Last Update User" />,
      cell: ({ row }) => <div className="text-center">{row.original.lastUpdatedUser || "—"}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      header: () => <div className="text-center">Action</div>,
      cell: ({ row }) => {
        const rec = row.original
        const isActive = rec.status === "active"
        
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
                
                <DropdownMenuItem onClick={() => actions.onEdit(rec)}>
                  Edit
                </DropdownMenuItem>
                
                {!isActive ? (
                  <DropdownMenuItem onClick={() => actions.onActivate(rec)}>
                    Activate
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => actions.onDeactivate(rec)}>
                    Deactivate
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: true,
    },
  ]
}