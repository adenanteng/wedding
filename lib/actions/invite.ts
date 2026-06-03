"use server"

import fs from "fs"
import path from "path"

export async function sendWhatsAppMessage({ 
  source, 
  number, 
  text, 
  type = 'text',
  locationData,
  stickerUrl,
  attachBanner = false
}: { 
  source: string, 
  number: string, 
  text?: string, 
  type?: 'text' | 'location' | 'sticker',
  locationData?: {
    name: string,
    address: string,
    latitude: number,
    longitude: number,
    delay?: number
  },
  stickerUrl?: string,
  attachBanner?: boolean
}) {
  const baseUrl = process.env.VALO_API_URL
  const apiKey = process.env.VALO_API_KEY

  if (!baseUrl || !apiKey) {
    throw new Error("Valo API credentials are missing on the server")
  }

  if (type === 'location' || type === 'sticker') {
    throw new Error(`Valo API does not support message type "${type}"`)
  }

  // 1. Map source to sender phone number
  let senderNumber = ""
  const normalizedSource = source?.toLowerCase()
  if (normalizedSource === "aden") {
    senderNumber = process.env.VALO_SENDER_ADEN || ""
  } else if (normalizedSource === "rahma") {
    senderNumber = process.env.VALO_SENDER_RAHMA || ""
  } else if (normalizedSource === "enola") {
    senderNumber = process.env.VALO_SENDER_ENOLA || ""
  }

  if (!senderNumber || senderNumber.startsWith("YOUR_")) {
    throw new Error(`Sender phone number mapping for source "${source}" is missing or invalid on the server`)
  }

  // 2. Build the request body
  let body: any = {
    to: number,
    sender_number: senderNumber
  }

  if (attachBanner) {
    const filePath = path.join(process.cwd(), 'public', 'img', 'couple0.jpeg')
    if (!fs.existsSync(filePath)) {
      throw new Error(`Banner photo not found at path: ${filePath}`)
    }
    const fileBuffer = fs.readFileSync(filePath)
    const base64Image = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`
    
    body.image_base64 = base64Image
    body.caption = text
  } else {
    body.message = text
  }

  try {
    const response = await fetch(`${baseUrl}/valo/messages/send`, {
      method: 'POST',
      headers: {
        'X-Valo-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Valo API Error:", errorData)
      throw new Error(errorData.error || errorData.message || `Failed to send WhatsApp message via Valo`)
    }

    return { success: true, data: await response.json() }
  } catch (error) {
    console.error("Server Action Error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
