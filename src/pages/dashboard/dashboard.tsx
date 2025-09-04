import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {CreditCard, User2,  Server, ShieldCheck, Activity, ArrowUpRight, ArrowDownRight, Clock, FileChartColumn, RefreshCw, Users, Shield, Settings2,
} from "lucide-react"

// Dummy Data 
type TokenBin = {
  id: string
  cardAssociation: string
  bin: string
  status:  "Active" | "Deactive" 
  date: string
}

type ProfileUser = {
  id: string
  name: string
  email: string
  role: "Admin" | "Manager" | "Operator" | "Auditor"
  status: "Active" | "Suspended"
  lastLogin: string
}

type Instance = {
  id: string
  name: string
  region: string
  version: string
  status: "Healthy" | "Degraded" | "Down"
  uptimePct: number
}

type TokenSummary = {
  label: string
  value: number
  change: number // +/- % change (dummy)
}

type ReportItem = {
  id: string
  title: string
  period: string
  owner: string
  status: "Generated" | "Scheduled" | "Draft"
}

const tokenBins: TokenBin[] = [
  { id: "TB-1001", cardAssociation: "Visa", bin: "412345",  status: "Active",   date: "2025-08-28 14:10" },
  { id: "TB-1002", cardAssociation: "Master", bin: "545454",  status: "Active",date: "2025-08-29 09:23" },
  { id: "TB-1003", cardAssociation: "Visa",   bin: "371111",  status: "Active",   date: "2025-08-30 18:41" },
  { id: "TB-1004", cardAssociation: "Master",   bin: "601100",  status: "Deactive", date: "2025-08-30 21:05" },
  { id: "TB-1005", cardAssociation: "Visa",   bin: "353011",  status: "Active",   date: "2025-08-31 11:37" },
]

const profileUsers: ProfileUser[] = [
  { id: "U-01", name: "Alice Martin",  email: "alice@demo.io",  role: "Admin",   status: "Active",    lastLogin: "2025-09-01 08:12" },
  { id: "U-02", name: "Jason Clark",   email: "jason@demo.io",  role: "Manager", status: "Active",    lastLogin: "2025-09-01 10:02" },
  { id: "U-03", name: "Mina Perera",   email: "mina@demo.io",   role: "Operator",status: "Suspended", lastLogin: "2025-08-29 16:55" },
  { id: "U-04", name: "Rae Thompson",  email: "rae@demo.io",    role: "Auditor", status: "Active",    lastLogin: "2025-08-30 19:04" },
]

const instances: Instance[] = [
  { id: "inst-ap-s1", name: "token-core-ap", region: "ap-south-1", version: "v2.3.1", status: "Healthy",  uptimePct: 99.98 },
  { id: "inst-eu-c1", name: "token-core-eu", region: "eu-central-1", version: "v2.3.1", status: "Degraded", uptimePct: 97.42 },
  { id: "inst-us-e1", name: "token-core-us", region: "us-east-1", version: "v2.3.1", status: "Healthy",  uptimePct: 99.95 },
  { id: "inst-backup", name: "reporting-batch", region: "ap-south-1", version: "v1.9.0", status: "Down", uptimePct: 92.12 },
]

const tokenOverview: TokenSummary[] = [
  { label: "Total Tokens", value: 128_540, change: +3.2 },
  { label: "Active Tokens", value: 96_230, change: +1.1 },
  { label: "Suspended", value: 1_420, change: -0.6 },
  { label: "BINs Configured", value: 126, change: +0.8 },
]

const reports: ReportItem[] = [
  { id: "RPT-01", title: "Daily Settlement Summary", period: "2025-08-31", owner: "Alice", status: "Generated" },
  { id: "RPT-02", title: "Token BIN Usage (Weekly)", period: "W35 (Aug 25–31)", owner: "Jason", status: "Scheduled" },
  { id: "RPT-03", title: "System Health Snapshot", period: "2025-08", owner: "Rae", status: "Draft" },
  { id: "RPT-04", title: "Compliance Audit Extract", period: "Q3 (Jul–Sep)", owner: "Alice", status: "Generated" },
]

// Small helpers
function Trend({ value }: { value: number }) {
  const up = value >= 0
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span className={`inline-flex items-center gap-1 text-sm ${up ? "text-emerald-600" : "text-rose-600"}`}>
      <Icon className="h-4 w-4" /> {Math.abs(value).toFixed(1)}%
    </span>
  )
}

function StatusBadge({
  v,
  map,
}: {
  v: string
  map: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }>
}) {
  const m = map[v] ?? { label: v, variant: "outline" as const }
  return <Badge variant={m.variant}>{m.label}</Badge>
}

export default function Dashboard() {
  // Derived figures (dummy math)
 
  const activeUsers = profileUsers.filter(u => u.status === "Active").length
  const healthyInstances = instances.filter(i => i.status === "Healthy").length
  const degradedInstances = instances.filter(i => i.status === "Degraded").length
  const downInstances = instances.filter(i => i.status === "Down").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Search anything…" className="w-[220px] hidden sm:block" />
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Token Bin
            </CardTitle>
            <CardDescription>Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">2840</div>
            <div className="mt-1 text-xs text-muted-foreground"> total Account bins</div>
            <div className="text-2xl font-semibold">1564</div>
            <div className="mt-1 text-xs text-muted-foreground"> total card bins</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Users
            </CardTitle>
            <CardDescription>Profile Management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{activeUsers}</div>
            <div className="mt-1 text-xs text-muted-foreground">of {profileUsers.length} total</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="h-4 w-4" />
              Instances
            </CardTitle>
            <CardDescription>Healthy / Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{healthyInstances} / {instances.length}</div>
            <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
              <Badge variant="secondary">Degraded {degradedInstances}</Badge>
              <Badge variant="destructive">Down {downInstances}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Tokens
            </CardTitle>
            <CardDescription>Active / Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {tokenOverview[1].value.toLocaleString()} / {tokenOverview[0].value.toLocaleString()}
            </div>
            <div className="mt-1"><Trend value={tokenOverview[0].change} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileChartColumn className="h-4 w-4" />
              Reports
            </CardTitle>
            <CardDescription>Generated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{reports.filter(r => r.status === "Generated").length}</div>
            <div className="mt-1 text-xs text-muted-foreground">of {reports.length} total</div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Sections */}
      <Tabs defaultValue="token-bins" className="w-full">
          <TabsList className="grid w-full gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-transparent p-0 h-auto">
          <TabsTrigger value="token-bins">Token Bin Management</TabsTrigger>
          <TabsTrigger value="profiles">Profile Management</TabsTrigger>
          <TabsTrigger value="instances">Instance Management</TabsTrigger>
          <TabsTrigger value="tokens">Token Management</TabsTrigger>
        </TabsList>

        {/* 1) Token Bin Management */}
        <TabsContent value="token-bins" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Recent Token Bins
                </CardTitle>
                <CardDescription>Dummy data </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-muted-foreground">
                      <tr className="border-b">
                        <th className="py-2 pr-4">ID</th>
                        <th className="py-2 pr-4">Merchant</th>
                        <th className="py-2 pr-4">BIN</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokenBins.map(b => (
                        <tr key={b.id} className="border-b last:border-none">
                          <td className="py-2 pr-4 font-medium">{b.id}</td>
                          <td className="py-2 pr-4">{b.cardAssociation}</td>
                          <td className="py-2 pr-4 tabular-nums">{b.bin}</td>
                          <td className="py-2 pr-4">
                            <StatusBadge
                              v={b.status}
                              map={{
                                Active: { label: "Active", variant: "default" },                              
                                Deactive: { label: "Deactive", variant: "destructive" },
                              }}
                            />
                          </td>
                          <td className="py-2">{b.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" /> Bins Snapshot
                </CardTitle>
                <CardDescription>Last 5 items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Active</span>
                  </div>
                  <Progress value={70} />
                </div>                
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Deactive</span>
                  </div>
                  <Progress value={10} />
                </div>
                <div className="pt-1 text-xs text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Updated a moment ago
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2) Profile Management */}
        <TabsContent value="profiles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><User2 className="h-4 w-4" /> User Roles</CardTitle>
                <CardDescription>Distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Admin","Manager","Operator","Auditor"].map(role => {
                  const count = profileUsers.filter(u => u.role === role).length
                  const pct = Math.round((count / profileUsers.length) * 100)
                  return (
                    <div key={role}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{role}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                      <Progress value={pct} />
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Users</CardTitle>
                <CardDescription>Dummy list </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-muted-foreground">
                      <tr className="border-b">
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2 pr-4">Role</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2">Last Login</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profileUsers.map(u => (
                        <tr key={u.id} className="border-b last:border-none">
                          <td className="py-2 pr-4 font-medium">{u.name}</td>
                          <td className="py-2 pr-4">{u.email}</td>
                          <td className="py-2 pr-4">{u.role}</td>
                          <td className="py-2 pr-4">
                            <StatusBadge
                              v={u.status}
                              map={{
                                Active: { label: "Active", variant: "default" },
                                Suspended: { label: "Suspended", variant: "destructive" },
                              }}
                            />
                          </td>
                          <td className="py-2">{u.lastLogin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 3) Instance Management */}
        {/* <TabsContent value="instances" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Server className="h-4 w-4" /> Instances</CardTitle>
                <CardDescription>Health & Uptime</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-3">
                {instances.map(i => (
                  <div key={i.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{i.name}</div>
                      <StatusBadge
                        v={i.status}
                        map={{
                          Healthy: { label: "Healthy", variant: "default" },
                          Degraded: { label: "Degraded", variant: "secondary" },
                          Down: { label: "Down", variant: "destructive" },
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{i.region} • {i.version}</div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Uptime</span>
                        <span className="font-medium">{i.uptimePct.toFixed(2)}%</span>
                      </div>
                      <Progress value={i.uptimePct} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Database className="h-4 w-4" /> Capacity</CardTitle>
                <CardDescription>Dummy allocation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>CPU</span><span className="font-medium">62%</span>
                  </div>
                  <Progress value={62} />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Memory</span><span className="font-medium">74%</span>
                  </div>
                  <Progress value={74} />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Storage</span><span className="font-medium">48%</span>
                  </div>
                  <Progress value={48} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}

        {/* 4) Token Management */}
        <TabsContent value="tokens" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" /> Overview</CardTitle>
                <CardDescription>Counts & Trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {tokenOverview.map((t, idx) => (
                  <div key={idx} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{t.label}</div>
                      <Trend value={t.change} />
                    </div>
                    <div className="text-2xl font-semibold mt-1">{t.value.toLocaleString()}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Settings2 className="h-4 w-4" /> BIN Activity</CardTitle>
                <CardDescription>Recent (dummy)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-muted-foreground">
                      <tr className="border-b">
                        <th className="py-2 pr-4">BIN</th>
                        <th className="py-2 pr-4">Assoc.</th>
                        <th className="py-2 pr-4">New Tokens</th>
                        <th className="py-2 pr-4">Suspended</th>
                        <th className="py-2 pr-4">Revoked</th>
                        <th className="py-2">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { bin: "412345", assoc: "Visa", newT: 420, sus: 12, rev: 4, tr: +2.1 },
                        { bin: "545454", assoc: "Mastercard", newT: 380, sus: 9, rev: 6, tr: -1.2 },
                        { bin: "371111", assoc: "Amex", newT: 155, sus: 2, rev: 1, tr: +0.8 },
                        { bin: "601100", assoc: "Discover", newT: 210, sus: 5, rev: 3, tr: +1.5 },
                        { bin: "353011", assoc: "JCB", newT: 96, sus: 1, rev: 0, tr: +0.2 },
                      ].map((r, i) => (
                        <tr key={i} className="border-b last:border-none">
                          <td className="py-2 pr-4 font-medium">{r.bin}</td>
                          <td className="py-2 pr-4">{r.assoc}</td>
                          <td className="py-2 pr-4 tabular-nums">{r.newT}</td>
                          <td className="py-2 pr-4 tabular-nums">{r.sus}</td>
                          <td className="py-2 pr-4 tabular-nums">{r.rev}</td>
                          <td className="py-2">
                            <Trend value={r.tr} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
