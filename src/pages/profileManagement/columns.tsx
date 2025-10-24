// import type { ColumnDef } from "@tanstack/react-table"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react"

// import {
//   getCoreRowModel,
//   getSortedRowModel,
//   useReactTable,
//   type SortingState,
//   type OnChangeFn,
// } from "@tanstack/react-table"

// export type PofileRecord = {
//   code: string
//   dek: string
//   cardExpiryCode: string
//   accountExpiryCode: string
//   tokenLength: string
// }

// // shorten long DEKs for display
// const short = (s: string, head = 8, tail = 6) =>
//   s.length <= head + tail ? s : `${s.slice(0, head)}…${s.slice(-tail)}`

// export function createColumns(): ColumnDef<PofileRecord>[] {
//   return [
//     {
//       accessorKey: "code",
//       header: ({ column }) => (
//         <div className="text-center">
//           <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//             Code
//             {column.getIsSorted() === "asc" ? (
//               <ArrowUp className="ml-2 h-4 w-4" />
//             ) : column.getIsSorted() === "desc" ? (
//               <ArrowDown className="ml-2 h-4 w-4" />
//             ) : null}
//           </Button>
//         </div>
//       ),
//       cell: ({ row }) => <div className="text-center font-medium">{row.original.code}</div>,
//       enableSorting: true,
//       enableHiding: true,
//     },
//     {
//       accessorKey: "dek",
//       header: ({ column }) => (
//         <div className="text-center">
//           <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//             Dek
//             {column.getIsSorted() === "asc" ? (
//               <ArrowUp className="ml-2 h-4 w-4" />
//             ) : column.getIsSorted() === "desc" ? (
//               <ArrowDown className="ml-2 h-4 w-4" />
//             ) : null}
//           </Button>
//         </div>
//       ),
//       cell: ({ row }) => <div className="text-center tabular-nums">{short(row.original.dek)}</div>,
//       enableSorting: false,
//       enableHiding: true,
//     },
//     {
//       accessorKey: "cardExpiryCode",
//       header: ({ column }) => (
//         <div className="text-center">
//           <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//             Card Expire Code
//             {column.getIsSorted() === "asc" ? (
//               <ArrowUp className="ml-2 h-4 w-4" />
//             ) : column.getIsSorted() === "desc" ? (
//               <ArrowDown className="ml-2 h-4 w-4" />
//             ) : null}
//           </Button>
//         </div>
//       ),
//       cell: ({ row }) => <div className="text-center">{row.original.cardExpiryCode}</div>,
//       enableSorting: true,
//       enableHiding: true,
//     },
//     {
//       accessorKey: "accountExpiryCode",
//       header: ({ column }) => (
//         <div className="text-center">
//           <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//             Account Expire Code
//             {column.getIsSorted() === "asc" ? (
//               <ArrowUp className="ml-2 h-4 w-4" />
//             ) : column.getIsSorted() === "desc" ? (
//               <ArrowDown className="ml-2 h-4 w-4" />
//             ) : null}
//           </Button>
//         </div>
//       ),
//       cell: ({ row }) => <div className="text-center">{row.original.accountExpiryCode}</div>,
//       enableSorting: true,
//       enableHiding: true,
//     },
//     {
//       accessorKey: "tokenLength",
//       header: ({ column }) => (
//         <div className="text-center">
//           <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//             Token Length
//             {column.getIsSorted() === "asc" ? (
//               <ArrowUp className="ml-2 h-4 w-4" />
//             ) : column.getIsSorted() === "desc" ? (
//               <ArrowDown className="ml-2 h-4 w-4" />
//             ) : null}
//           </Button>
//         </div>
//       ),
//       cell: ({ row }) => <div className="text-center tabular-nums">{row.original.tokenLength}</div>,
//       enableSorting: true,
//       enableHiding: true,
//     },
//     {
//       id: "actions",
//       header: () => <div className="text-center">Action</div>,
//       cell: ({ row }) => {
//         const rec = row.original
//         return (
//           <div className="text-center">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
//                   <span className="sr-only">Open menu</span>
//                   <MoreHorizontal className="h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                 <DropdownMenuItem onClick={() => alert(`View ${rec.code}`)}>View</DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => alert(`Edit ${rec.code}`)}>Edit</DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={() => alert(`Delete ${rec.code}`)}>Delete</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         )
//       },
//       enableSorting: false,
//       enableHiding: true,
//     },
//   ]
// }


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

// Row type
export type PofileRecord = {
  code: string
  dek: string
  cardExpiryCode: string
  accountExpiryCode: string
  tokenLength: string
}

// shorten long DEKs for display
const short = (s: string, head = 8, tail = 6) =>
  !s ? "" : s.length <= head + tail ? s : `${s.slice(0, head)}…${s.slice(-tail)}`

export function createColumns(): ColumnDef<PofileRecord>[] {
  return [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Code
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium">{row.original.code}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "dek",
      header: ({ column }) => (
        <div className="text-center">
          <Button variant="ghost" >
            Dek
          </Button>
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
      header: ({ column }) => (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Card Expire Code
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.original.cardExpiryCode}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "accountExpiryCode", 
      header: ({ column }) => (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Account Expire Code
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.original.accountExpiryCode}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "tokenLength",
      header: ({ column }) => (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Token Length
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center tabular-nums">{row.original.tokenLength}</div>
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
                <DropdownMenuItem onClick={() => alert(`View ${rec.code}`)}>
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert(`Edit ${rec.code}`)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert(`Delete ${rec.code}`)}>
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
