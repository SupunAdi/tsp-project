import { useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { CreditCard, CheckCircle2, XCircle, Clock } from "lucide-react"

import PaginationBar from "@/components/pagination-bar"
import { usePagination } from "@/hooks/use-pagination"

// ----------------------- Types & Sample Data -----------------------

type AccountBinRecord = {
  id: string
  accountBin: string
  association: "Visa" | "Mastercard" | "Amex" | "Discover" | "JCB" | "UnionPay"
  bankCode: string
  status: "active" | "deactive"
  createdAt: string
  updatedAt: string
  updatedBy: string
}

const NOW = new Date().toISOString()

const INITIAL_ROWS: AccountBinRecord[] = [
  { id: "a1", accountBin: "ACC-1001", association: "Visa",       bankCode: "BNK00123", status: "active",   createdAt: NOW, updatedAt: NOW, updatedBy: "Alice" },
  { id: "a2", accountBin: "ACC-1002", association: "Mastercard", bankCode: "CBA45",    status: "deactive", createdAt: NOW, updatedAt: NOW, updatedBy: "Bob" },
  { id: "a3", accountBin: "ACC-1003", association: "UnionPay",   bankCode: "UP9988",   status: "active",   createdAt: NOW, updatedAt: NOW, updatedBy: "Cara" },
]

// dropdown options
const ASSOCIATIONS: AccountBinRecord["association"][] = [
  "Visa", "Mastercard", "Amex", "Discover", "JCB", "UnionPay",
]
const BANK_CODES = [
  "BNK00123", "CBA45", "UP9988", "AMX77", "DISC001", "JCB12",
  "V45", "MC0099", "AM3X", "D1", "JCB0007", "BANKX",
]

// ----------------------- Component -----------------------

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
    bankCode: BANK_CODES[0],
  })

  // length of digits within accountBin (e.g. "ACC-1001" -> 4)
  const accountBinSize = form.accountBin.replace(/\D/g, "").length

  // pagination (same pattern as CardBinManagement)
  const { page, setPage, pageSize, setPageSize, pageCount, range } = usePagination(rows.length, 5)
  const startIdx = (page - 1) * pageSize
  const endIdx = startIdx + pageSize
  const currentRows = useMemo(() => rows.slice(startIdx, endIdx), [rows, startIdx, endIdx])

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
    // stub for future backend connect
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
      {/* KPI Cards (mirrors CardBinManagement style) */}
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

      {/* Add New button (right-aligned, under cards) */}
      <div className="flex justify-end w-full -mt-1 mb-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="sm:ml-auto">Add New Account Bin</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Account BIN</DialogTitle>
              <DialogDescription>Fill details and click Save. This is a frontend preview only.</DialogDescription>
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
                    {BANK_CODES.map((code) => (
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
              <TableHead>Account BIN</TableHead>
              <TableHead>Association</TableHead>
              <TableHead>Bank Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Create time</TableHead>
              <TableHead>Update time</TableHead>
              <TableHead>Last update user</TableHead>
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
                  <Button
                    className="h-6 w-20 justify-center px-0"
                    size="sm"
                    variant={r.status === "active" ? "destructive" : "default"}
                    onClick={() => toggleStatus(r.id)}
                  >
                    {r.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
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
