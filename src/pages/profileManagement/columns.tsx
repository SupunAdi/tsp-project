import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Row type
export type PofileRecord = {
  code: string
  dek: string
  cardExpiryCode: string
  accountExpiryCode: string
  tokenLength: string
  profileStatus: string
}

export type ProfileRowActions = {
  onView: (row: PofileRecord) => void
  onEdit: (row: PofileRecord) => void
  onDelete: (row: PofileRecord) => void
}

const short = (s: string, head = 8, tail = 6) =>
  !s ? "" : s.length <= head + tail ? s : `${s.slice(0, head)}…${s.slice(-tail)}`

// Reusable sort header 
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

export function createColumns(actions: ProfileRowActions): ColumnDef<PofileRecord>[] {
return [
    {
      accessorKey: "code", 
      header: ({ column }) => <SortHeader column={column} label="Code" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.code}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "dek", 
      header: () => (
        <div className="text-center">
          <Button variant="ghost" >Dek</Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center tabular-nums">{short(row.original.dek)}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "cardExpiryCode", 
      header: ({ column }) => <SortHeader column={column} label="Card Expire Code" />,
      cell: ({ row }) => <div className="text-center">{row.original.cardExpiryCode}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "accountExpiryCode", 
      header: ({ column }) => <SortHeader column={column} label="Account Expire Code" />,
      cell: ({ row }) => <div className="text-center">{row.original.accountExpiryCode}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "profileStatus", 
      header: ({ column }) => <SortHeader column={column} label="Status" />,
      cell: ({ row }) => {
           const s = row.original.profileStatus?.toUpperCase()
        const active = s === "ACT" || s === "ACTIVE"
        return (
          <div className="text-center">
            <Badge className={active ? "bg-black text-white hover:bg-black" : "bg-white text-black border hover:bg-white"}>
              {active ? "Active" : "Deactive"}
            </Badge>
          </div>
        )
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "tokenLength", 
      // header: ({ column }) => <SortHeader column={column} label="Token Length" />,
          header: () => (
        <div className="text-center">
          <Button variant="ghost" >Token Length</Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center tabular-nums">{row.original.tokenLength}</div>
      ),
      enableSorting: false,
      enableHiding: true,
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
                <DropdownMenuItem onClick={() => actions.onView(rec)}>
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => actions.onEdit(rec)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => actions.onDelete(rec)}>
                  Delete
                </DropdownMenuItem>
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
