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
  const [saving, setSaving] = useState(false)
  const [formErr, setFormErr] = useState<string | null>(null)

  const [mode, setMode] = useState<Mode>("create")
  const [editingCode, setEditingCode] = useState<string | null>(null)

  const [traceId, setTraceId] = useState("")
  const [tokenBin, setTokenBin] = useState("")
  const [bankCode, setBankCode] = useState("")
  const [binSize, setBinSize] = useState("")

  const [status, setStatus] = useState<"ACT" | "DEACT">("DEACT")
  const [originalStatus, setOriginalStatus] = useState<"ACT" | "DEACT">("DEACT")


  const resetForm = () => {
    setTraceId("")
    setTokenBin("")
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


      const payload = {
        traceId: traceId.trim(),
        tokenBin: tokenBin.trim(),
        bankCode: bankCode.trim(),
        binSize: binSize.trim(),
      }

      // if (mode === "create") {
      //   // CREATE -> POST /generate
      //   const res = await api.post("/tsp/v1/account-token-bin/create", payload)
      //   const isOk =
      //     res?.data?.code === "00" || res?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"
      //   if (!isOk) {
      //     setFormErr(res?.data?.message || "Request failed")
      //     return
      //   }
      // } 
      // else if (mode === "edit" && editingCode) {
      //   // UPDATE -> PUT /update-profile/{code}
      //   const res = await api.put(`/tsp/v1/profile/update-profile/${editingCode}`, payload)
      //   const isOk =
      //     res?.data?.code === "00" || res?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"
      //   if (!isOk) {
      //     setFormErr(res?.data?.message || "Update failed")
      //     return
      //   }

        // If status changed, call activate/deactivate
        // if (status !== originalStatus) {
        //   const statusPayload = {
        //     traceId: traceId.trim(),
        //     profileId: editingCode,
        //     eventId: null,
        //   }

        //   if (status === "ACT") {
        //     const resAct = await api.post("/tsp/v1/profile/activate-profile", statusPayload)
        //     const okAct =
        //       resAct?.data?.code === "00" ||
        //       resAct?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"
        //     if (!okAct) {
        //       setFormErr(resAct?.data?.message || "Failed to activate profile")
        //       return
        //     }
        //   } else {
        //     const resDeact = await api.post("/tsp/v1/profile/deactivate-profile", statusPayload)
        //     const okDeact =
        //       resDeact?.data?.code === "00" ||
        //       resDeact?.data?.code === "TSP_REQUEST_PROCESS_SUCCESS"
        //     if (!okDeact) {
        //       setFormErr(resDeact?.data?.message || "Failed to deactivate profile")
        //       return
        //     }
        //   }
        // }
      // }

      setOpen(false)
      await load()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        (mode === "create" ? "Failed to create Account Bin" : "Failed to update account bin")
      setFormErr(msg)
    } finally {
      setSaving(false)
    }
  }

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
         <Dialog open={open} onOpenChange={handleOpenChange}>
         <DialogTrigger asChild>
            <Button className="sm:ml-auto" onClick={handleAddClick}>
              Add New Card Bin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {mode === "create" ? "Add New Account Bin" : `Edit Account Bin ${editingCode}`}
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
                <Label htmlFor="tokenBin">Token Bin</Label>
                <Input
                  id="tokenBin"
                  placeholder=""
                  value={tokenBin}
                  onChange={(e) => setTokenBin(e.target.value.trim())}
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
                  placeholder=""
                  value={binSize}
                  onChange={(e) => setBinSize(e.target.value.trim())}
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









