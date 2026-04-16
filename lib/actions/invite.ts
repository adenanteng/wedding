"use server"

export async function sendWhatsAppMessage({ 
  source, 
  number, 
  text, 
  type = 'text',
  locationData 
}: { 
  source: string, 
  number: string, 
  text?: string, 
  type?: 'text' | 'location',
  locationData?: {
    name: string,
    address: string,
    latitude: number,
    longitude: number,
    delay?: number
  }
}) {
  const baseUrl = process.env.EVO_API_URL
  const apiKey = process.env.EVO_API_KEY

  if (!baseUrl || !apiKey) {
    throw new Error("Evolution API credentials are missing on the server")
  }

  const endpoint = type === 'text' ? `/message/sendText/${source}` : `/message/sendLocation/${source}`
  const body = type === 'text' 
    ? { number, text } 
    : { number, ...locationData }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Evolution API Error:", errorData)
      throw new Error(errorData.message || `Failed to send WhatsApp ${type} message`)
    }

    return { success: true, data: await response.json() }
  } catch (error) {
    console.error("Server Action Error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
