import { type NextRequest, NextResponse } from "next/server"

export const revalidate = 300 // Revalidate every 5 minutes

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const operator = searchParams.get("operator")

    if (!from || !to || !operator) {
      return NextResponse.json({ error: "Missing required parameters: from, to, operator" }, { status: 400 })
    }

    const apiUrl = `https://api-challenge.dofleini.com/air-quality/summary?from=${from}&to=${to}&operator=${operator}`

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Cookie": "AWSALB=JGHBe5fSSlnnPkz4uUaEBhMq+1SyTiiP1B5rHV6U6ATjUoMobkDtYGL6P6zz6wWqzC41i3yGM5X3g1ucGh0irNU4S56cXccnxHv+I9ryYZde8esRZlJlc45Ua+sN; AWSALBCORS=JGHBe5fSSlnnPkz4uUaEBhMq+1SyTiiP1B5rHV6U6ATjUoMobkDtYGL6P6zz6wWqzC41i3yGM5X3g1ucGh0irNU4S56cXccnxHv+I9ryYZde8esRZlJlc45Ua+sN; AWSALB=5K9ymwaiwA940cWqKcV72dwh3PQmR2Gelddb73m66dNxTj2txNCE/VwrxJbz6TDROU6cDwFdvoHrhrj9KpUjEV4EXsKLQ8vzo3MM3gT/rQPZXmndebsfpRJ/pfGc; AWSALBCORS=5K9ymwaiwA940cWqKcV72dwh3PQmR2Gelddb73m66dNxTj2txNCE/VwrxJbz6TDROU6cDwFdvoHrhrj9KpUjEV4EXsKLQ8vzo3MM3gT/rQPZXmndebsfpRJ/pfGc",
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Summary API Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch summary data" },
      { status: 500 },
    )
  }
}
