import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export const revalidate = 600 // Revalidate every 10 minutes (timeline data changes more frequently)

export async function GET(request: NextRequest, { params }: { params: Promise<{ parameter: string }> }) {
  try {
    const searchParams = request.nextUrl.searchParams
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const interval = searchParams.get("interval")
    const { parameter } = await params

    if (!from || !to || !parameter) {
      return NextResponse.json({ error: "Missing required parameters: parameter, from, to" }, { status: 400 })
    }

    // Build API URL with optional interval parameter
    let apiUrl = `https://api-challenge.dofleini.com/air-quality/timeline/${parameter}?from=${from}&to=${to}`
    if (interval) {
      apiUrl += `&interval=${interval}`
    }

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Cookie": "AWSALB=JGHBe5fSSlnnPkz4uUaEBhMq+1SyTiiP1B5rHV6U6ATjUoMobkDtYGL6P6zz6wWqzC41i3yGM5X3g1ucGh0irNU4S56cXccnxHv+I9ryYZde8esRZlJlc45Ua+sN; AWSALBCORS=JGHBe5fSSlnnPkz4uUaEBhMq+1SyTiiP1B5rHV6U6ATjUoMobkDtYGL6P6zz6wWqzC41i3yGM5X3g1ucGh0irNU4S56cXccnxHv+I9ryYZde8esRZlJlc45Ua+sN; AWSALB=5K9ymwaiwA940cWqKcV72dwh3PQmR2Gelddb73m66dNxTj2txNCE/VwrxJbz6TDROU6cDwFdvoHrhrj9KpUjEV4EXsKLQ8vzo3MM3gT/rQPZXmndebsfpRJ/pfGc; AWSALBCORS=5K9ymwaiwA940cWqKcV72dwh3PQmR2Gelddb73m66dNxTj2txNCE/VwrxJbz6TDROU6cDwFdvoHrhrj9KpUjEV4EXsKLQ8vzo3MM3gT/rQPZXmndebsfpRJ/pfGc",
      },
      next: { revalidate: 600 } // Cache for 10 minutes
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Timeline API Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch timeline data" },
      { status: 500 },
    )
  }
}
