import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"

const portfolioData = [
  { name: "Bitcoin", symbol: "BTC", amount: 0.5, value: 25000 },
  { name: "Ethereum", symbol: "ETH", amount: 5, value: 15000 },
  { name: "Cardano", symbol: "ADA", amount: 1000, value: 2100 },
  { name: "Solana", symbol: "SOL", amount: 20, value: 3000 },
]

const Portfolio: React.FC = () => {
  const totalValue = portfolioData.reduce((sum, asset) => sum + asset.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tu Portafolio</CardTitle>
        <CardDescription>Valor total: ${totalValue.toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Símbolo</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Valor (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolioData.map((asset) => (
              <TableRow key={asset.symbol}>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.symbol}</TableCell>
                <TableCell>{asset.amount}</TableCell>
                <TableCell>${asset.value.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default Portfolio