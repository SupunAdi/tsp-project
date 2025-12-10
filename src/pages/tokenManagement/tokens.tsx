import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import PaginationBar from "@/components/pagination-bar"
import { CreditCard, CheckCircle2, XCircle, Clock , RefreshCcw } from "lucide-react"
import type { TokenManagementRecord, TokenRowActions } from "./columns"

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

  const generateTraceId = (): string => {
  const timestamp = Date.now().toString().slice(-3) // Last 3 digits of timestamp
  const random = Math.floor(100 + Math.random() * 900).toString() // 3 random digits
  return timestamp + random // Combine for 6 digits
  }

   // ---------- row action handlers ----------
  const handleActivateRow = useCallback(async (row: TokenManagementRecord) => {
    try {
      const generatedTraceId = generateTraceId()
      const payload = {
        traceId: generatedTraceId,
        token: row.token,
        eventId: ""
      }

      // Optimistic update - update UI immediately
      setRows(prevRows => 
        prevRows.map(item => 
          item.token === row.token 
            ? { ...item, status: "ACT" }
            : item
        )
      )

      const response = await api.post("/tsp/v1/token-management/activate-token", payload)
      if (response.data.code === "TSP_REQUEST_PROCESS_SUCCESS") {
        console.log("Token activated successfully")
      } else {
        // Revert on error
        await load()
        throw new Error(response.data.message || "Activation failed")
      }
    } catch (err: any) {
      // Revert on error
      await load()
      const msg = err?.response?.data?.message || err?.message || "Failed to activate profile"
      setError(msg)
    }
  }, [load])

  const handleDeactivateRow = useCallback(async (row: TokenManagementRecord) => {
  try {
    const generatedTraceId = generateTraceId()
    const payload = {
      traceId: generatedTraceId,
      token: row.token,
      eventId: ""
    }

    // Optimistic update - update UI immediately
    setRows(prevRows => 
      prevRows.map(item => 
        item.token === row.token 
          ? { ...item, profileStatus: "DEACT" }
          : item
      )
    )

    const response = await api.post("/tsp/v1/token-management/deactivate-token", payload)
    if (response.data.code === "TSP_REQUEST_PROCESS_SUCCESS") {
      console.log("Token deactivated successfully")
    } else {
      // Revert on error
      await load()
      throw new Error(response.data.message || "Deactivation failed")
    }
  } catch (err: any) {
    // Revert on error
    await load()
    const msg = err?.response?.data?.message || err?.message || "Failed to deactivate profile"
    setError(msg)
  }
  }, [load])

    const actions: TokenRowActions = {
      onActivate: handleActivateRow,
      onDeactivate: handleDeactivateRow,
    }

   const columns = useMemo(() => createColumns(actions), [actions])
  
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
  

