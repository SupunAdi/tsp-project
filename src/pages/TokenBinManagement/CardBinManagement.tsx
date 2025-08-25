import { useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog"
import {Card,CardContent,CardHeader,CardTitle,CardDescription,} from "@/components/ui/card"
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { CreditCard, CheckCircle2, XCircle, Clock } from "lucide-react"
import PaginationBar from "@/components/pagination-bar"
import { usePagination } from "@/hooks/use-pagination"
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal } from "lucide-react"


// ----------------------- Types & Sample Data -----------------------

type TokenBinRecord = {
  id: string
  tokenBin: string
  cardAssociation: "Visa" | "Mastercard" | "Amex" | "Discover" | "JCB" | "UnionPay"
  bankCode: string
  status: "active" | "deactive"
  createdAt: string
  updatedAt: string
  updatedBy: string
}

const NOW = new Date()
const fmt = (d: Date) => new Date(d).toISOString()

const INITIAL_ROWS: TokenBinRecord[] = [
  { id: "1",  tokenBin: "412345", cardAssociation: "Visa",       bankCode: "BNK00123", status: "active",   createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "Alice" },
  { id: "2",  tokenBin: "512345", cardAssociation: "Mastercard", bankCode: "CBA45",    status: "deactive", createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "Bob"   },
  { id: "3",  tokenBin: "622222", cardAssociation: "UnionPay",   bankCode: "UP9988",   status: "active",   createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "Cara"  },
  { id: "4",  tokenBin: "371111", cardAssociation: "Amex",       bankCode: "AMX77",    status: "active",   createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "Dana"  },
  { id: "5",  tokenBin: "601155", cardAssociation: "Discover",   bankCode: "DISC001",  status: "deactive", createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "Evan"  },
  { id: "6",  tokenBin: "352800", cardAssociation: "JCB",        bankCode: "JCB12",    status: "active",   createdAt: fmt(new Date(+NOW - 9e7)), updatedAt: fmt(new Date(+NOW - 5e7)), updatedBy: "Alex" },
  { id: "7",  tokenBin: "455667", cardAssociation: "Visa",       bankCode: "V45",      status: "active",   createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "Mia"   },
  { id: "8",  tokenBin: "545454", cardAssociation: "Mastercard", bankCode: "MC0099",   status: "deactive", createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "Noah"  },
  { id: "9",  tokenBin: "378282", cardAssociation: "Amex",       bankCode: "AM3X",     status: "active",   createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "Ivy"   },
  { id: "10", tokenBin: "601100", cardAssociation: "Discover",   bankCode: "D1",       status: "active",   createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "Omar"  },
  { id: "11", tokenBin: "353011", cardAssociation: "JCB",        bankCode: "JCB0007",  status: "deactive", createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "Rae"   },
  { id: "12", tokenBin: "400000", cardAssociation: "Visa",       bankCode: "BANKX",    status: "active",   createdAt: fmt(NOW), updatedAt: fmt(NOW), updatedBy: "Leo"   },
]

// dropdown options
const CARD_ASSOCIATIONS: TokenBinRecord["cardAssociation"][] = [
  "Visa", "Mastercard", "Amex", "Discover", "JCB", "UnionPay",
]
const BANK_CODES = [
  "BNK00123", "CBA45", "UP9988", "AMX77", "DISC001", "JCB12",
  "V45", "MC0099", "AM3X", "D1", "JCB0007", "BANKX",
]

// ----------------------- Component -----------------------

export default function CardBinManagement() {
  const [rows, setRows] = useState<TokenBinRecord[]>(INITIAL_ROWS)

  // dialog (add-new) state
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<{
    bin: string
    cardAssociation: TokenBinRecord["cardAssociation"]
    bankCode: string
  }>({
    bin: "",
    cardAssociation: CARD_ASSOCIATIONS[0],
    bankCode: BANK_CODES[0],
  })

  const binSize = form.bin.replace(/\D/g, "").length

  //
    //sorting
  // type SortKey = "tokenBin" | "association" | "bankCode" |  "createdAt" | "updatedAt" | "updatedBy"
  type SortKey = "tokenBin" | "cardAssociation" | "bankCode" | "status" |  "createdAt" | "updatedAt" | "updatedBy"

  type SortState = { key: SortKey; dir: "asc" | "desc" } | null
  const [sort, setSort] = useState<SortState>(null)
  const iconFor = (active: boolean, dir?: "asc" | "desc") =>
    !active ? <ArrowUpDown className="ml-2 h-4 w-4" /> : dir === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
  const toggleHeaderSort = (key: SortKey) =>
    setSort((prev) => (prev?.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }))

  const sortedRows = useMemo(() => {
    if (!sort) return rows
    const arr = [...rows]
    const dir = sort.dir === "asc" ? 1 : -1
    arr.sort((a, b) => {
      switch (sort.key) {
        case "tokenBin": return a.tokenBin.localeCompare(b.tokenBin) * dir
        case "cardAssociation": return a.cardAssociation.localeCompare(b.cardAssociation) * dir
        case "bankCode": return a.bankCode.localeCompare(b.bankCode) * dir
        case "status": return a.status.localeCompare(b.status) * dir
        case "updatedBy": return a.updatedBy.localeCompare(b.updatedBy) * dir
        case "createdAt": return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir
        case "updatedAt": return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * dir
      }
    })
    return arr
  }, [rows, sort])
  //

  // pagination
  const { page, setPage, pageSize, setPageSize, pageCount, range } = usePagination(sortedRows.length, 5)
  const startIdx = (page - 1) * pageSize
  const endIdx = startIdx + pageSize
  const currentRows = useMemo(() => sortedRows.slice(startIdx, endIdx), [sortedRows, startIdx, endIdx])

  const toggleStatus = (id: string) =>
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: r.status === "active" ? "deactive" : "active",
              updatedAt: new Date().toISOString(),
              updatedBy: "Demo User",
            }
          : r
      )
    )

  const handleSave = () => {
    // stub for future backend connect
    console.log("Saving (stub):", {
      tokenBin: form.bin.replace(/\D/g, ""),
      cardAssociation: form.cardAssociation,
      bankCode: form.bankCode,
      binSize,
    })
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Total BINs
            </CardTitle>
            <CardDescription>All configured BINs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">—</div>
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

      {/* Add New button (right-aligned, under cards) */}
      <div className="flex justify-end w-full -mt-1 mb-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="sm:ml-auto">Add New Card Bin</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Card BIN</DialogTitle>
              <DialogDescription>Fill details and click Save. .</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              {/* BIN number */}
              <div className="grid gap-2">
                <Label htmlFor="bin">BIN Number</Label>
                <Input
                  id="bin"
                  inputMode="numeric"
                  placeholder="Enter digits only"
                  value={form.bin}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bin: e.target.value.replace(/\D/g, "") }))
                  }
                />
              </div>

              {/* Card Association */}
              <div className="grid gap-2">
                <Label>Card Association</Label>
                <Select
                  value={form.cardAssociation}
                  onValueChange={(val) =>
                    setForm((f) => ({ ...f, cardAssociation: val as TokenBinRecord["cardAssociation"] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {CARD_ASSOCIATIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* BIN Size (auto) */}
              <div className="grid gap-2">
                <Label htmlFor="binsize">BIN Size</Label>
                <Input id="binsize" value={binSize} readOnly />
              </div>

              {/* Bank Code */}
              <div className="grid gap-2">
                <Label>Bank Code</Label>
                <Select
                  value={form.bankCode}
                  onValueChange={(val) => setForm((f) => ({ ...f, bankCode: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {BANK_CODES.map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-[1100px]">
        <Table>
          <TableHeader>
            <TableRow className="[&>th]:text-center">
              <TableHead>
                <Button variant="ghost" onClick={() => toggleHeaderSort("tokenBin")} className="mx-auto">
                  Token BIN {iconFor(sort?.key === "tokenBin", sort?.dir)}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleHeaderSort("cardAssociation")} className="mx-auto">
                  Card Association {iconFor(sort?.key === "cardAssociation", sort?.dir)}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleHeaderSort("bankCode")} className="mx-auto">
                  Bank Code {iconFor(sort?.key === "bankCode", sort?.dir)}
                </Button>
              </TableHead>
              <TableHead>BIN Size</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleHeaderSort("status")} className="mx-auto">
                  Status {iconFor(sort?.key === "status", sort?.dir)}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleHeaderSort("createdAt")} className="mx-auto">
                  Create time {iconFor(sort?.key === "createdAt", sort?.dir)}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleHeaderSort("updatedAt")} className="mx-auto">
                  Update time {iconFor(sort?.key === "updatedAt", sort?.dir)}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleHeaderSort("updatedBy")} className="mx-auto">
                  Last update user {iconFor(sort?.key === "updatedBy", sort?.dir)}
                </Button>
              </TableHead>
              <TableHead className="w-[140px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.tokenBin}</TableCell>
                <TableCell>{r.cardAssociation}</TableCell>
                <TableCell className="tabular-nums">{r.bankCode}</TableCell>
                <TableCell>{r.bankCode.length}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={r.status === "active" ? "default" : "secondary"}>
                    {r.status === "active" ? "Active" : "Deactive"}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(r.updatedAt).toLocaleString()}</TableCell>
                <TableCell>{r.updatedBy}</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>

                      <DropdownMenuItem onClick={() => toggleStatus(r.id)}>
                        {r.status === "active" ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => alert(`Editing BIN ${r.tokenBin}`)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => alert(`Deleting BIN ${r.tokenBin}`)}>
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => alert(`Viewing BIN ${r.tokenBin}`)}>
                        View
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
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
