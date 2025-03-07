'use client'

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"
import { TrendingUp, TrendingDown, Bitcoin } from "lucide-react"

const mockData = {
  bitcoin: {
    usd: 45000,
    usd_24h_change: 2.5
  },
  ethereum: {
    usd: 2800,
    usd_24h_change: -1.2
  }
}

type CryptoPricesData = {
  bitcoin: {
    usd: number
    usd_24h_change: number
  }
  ethereum: {
    usd: number
    usd_24h_change: number
  }
}

const CryptoPrices: React.FC = () => {
  const [prices, setPrices] = useState<CryptoPricesData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(`https://crypto-trading-platform-backend.onrender.com/api/crypto-prices`,)
        if (!response.ok) {
          setPrices(mockData)
          return
        }
        const data = await response.json()
        setPrices(data)
      } catch (err) {
        console.error("Error fetching crypto prices:", err)
        setPrices(mockData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrices()
    const intervalId = setInterval(fetchPrices, 60000)
    return () => clearInterval(intervalId)
  }, [])
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Precios de Criptomonedas</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[100px] w-full mb-4" />
          <Skeleton className="h-[100px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Precios de Criptomonedas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {prices && (
            <>
              <PriceDisplay
                name="Bitcoin"
                icon={<Bitcoin className="h-6 w-6" />}
                price={prices.bitcoin.usd}
                change={prices.bitcoin.usd_24h_change}
              />
              <PriceDisplay
                name="Ethereum"
                icon={<div className="h-6 w-6">🔵</div>}
                price={prices.ethereum.usd}
                change={prices.ethereum.usd_24h_change}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface PriceDisplayProps {
  name: string
  icon: React.ReactNode
  price: number | undefined
  change: number | undefined
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ name, icon, price, change }) => {
  const isPositive = change !== undefined && change >= 0
  const changeColor = isPositive ? "text-green-500" : "text-red-500"
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-2xl font-bold">
            {price !== undefined
              ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : "N/A"}
          </p>
        </div>
      </div>
      <div className={`flex items-center ${changeColor}`}>
        <TrendIcon className="h-4 w-4 mr-1" />
        <span>{change !== undefined ? `${change.toFixed(2)}%` : "N/A"}</span>
      </div>
    </div>
  )
}

export default CryptoPrices

