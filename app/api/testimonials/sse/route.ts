import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

// Store connected clients
const clients = new Set<ReadableStreamController<Uint8Array>>()

// Function to send updates to all connected clients
export function notifyClients(data: any) {
  const eventData = `data: ${JSON.stringify(data)}\n\n`
  clients.forEach((client) => {
    try {
      client.enqueue(new TextEncoder().encode(eventData))
    } catch (error) {
      console.error("Error sending SSE update:", error)
    }
  })
}

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const encoder = new TextEncoder()
    let controller: ReadableStreamController<Uint8Array>

    const stream = new ReadableStream({
      start(c) {
        controller = c
        clients.add(controller)

        // Send initial connection message
        controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'))

        // Remove client when connection is closed
        const timer = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(": keepalive\n\n"))
          } catch (e) {
            clearInterval(timer)
            clients.delete(controller)
          }
        }, 30000) // Send keepalive every 30 seconds
      },
      cancel() {
        clients.delete(controller)
      },
    })

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error setting up SSE:", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}
