import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"

const marketData = [
  { name: "Bitcoin", symbol: "BTC", price: 50000, change: 2.5 },
  { name: "Ethereum", symbol: "ETH", price: 3000, change: -1.2 },
  { name: "Cardano", symbol: "ADA", price: 2.1, change: 5.7 },
  { name: "Solana", symbol: "SOL", price: 150, change: 10.3 },
  { name: "Polkadot", symbol: "DOT", price: 35, change: -0.8 },
]

const Markets: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mercado de Criptomonedas</CardTitle>
        <CardDescription>Precios y cambios en las últimas 24 horas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-full table-auto">
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Símbolo</TableHead>
                <TableHead>Precio (USD)</TableHead>
                <TableHead>Cambio 24h</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketData.map((coin) => (
                <TableRow key={coin.symbol}>
                  <TableCell>{coin.name}</TableCell>
                  <TableCell>{coin.symbol}</TableCell>
                  <TableCell>${coin.price.toLocaleString()}</TableCell>
                  <TableCell className={coin.change >= 0 ? "text-green-600" : "text-red-600"}>
                    {coin.change > 0 ? "+" : ""}
                    {coin.change}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default Markets