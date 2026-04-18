"use server"

import { cookies } from "next/headers"

export async function verifyRsvpPassword(password: string) {
    const correctPassword = process.env.PASSWORD_RSVP
    
    if (password === correctPassword) {
        const cookieStore = await cookies()
        cookieStore.set("rsvp_authenticated", "true", {
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/rsvp",
        })
        return { success: true }
    }
    
    return { success: false, message: "Password salah!" }
}

export async function checkRsvpAuth() {
    const cookieStore = await cookies()
    return cookieStore.get("rsvp_authenticated")?.value === "true"
}
