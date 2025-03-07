'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Alert, AlertDescription } from "./ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import axios from 'axios'

interface Simulation {
  id: string
  userId: string
  initialBalance: number
  currentBalance: number
  trades: Trade[] 
  performance: {
    totalPnL: number
    winRate: number
    avgReturn: number
  }
}

interface Trade {
  id: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  timestamp: Date | string
  pnl?: number
}

interface Prediction {
  id: string
  symbol: string
  predictedPrice: number
  confidence: number
  timeframe: string
  actualPrice?: number
  accuracy?: number
  createdAt: Date | string
}

const SimulatorDashboard: React.FC = () => {
  const [simulation, setSimulation] = useState<Simulation | null>(null)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tradeAmount, setTradeAmount] = useState<number>(0)
  const [selectedSymbol] = useState<string>('BTC')

  const loadSimulationData = useCallback(async () => {
    try {
      setLoading(true)
      const [simResponse, predResponse] = await Promise.all([
        axios.get('/api/simulation/current'),
        axios.get(`/api/predictions/${selectedSymbol}`)
      ])

      setSimulation(simResponse.data)
      setPredictions(predResponse.data)
      setError(null)
    } catch (err) {
      setError('Error al cargar datos de simulación')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [selectedSymbol])

  useEffect(() => {
    loadSimulationData()
    const interval = setInterval(loadSimulationData, 60000)
    return () => clearInterval(interval)
  }, [loadSimulationData])

  const executeTrade = async (type: 'buy' | 'sell') => {
    if (!tradeAmount || predictions.length === 0) return

    try {
      const response = await axios.post('/api/simulation/trade', {
        type,
        amount: tradeAmount,
        symbol: selectedSymbol,
        price: predictions[0]?.predictedPrice
      })

      setSimulation(prev =>
        prev
          ? {
              ...prev,
              trades: [...prev.trades, response.data],
              currentBalance: response.data.newBalance
            }
          : prev
      )

      setTradeAmount(0)
    } catch (err) {
      setError('Error al ejecutar operación')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!simulation) {
    return <div>No se encontraron datos de simulación.</div>
  }

  return (
<div className="p-6 space-y-6">
  <h2 className="text-3xl font-bold text-center">Simulador de Trading</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6">

    <Card className="md:col-span-4 sm:col-span-2">
      <CardHeader>
        <CardTitle>Balance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-3xl font-bold">
          ${ (simulation?.currentBalance ?? 0).toFixed(2) }
        </div>
        <div className="text-sm text-muted-foreground">
          P&L: ${ (simulation?.performance?.totalPnL ?? 0).toFixed(2) }
        </div>
        <div className="text-sm text-muted-foreground">
          Win Rate: {(simulation?.performance?.winRate ?? 0).toFixed(1)}%
        </div>
      </CardContent>
    </Card>

    <Card className="md:col-span-8 sm:col-span-2">
      <CardHeader>
        <CardTitle>Nueva Operación</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="number"
            placeholder="Cantidad"
            value={tradeAmount || ''}
            onChange={(e) => setTradeAmount(Number(e.target.value))}
            className="w-full sm:w-[200px]"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => executeTrade('buy')}
              disabled={!tradeAmount}
              className="bg-green-500 hover:bg-green-600"
            >
              Comprar
            </Button>
            <Button
              onClick={() => executeTrade('sell')}
              disabled={!tradeAmount}
              className="bg-red-500 hover:bg-red-600"
            >
              Vender
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Card: Historial de Operaciones */}
    <Card className="md:col-span-12 sm:col-span-2">
      <CardHeader>
        <CardTitle>Historial de Operaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">P&L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {simulation.trades?.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>
                  {new Date(trade.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>
                  <span className={trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                    {trade.type.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="text-right">{trade.amount}</TableCell>
                <TableCell className="text-right">${trade.price}</TableCell>
                <TableCell className={`text-right ${(trade.pnl ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${ (trade.pnl ?? 0).toFixed(2) }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</div>
  )
}

export default SimulatorDashboard
