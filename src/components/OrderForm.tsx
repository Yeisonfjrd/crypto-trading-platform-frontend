"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@clerk/clerk-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

interface OrderFormProps {
  onOrderCreated: () => void
}

const OrderForm: React.FC<OrderFormProps> = ({ onOrderCreated }) => {
  const [pair, setPair] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"buy" | "sell">("buy")
  const [currentPrice, setCurrentPrice] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const { getToken } = useAuth()

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001")

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setCurrentPrice(data.price)
    }

    return () => ws.close()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const token = await getToken()
      if (!token) {
        throw new Error("No se encontró el token de autenticación")
      }

      const response = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pair,
          amount: Number.parseFloat(amount),
          type,
          price: currentPrice,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al crear la orden")
      }

      onOrderCreated()
      setPair("")
      setAmount("")
      setType("buy")
    } catch (error) {
      console.error("Error:", error)
      setError(error instanceof Error ? error.message : "Error desconocido")
    }
  }

  const totalValue = Number.parseFloat(amount) * currentPrice

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Nueva Orden</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pair">Par (Ej. BTC/USD)</Label>
            <Input id="pair" value={pair} onChange={(e) => setPair(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Cantidad</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={(value) => setType(value as "buy" | "sell")}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Compra</SelectItem>
                <SelectItem value="sell">Venta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {currentPrice > 0 && (
            <div className="text-sm text-muted-foreground">Precio actual: ${currentPrice.toFixed(2)}</div>
          )}
          {amount && currentPrice > 0 && (
            <div className="text-sm font-medium">Valor total de la orden: ${totalValue.toFixed(2)}</div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit}>
          Enviar Orden
        </Button>
      </CardFooter>
    </Card>
  )
}

export default OrderForm

