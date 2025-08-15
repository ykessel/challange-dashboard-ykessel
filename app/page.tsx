"use client"

import { Suspense, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { SummaryCards } from "@/components/summary-cards"
import { TimelineChart } from "@/components/timeline-chart"
import { HistoricalDataTable } from "@/components/historical-data-table"
import type { DateRange } from "@/types/air-quality"

// Default date range for initial load
const defaultDateRange: DateRange = {
  from: new Date(2004, 2, 1), // March 1, 2004
  to: new Date(2004, 4, 1), // May 1, 2004
}

// Client component for the dashboard
export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <DashboardHeader dateRange={dateRange} onDateRangeChange={setDateRange} />

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Summary Cards Section */}
          <section className="space-y-6">
            <Suspense fallback={<div>Loading summary cards...</div>}>
              <SummaryCards dateRange={dateRange} />
            </Suspense>
          </section>

          {/* Chart Section */}
          <section className="space-y-6">
            <Suspense fallback={<div>Loading timeline chart...</div>}>
              <TimelineChart dateRange={dateRange} />
            </Suspense>
          </section>

          {/* Table Section */}
          <section className="space-y-6">
            <Suspense fallback={<div>Loading data table...</div>}>
              <HistoricalDataTable dateRange={dateRange} />
            </Suspense>
          </section>
        </div>
      </main>
    </div>
  )
}
