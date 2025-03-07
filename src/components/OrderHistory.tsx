'use client'

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

type Order = {
  id: number
  pair: string
  amount: number
  type: "buy" | "sell"
  status: "completed" | "cancelled" | "pending"
  createdAt: string
}

interface OrderHistoryProps {
  orders: Order[]
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders = [] }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 5

  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(orders.length / ordersPerPage)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Órdenes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Par</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.pair || 'N/A'}</TableCell>
                <TableCell>
                  {order.amount ? order.amount.toFixed(8) : '0.00000000'}
                </TableCell>
                <TableCell>
                  <Badge variant={order.type === "buy" ? "default" : "secondary"}>
                    {(order.type || 'N/A').toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={order.status === 'completed' ? 'default' : order.status === 'cancelled' ? 'destructive' : 'default'}>
                    {order.status || 'pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.createdAt ? 
                    new Date(order.createdAt).toLocaleString() : 
                    'N/A'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {orders.length > 0 ? (
          <div className="flex items-center justify-between space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No hay órdenes para mostrar
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default OrderHistory