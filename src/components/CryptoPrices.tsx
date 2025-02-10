"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"
import { AlertCircle, TrendingUp, TrendingDown, Bitcoin, EclipseIcon as Ethereum } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

interface CryptoPrice {
  usd: number
  usd_24h_change: number
}

interface CryptoPricesData {
  bitcoin: CryptoPrice
  ethereum: CryptoPrice
}

const CryptoPrices: React.FC = () => {
  const [prices, setPrices] = useState<CryptoPricesData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/crypto-prices")
        if (!response.ok) {
          throw new Error(`Error fetching crypto prices: ${response.statusText}`)
        }
        const data = await response.json()
        setPrices(data)
      } catch (err) {
        console.error("Error fetching crypto prices:", err)
        setError("Error al cargar los precios de criptomonedas. Por favor, intente de nuevo más tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrices()
    // Set up an interval to fetch prices every 60 seconds
    const intervalId = setInterval(fetchPrices, 60000)

    // Clean up the interval on component unmount
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
                icon={<Ethereum className="h-6 w-6" />}
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