import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import PaginationBar from "@/components/pagination-bar"
import type { TokenBinRecord, TokenBinRowActions } from "./columns"
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

export default function CardBinManagement() {
  const [rows, setRows] = useState<TokenBinRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)         // UI is 1-based
  const [pageSize, setPageSize] = useState(5) // 5 | 10 | 20

  const [sorting, setSorting] = useState<SortingState>([
    { id: "tokenBin", desc: false }
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

  const [tokenBin, setTokenBin] = useState("")
  const [cardAssociation, setCardAssociation] = useState("")
  const [bankCode, setBankCode] = useState("")
  const [binSize, setBinSize] = useState("")

  const [status, setStatus] = useState<"ACT" | "DEACT">("DEACT")
  const [originalStatus, setOriginalStatus] = useState<"ACT" | "DEACT">("DEACT")

  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  // ---------- load list from backend ----------
  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await api.get<PageResponse<TokenBinRecord>>("/tsp/v1/card-token-bin", {
        params: {
          page: page - 1, // backend is 0-based
          size: pageSize,
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
      const msg = err?.response?.data?.message || err?.message || "Failed to load card token bins"
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

  const resetForm = () => {
    setTokenBin("")
    setCardAssociation("")
    setBankCode("")
    setBinSize("")
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
  const handleActivateRow = useCallback(async (row: TokenBinRecord) => {
    try {
      const generatedTraceId = generateTraceId()
      const payload = {
        traceId: generatedTraceId,
        tokenBin: row.tokenBin,
        eventId: ""
      }

      // Optimistic update - update UI immediately
      setRows(prevRows => 
        prevRows.map(item => 
          item.tokenBin === row.tokenBin 
            ? { ...item, status: "active" as const }
            : item
        )
      )

      const response = await api.post("/tsp/v1/card-token-bin/activate-cardTokenBin", payload)

      if (response.data.code === "TSP_REQUEST_PROCESS_SUCCESS") {
        console.log("Card token bin activated successfully")
      } else {
        // Revert on error
        await load()
        throw new Error(response.data.message || "Activation failed")
      }
    } catch (err: any) {
      // Revert on error
      await load()
      const msg = err?.response?.data?.message || err?.message || "Failed to activate card bin"
      setError(msg)
    }
  }, [load])

  const handleDeactivateRow = useCallback(async (row: TokenBinRecord) => {
    try {
      const generatedTraceId = generateTraceId()
      const payload = {
        traceId: generatedTraceId,
        tokenBin: row.tokenBin,
        eventId: ""
      }

      // Optimistic update - update UI immediately
      setRows(prevRows => 
        prevRows.map(item => 
          item.tokenBin === row.tokenBin 
            ? { ...item, status: "deactive" as const }
            : item
        )
      )

      const response = await api.post("/tsp/v1/card-token-bin/deactivate-cardTokenBin", payload)

      if (response.data.code === "TSP_REQUEST_PROCESS_SUCCESS") {
        console.log("Card token bin deactivated successfully")
      } else {
        // Revert on error
        await load()
        throw new Error(response.data.message || "Deactivation failed")
      }
    } catch (err: any) {
      // Revert on error
      await load()
      const msg = err?.response?.data?.message || err?.message || "Failed to deactivate card bin"
      setError(msg)
    }
  }, [load])

  const handleEditRow = useCallback((row: TokenBinRecord) => {
    setMode("edit")
    setEditingCode(row.tokenBin)

    setTokenBin(row.tokenBin || "")
    setCardAssociation(row.cardAssociation || "")
    setBankCode(row.bankCode || "")
    setBinSize(row.binSize || "")

    const normalized = row.status === "active" ? "ACT" : "DEACT"
    setStatus(normalized)
    setOriginalStatus(normalized)

    setFormErr(null)
    setOpen(true)
  }, [])

  const actions: TokenBinRowActions = {
    onEdit: handleEditRow,
    onActivate: handleActivateRow,
    onDeactivate: handleDeactivateRow
  }

  const columns = useMemo(() => createColumns(actions), [actions])

  // ---------- Save (create / edit) ----------
  const handleSave = async () => {
    try {
      setSaving(true)
      setFormErr(null)

      const generatedTraceId = generateTraceId()

      if (!tokenBin?.trim()) {
        setFormErr("Token Bin is required")
        setSaving(false)
        return
      }
      if (!bankCode?.trim()) {
        setFormErr("Bank Code is required")
        setSaving(false)
        return
      }

      const payload = {
        traceId: generatedTraceId,
        tokenBin: tokenBin.trim(),
        cardAssociation: cardAssociation.trim(),
        bankCode: bankCode.trim(),
        binSize: binSize,
      }

      if (mode === "create") {
        // CREATE -> POST /create
        const res = await api.post("/tsp/v1/card-token-bin/create", payload)
        const isOk =
          res?.data?.code === "00" || res?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"
        if (!isOk) {
          setFormErr(res?.data?.message || "Request failed")
          return
        }

        // If creating with ACT status, activate it immediately
        if (status === "ACT") {
          const statusPayload = {
            traceId: generatedTraceId,
            tokenBin: tokenBin.trim(),
            eventId: ""
          }
          const resAct = await api.post("/tsp/v1/card-token-bin/activate-cardTokenBin", statusPayload)
          const okAct =
            resAct?.data?.code === "00" ||
            resAct?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"
          if (!okAct) {
            setFormErr(resAct?.data?.message || "Failed to activate card bin")
            return
          }
        }
      } else if (mode === "edit" && editingCode) {
        // UPDATE -> PUT /update
        const res = await api.put(`/tsp/v1/card-token-bin/update/${editingCode}`, payload)
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
            tokenBin: editingCode,
            eventId: ""
          }

          if (status === "ACT") {
            const resAct = await api.post("/tsp/v1/card-token-bin/activate-cardTokenBin", statusPayload)
            const okAct =
              resAct?.data?.code === "00" ||
              resAct?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"
            if (!okAct) {
              setFormErr(resAct?.data?.message || "Failed to activate card bin")
              return
            }
          } else {
            const resDeact = await api.post("/tsp/v1/card-token-bin/deactivate-cardTokenBin", statusPayload)
            const okDeact =
              resDeact?.data?.code === "00" ||
              resDeact?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"
            if (!okDeact) {
              setFormErr(resDeact?.data?.message || "Failed to deactivate card bin")
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
        (mode === "create" ? "Failed to create Card Bin" : "Failed to update card bin")
      setFormErr(msg)
    } finally {
      setSaving(false)
    }
  }

  // Calculate active/deactive counts for KPI cards
  const activeCount = rows.filter(r => r.status === "active").length
  const deactiveCount = rows.filter(r => r.status === "deactive").length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Card BIN Management</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading…" : `Showing ${total} BIN(s)`}
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total</CardTitle>
            <CardDescription>All BINs</CardDescription>
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
              {loading ? "—" : activeCount}
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
              {loading ? "—" : deactiveCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add / Edit Dialog */}
      <div className="flex justify-end w-full -mt-1 mb-2">
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="sm:ml-auto" onClick={handleAddClick}>
              Add New Card Bin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {mode === "create" ? "Add New Card Bin" : `Edit Card Bin ${editingCode}`}
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
                <Label htmlFor="tokenBin">Token Bin</Label>
                <Input
                  id="tokenBin"
                  placeholder=""
                  value={tokenBin}
                  onChange={(e) => setTokenBin(e.target.value.trim())}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cardAssociation">Card Association</Label>
                <Input
                  id="cardAssociation"
                  placeholder=""
                  value={cardAssociation}
                  onChange={(e) => setCardAssociation(e.target.value.trim())}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bankCode">Bank Code</Label>
                <Input
                  id="bankCode"
                  placeholder=""
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value.trim())}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="binSize">Bin Size</Label>
                <Input
                  id="binSize"
                  type="number"
                  placeholder=""
                  value={binSize}
                  onChange={(e) => setBinSize(e.target.value)}
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

      {/* Table */}
      <div className="rounded-md border min-h-[120px]">
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">Loading card token bins</div>
        ) : rows.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">No card token bins found.</div>
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
        onPageSizeChange={(s: number) => { setPageSize(s); setPage(1) }}
      />
    </div>
  )
}