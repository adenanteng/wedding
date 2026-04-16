"use client"

import { useEffect, useState, useCallback } from "react"
import { DataTable } from "@/components/rsvp/data-table"
import { columns, RSVP } from "@/components/rsvp/columns"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddRsvpSheet } from "@/components/rsvp/add-rsvp-sheet"
import { BulkInviteSheet } from "@/components/rsvp/bulk-invite-sheet"

export default function RsvpDashboardPage() {
    const [data, setData] = useState<RSVP[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = useCallback(async () => {
        setLoading(true)
        const { data: rsvps, error } = await supabase
            .from('rsvps')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error("Error fetching RSVPs:", error)
        } else {
            setData(rsvps || [])
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <div className="container mx-auto py-10 px-6 max-w-7xl" style={{ fontFamily: "var(--font-sans)" }}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">RSVP Dashboard</h1>
                        <p className="text-muted-foreground">
                            Manage and view all guest RSVP responses.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <BulkInviteSheet onSuccess={fetchData} />
                        <AddRsvpSheet onSuccess={fetchData} />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Respon</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Hadir</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {data.filter(d => d.presence === true).length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tidak Hadir</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {data.filter(d => d.presence === false).length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Belum Tahu</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-muted-foreground">
                                {data.filter(d => d.presence === null || d.presence === undefined).length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-card rounded-lg border shadow-sm p-2">
                    <DataTable 
                        columns={columns} 
                        data={data} 
                        onRefresh={fetchData}
                        isLoading={loading}
                    />
                </div>
            </div>
        </div>
    );
}
