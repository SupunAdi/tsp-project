import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import PaginationBar from "@/components/pagination-bar"
import type { InstanceRecord, InstanceRowActions } from "./columns"
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

type Mode = "create" | "edit"

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
  const dir = sorting[0]?.desc ? "desc" : "asc"

    const generateTraceId = (): string => {
    const timestamp = Date.now().toString().slice(-3) // Last 3 digits of timestamp
    const random = Math.floor(100 + Math.random() * 900).toString() // 3 random digits
    return timestamp + random // Combine for 6 digits
  }

  // ------- dialog & form state --------
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formErr, setFormErr] = useState<string | null>(null)

  const [mode, setMode] = useState<Mode>("create")
  const [editingCode, setEditingCode] = useState<string | null>(null)

  const [instanceName, setInstanceName] = useState("")
  const [profileId, setProfileId] = useState("")

  const [status, setStatus] = useState<"ACT" | "DEACT">("DEACT")
  const [originalStatus, setOriginalStatus] = useState<"ACT" | "DEACT">("DEACT")

  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  const resetForm = () => {
    setInstanceName("")
    setProfileId("")
    setStatus("DEACT")
    setOriginalStatus("DEACT")
    setEditingCode(null)
    setFormErr(null)
    setMode("create")
  }


  const handleOpenChange = (v: boolean) => {
    setOpen(v)
    if (!v) resetForm()
  }

  const handleAddClick = () => {
    resetForm()
    setMode("create")
    setOpen(true)
  }


  // ---------- row action handlers ----------
  // const handleViewRow = useCallback((row: InstanceRecord) => {
  //   console.log("View instance", row.instanceId)
  // }, [])

  const handleEditRow = useCallback((row: InstanceRecord) => {
    setMode("edit")
    setEditingCode(row.instanceId)

    setInstanceName(row.instanceName || "")
    setProfileId(row.profileCode || "")

    const normalized =
      row.instanceStatus?.toUpperCase() === "ACT" ||
        row.instanceStatus?.toUpperCase() === "ACTIVE"
        ? "ACT"
        : "DEACT"
    setStatus(normalized)
    setOriginalStatus(normalized)

    setFormErr(null)
    setOpen(true)
  }, [])

  // const [deleteOpen, setDeleteOpen] = useState(false)
  // const [deleteTarget, setDeleteTarget] = useState<InstanceRecord | null>(null)
  // const [deleteLoading, setDeleteLoading] = useState(false)

  // const handleDeleteRow = useCallback((row: InstanceRecord) => {
  //   setDeleteTarget(row)
  //   setDeleteOpen(true)
  // }, [])

// const handleConfirmDelete = async () => {
//   if (!deleteTarget) return

//   try {
//     setDeleteLoading(true)
//     setFormErr(null)

//     const generatedTraceId = generateTraceId()

//     const payload = {
//       traceId: generatedTraceId,        
//       instanceId: deleteTarget.instanceId,
//       eventId: null,
//     }

//     const res = await api.post("/tsp/v1/instance/remove-instance", payload)

//     const ok =
//       res?.data?.code === "00" ||
//       res?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"

//     if (!ok) {
//       setFormErr(res?.data?.message || "Failed to delete instance")
//       return
//     }

//     setDeleteOpen(false)
//     setDeleteTarget(null)
//     await load()
//       } catch (err: any) {
//         const msg =
//           err?.response?.data?.message ||
//           err?.message ||
//           "Failed to delete instance"
//         setFormErr(msg)
//       } finally {
//         setDeleteLoading(false)
//       }
//     }


  const actions: InstanceRowActions = {
    // onView: handleViewRow,
    onEdit: handleEditRow
    // onDelete: handleDeleteRow,
  }

  const columns = useMemo(() => createColumns(actions), [actions])

  // ---------- load list from backend ----------
  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await api.get<PageResponse<InstanceRecord>>("/tsp/v1/instance", {
        params: {
          page: page - 1, // backend is 0-based
          size: pageSize,
          sort,
          dir,
        },
      })

      setRows(res.data.content ?? [])
      setTotal(res.data.totalElements ?? 0)
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load instance"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, sort, dir])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [sorting])

  // ---------- Save (create / edit) ----------
  const handleSave = async () => {
    try {
      setSaving(true)
      setFormErr(null)

      const generatedTraceId = generateTraceId()
  
      if (!instanceName?.trim()) {
        setFormErr("Instance name is required")
        setSaving(false)
        return
      }

      const payload = {
        traceId: generatedTraceId,
        instanceName: instanceName.trim(),
        profileId: profileId.trim(),

      }
      if (mode === "create") {
        // CREATE -> POST /generate
        const res = await api.post("/tsp/v1/instance/create-instance", payload)
        const isOk =
          res?.data?.code === "00" || res?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"
        if (!isOk) {
          setFormErr(res?.data?.message || "Request failed")
          return
        }

      //UPDATE
      } else if (mode === "edit" && editingCode) {
        const res = await api.put(`/tsp/v1/instance/update-instance/${editingCode}`, payload)
        const isOk =
          res?.data?.code === "00" || res?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"
        if (!isOk) {
          setFormErr(res?.data?.message || "Update failed")
          return
        }

        // If status changed, call activate/deactivate
        if (status !== originalStatus) {
          const statusPayload = {
            traceId: generatedTraceId,
            instanceId: editingCode,
            eventId: null,
          }

          if (status === "ACT") {
            const resAct = await api.post("/tsp/v1/instance/activate-instance", statusPayload)
            const okAct =
              resAct?.data?.code === "00" ||
              resAct?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"
            if (!okAct) {
              setFormErr(resAct?.data?.message || "Failed to activate instance")
              return
            }
          } else {
            const resDeact = await api.post("/tsp/v1/instance/deactivate-instance", statusPayload)
            const okDeact =
              resDeact?.data?.code === "00" ||
              resDeact?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"
            if (!okDeact) {
              setFormErr(resDeact?.data?.message || "Failed to deactivate instance")
              return
            }
          }
        }
      }

      setOpen(false)
      await load()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        (mode === "create" ? "Failed to create instance" : "Failed to update instance")
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

      {/* Error banner */}
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

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

      {/* Add / Edit Dialog */}
      <div className="flex justify-end w-full -mt-1 mb-2">
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="sm:ml-auto" onClick={handleAddClick}>
              Add New Instance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {mode === "create" ? "Add New Instance" : `Edit Instance ${editingCode}`}
              </DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? "Fill details and click Save."
                  : "Update details and click Save."}
              </DialogDescription>
            </DialogHeader>

            {formErr && (<div className="text-sm text-red-600 border border-red-200 rounded-md p-2">{formErr}</div>)}

            <div className="grid gap-4 py-2">
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

                {mode === "edit" && (
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="border rounded-md px-2 py-2 text-sm"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as "ACT" | "DEACT")}
                    >
                      <option value="ACT">Active</option>
                      <option value="DEACT">Deactive</option>
                    </select>
                  </div>
                )}
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

     {/* <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Instance</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `Are you sure you want to delete instance ${deleteTarget.instanceId}?`
                : "Are you sure you want to delete this instance?"}
              <br />
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}


      {/* Table */ }
  <div className="rounded-md border min-h-[120px]">
    {loading ? (
      <div className="p-4 text-sm text-muted-foreground">Loading instances…</div>
    ) : rows.length === 0 ? (
      <div className="p-4 text-sm text-muted-foreground">No instance found.</div>
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

  {/* Pagination */ }
  <PaginationBar
    total={total}
    page={page}
    pageSize={pageSize}
    pageCount={pageCount}
    start={start}
    end={end}
    onPageChange={setPage}
    onPageSizeChange={(s: number) => { setPageSize(s); setPage(1) }}
  />
    </div >
  )
}
