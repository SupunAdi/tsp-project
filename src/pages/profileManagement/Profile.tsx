import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
//import PaginationBar from "@/hooks/use-pagination" ? /* if you export default */ "@/components/pagination-bar" : "@/components/pagination-bar"
import PaginationBar from "@/components/pagination-bar"

import { usePagination } from "@/hooks/use-pagination"
import { CreditCard, CheckCircle2, XCircle, Clock, RefreshCcw } from "lucide-react"

import type { PofileRecord } from "./columns"
import { createColumns } from "./columns"
import api from "@/lib/api/api"


export default function Profile() {
  const [rows, setRows] = useState<PofileRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get<PofileRecord[]>("/tsp/v1/profile")
      setRows(res.data ?? [])
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load profiles"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const { page, setPage, pageSize, setPageSize, pageCount, range } = usePagination(rows.length, 5)
  const startIdx = (page - 1) * pageSize
  const endIdx = startIdx + pageSize
  const currentRows = useMemo(() => rows.slice(startIdx, endIdx), [rows, startIdx, endIdx])

  const columns = useMemo(() => createColumns(), [])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Profile Management</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading…" : `Showing ${rows.length} profiles`}
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
          title="Reload"
        >
          <RefreshCcw className="h-4 w-4" /> Reload
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Total Profiles
            </CardTitle>
            <CardDescription>All configured profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {loading ? "—" : rows.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Active (placeholder)
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
              Deactive (placeholder)
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

      {/* Table / Loading state */}
      <div className="rounded-md border min-h-[120px]">
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">Loading profiles…</div>
        ) : rows.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">No profiles found.</div>
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
