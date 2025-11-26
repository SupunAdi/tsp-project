import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUp, ArrowDown, MoreHorizontal } from "lucide-react"

// Row type must match API payload (InstanceResponse)
export type InstanceRecord = {
  instanceId: string
  instanceName: string
  instanceStatus: string          
  profileCode: string
  createTime: string
  lastUpdateTime: string
}

const DateCell: React.FC<{ value?: string }> = ({ value }) => {
  if (!value) return <span>—</span>
  const d = new Date(value)
  return <span>{isNaN(d.getTime()) ? value : d.toLocaleString()}</span>
}

export type InstanceRowActions = {
  onView?: (row: InstanceRecord) => void
  onEdit: (row: InstanceRecord) => void
  onDelete?: (row: InstanceRecord) => void
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

export function createColumns(actions: InstanceRowActions): ColumnDef<InstanceRecord>[] {
return [
    {
      accessorKey: "instanceId", // maps to backend sort "instanceId" -> "code"
      header: ({ column }) => <SortHeader column={column} label="Instance Code" />,
      cell: ({ row }) => <div className="text-center font-medium">{row.original.instanceId}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "instanceName", // "instanceName" -> "name"
      header: ({ column }) => <SortHeader column={column} label="Instance Name" />,
      cell: ({ row }) => <div className="text-center">{row.original.instanceName}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "instanceStatus", // "instanceStatus" -> "status.code"
      header: ({ column }) => <SortHeader column={column} label="Status" />,
      cell: ({ row }) => {
        const s = row.original.instanceStatus?.toUpperCase()
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
      accessorKey: "profileCode", // "profileCode" -> "profile.code"
      header: ({ column }) => <SortHeader column={column} label="Profile Code" />,
      cell: ({ row }) => <div className="text-center">{row.original.profileCode}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "createTime", // "createTime" -> "createdTime"
      header: ({ column }) => <SortHeader column={column} label="Created Time" />,
      cell: ({ row }) => (
        <div className="text-center tabular-nums">
          <DateCell value={row.original.createTime} />
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "lastUpdateTime", // "lastUpdateTime" -> "lastUpdatedTime"
      header: ({ column }) => <SortHeader column={column} label="Last Update Time" />,
      cell: ({ row }) => (
        <div className="text-center tabular-nums">
          <DateCell value={row.original.lastUpdateTime} />
        </div>
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
                {/* <DropdownMenuItem onClick={() => actions.onView(rec)}>
                  View
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => actions.onEdit(rec)}>
                  Edit
                </DropdownMenuItem>
                {/* <DropdownMenuSeparator /> */}
                {/* <DropdownMenuItem onClick={() => actions.onDelete(rec)}>
                  Delete
                </DropdownMenuItem> */}

                <DropdownMenuItem onClick={() => alert(`Toggling ${rec.instanceId}`)}>
                  {rec.instanceStatus === "active" ? "Deactivate" : "Activate"}
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
