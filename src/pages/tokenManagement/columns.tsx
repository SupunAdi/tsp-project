import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react"

export type TokenBinRecord = {
  id: string
  tokenBin: string
  cardAssociation: "Visa" | "Mastercard" | "Amex" | "Discover" | "JCB" | "UnionPay"
  bankCode: string
  status: "active" | "deactive"
  createdAt: string
  updatedAt: string
  updatedBy: string
}

const NOW = new Date()
const fmt = (d: Date) => new Date(d).toISOString()

export const INITIAL_ROWS: TokenBinRecord[] = [
  { id: "1",  tokenBin: "412345", cardAssociation: "Visa",       bankCode: "BNK00123", status: "active",  createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "kevin" },
  { id: "2",  tokenBin: "512345", cardAssociation: "Mastercard", bankCode: "CBA45",   status: "deactive",createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "devin"   },
  { id: "3",  tokenBin: "622222", cardAssociation: "UnionPay",   bankCode: "UP9988",  status: "active",  createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "shaleen"  },
  { id: "4",  tokenBin: "371111", cardAssociation: "Amex",       bankCode: "AMX77",   status: "active",  createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "wije"  },
  { id: "5",  tokenBin: "601155", cardAssociation: "Discover",   bankCode: "DISC001", status: "deactive",createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "milta"  },
  { id: "6",  tokenBin: "352800", cardAssociation: "JCB",        bankCode: "JCB12",   status: "active",  createdAt: fmt(new Date(+NOW-9e7)), updatedAt: fmt(new Date(+NOW-5e7)), updatedBy: "kanchuka"  },
  { id: "7",  tokenBin: "455667", cardAssociation: "Visa",       bankCode: "V45",     status: "active",  createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "gayesh"   },
  { id: "8",  tokenBin: "545454", cardAssociation: "Mastercard", bankCode: "MC0099",  status: "deactive",createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "Noah"  },
  { id: "9",  tokenBin: "378282", cardAssociation: "Amex",       bankCode: "AM3X",    status: "active",  createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "Ivy"   },
  { id: "10", tokenBin: "601100", cardAssociation: "Discover",   bankCode: "D1",      status: "active",  createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "Omar"  },
  { id: "11", tokenBin: "353011", cardAssociation: "JCB",        bankCode: "JCB0007", status: "deactive",createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "Rae"   },
  { id: "12", tokenBin: "400000", cardAssociation: "Visa",       bankCode: "BANKX",   status: "active",  createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "Leo"   },
]

// dropdown/select options
export const CARD_ASSOCIATIONS: TokenBinRecord["cardAssociation"][] = [
  "Visa", "Mastercard", "Amex", "Discover", "JCB", "UnionPay",
]
export const BANK_CODES = [
  "BNK00123", "CBA45", "UP9988", "AMX77", "DISC001", "JCB12",
  "V45", "MC0099", "AM3X", "D1", "JCB0007", "BANKX",
]

export function createColumns(opts: { onToggleStatus: (id: string) => void }): ColumnDef<TokenBinRecord>[] {
  const { onToggleStatus } = opts

  return [
    {
      accessorKey: "tokenBin",
      header: ({ column }) => (
        <div className="text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Token BIN
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("tokenBin")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "cardAssociation",
      header: ({ column }) => (
        <div className="text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Card Association
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("cardAssociation")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "bankCode",
      header: ({ column }) => (
        <div className="text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Bank Code
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="text-center tabular-nums">{row.getValue("bankCode")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "binSize",
      header: () => <div className="text-center">BIN Size</div>,
      // compute from tokenBin (digits length), matching your modal logic
      cell: ({ row }) => {
        const t: string = row.original.tokenBin || ""
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
        Status
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : null}
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
            Create time
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : null}
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
            Update time
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : null}
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
        Last update user
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : null}
      </Button>
    </div>
  ),
  cell: ({ row }) => (
    <div className="text-center">{row.getValue("updatedBy")}</div>
  ),
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

                <DropdownMenuItem onClick={() => alert(`Editing BIN ${rec.tokenBin}`)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert(`Deleting BIN ${rec.tokenBin}`)}>
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert(`Viewing BIN ${rec.tokenBin}`)}>
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
