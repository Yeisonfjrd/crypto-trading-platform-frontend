'use client'

import React, { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface PriceUpdate {
  pair: string
  price: number
  timestamp: number
}

interface ChartData {
  pair: string
  price: number
  timestamp: number
  movingAverage: number | null
}

interface PriceChartProps {
  priceUpdates: PriceUpdate[]
}

const PriceChart: React.FC<PriceChartProps> = ({ priceUpdates }) => {
  const [timeRange, setTimeRange] = useState('1h');

  const chartData = useMemo(() => {
    const windowSize = 5;
    const now = Date.now();

    return priceUpdates.map((update, index) => {
      const dataTime = update.timestamp;

      if (
        (timeRange === '1h' && now - dataTime > 60 * 60 * 1000) ||
        (timeRange === '24h' && now - dataTime > 24 * 60 * 60 * 1000) ||
        (timeRange === '7d' && now - dataTime > 7 * 24 * 60 * 60 * 1000)
      ) {
        return null;
      }

      const movingAverage = index >= windowSize - 1
        ? priceUpdates
            .slice(index - windowSize + 1, index + 1)
            .reduce((acc, d) => acc + d.price, 0) / windowSize
        : null;

      return { ...update, movingAverage };
    }).filter(Boolean) as ChartData[];
  }, [priceUpdates, timeRange]);

  return (
    <Card className="w-full max-w-screen-lg mx-auto p-4 sm:p-6">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2 pb-2">
        <CardTitle className="text-lg font-semibold">Gráfico de Precios</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Seleccionar rango" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Última hora</SelectItem>
            <SelectItem value="24h">Últimas 24 horas</SelectItem>
            <SelectItem value="7d">Últimos 7 días</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="w-full">
        <div className="w-full h-[250px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()} />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }} labelStyle={{ color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="price" stroke="#8884d8" name="Precio" strokeWidth={2} />
              <Line type="monotone" dataKey="movingAverage" stroke="#82ca9d" name="Media Móvil" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;