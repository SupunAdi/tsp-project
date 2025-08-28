import { useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreditCard, CheckCircle2, XCircle, Clock, ArrowUp, ArrowDown, MoreHorizontal } from "lucide-react"
import PaginationBar from "@/components/pagination-bar"
import { usePagination } from "@/hooks/use-pagination"

// import shared types/data/options from columns.tsx
import {
  INITIAL_ROWS,
  ASSOCIATIONS,
  BANK_CODES as ACCOUNT_BANK_CODES,
  type AccountBinRecord,
} from "./columns"

export default function AccountBinManagement() {
  const [rows, setRows] = useState<AccountBinRecord[]>(INITIAL_ROWS)

  // dialog (add-new) state
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<{
    accountBin: string
    association: AccountBinRecord["association"]
    bankCode: string
  }>({
    accountBin: "",
    association: ASSOCIATIONS[0],
    bankCode: ACCOUNT_BANK_CODES[0],
  })

  // length of digits within accountBin (e.g. "ACC-1001" -> 4)
  const accountBinSize = form.accountBin.replace(/\D/g, "").length

  // ------- sorting (kept exactly as your pattern) -------
  type SortKey = "accountBin" | "association" | "bankCode" | "status" | "createdAt" | "updatedAt" | "updatedBy"
  type SortState = { key: SortKey; dir: "asc" | "desc" } | null
  const [sort, setSort] = useState<SortState>(null)

  const iconFor = (active: boolean, dir?: "asc" | "desc") =>
    !active ? null : dir === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />

  const toggleHeaderSort = (key: SortKey) =>
    setSort((prev) => (prev?.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }))

  const sortedRows = useMemo(() => {
    if (!sort) return rows
    const arr = [...rows]
    const dir = sort.dir === "asc" ? 1 : -1
    arr.sort((a, b) => {
      switch (sort.key) {
        case "accountBin": return a.accountBin.localeCompare(b.accountBin) * dir
        case "association": return a.association.localeCompare(b.association) * dir
        case "bankCode": return a.bankCode.localeCompare(b.bankCode) * dir
        case "status": return a.status.localeCompare(b.status) * dir
        case "updatedBy": return a.updatedBy.localeCompare(b.updatedBy) * dir
        case "createdAt": return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir
        case "updatedAt": return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * dir
      }
    })
    return arr
  }, [rows, sort])
  // ------------------------------------------------------

  // pagination
  const { page, setPage, pageSize, setPageSize, pageCount, range } = usePagination(sortedRows.length, 5)
  const startIdx = (page - 1) * pageSize
  const endIdx = startIdx + pageSize
  const currentRows = useMemo(() => sortedRows.slice(startIdx, endIdx), [sortedRows, startIdx, endIdx])

  const toggleStatus = (id: string) =>
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: r.status === "active" ? "deactive" : "active",
              updatedAt: new Date().toISOString(),
              updatedBy: "Demo User",
            }
          : r
      )
    )

  const handleSave = () => {
    console.log("Saving (stub):", {
      accountBin: form.accountBin,
      association: form.association,
      bankCode: form.bankCode,
      accountBinSize,
    })
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Total Account BINs
            </CardTitle>
            <CardDescription>All configured account BINs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">—</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Active
            </CardTitle>
            <CardDescription>Currently enabled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">—</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Deactive
            </CardTitle>
            <CardDescription>Currently disabled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">—</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last Updated
            </CardTitle>
            <CardDescription>Most recent change</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">—</div>
          </CardContent>
        </Card>
      </div>

      {/* Add New */}
      <div className="flex justify-end w-full -mt-1 mb-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="sm:ml-auto">Add New Account Bin</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Account BIN</DialogTitle>
              <DialogDescription>Fill details and click Save.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              {/* Account BIN */}
              <div className="grid gap-2">
                <Label htmlFor="accountBin">Account BIN</Label>
                <Input
                  id="accountBin"
                  placeholder="e.g. ACC-1004"
                  value={form.accountBin}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, accountBin: e.target.value }))
                  }
                />
              </div>

              {/* Association */}
              <div className="grid gap-2">
                <Label>Association</Label>
                <Select
                  value={form.association}
                  onValueChange={(val) =>
                    setForm((f) => ({ ...f, association: val as AccountBinRecord["association"] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSOCIATIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Account BIN Size (auto) */}
              <div className="grid gap-2">
                <Label htmlFor="binsize">Account BIN Size</Label>
                <Input id="binsize" value={accountBinSize} readOnly />
              </div>

              {/* Bank Code */}
              <div className="grid gap-2">
                <Label>Bank Code</Label>
                <Select
                  value={form.bankCode}
                  onValueChange={(val) => setForm((f) => ({ ...f, bankCode: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNT_BANK_CODES.map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="[&>th]:text-center">
              <TableHead>
                <Button variant="ghost" onClick={() => toggleHeaderSort("accountBin")} className="mx-auto">
                  Account BIN {iconFor(sort?.key === "accountBin", sort?.dir)}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleHeaderSort("association")} className="mx-auto">
                  Association {iconFor(sort?.key === "association", sort?.dir)}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleHeaderSort("bankCode")} className="mx-auto">
                  Bank Code {iconFor(sort?.key === "bankCode", sort?.dir)}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleHeaderSort("status")} className="mx-auto">
                  Status {iconFor(sort?.key === "status", sort?.dir)}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleHeaderSort("createdAt")} className="mx-auto">
                  Create time {iconFor(sort?.key === "createdAt", sort?.dir)}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleHeaderSort("updatedAt")} className="mx-auto">
                  Update time {iconFor(sort?.key === "updatedAt", sort?.dir)}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleHeaderSort("updatedBy")} className="mx-auto">
                  Last update user {iconFor(sort?.key === "updatedBy", sort?.dir)}
                </Button>
              </TableHead>
              <TableHead className="w-[140px]">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentRows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.accountBin}</TableCell>
                <TableCell>{r.association}</TableCell>
                <TableCell className="tabular-nums">{r.bankCode}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={r.status === "active" ? "default" : "secondary"}>
                    {r.status === "active" ? "Active" : "Deactive"}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(r.updatedAt).toLocaleString()}</TableCell>
                <TableCell>{r.updatedBy}</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>

                      <DropdownMenuItem onClick={() => toggleStatus(r.id)}>
                        {r.status === "active" ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => alert(`Editing ${r.accountBin}`)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => alert(`Deleting ${r.accountBin}`)}>
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => alert(`Viewing ${r.accountBin}`)}>
                        View
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <PaginationBar
        total={rows.length}
        page={page}
        pageSize={pageSize}
        pageCount={pageCount}
        start={range.start}
        end={range.end}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  )
}
