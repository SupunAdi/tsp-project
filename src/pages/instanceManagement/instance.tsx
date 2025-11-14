import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import PaginationBar from "@/components/pagination-bar"
import type { InstanceRecord } from "./columns"
import { createColumns } from "./columns"
import api from "@/lib/api/api"
import { RefreshCcw } from "lucide-react"
import type { SortingState } from "@tanstack/react-table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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

export default function InstanceManagement() {
  const [rows, setRows] = useState<InstanceRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)         // UI is 1-based
  const [pageSize, setPageSize] = useState(5) // 5 | 10 | 20

  const [sorting, setSorting] = useState<SortingState>([
    { id: "instanceId", desc: false }
  ]) 

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sort = sorting[0]?.id
  const dir  = sorting[0]?.desc ? "desc" : "asc"

  const load = async () => {
    try {
          setLoading(true)
          setError(null)

          const res = await api.get<PageResponse<InstanceRecord>>("/tsp/v1/instance", { 
            params : {
              page: page - 1,   // backend is 0-based
              size: pageSize,   // 5/10/20
              sort,             
              dir, 
            },
          })
          setRows(res.data.content ?? [])
          setTotal(res.data.totalElements ?? 0)
        } catch (err: any) {
          const msg = err?.response?.data?.message || err?.message || "Failed to load instances"
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

  // dialog state
    const [open, setOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formErr, setFormErr] = useState<string | null>(null)
      
    const [traceId, setTraceId] = useState("")
    const [instanceName, setInstanceName] = useState("")
    const [profileId, setProfileId] = useState("")

    const resetForm=()=> {
      setTraceId("")
      setInstanceName("")
      setProfileId("")
      setFormErr(null)
    }
  
  const handleOpenChange = (v: boolean) => {
    setOpen(v)
    if (!v) resetForm()          // <-- clear when closing
  }

    const handleSave = async () => {
    try {
      setSaving(true)
      setFormErr(null)

    if (!/^\d{6}$/.test(traceId)) {
      setFormErr("Trace Id must be exactly 6 digits")
      setSaving(false)
      return
    }

    const payload = {
      traceId: traceId.trim(),
      instanceName: instanceName.trim(),
      profileId: profileId.trim(),
    }

    const res = await api.post("/tsp/v1/instance/create-instance", payload)

    //  check your wrapped response
    const isOk = res?.data?.code === "00" || res?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"
    if (!isOk) {
      setFormErr(res?.data?.message || "Request failed")
      return 
    }
      setOpen(false)
      await load()
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to create profile"
      setFormErr(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Instance Management</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading…" : `Showing ${total} instance(s)`}
          </p>
        </div>
        <Button variant="outline" onClick={load} className="inline-flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" /> Reload
        </Button>
      </div>

      {/* KPI cards (now use server total; active/deactive counts are on current page by design) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total</CardTitle>
            <CardDescription>All instances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{loading ? "—" : total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Active</CardTitle>
            <CardDescription>Status = ACT (on this page)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {rows.filter(r => r.instanceStatus?.toUpperCase() === "ACT").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Deactive</CardTitle>
            <CardDescription>Status = DEACT (on this page)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {rows.filter(r => r.instanceStatus?.toUpperCase() === "DEACT").length}
            </div>
          </CardContent>
        </Card>
      </div>

            <div className="flex justify-end w-full -mt-1 mb-2">
              <Dialog open={open} onOpenChange={handleOpenChange}>
                  <DialogTrigger asChild>
                     <Button className="sm:ml-auto" onClick={() => { resetForm(); setOpen(true) }}>Add New Instance</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Instance</DialogTitle>
                        <DialogDescription>Fill details and click Save.</DialogDescription>
                      </DialogHeader>

                      {formErr && ( <div className="text-sm text-red-600 border border-red-200 rounded-md p-2">{formErr}</div> )}

                      <div className="grid gap-4 py-2">
                        <Label htmlFor="traceId">Trace Id</Label>
                          <Input   
                            id="traceId"
                            placeholder="123456"
                            value={traceId}
                            onChange={(e) => setTraceId(e.target.value.trim())}
                          />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="instanceName">Instance Name</Label>
                          <Input   
                            id="instanceName"
                            placeholder=""
                            value={instanceName}
                            onChange={(e) => setInstanceName(e.target.value.trim())}
                          />
                      </div> 
                      <div className="grid gap-2">
                        <Label htmlFor="profileId">Profile Id</Label>
                         <Input   
                            id="profileId"
                            placeholder="P001"
                            value={profileId}
                            onChange={(e) => setProfileId(e.target.value.trim())}
                          />
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save"}
                        </Button> 
                      </DialogFooter>              
                  </DialogContent>
            </Dialog>
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
          <DataTable
            columns={columns}
            data={rows}
            state={{ sorting }}
            onSortingChange={setSorting}
            manualSorting
          />
        )}
      </div>

      {/* Pagination */}
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
