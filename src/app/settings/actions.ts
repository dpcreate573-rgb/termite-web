"use server"

import { db } from "@/db"
import { settings, allowedUsers } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

const SETTINGS_ID = "system_settings"

export async function getSettings() {
    const result = await db.select().from(settings).where(eq(settings.id, SETTINGS_ID)).get()
    return result || null
}

export async function updateSettings(data: {
    companyName: string
    representative?: string
    accreditationNumber?: string
    zipCode?: string
    address?: string
    tel?: string
    fax?: string
    logoUrl?: string
    stampUrl?: string
    bankAccount1?: string
    bankAccount2?: string
    prMessage?: string
    smtpHost?: string
    smtpPort?: number
    smtpUser?: string
    smtpPass?: string
    emailFrom?: string
    quoteEmailTemplate?: string
    invoiceEmailTemplate?: string
}) {
    const existing = await getSettings()

    const payload = {
        ...data,
        updatedAt: new Date(),
    }

    if (existing) {
        await db.update(settings).set(payload).where(eq(settings.id, SETTINGS_ID))
    } else {
        await db.insert(settings).values({
            id: SETTINGS_ID,
            ...payload,
        })
    }

    revalidatePath("/settings")
    return { success: true }
}

export async function getAllowedUsers() {
    return await db.select().from(allowedUsers).all()
}

export async function addAllowedUser(email: string, name: string, role: string) {
    const id = crypto.randomUUID()
    await db.insert(allowedUsers).values({
        id,
        email,
        name,
        role,
        createdAt: new Date(),
    })
    revalidatePath("/settings")
    return { success: true }
}

export async function deleteAllowedUser(id: string) {
    await db.delete(allowedUsers).where(eq(allowedUsers.id, id))
    revalidatePath("/settings")
    return { success: true }
}
