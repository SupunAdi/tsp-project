import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import PaginationBar from "@/components/pagination-bar"
import { usePagination } from "@/hooks/use-pagination"
import {
  createColumns, INITIAL_ROWS, type AuditLogRecord, USER_ROLES, PAGES, TASKS, USERS
} from "./columns"
import { Search } from "lucide-react"
import { startOfDay, endOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/date-range"

import {
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function Report() {
  const [rows] = useState<AuditLogRecord[]>(INITIAL_ROWS)

  const [filters, setFilters] = useState({
    userRole: "", description: "", userName: "", remarks: "",
    page: "", task: "", ip: "", quick: "",
  })
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const filtered = useMemo(() => {
    const inRange = (iso: string) => {
      if (!dateRange?.from && !dateRange?.to) return true
      const t = new Date(iso).getTime()
      const from = dateRange?.from ? startOfDay(dateRange.from).getTime() : -Infinity
      const to   = dateRange?.to   ?   endOfDay(dateRange.to).getTime()   :  Infinity
      return t >= from && t <= to
    }
    const q = filters.quick.toLowerCase().trim()

    return rows.filter((r) => {
      const roleOk = !filters.userRole || r.userRole === filters.userRole
      const nameOk = !filters.userName || r.userName === filters.userName
      const pageOk = !filters.page || r.page === filters.page
      const taskOk = !filters.task || r.task === filters.task
      const descOk = !filters.description || r.description.toLowerCase().includes(filters.description.toLowerCase())
      const remOk  = !filters.remarks || (r.remarks ?? "").toLowerCase().includes(filters.remarks.toLowerCase())
      const dateOk = inRange(r.createdAt)

      const quickOk = !q || [
        r.userRole, r.description, r.page, r.task, r.userName,
        new Date(r.createdAt).toLocaleString(),
      ].join(" ").toLowerCase().includes(q)

      return roleOk && nameOk && pageOk && taskOk && descOk && remOk && dateOk && quickOk
    })
  }, [rows, filters, dateRange])

  const { page, setPage, pageSize, setPageSize, pageCount, range } =
    usePagination(filtered.length, 5)
  const startIdx = (page - 1) * pageSize
  const endIdx = startIdx + pageSize
  const currentRows = useMemo(() => filtered.slice(startIdx, endIdx), [filtered, startIdx, endIdx])

  // Dialog state
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<AuditLogRecord | null>(null)

  // Extra (dummy) editable fields
  const [extraRemarks, setExtraRemarks] = useState("")
  const [resolution, setResolution] = useState<"Approve" | "Investigate" | "Ignore" | "Escalate">("Investigate")
  const [internalNote, setInternalNote] = useState("")

  const openDialogFor = (row: AuditLogRecord) => {
    setSelected(row)
    setExtraRemarks(row.remarks ?? "")
    setResolution("Investigate")
    setInternalNote("")
    setOpen(true)
  }

  const columns = useMemo(() => createColumns(openDialogFor), [])

  const onSearchClick = () => setPage(1)
  const onClear = () => {
    setFilters({ userRole:"", description:"", userName:"", remarks:"", page:"", task:"", ip:"", quick:"" })
    setDateRange(undefined)
    setPage(1)
  }

  const saveDialog = () => {
    console.log("Saving review:", {
      id: selected?.id,
      extraRemarks,
      resolution,
      internalNote,
    })
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Reporting</h1>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium">
            Audit Traces{" "}
            <span className="ml-2 rounded-full bg-muted px-2 py-[2px] text-xs">{filtered.length}</span>
          </div>
          <Input
            placeholder="Search"
            value={filters.quick}
            onChange={(e) => setFilters((f) => ({ ...f, quick: e.target.value }))}
            className="w-[280px]"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <Label className="sr-only">Select User Role</Label>
            <Select value={filters.userRole} onValueChange={(v) => setFilters((f) => ({ ...f, userRole: v }))}>
              <SelectTrigger><SelectValue placeholder="Select User Role" /></SelectTrigger>
              <SelectContent>{USER_ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <Input
            placeholder="Enter Description"
            value={filters.description}
            onChange={(e) => setFilters((f) => ({ ...f, description: e.target.value }))}
          />

          <div>
            <Select value={filters.userName} onValueChange={(v) => setFilters((f) => ({ ...f, userName: v }))}>
              <SelectTrigger><SelectValue placeholder="Select User Name" /></SelectTrigger>
              <SelectContent>{USERS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <Input
            placeholder="Enter Remarks"
            value={filters.remarks}
            onChange={(e) => setFilters((f) => ({ ...f, remarks: e.target.value }))}
          />

          <div>
            <Select value={filters.page} onValueChange={(v) => setFilters((f) => ({ ...f, page: v }))}>
              <SelectTrigger><SelectValue placeholder="Select Page" /></SelectTrigger>
              <SelectContent>{PAGES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div>
            <Select value={filters.task} onValueChange={(v) => setFilters((f) => ({ ...f, task: v }))}>
              <SelectTrigger><SelectValue placeholder="Select Task" /></SelectTrigger>
              <SelectContent>{TASKS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="md:col-span-1 lg:col-span-2">
            <DateRangePicker
              value={dateRange}
              onChange={(r) => { setDateRange(r); setPage(1) }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button onClick={onSearchClick} className="gap-2">
            <Search className="h-4 w-4" /> Search
          </Button>
          <Button variant="outline" onClick={onClear}>Clear</Button>
        </div>
      </Card>

      <div className="rounded-md border">
        <DataTable columns={columns} data={currentRows} />
      </div>

      <PaginationBar
        total={filtered.length}
        page={page}
        pageSize={pageSize}
        pageCount={pageCount}
        start={range.start}
        end={range.end}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-[95vw] sm:max-w-2xl lg:max-w-3xl p-0 overflow-hidden"
          onOpenAutoFocus={(e) => e.preventDefault()} // don't auto-focus close button
        >
          <form
            className="flex h-full max-h-[85vh] flex-col"
            onSubmit={(e) => { e.preventDefault(); saveDialog(); }}
          >
            <DialogHeader className="px-6 pt-6 pb-4 sticky top-0 bg-background z-10">
              <DialogTitle>Audit Trace #{selected?.id}</DialogTitle>
              <DialogDescription>Review the activity and add your notes.</DialogDescription>
            </DialogHeader>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
              {selected && (
                <>
                  {/* read-only row fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>User Role</Label>
                      <Input value={selected.userRole} readOnly />
                    </div>
                    <div>
                      <Label>User Name</Label>
                      <Input value={selected.userName} readOnly />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <Input value={selected.description} readOnly />
                    </div>
                    <div>
                      <Label>Page</Label>
                      <Input value={selected.page} readOnly />
                    </div>
                    <div>
                      <Label>Task</Label>
                      <Input value={selected.task} readOnly />
                    </div>
                    <div>
                      <Label>Created Time</Label>
                      <Input value={new Date(selected.createdAt).toLocaleString()} readOnly />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Input value={selected.status ?? "Success"} readOnly />
                    </div>
                  </div>

                  {/* extra inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <Label>Remarks (user-visible)</Label>
                      <Textarea
                        placeholder="Enter remarks shown in reports..."
                        value={extraRemarks}
                        onChange={(e) => setExtraRemarks(e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Resolution</Label>
                      <Select value={resolution} onValueChange={(v) => setResolution(v as any)}>
                        <SelectTrigger><SelectValue placeholder="Select resolution" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Approve">Approve</SelectItem>
                          <SelectItem value="Investigate">Investigate</SelectItem>
                          <SelectItem value="Ignore">Ignore</SelectItem>
                          <SelectItem value="Escalate">Escalate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Label>Internal Note</Label>
                      <Textarea
                        placeholder="Internal note..."
                        value={internalNote}
                        onChange={(e) => setInternalNote(e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sticky footer */}
            <div className="sticky bottom-0 bg-background border-t px-6 py-3 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Close</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
