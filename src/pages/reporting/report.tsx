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
// import type { DataRangePicker } from "@/components/date-range"
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
        r.userRole, r.description, r.page, r.task,  r.userName,
         new Date(r.createdAt).toLocaleString(),
      ].join(" ").toLowerCase().includes(q)

      return roleOk && nameOk && pageOk && taskOk &&  descOk && remOk && dateOk && quickOk
    })
  }, [rows, filters, dateRange]) // <-- include dateRange

  const { page, setPage, pageSize, setPageSize, pageCount, range } =
    usePagination(filtered.length, 5)
  const startIdx = (page - 1) * pageSize
  const endIdx = startIdx + pageSize
  const currentRows = useMemo(() => filtered.slice(startIdx, endIdx), [filtered, startIdx, endIdx])

  const columns = useMemo(() => createColumns(), [])

  const onSearchClick = () => setPage(1)
  const onClear = () => {
    setFilters({ userRole:"", description:"", userName:"", remarks:"", page:"", task:"", ip:"", quick:"" })
    setDateRange(undefined)
    setPage(1)
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

          <Input
            placeholder="Enter IP"
            value={filters.ip}
            onChange={(e) => setFilters((f) => ({ ...f, ip: e.target.value }))}
          />

          {/* Date range picker */}
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
    </div>
  )
}
