import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowUp, ArrowDown, Eye } from "lucide-react"

export type AuditLogRecord = {
  id: string
  userRole: "ADMIN" | "OPERATOR" | "AUDITOR" | "MERCHANT"
  description: string
  page: string
  task: "Login" | "Access and load page" | "Create" | "Update" | "Delete"
  userName: string
  createdAt: string 
  remarks?: string
  status?: "Success" | "Failed"
}

export const USER_ROLES: AuditLogRecord["userRole"][] = [
  "ADMIN", "OPERATOR", "AUDITOR", "MERCHANT",
]
export const PAGES = [
  "Login",
  "Token Bin Management",
  "Profile Management",
  "instance",
  "Token Management",
]
export const TASKS: AuditLogRecord["task"][] = [
  "Login", "Access and load page", "Create", "Update", "Delete",
]
export const USERS = ["gihan", "wije", "kevin", "nuwan", "demo_user"]

const iso = (d: Date | number) => new Date(d).toISOString()

export const INITIAL_ROWS: AuditLogRecord[] = [
  {
    id: "1",
    userRole: "ADMIN",
    description: " View Token Bin Management",
    page: "Token Bin Management",
    task: "Access and load page",
    userName: "gihan",
    createdAt: iso(Date.now() - 20_000),
    status: "Success",
  },
  {
    id: "2",
    userRole: "AUDITOR",
    description: "Login successfully",
    page: "Login",
    task: "Login",
    userName: "wije",
    createdAt: iso(Date.now() - 30_000),
    status: "Success",
  },
  {
    id: "3",
    userRole: "ADMIN",
    description: "Login successfully",
    page: "Login",
    task: "Login",
    userName: "kevin",
    createdAt: iso(Date.now() - 60_000),
    status: "Failed",
  },
  {
    id: "4",
    userRole: "AUDITOR",
    description: "View Profile Management",
    page: "Profile Management",
    task: "Access and load page",
    userName: "damith",
    createdAt: iso(Date.now() - 90_000),
    status: "Success",
  },
  {
    id: "5",
    userRole: "ADMIN",
    description: "View instance page",
    page: "instance",
    task: "Access and load page",
    userName: "gayesh",
    createdAt: iso(Date.now() - 110_000),
    status: "Failed",
  },
]

// opens the dialog from Report
export function createColumns(
  onView?: (row: AuditLogRecord) => void
): ColumnDef<AuditLogRecord>[] {
  const Clickable: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick() }}
      className="cursor-pointer rounded px-2 py-1 hover:bg-muted/50"
    >
      {children}
    </div>
  )

  return [
    {
      accessorKey: "userRole",
      header: ({ column }) => (
        <div className="text-left pl-2">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            User Role
            {column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> :
             column.getIsSorted() === "desc" ? <ArrowDown className="ml-2 h-4 w-4" /> : null}
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <Clickable onClick={() => onView?.(row.original)}>
          <div className="pl-0">{row.original.userRole}</div>
        </Clickable>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <Clickable onClick={() => onView?.(row.original)}>
          {row.original.description}
        </Clickable>
      ),
    },
    {
      accessorKey: "page",
      header: ({ column }) => (
        <div className="text-left">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Page
            {column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> :
             column.getIsSorted() === "desc" ? <ArrowDown className="ml-2 h-4 w-4" /> : null}
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <Clickable onClick={() => onView?.(row.original)}>
          {row.original.page}
        </Clickable>
      ),
    },
    {
      accessorKey: "task",
      header: "Task",
      cell: ({ row }) => (
        <Clickable onClick={() => onView?.(row.original)}>
          {row.original.task}
        </Clickable>
      ),
    },
    {
      accessorKey: "userName",
      header: "User Name",
      cell: ({ row }) => (
        <Clickable onClick={() => onView?.(row.original)}>
          {row.original.userName}
        </Clickable>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <div className="text-left">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Created Time
            {column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> :
             column.getIsSorted() === "desc" ? <ArrowDown className="ml-2 h-4 w-4" /> : null}
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <Clickable onClick={() => onView?.(row.original)}>
          {new Date(row.original.createdAt).toLocaleString()}
        </Clickable>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status ?? "Success"
        return (
          <Clickable onClick={() => onView?.(row.original)}>
            <Badge variant={s === "Success" ? "default" : "destructive"}>{s}</Badge>
          </Clickable>
        )
      },
      enableHiding: true,
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => {
        const rec = row.original
        return (
          <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* prevent bubbling so row click won't fire */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onView?.(rec)}>
                  <Eye className="mr-2 h-4 w-4" /> View
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert(`Filter by user ${rec.userName}`)}>
                  Filter by User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
