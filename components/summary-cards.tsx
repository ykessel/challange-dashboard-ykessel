"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Minus, AlertCircle, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ConnectionStatus } from "@/components/connection-status"
import { OPERATORS, VALUES_KEY_LABELS, type DateRange } from "@/types/air-quality"
// import { useSocket } from "@/hooks/use-socket"
import { cn } from "@/lib/utils"

interface SummaryCardsProps {
  dateRange: DateRange
}

interface MetricCardData {
  parameter: string
  value: number
  previousValue?: number
  trend: "up" | "down" | "neutral"
  lastUpdated: Date
}

export function SummaryCards({ dateRange }: SummaryCardsProps) {
  const [operator, setOperator] = useState<OPERATORS>(OPERATORS.AVG)
  const [metrics, setMetrics] = useState<MetricCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedParams, setSelectedParams] = useState<Set<string>>(new Set(["CO", "NO2", "T", "RH", "PT08S1", "NMHC"]))

  // Simulated Socket.io data for development
  // This simulates real-time updates without requiring a WebSocket server
  const [isConnected, setIsConnected] = useState(true)
  const [socketData, setSocketData] = useState<any>(null)
  const [socketError, setSocketError] = useState<string | null>(null)

  // All available parameters to display in cards
  const allParams = Object.keys(VALUES_KEY_LABELS)
  const displayParams = Array.from(selectedParams)

  // Simulate real-time data updates
  const simulateRealTimeUpdates = () => {
    const simulatedData: any = {}
    
    // Generate realistic values for each parameter with natural variations
    allParams.forEach((param) => {
      // Base values for each parameter (realistic ranges based on air quality data)
      const baseValues = {
        CO: 2.5,        // Carbon Monoxide (mg/m³)
        PT08S1: 1360,   // PT08.S1 (CO) (mg/m³)
        NMHC: 150,      // Non-methane hydrocarbons (μg/m³)
        C6H6: 11,       // Benzene (μg/m³)
        PT08S2: 1046,   // PT08.S2 (NMHC) (mg/m³)
        NOx: 147,       // Nitrogen oxides (μg/m³)
        PT08S3: 1056,   // PT08.S3 (NOx) (mg/m³)
        NO2: 57,        // Nitrogen dioxide (μg/m³)
        PT08S4: 1132,   // PT08.S4 (NO2) (mg/m³)
        PT08S5: 1692,   // PT08.S5 (O3) (mg/m³)
        T: 18.5,        // Temperature (°C)
        RH: 49.5,       // Relative Humidity (%)
        AH: 0.75,       // Absolute Humidity (g/m³)
      }
      
      const baseValue = baseValues[param as keyof typeof baseValues] || 100
      
      // Add realistic variations with some trending behavior
      const timeVariation = Math.sin(Date.now() / 10000) * 0.1 // Slow oscillation
      const randomVariation = (Math.random() - 0.5) * 0.15 // Random noise
      const totalVariation = timeVariation + randomVariation
      
      // Ensure values stay within realistic bounds
      let newValue = Math.max(0, baseValue * (1 + totalVariation))
      
      // Special handling for temperature (should vary more naturally)
      if (param === 'T') {
        newValue = Math.max(-10, Math.min(40, newValue)) // Keep between -10°C and 40°C
      }
      
      // Special handling for humidity (should be between 0-100%)
      if (param === 'RH') {
        newValue = Math.max(0, Math.min(100, newValue))
      }
      
      simulatedData[param] = parseFloat(newValue.toFixed(2))
    })
    
    setSocketData(simulatedData)
  }

  const fetchSummaryData = async (selectedOperator: OPERATORS) => {
    try {
      setLoading(true)
      setError(null)

      const fromDate = dateRange.from.toISOString().split("T")[0]
      const toDate = dateRange.to.toISOString().split("T")[0]

      const response = await fetch(
        `/api/air-quality/summary?from=${fromDate}&to=${toDate}&operator=${selectedOperator}`,
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API Error: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()

      // Transform API data to our format
      const newMetrics: MetricCardData[] = displayParams.map((param: string) => {
        let currentValue = data[param] || 0

        if (socketData && socketData[param] !== undefined) {
          currentValue = socketData[param]
        }

        const existingMetric = metrics.find((m) => m.parameter === param)
        const previousValue = existingMetric?.value

        let trend: "up" | "down" | "neutral" = "neutral"
        if (previousValue !== undefined && currentValue !== previousValue) {
          trend = currentValue > previousValue ? "up" : "down"
        }

        return {
          parameter: param,
          value: currentValue,
          previousValue,
          trend,
          lastUpdated: new Date(),
        }
      })

      setMetrics(newMetrics)
    } catch (err) {
      console.error("Error fetching summary data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  // Update metrics when real-time data is received
  const updateMetricsWithRealTimeData = (realTimeData: any) => {
    if (!realTimeData || metrics.length === 0) return

    setMetrics((prevMetrics) =>
      prevMetrics.map((metric) => {
        const newValue = realTimeData[metric.parameter]
        
        if (newValue === undefined) return metric

        let trend: "up" | "down" | "neutral" = "neutral"
        if (newValue !== metric.value) {
          trend = newValue > metric.value ? "up" : "down"
        }

        return {
          ...metric,
          previousValue: metric.value,
          value: newValue,
          trend,
          lastUpdated: new Date(),
        }
      }),
    )
  }

  // Initial data fetch
  useEffect(() => {
    fetchSummaryData(operator)
  }, [dateRange, operator])

  // Simulate real-time updates every 3 seconds
  useEffect(() => {
    // Initial simulation
    simulateRealTimeUpdates()
    
    // Set up interval for continuous updates
    const interval = setInterval(() => {
      simulateRealTimeUpdates()
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (socketData) {
      // Simulated Socket.io data received - update metrics with real-time data
      updateMetricsWithRealTimeData(socketData)
    }
  }, [socketData])

  const handleOperatorChange = (newOperator: string) => {
    const validOperator = newOperator as OPERATORS
    if (Object.values(OPERATORS).includes(validOperator)) {
      setOperator(validOperator)
    } else {
      setError(`Unsupported operator: ${newOperator}`)
    }
  }

  const toggleParameter = (param: string) => {
    setSelectedParams(prev => {
      const newSet = new Set(prev)
      if (newSet.has(param)) {
        // No permitir deseleccionar si solo queda uno
        if (newSet.size > 1) {
          newSet.delete(param)
        }
      } else {
        newSet.add(param)
      }
      return newSet
    })
  }

  const selectAllParameters = () => {
    setSelectedParams(new Set(allParams))
  }

  const selectDefaultParameters = () => {
    setSelectedParams(new Set(["CO", "NO2", "T", "RH", "PT08S1", "NMHC"]))
  }

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTrendColor = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-card-foreground"
    }
  }

  const getParameterColor = (param: string) => {
    const colors = {
      CO: "bg-primary",
      PT08S1: "bg-blue-500",
      NMHC: "bg-green-500",
      C6H6: "bg-purple-500",
      PT08S2: "bg-indigo-500",
      NOx: "bg-orange-500",
      PT08S3: "bg-pink-500",
      NO2: "bg-secondary",
      PT08S4: "bg-teal-500",
      PT08S5: "bg-cyan-500",
      T: "bg-accent",
      RH: "bg-chart-3",
      AH: "bg-yellow-500",
    }
    return colors[param as keyof typeof colors] || "bg-primary"
  }

  if (error && !socketError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">
              Environmental Metrics Summary 
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({selectedParams.size} de {allParams.length} parámetros)
              </span>
            </h2>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              🔄 Simulated real-time data (updates every 3s)
            </p>
          </div>
        <div className="flex items-center gap-2">
            <ConnectionStatus isConnected={isConnected} hasError={!!socketError} />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Parámetros ({selectedParams.size})
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-background/95 backdrop-blur-sm" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={selectDefaultParameters}>
                        Predeterminados
                      </Button>
                      <Button variant="outline" size="sm" onClick={selectAllParameters}>
                        Todos
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {allParams.map((param) => (
                      <div key={param} className="flex items-center space-x-3">
                        <Checkbox
                          id={`error-${param}`}
                          checked={selectedParams.has(param)}
                          onCheckedChange={() => toggleParameter(param)}
                        />
                        <label htmlFor={`error-${param}`} className="text-sm font-normal cursor-pointer text-foreground">
                          {VALUES_KEY_LABELS[param]?.label || param}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Select value={operator} onValueChange={handleOperatorChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={OPERATORS.AVG}>Average</SelectItem>
                <SelectItem value={OPERATORS.MIN}>Minimum</SelectItem>
                <SelectItem value={OPERATORS.MAX}>Maximum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">
            Environmental Metrics Summary
          </h2>
          <p className="text-sm text-muted-foreground">
            {selectedParams.size} de {allParams.length} parámetros seleccionados
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            🔄 Simulated real-time data (updates every 3s)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionStatus isConnected={isConnected} hasError={!!socketError} />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Parámetros ({selectedParams.size})
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-background/95 backdrop-blur-sm" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={selectDefaultParameters}>
                      Predeterminados
                    </Button>
                    <Button variant="outline" size="sm" onClick={selectAllParameters}>
                      Todos
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {allParams.map((param) => (
                    <div key={param} className="flex items-center space-x-3">
                      <Checkbox
                        id={param}
                        checked={selectedParams.has(param)}
                        onCheckedChange={() => toggleParameter(param)}
                      />
                      <label htmlFor={param} className="text-sm font-normal cursor-pointer text-foreground">
                        {VALUES_KEY_LABELS[param]?.label || param}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Select value={operator} onValueChange={handleOperatorChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={OPERATORS.AVG}>Average</SelectItem>
              <SelectItem value={OPERATORS.MIN}>Minimum</SelectItem>
              <SelectItem value={OPERATORS.MAX}>Maximum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {displayParams.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          <p>Selecciona al menos un parámetro para ver los datos</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {displayParams.map((param: string) => {
          const metric = metrics.find((m) => m.parameter === param)
          const label = VALUES_KEY_LABELS[param]?.label || param

          return (
            <Card key={param} className="relative overflow-hidden card-hover border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300",
                    `${getParameterColor(param)}/10`,
                  )}
                >
                  <div
                    className={cn("h-4 w-4 rounded-full transition-all duration-300", getParameterColor(param))}
                  ></div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p
                      className={cn(
                        "text-lg sm:text-xl lg:text-2xl font-bold transition-all duration-500",
                        loading ? "text-muted-foreground" : getTrendColor(metric?.trend || "neutral"),
                      )}
                    >
                      {loading ? "--" : metric?.value?.toFixed(2) || "0.00"}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {operator}
                      </span>
                      {metric?.lastUpdated && (
                        <p className="text-xs text-muted-foreground">{metric.lastUpdated.toLocaleTimeString()}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {!loading && metric && (
                      <div className="transition-all duration-300">{getTrendIcon(metric.trend)}</div>
                    )}
                  </div>
                </div>
              </CardContent>

              {/* Enhanced loading indicator */}
              {loading && (
                <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span className="text-sm">Updating...</span>
                  </div>
                </div>
              )}

              {metric && metric.trend !== "neutral" && !loading && (
                <div
                  className={cn(
                    "absolute top-2 right-2 h-2 w-2 rounded-full animate-pulse",
                    metric.trend === "up" ? "bg-green-500" : "bg-red-500",
                  )}
                />
              )}
            </Card>
          )
        })}
        </div>
      )}

      {socketError && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Simulated WebSocket error: {socketError}. Real-time updates unavailable.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
