import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
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

/** ---------------- Types ---------------- */
export type AccountBinRecord = {
  id: string
  accountBin: string
  association: "Visa" | "Mastercard" | "Amex" | "Discover" | "JCB" | "UnionPay"
  bankCode: string
  status: "active" | "deactive"
  createdAt: string
  updatedAt: string
  updatedBy: string
}

/** --------------- Sample Data + Options --------------- */
const NOW = new Date().toISOString()

export const INITIAL_ROWS: AccountBinRecord[] = [
  { id: "a1", accountBin: "ACC-1001", association: "Visa",       bankCode: "BNK00123", status: "active",   createdAt: NOW, updatedAt: NOW, updatedBy: "Alice" },
  { id: "a2", accountBin: "ACC-1002", association: "Mastercard", bankCode: "CBA45",    status: "deactive", createdAt: NOW, updatedAt: NOW, updatedBy: "Bob" },
  { id: "a3", accountBin: "ACC-1003", association: "UnionPay",   bankCode: "UP9988",   status: "active",   createdAt: NOW, updatedAt: NOW, updatedBy: "Cara" },
]

export const ASSOCIATIONS: AccountBinRecord["association"][] = [
  "Visa", "Mastercard", "Amex", "Discover", "JCB", "UnionPay",
]

export const BANK_CODES = [
  "BNK00123", "CBA45", "UP9988", "AMX77", "DISC001", "JCB12",
  "V45", "MC0099", "AM3X", "D1", "JCB0007", "BANKX",
]

/** ---------------- Columns (optional TanStack variant) ---------------- */
export function createColumns(opts: { onToggleStatus: (id: string) => void }): ColumnDef<AccountBinRecord>[] {
  const { onToggleStatus } = opts

  const sortIcon = (column: any) =>
    column.getIsSorted() === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : column.getIsSorted() === "desc" ? (
      <ArrowDown className="ml-2 h-4 w-4" />
    ) : null

  return [
    {
      accessorKey: "accountBin",
      header: ({ column }) => (
        <div className="text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Account BIN {sortIcon(column)}
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("accountBin")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "association",
      header: ({ column }) => (
        <div className="text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Association {sortIcon(column)}
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("association")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "bankCode",
      header: ({ column }) => (
        <div className="text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Bank Code {sortIcon(column)}
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="text-center tabular-nums">{row.getValue("bankCode")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "accountBinSize",
      header: () => <div className="text-center">Account BIN Size</div>,
      // based on digits inside accountBin (e.g. "ACC-1001" -> 4)
      cell: ({ row }) => {
        const t: string = row.original.accountBin || ""
        return <div className="text-center">{t.replace(/\D/g, "").length}</div>
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <div className="text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Status {sortIcon(column)}
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <div className="text-center">
            <Badge variant={status === "active" ? "default" : "secondary"}>
              {status === "active" ? "Active" : "Deactive"}
            </Badge>
          </div>
        )
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <div className="text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Create time {sortIcon(column)}
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{new Date(row.original.createdAt).toLocaleString()}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <div className="text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Update time {sortIcon(column)}
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{new Date(row.original.updatedAt).toLocaleString()}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "updatedBy",
      header: ({ column }) => (
        <div className="text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Last update user {sortIcon(column)}
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("updatedBy")}</div>,
      enableSorting: true,
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

                <DropdownMenuItem onClick={() => onToggleStatus(rec.id)}>
                  {rec.status === "active" ? "Deactivate" : "Activate"}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => alert(`Editing ${rec.accountBin}`)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert(`Deleting ${rec.accountBin}`)}>
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert(`Viewing ${rec.accountBin}`)}>
                  View
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
