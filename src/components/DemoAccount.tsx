"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Skeleton } from "./ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

interface Transaction {
  type: "buy" | "sell"
  amount: number
  pair: string
  price: number
}

const DemoAccount: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchDemoData = async () => {
      try {
        const token = await getToken()
        const response = await fetch("http://localhost:3001/api/demo-account", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          throw new Error(`Error fetching demo data: ${response.statusText}`)
        }

        const data = await response.json()
        setBalance(data.balance)
        setTransactions(data.transactions)
      } catch (err) {
        console.error("Error fetching demo account data:", err)
        setError("Error al cargar los datos de la cuenta demo. Por favor, intente de nuevo más tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDemoData()
  }, [getToken])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cuenta Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-[250px] mb-4" />
          <Skeleton className="h-[200px] w-full" />
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
        <CardTitle>Cuenta Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Saldo Virtual</h4>
          <p className="text-2xl font-bold">${balance?.toFixed(2)}</p>
        </div>

        <h4 className="text-sm font-medium text-muted-foreground mb-4">Transacciones Simuladas</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Par</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Precio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Badge variant={tx.type === "buy" ? "default" : "secondary"}>
                    {tx.type === "buy" ? "Compra" : "Venta"}
                  </Badge>
                </TableCell>
                <TableCell>{tx.pair}</TableCell>
                <TableCell>{tx.amount.toFixed(8)}</TableCell>
                <TableCell>${tx.price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default DemoAccount

