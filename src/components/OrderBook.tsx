'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Skeleton } from "./ui/skeleton"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

interface Order {
  id: number
  pair: string
  amount: number
  price: number
  type: 'buy' | 'sell'
  status: string
}

const OrderBook: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://crypto-trading-platform-backend.onrender.com/api/order-book`,)
        if (!response.ok) {
          throw new Error('Failed to fetch order book')
        }
        const data = await response.json()
        setOrders(data.orders)
      } catch (err) {
        setError('Error al cargar el libro de órdenes. Por favor, intente de nuevo más tarde.')
        console.error('Error fetching order book:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const renderOrderTable = (type: 'buy' | 'sell') => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Par</TableHead>
          <TableHead>Cantidad</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders
          .filter(order => order.type === type)
          .map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.pair}</TableCell>
              <TableCell>{order.amount.toFixed(8)}</TableCell>
              <TableCell>{order.price.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={order.status === 'active' ? 'default' : 'secondary'}>
                  {order.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Libro de Órdenes</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Libro de Órdenes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-4 text-lg font-semibold">Órdenes de Compra</h4>
            {renderOrderTable('buy')}
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold">Órdenes de Venta</h4>
            {renderOrderTable('sell')}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default OrderBook
