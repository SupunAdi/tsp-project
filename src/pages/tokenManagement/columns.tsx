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
import { MoreHorizontal, ArrowUp, ArrowDown, Badge } from "lucide-react"


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

const maskPan = (pan?: string) =>
  !pan ? "" : pan.length <= 4 ? pan : `${"*".repeat(pan.length - 4)}${pan.slice(-4)}`

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

export function createColumns(): ColumnDef<TokenManagementRecord>[] {
  return [
    {
      accessorKey: "id", 
      header: ({ column }) => <SortHeader column={column} label="Id" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.id}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "instanceId", 
      header: ({ column }) => <SortHeader column={column} label="Instance Id" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.instanceId}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "cardNumber", 
      header: ({ column }) => <SortHeader column={column} label="Card Number" />,
      cell: ({ row }) => <div className="text-center font-medium">{maskPan(row.original.cardNumber)}</div>,
      enableSorting: true,
      enableHiding: true,
    },   
    {
      accessorKey: "nameOnCard", 
      header: ({ column }) => <SortHeader column={column} label="Name On Card" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.nameOnCard}</div>,
      enableSorting: true,
      enableHiding: true,
    },    
    {
      accessorKey: "expiry", 
      header: ({ column }) => <SortHeader column={column} label="Expiry" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.expiry}</div>,
      enableSorting: true,
      enableHiding: true,
    },   
    {
      accessorKey: "cvv", 
      header: ({ column }) => <SortHeader column={column} label="CVV" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.cvv}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "nic", 
      header: ({ column }) => <SortHeader column={column} label="NIC" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.nic}</div>,
      enableSorting: true,
      enableHiding: true,
    },    
    {
      accessorKey: "accountHolderName", 
      header: ({ column }) => <SortHeader column={column} label="accountHolderName" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.accountHolderName}</div>,
      enableSorting: true,
      enableHiding: true,
    },    
    {
      accessorKey: "accountNumber", 
      header: ({ column }) => <SortHeader column={column} label="accountNumber" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.accountNumber}</div>,
      enableSorting: true,
      enableHiding: true,
    },   
    {
      accessorKey: "tokenType", 
      header: ({ column }) => <SortHeader column={column} label="Token Type" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.tokenType}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "token", 
      header: ({ column }) => <SortHeader column={column} label="Token" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.token}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "tokenExpiry", 
      header: ({ column }) => <SortHeader column={column} label="Token Expiry" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.tokenExpiry}</div>,
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
                active ? "bg-black text-white hover:bg-black": "bg-white text-black border border-gray-300 hover:bg-white"}
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
      cell: ({ row }) => <div className="text-center font-medium">{row.original.createdTime}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "lastUpdatedTime", 
      header: ({ column }) => <SortHeader column={column} label="Last Updated Time" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.lastUpdatedTime}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "bankCode", 
      header: ({ column }) => <SortHeader column={column} label="bankCode" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.bankCode}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "cardAssociation", 
      header: ({ column }) => <SortHeader column={column} label="Card Association" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.cardAssociation}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "hashCardNumber", 
      header: ({ column }) => <SortHeader column={column} label="hashCardNumber" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.hashCardNumber}</div>,
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
                <DropdownMenuItem onClick={() => alert(`View ${rec.id}`)}>View</DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert(`Edit ${rec.id}`)}>Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert(`Delete ${rec.id}`)}>Delete</DropdownMenuItem>
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