"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

interface Stats {
  totalVolume: number
  totalProfitLoss: number
  successRate: string
  performanceByPair: Record<string, number>
}

const UserStats: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getToken();
        console.log('Token:', token);
        console.log('Fetching from:', `${process.env.VITE_BACKEND_URL}/api/stats`);
        const response = await fetch(`${process.env.VITE_BACKEND_URL}/api/stats`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          throw new Error(`Error fetching stats: ${response.statusText}`)
        }

        const data = await response.json()
        setStats(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching stats:", error)
        setError("No se pudieron cargar las estadísticas. Inténtalo más tarde.")
      }
    }

    fetchStats()
  }, [getToken])

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas del Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    )
  }

  const chartData = Object.entries(stats.performanceByPair).map(([pair, profit]) => ({
    pair,
    profit,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas del Usuario</CardTitle>
        <CardDescription>Resumen de tu actividad de trading</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatItem
            title="Total Volumen"
            value={stats.totalVolume.toFixed(2)}
            icon={<ArrowUpIcon className="h-4 w-4 text-green-500" />}
          />
          <StatItem
            title="Ganancia/Pérdida Total"
            value={stats.totalProfitLoss.toFixed(2)}
            icon={
              stats.totalProfitLoss >= 0 ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500" />
              )
            }
          />
          <StatItem
            title="Tasa de Éxito"
            value={stats.successRate}
            icon={<ArrowUpIcon className="h-4 w-4 text-green-500" />}
          />
        </div>

        <div className="mt-6">
          <h4 className="mb-4 text-sm font-medium">Rendimiento por Par</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="pair" />
              <YAxis />
              <Tooltip
                contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "none" }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
              <Bar dataKey="profit" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

interface StatItemProps {
  title: string
  value: string
  icon: React.ReactNode
}

const StatItem: React.FC<StatItemProps> = ({ title, value, icon }) => (
  <div className="flex flex-col space-y-2">
    <p className="text-sm font-medium text-muted-foreground">{title}</p>
    <div className="flex items-center space-x-2">
      {icon}
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  </div>
)

export default UserStats

