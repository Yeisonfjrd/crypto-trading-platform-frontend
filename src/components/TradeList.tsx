import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

interface Trade {
  id: number
  pair: string
  amount: number
  type: "buy" | "sell"
  timestamp: string
}

interface TradeListProps {
  trades: Trade[]
}

const TradeList: React.FC<TradeListProps> = ({ trades }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tus Últimas Operaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Par</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Fecha/Hora</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>
                  <Badge variant={trade.type === "buy" ? "default" : "secondary"} className="flex items-center gap-1">
                    {trade.type === "buy" ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
                    {trade.type.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{trade.pair}</TableCell>
                <TableCell>{trade.amount.toFixed(8)}</TableCell>
                <TableCell>{new Date(trade.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default TradeList