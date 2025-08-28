import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import PaginationBar from "@/components/pagination-bar"
import { usePagination } from "@/hooks/use-pagination"
import { CreditCard, CheckCircle2, XCircle, Clock } from "lucide-react"

import { DataTable } from "@/components/ui/data-table"

import type { TokenBinRecord } from "./columns"
import { createColumns, INITIAL_ROWS, CARD_ASSOCIATIONS, BANK_CODES } from "./columns"

export default function TokenBills() {
  const [rows, setRows] = useState<TokenBinRecord[]>(INITIAL_ROWS)

  // modal state
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<{
    bin: string
    cardAssociation: TokenBinRecord["cardAssociation"]
    bankCode: string
  }>({
    bin: "",
    cardAssociation: CARD_ASSOCIATIONS[0],
    bankCode: BANK_CODES[0],
  })

  const binSize = form.bin.replace(/\D/g, "").length

  const { page, setPage, pageSize, setPageSize, pageCount, range } = usePagination(rows.length, 5)
  const startIdx = (page - 1) * pageSize
  const endIdx = startIdx + pageSize
  const currentRows = useMemo(() => rows.slice(startIdx, endIdx), [rows, startIdx, endIdx])

  // status toggle 
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
      tokenBin: form.bin.replace(/\D/g, ""),
      cardAssociation: form.cardAssociation,
      bankCode: form.bankCode,
      binSize,
    })
    setOpen(false)
  }

  const columns = useMemo(() => createColumns({ onToggleStatus: toggleStatus }), [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Profile Management</h1>
        </div>
      </div>

      {/* KPI Cards  */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Total BINs
            </CardTitle>
            <CardDescription>All configured BINs</CardDescription>
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

      {/* Add New Modal  */}
      <div className="flex justify-end w-full -mt-1 mb-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="sm:ml-auto">Add New Card Bin</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Card BIN</DialogTitle>
              <DialogDescription>Fill details and click Save. This is a frontend preview only.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              {/* Bin number */}
              <div className="grid gap-2">
                <Label htmlFor="bin">BIN Number</Label>
                <Input
                  id="bin"
                  inputMode="numeric"
                  placeholder="Enter digits only"
                  value={form.bin}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bin: e.target.value.replace(/\D/g, "") }))
                  }
                />
              </div>

              {/* Card Association */}
              <div className="grid gap-2">
                <Label>Card Association</Label>
                <Select
                  value={form.cardAssociation}
                  onValueChange={(val) =>
                    setForm((f) => ({ ...f, cardAssociation: val as TokenBinRecord["cardAssociation"] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {CARD_ASSOCIATIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* BIN Size (auto) */}
              <div className="grid gap-2">
                <Label htmlFor="binsize">BIN Size</Label>
                <Input id="binsize" value={binSize} readOnly />
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

      {/* DataTable using tanstack/react-table */}
      <div className="rounded-md border">
        <DataTable columns={columns} data={currentRows} />
      </div>

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
