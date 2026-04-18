"use client"

import { useEffect, useState, useCallback } from "react"
import { DataTable } from "@/components/rsvp/data-table"
import { columns, RSVP } from "@/components/rsvp/columns"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AddRsvpSheet } from "@/components/rsvp/add-rsvp-sheet"
import { BulkInviteSheet } from "@/components/rsvp/bulk-invite-sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { checkRsvpAuth, verifyRsvpPassword } from "./actions"
import { toast } from "sonner"

export default function RsvpDashboardPage() {
    const [data, setData] = useState<RSVP[]>([])
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const [password, setPassword] = useState("")
    const [verifying, setVerifying] = useState(false)

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
        const checkAuth = async () => {
            const auth = await checkRsvpAuth()
            setIsAuthenticated(auth)
            if (auth) {
                fetchData()
            }
        }
        checkAuth()
    }, [fetchData])

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setVerifying(true)
        const result = await verifyRsvpPassword(password)
        if (result.success) {
            setIsAuthenticated(true)
            fetchData()
            toast.success("Login berhasil")
        } else {
            toast.error(result.message || "Password salah")
        }
        setVerifying(false)
    }

    if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 p-6 font-sans">
                <Card className="w-full max-w-md shadow-lg border-2 border-primary/10">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center font-bold">RSVP Access</CardTitle>
                        <CardDescription className="text-center">
                            Masukkan password untuk mengakses dashboard RSVP.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleVerify} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder=""
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="border-primary/20 focus-visible:ring-primary"
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full font-bold" 
                                disabled={verifying}
                            >
                                {verifying ? "Memverifikasi..." : "Masuk"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 px-6 max-w-7xl" style={{ fontFamily: "var(--font-sans)" }}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground">
                            Atur dan lihat undangan.
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
