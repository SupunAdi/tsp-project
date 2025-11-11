import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, Clock, CreditCard, Library, RefreshCcw, XCircle } from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import PaginationBar from "@/components/pagination-bar"

import type { AccountBinRecord } from "./columns"
import { createColumns } from "./columns"
import api from "@/lib/api/api"


import type { SortingState } from "@tanstack/react-table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"


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

export default function AccountBinManagement() {
    const [rows, setRows] = useState<AccountBinRecord[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)          // UI is 1-based
    const [pageSize, setPageSize] = useState(5)  // 5 | 10 | 20

      const [sorting, setSorting] = useState<SortingState>([
    { id: "tokenBin", desc: false }
  ]) 

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const activeCount = rows.filter(r => r.status === "active").length
  const deactiveCount = rows.filter(r => r.status === "deactive").length

  const sort = sorting[0]?.id
  const dir  = sorting[0]?.desc ? "desc" : "asc"

  const load = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await api.get<PageResponse<AccountBinRecord>>("/tsp/v1/account-token-bin", {
        params: {
          page: page - 1,   // backend is 0-based
          size: pageSize,   // 5/10/20
          sort,             
          dir,              
        },
      })

       const mapped = (res.data.content ?? []).map(item => ({
      ...item,
      status: ((item.status ?? "").toUpperCase().startsWith("ACT")
        ? "active"
        : "deactive") as "active" | "deactive",
    }))

      setRows(mapped)
      setTotal(res.data.totalElements ?? 0)

    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load account token bins"
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

  const [open, setOpen] = useState(false)


  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Account BIN Management</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading…" : `Showing ${total} BIN(s)`}
          </p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm" title="Reload">
            <RefreshCcw className="h-4 w-4" /> Reload
        </button>
      </div>


       {error && <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div>}


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
         <Card>
           <CardHeader className="pb-2">
             <CardTitle className="text-base flex items-center gap-2">
               <CreditCard className="h-4 w-4" /> Total BINs
             </CardTitle>
             <CardDescription>All configured BINs</CardDescription>
           </CardHeader>
           <CardContent><div className="text-3xl font-semibold">{loading ? "—" : total}</div></CardContent>
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
              <div className="text-3xl font-semibold">{loading ? "—" : activeCount}</div>
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
              <div className="text-3xl font-semibold">{loading ? "—" : deactiveCount}</div>
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

        <div className="flex justify-end w-full -mt-1 mb-2">
            <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="sm:ml-auto">Add New Card Bin</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Account BIN</DialogTitle>
                        <DialogDescription>Fill details and click Save.</DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-2">

                      </div>

                      <DialogFooter>
                          <Button >Save</Button>
                      </DialogFooter>
                  </DialogContent>
            </Dialog>
        </div>

      {/* Table */}
      <div className="rounded-md border min-h-[120px]">
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">Loading account token bins</div>
        ) : rows.length === 0 ? (
           <div className="p-4 text-sm text-muted-foreground">No account token bins found.</div>
         ) : (
          <DataTable
            columns={columns}
            data={rows}
            state={{ sorting }}
            onSortingChange={setSorting}  
            manualSorting
          />
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









