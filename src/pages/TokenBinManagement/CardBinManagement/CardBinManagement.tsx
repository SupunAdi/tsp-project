import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import PaginationBar from "@/components/pagination-bar"
import { usePagination } from "@/hooks/use-pagination"

import type { TokenBinRecord } from "./columns"
import { createColumns } from "./columns"
import api from "@/lib/api/api"

type ApiTokenBin = {
  tokenBin: string
  cardAssociation: string | null
  status: string | null            
  createTime: string | null
  updateTime: string | null
  lastUpdatedUser: string | null
  bankCode: string | null
}

export default function CardBinManagement() {
  const [rows, setRows] = useState<TokenBinRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await api.get<ApiTokenBin[]>("/tsp/v1/card-token-bin")
      const list = Array.isArray(res.data) ? res.data : []

      const data: TokenBinRecord[] = list.map((x) => ({
        id: String(x.tokenBin ?? crypto.randomUUID()),
        tokenBin: x.tokenBin ?? "",
        cardAssociation: x.cardAssociation ?? "",
        bankCode: x.bankCode ?? "",
        // normalize status -> "active" | "deactive"
        status: (x.status ?? "").toString().toUpperCase().startsWith("ACT") ? "active" : "deactive",
        createdAt: x.createTime ?? "",
        updatedAt: x.updateTime ?? "",
        updatedBy: x.lastUpdatedUser ?? "",
      }))

      setRows(data)
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Failed to load card token BINs"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // pagination
  const { page, setPage, pageSize, setPageSize, pageCount, range } = usePagination(rows.length, 5)
  const currentRows = useMemo(
    () => rows.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize),
    [rows, page, pageSize]
  )

  const columns = useMemo(() => createColumns(), [])

  const activeCount = rows.filter(r => r.status === "active").length
  const deactiveCount = rows.filter(r => r.status === "deactive").length
  const lastUpdated = rows.length > 0
    ? rows
        .map(r => r.updatedAt)
        .filter(Boolean)
        .map(v => new Date(v))
        .filter(d => !isNaN(d.getTime()))
        .sort((a, b) => b.getTime() - a.getTime())[0]
    : undefined

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Card BIN Management</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading…" : `Showing ${rows.length} BIN(s)`}
          </p>
        </div>
        <Button variant="outline" onClick={load} className="inline-flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" /> Reload
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total BINs</CardTitle>
            <CardDescription>All configured BINs</CardDescription>
          </CardHeader>
          <CardContent><div className="text-3xl font-semibold">{rows.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Active</CardTitle>
            <CardDescription>Status = ACT</CardDescription>
          </CardHeader>
          <CardContent><div className="text-3xl font-semibold">{activeCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Deactive</CardTitle>
            <CardDescription>Status = DEACT</CardDescription>
          </CardHeader>
          <CardContent><div className="text-3xl font-semibold">{deactiveCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Last Updated</CardTitle>
            <CardDescription>Most recent change</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {lastUpdated ? lastUpdated.toLocaleDateString() : "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <div className="rounded-md border min-h-[120px]">
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">Loading BINs…</div>
        ) : error ? (
          <div className="p-4 text-sm text-red-600">{error}</div>
        ) : rows.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">No data found.</div>
        ) : (
          <DataTable columns={columns} data={currentRows} />
        )}
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
