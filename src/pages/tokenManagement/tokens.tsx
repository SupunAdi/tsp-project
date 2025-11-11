import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import PaginationBar from "@/components/pagination-bar"
import { usePagination } from "@/hooks/use-pagination"
import { CreditCard, CheckCircle2, XCircle, Clock , RefreshCcw } from "lucide-react"
import type { TokenManagementRecord } from "./columns"

import { DataTable } from "@/components/ui/data-table"


import { createColumns,} from "./columns"


import api from "@/lib/api/api"
import type { SortingState } from "@tanstack/react-table"

type PageResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  hasNext: boolean
  hasPrevious: boolean
}



export default function TokenBills() {
  const [rows, setRows] = useState<TokenManagementRecord[]>([])

  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)          // UI is 1-based
  const [pageSize, setPageSize] = useState(5)  // 5 | 10 | 20

  const [sorting, setSorting] = useState<SortingState>([
    { id: "id", desc: false }
  ]) // [{id, desc}]

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sort = sorting[0]?.id
  const dir  = sorting[0]?.desc ? "desc" : "asc"

  const load = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await api.get<PageResponse<TokenManagementRecord>>("/tsp/v1/token-management", {
        params: {
          page: page - 1,   // backend is 0-based
          size: pageSize,   // 5/10/20
          sort,             
          dir,              
        },
      })

      setRows(res.data.content ?? [])
      setTotal(res.data.totalElements ?? 0)
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load token managements"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page, pageSize, sort, dir])
  useEffect(() => { setPage(1) }, [sorting])

  const columns = useMemo(() => createColumns(), [])

  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)



  return (
    <div className="space-y-4">
      {/* Header */}
       <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Token Management</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading…" : `Showing ${total} token managements`}
          </p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm" title="Reload">
          <RefreshCcw className="h-4 w-4" /> Reload
        </button>
      </div> 

      {/* Error banner */}
      {error && <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      

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
      {/* <div className="flex justify-end w-full -mt-1 mb-2"> */}
        {/* <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="sm:ml-auto">Add New Card Bin</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Card BIN</DialogTitle>
              <DialogDescription>Fill details and click Save. This is a frontend preview only.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
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
              </div> */}

              {/* Card Association */}
              {/* <div className="grid gap-2">
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
              </div> */}

              {/* BIN Size (auto) */}
              {/* <div className="grid gap-2">
                <Label htmlFor="binsize">BIN Size</Label>
                <Input id="binsize" value={binSize} readOnly />
              </div> */}

              {/* Bank Code */}
              {/* <div className="grid gap-2">
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
              </div> */}
            {/* </div> */}

            {/* <DialogFooter>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div> */}

          {/* Table */}
      <div className="rounded-md border min-h-[120px]">
          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-50 border-b"> {error} </div>
          )}
          <DataTable
            columns={columns}
            data={rows}                
            state={{ sorting }}
            onSortingChange={setSorting}
            manualSorting
          />
          {!loading && rows.length === 0 && (
            <div className="p-3 text-sm text-muted-foreground border-t">
              No token managements found.
            </div>
          )}
      </div>

      {/* Pagination (server-side) */}
      <PaginationBar
        total={total}
        page={page}
        pageSize={pageSize}
        pageCount={pageCount}
        start={start}
        end={end}
        onPageChange={setPage}
        onPageSizeChange={(s:number) => { setPageSize(s); setPage(1) }}
      />
    </div>
  )
}
  

