import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowUp, ArrowDown, } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Row type must match API payload (TokenManagementResponse)
export type TokenManagementRecord = {
  id: string
  instanceId: string
  cardNumber: string
  nameOnCard: string
  expiry: string
  cvv: string
  nic: string
  accountHolderName: string
  accountNumber: string
  tokenType: string
  token: string
  tokenExpiry: string
  status: string
  createdTime: string
  lastUpdatedTime: string
  bankCode: string
  cardAssociation: string
  hashCardNumber: string
}

export type TokenRowActions = {
  onActivate: (row: TokenManagementRecord) => void
  onDeactivate: (row: TokenManagementRecord) => void
}

const maskPan = (pan?: string) =>
  !pan ? "" : pan.length <= 4 ? pan : `${"*".repeat(pan.length - 4)}${pan.slice(-4)}`

const displayValue = (val?: string | null) => {
  if (val === undefined || val === null || val === "" || val === " ") return "null"
  return val
}

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

const DateCell: React.FC<{ value?: string }> = ({ value }) => {
  if (!value) return <span>—</span>
  const d = new Date(value)
  return <span>{isNaN(d.getTime()) ? value : d.toLocaleString()}</span>
}

export function createColumns(actions: TokenRowActions): ColumnDef<TokenManagementRecord>[] {

  return [
    {
      accessorKey: "id", 
      header: ({ column }) => <SortHeader column={column} label="Id" />,
      cell: ({ row }) => <div className="text-center font-medium">{displayValue(row.original.id)}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "instanceId", 
      header: ({ column }) => <SortHeader column={column} label="Instance Id" />,
      cell: ({ row }) => <div className="text-center">{displayValue(row.original.instanceId)}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "cardNumber", 
      header: ({ column }) => <SortHeader column={column} label="Card Number" />,
      cell: ({ row }) => <div className="text-center">{maskPan(row.original.cardNumber) || "—"}</div>,
      enableSorting: true,
      enableHiding: true,
    },   
    {
      accessorKey: "nameOnCard", 
      header: ({ column }) => <SortHeader column={column} label="Name On Card" />,
      cell: ({ row }) => <div className="text-center">{row.original.nameOnCard || "—"}</div>,
      enableSorting: true,
      enableHiding: true,
    },    
    {
      accessorKey: "expiry", 
      header: ({ column }) => <SortHeader column={column} label="Expiry" />,
      cell: ({ row }) => <div className="text-center">{row.original.expiry || "—"}</div>,
      enableSorting: true,
      enableHiding: true,
    },   
    {
      accessorKey: "cvv", 
      header: ({ column }) => <SortHeader column={column} label="CVV" />,
      cell: ({ row }) => <div className="text-center">{row.original.cvv || "—"}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "nic", 
      header: ({ column }) => <SortHeader column={column} label="NIC" />,
      cell: ({ row }) => <div className="text-center">{displayValue(row.original.nic)}</div>,
      enableSorting: true,
      enableHiding: true,
    },    
    {
      accessorKey: "accountHolderName", 
      header: ({ column }) => <SortHeader column={column} label="Account Holder Name" />,
      cell: ({ row }) => <div className="text-center">{row.original.accountHolderName || "—"}</div>,
      enableSorting: true,
      enableHiding: true,
    },    
    {
      accessorKey: "accountNumber", 
      header: ({ column }) => <SortHeader column={column} label="Account Number" />,
      cell: ({ row }) => <div className="text-center">{row.original.accountNumber || "—"}</div>,
      enableSorting: true,
      enableHiding: true,
    },   
    {
      accessorKey: "tokenType", 
      header: ({ column }) => <SortHeader column={column} label="Token Type" />,
      cell: ({ row }) => <div className="text-center">{displayValue(row.original.tokenType)}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "token", 
      header: ({ column }) => <SortHeader column={column} label="Token" />,
      cell: ({ row }) => <div className="text-center">{displayValue(row.original.token)}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "tokenExpiry", 
      header: ({ column }) => <SortHeader column={column} label="Token Expiry" />,
       cell: ({row})=>(
        <div className="text-center">
          <DateCell value={row.original.tokenExpiry}/>
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },  
    {
      accessorKey: "status",
      header: ({ column }) => <SortHeader column={column} label="Status" />,
      cell: ({ row }) => {
        const s = row.original.status?.toUpperCase()
        const active = s === "ACT" || s === "ACTIVE"
        return (
          <div className="text-center">
            <Badge
              className={
                active ? "bg-black text-white hover:bg-black": "bg-white text-black border hover:bg-white"}
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
      accessorKey: "createdTime", 
      header: ({ column }) => <SortHeader column={column} label="Created Time" />,
      cell: ({row})=>(
        <div className="text-center">
          <DateCell value={row.original.createdTime}/>
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
    accessorKey: "lastUpdatedTime", // "lastUpdateTime" -> "lastUpdatedTime"
    header: ({ column }) => <SortHeader column={column} label="Last Update Time" />,
    cell: ({ row }) => (
      <div className="text-center">
        <DateCell value={row.original.lastUpdatedTime} />
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
    },
    {
      accessorKey: "bankCode", 
      header: ({ column }) => <SortHeader column={column} label="bankCode" />,
      cell: ({ row }) => <div className="text-center">{displayValue(row.original.bankCode)}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "cardAssociation", 
      header: ({ column }) => <SortHeader column={column} label="Card Association" />,
      cell: ({ row }) => <div className="text-center">{row.original.cardAssociation || "—"}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "hashCardNumber", 
      header: ({ column }) => <SortHeader column={column} label="Hash Card Number" />,
      cell: ({ row }) => <div className="text-center">{row.original.hashCardNumber || "—"}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      header: () => <div className="text-center">Action</div>,
      cell: ({ row }) => {
        const rec = row.original

        const isActive = rec.status?.toUpperCase() === "ACT" || rec.status?.toUpperCase() === "ACTIVE"
        
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