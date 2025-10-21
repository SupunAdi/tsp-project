import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import PaginationBar from "@/components/pagination-bar"
import { usePagination } from "@/hooks/use-pagination"

import type { InstanceRecord } from "./columns"
import { createColumns } from "./columns"
import api from "@/lib/api/api"

type ApiInstance = {
  instanceId: string
  instanceName: string
  instanceStatus: string
  profileCode: string
  createTime: string
  lastUpdateTime: string
}

export default function InstanceManagement() {
  const [rows, setRows] = useState<InstanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get<ApiInstance[]>("/tsp/v1/instance")
      const data = (res.data ?? []).map<InstanceRecord>((x) => ({
        code: x.instanceId,
        name: x.instanceName,
        status: x.instanceStatus,
        profileCode: x.profileCode,
        createdTime: x.createTime,
        lastUpdateTime: x.lastUpdateTime,
      }))
      setRows(data)
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Failed to load instances"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const { page, setPage, pageSize, setPageSize, pageCount, range } = usePagination(rows.length, 5)
  const currentRows = useMemo(() => rows.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize), [rows, page, pageSize])
  const columns = useMemo(() => createColumns(), [])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Instance Management</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading…" : `Showing ${rows.length} instance(s)`}
          </p>
        </div>
        <Button variant="outline" onClick={load} className="inline-flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" /> Reload
        </Button>
      </div>

      {/* Tiny KPIs (optional) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total</CardTitle>
            <CardDescription>All instances</CardDescription>
          </CardHeader>
          <CardContent><div className="text-3xl font-semibold">{rows.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Active</CardTitle>
            <CardDescription>Status = ACT</CardDescription>
          </CardHeader>
          <CardContent><div className="text-3xl font-semibold">{rows.filter(r => r.status?.toUpperCase() === "ACT").length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Deactive</CardTitle>
            <CardDescription>Status = DEACT</CardDescription>
          </CardHeader>
          <CardContent><div className="text-3xl font-semibold">{rows.filter(r => r.status?.toUpperCase() === "DEACT").length}</div></CardContent>
        </Card>
      </div>

      {/* Table */}
      <div className="rounded-md border min-h-[120px]">
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">Loading instances…</div>
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
