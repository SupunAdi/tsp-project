import { useEffect, useMemo, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import PaginationBar from "@/components/pagination-bar"
import { CreditCard, CheckCircle2, XCircle, Clock, RefreshCcw } from "lucide-react"
import type { PofileRecord, ProfileRowActions } from "./columns"
import { createColumns } from "./columns"
import api from "@/lib/api/api"
import type { SortingState } from "@tanstack/react-table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

export default function Profile() {
  const [rows, setRows] = useState<PofileRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1) // UI is 1-based
  const [pageSize, setPageSize] = useState(5) // 5 | 10 | 20

  const [sorting, setSorting] = useState<SortingState>([
    { id: "code", desc: false },
  ])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sort = sorting[0]?.id
  const dir = sorting[0]?.desc ? "desc" : "asc"


  // ------- dialog & form state --------
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formErr, setFormErr] = useState<string | null>(null)

  const [mode, setMode] = useState<Mode>("create")
  const [editingCode, setEditingCode] = useState<string | null>(null)

  const [traceId, setTraceId] = useState("")
  const [cardExpiryProfile, setCardExpiryProfile] = useState("")
  const [accountExpiryProfile, setAccountExpiryProfile] = useState("")
  const [tokenLength, setTokenLength] = useState("")

  const [status, setStatus] = useState<"ACT" | "DEACT">("DEACT")
  const [originalStatus, setOriginalStatus] = useState<"ACT" | "DEACT">("DEACT")

  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  const resetForm = () => {
    setTraceId("")
    setCardExpiryProfile("")
    setAccountExpiryProfile("")
    setTokenLength("")
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
  const handleViewRow = useCallback((row: PofileRecord) => {
    console.log("View profile", row.code)
  }, [])

  const handleEditRow = useCallback((row: PofileRecord) => {
    setMode("edit")
    setEditingCode(row.code)

    setCardExpiryProfile(row.cardExpiryCode || "")
    setAccountExpiryProfile(row.accountExpiryCode || "")
    setTokenLength(row.tokenLength || "")

    const normalized =
      row.profileStatus?.toUpperCase() === "ACT" ||
        row.profileStatus?.toUpperCase() === "ACTIVE"
        ? "ACT"
        : "DEACT"
    setStatus(normalized)
    setOriginalStatus(normalized)

    setTraceId("") // user must enter a new 6-digit traceId for the request
    setFormErr(null)
    setOpen(true)
  }, [])

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<PofileRecord | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleDeleteRow = useCallback((row: PofileRecord) => {
    setDeleteTarget(row)
    setDeleteOpen(true)
  }, [])


const handleConfirmDelete = async () => {
  if (!deleteTarget) return

  try {
    setDeleteLoading(true)
    setFormErr(null)

    const payload = {
      traceId: "123456",        // Or generate a new traceId if required
      profileId: deleteTarget.code,
      eventId: null,
    }

    const res = await api.post("/tsp/v1/profile/remove-profile", payload)

    const ok =
      res?.data?.code === "00" ||
      res?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"

    if (!ok) {
      setFormErr(res?.data?.message || "Failed to delete profile")
      return
    }

    setDeleteOpen(false)
    setDeleteTarget(null)
    await load()

  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to delete profile"
    setFormErr(msg)
  } finally {
    setDeleteLoading(false)
  }
}

  const actions: ProfileRowActions = {
    onView: handleViewRow,
    onEdit: handleEditRow,
    onDelete: handleDeleteRow,
  }

  const columns = useMemo(() => createColumns(actions), [actions])

  // ---------- load list from backend ----------
  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await api.get<PageResponse<PofileRecord>>("/tsp/v1/profile", {
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
      const msg = err?.response?.data?.message || err?.message || "Failed to load profiles"
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

      if (!/^\d{6}$/.test(traceId)) {
        setFormErr("Trace Id must be exactly 6 digits")
        setSaving(false)
        return
      }
      if (!tokenLength?.trim()) {
        setFormErr("Token Length is required")
        setSaving(false)
        return
      }

      const payload = {
        traceId: traceId.trim(),
        cardExpiryProfile: cardExpiryProfile.trim(),
        accountExpiryProfile: accountExpiryProfile.trim(),
        tokenLength: tokenLength.trim(),
      }

      if (mode === "create") {
        // CREATE -> POST /generate
        const res = await api.post("/tsp/v1/profile/generate", payload)
        const isOk =
          res?.data?.code === "00" || res?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"
        if (!isOk) {
          setFormErr(res?.data?.message || "Request failed")
          return
        }
      } else if (mode === "edit" && editingCode) {
        // UPDATE -> PUT /update-profile/{code}
        const res = await api.put(`/tsp/v1/profile/update-profile/${editingCode}`, payload)
        const isOk =
          res?.data?.code === "00" || res?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"
        if (!isOk) {
          setFormErr(res?.data?.message || "Update failed")
          return
        }

        // If status changed, call activate/deactivate
        if (status !== originalStatus) {
          const statusPayload = {
            traceId: traceId.trim(),
            profileId: editingCode,
            eventId: null,
          }

          if (status === "ACT") {
            const resAct = await api.post("/tsp/v1/profile/activate-profile", statusPayload)
            const okAct =
              resAct?.data?.code === "00" ||
              resAct?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"
            if (!okAct) {
              setFormErr(resAct?.data?.message || "Failed to activate profile")
              return
            }
          } else {
            const resDeact = await api.post("/tsp/v1/profile/deactivate-profile", statusPayload)
            const okDeact =
              resDeact?.data?.code === "00" ||
              resDeact?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"
            if (!okDeact) {
              setFormErr(resDeact?.data?.message || "Failed to deactivate profile")
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
        (mode === "create" ? "Failed to create profile" : "Failed to update profile")
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
          <h1 className="text-2xl font-semibold">Profile Management</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading…" : `Showing ${total} profiles`}
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

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Total Profiles
            </CardTitle>
            <CardDescription>All configured profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{loading ? "—" : total}</div>
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

      {/* Add / Edit Dialog */}
      <div className="flex justify-end w-full -mt-1 mb-2">
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="sm:ml-auto" onClick={handleAddClick}>
              Add New Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {mode === "create" ? "Add New Profile" : `Edit Profile ${editingCode}`}
              </DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? "Fill details and click Save."
                  : "Update details and click Save."}
              </DialogDescription>
            </DialogHeader>

            {formErr && (
              <div className="text-sm text-red-600 border border-red-200 rounded-md p-2">
                {formErr}
              </div>
            )}

            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="traceId">Trace Id</Label>
                <Input
                  id="traceId"
                  placeholder="123456"
                  value={traceId}
                  onChange={(e) => setTraceId(e.target.value.trim())}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="accountExpiryProfile">Account Expiry Profile</Label>
                <Input
                  id="accountExpiryProfile"
                  placeholder="EXP001"
                  value={accountExpiryProfile}
                  onChange={(e) => setAccountExpiryProfile(e.target.value.trim())}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cardExpiryProfile">Card Expiry Profile</Label>
                <Input
                  id="cardExpiryProfile"
                  placeholder="EXP002"
                  value={cardExpiryProfile}
                  onChange={(e) => setCardExpiryProfile(e.target.value.trim())}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tokenLength">Token Length</Label>
                <Input
                  id="tokenLength"
                  type="number"
                  value={tokenLength}
                  onChange={(e) => setTokenLength(e.target.value)}
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

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Profile</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `Are you sure you want to delete profile ${deleteTarget.code}?`
                : "Are you sure you want to delete this profile?"}
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
      </Dialog>

      {/* Table */}
      <div className="rounded-md border min-h-[120px]">
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">Loading profiles…</div>
        ) : rows.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">No profiles found.</div>
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
        onPageSizeChange={(s: number) => {
          setPageSize(s)
          setPage(1)
        }}
      />
    </div>
  )
}
