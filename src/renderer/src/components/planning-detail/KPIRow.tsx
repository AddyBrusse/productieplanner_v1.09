import { Card } from "@/components/ui/card"

export function KPIRow() {
  const kpis = [
    {
      label: "Total Jobs",
      value: "12",
      description: "Production jobs",
    },
    {
      label: "On Time",
      value: "9",
      description: "Jobs on schedule",
    },
    {
      label: "Delayed",
      value: "3",
      description: "Jobs behind schedule",
    },
    {
      label: "Machines Running",
      value: "5",
      description: "Active machines",
    },
  ]

  return (
    <div className="flex gap-6">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="p-3 w-40">
          <div className="text-xs font-medium text-muted-foreground uppercase">{kpi.label}</div>
          <div className="text-2xl font-bold mt-1">{kpi.value}</div>
          <div className="text-xs text-muted-foreground mt-1">{kpi.description}</div>
        </Card>
      ))}
    </div>
  )
}
