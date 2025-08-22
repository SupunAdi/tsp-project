"use client"

import type { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type User = {
    id : number;
    name: string;
    email: string;
}

export const columns : ColumnDef<User>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <div className="text-center">
                    {column.getCanSort() ? 
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        ID
                        { column.getIsSorted() === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4" />}
                    </Button> : "ID" }
                </div>
                
            )
        },
        cell: ({ row }) => <div className="text-center">{row.getValue('id')}</div>,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <div className="text-center">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Name
                        {column.getIsSorted() === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4" />}
                    </Button>
                </div>
                
            )
        },
        cell: ({ row }) => <div className="text-center">{row.getValue('name')}</div>,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <div className="text-center">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Email
                        {column.getIsSorted() === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4" />}
                    </Button>
                </div>
                
            )
        },
        cell: ({ row }) => <div className="text-center">{row.getValue('email')}</div>,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
    },
    {
        id: 'actions',
        header: () => <div className="text-center">Action</div>,
        cell: ({ row }) => {
            const user = row.original;
           // row._getAllCellsByColumnId
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
                        <DropdownMenuItem onClick={() => alert(`Editing user ${user.id}`)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert(`Deleting user ${user.id}`)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => alert(`Viewing user ${user.id}`)}>View</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: true,
        enableResizing: false,
    }
];