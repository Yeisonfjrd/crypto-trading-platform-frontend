'use client'

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useAuth } from "@clerk/clerk-react"
import { Loader2, LayoutDashboard, LineChart, Wallet, History } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ScrollArea } from "../components/ui/scroll-area"
import UserStats from "./UserStats"
import DemoAccount from "./DemoAccount"
import CryptoPrices from "./CryptoPrices"
import Portfolio from "./Portfolio"
import OrderForm from "./OrderForm"
import OrderHistory from "./OrderHistory"
import PriceChart from "./PriceChart"
import Markets from './Markets';
import CryptoNews from './CryptoNews';

interface PriceUpdate {
    pair: string
    price: number
    timestamp: number
}

interface Order {
    id: number
    pair: string
    amount: number
    price: number
    type: "buy" | "sell"
    status: "pending" | "completed" | "cancelled"
    createdAt: string
}

const Dashboard: React.FC = () => {
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdate[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { getToken } = useAuth()
  const pingInterval = useRef<NodeJS.Timeout | undefined>(undefined)
  const wsRef = useRef<WebSocket | undefined>(undefined)

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout | undefined
    let reconnectAttempts = 0

    const connectWebSocket = () => {
        wsRef.current = new WebSocket("ws://localhost:3001")

        wsRef.current.onopen = () => {
            console.log("Conectado al WebSocket")
            reconnectAttempts = 0
            
            pingInterval.current = setInterval(() => {
                if (wsRef.current?.readyState === WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify({ type: "ping" }))
                }
            }, 15000)
        }

          wsRef.current.onmessage = (event) => {
              try {
                  const data = JSON.parse(event.data)
                  if (data.type === "pong") return

                  if (data.type === "price_update") {
                      setPriceUpdates(prev => [...prev, data])
                  } else if (data.type === "order_completed") {
                      setOrders(prevOrders => 
                          prevOrders.map(order => {
                              const completedOrder = data.orders.find((completed: Order) => completed.id === order.id)
                              return completedOrder ? { ...order, status: completedOrder.status } : order
                          })
                      )
                  }
              } catch (error) {
                  console.error("Error parsing WebSocket message:", error)
              }
          }

          wsRef.current.onclose = () => {
              clearInterval(pingInterval.current)
              
              const reconnectDelay = Math.min(2 ** reconnectAttempts * 1000, 60000)
              reconnectTimeout = setTimeout(connectWebSocket, reconnectDelay)
              reconnectAttempts++
          }

          wsRef.current.onerror = () => {
              wsRef.current?.close()
          }
      }

      connectWebSocket()

      return () => {
          if (pingInterval.current) clearInterval(pingInterval.current)
          if (reconnectTimeout) clearTimeout(reconnectTimeout)
          wsRef.current?.close()
      }
  }, [])

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = await getToken()
                const response = await fetch("http://localhost:3001/api/orders", {
                    headers: { Authorization: `Bearer ${token}` },
                })

                if (!response.ok) {
                    throw new Error(`Error fetching orders: ${response.statusText}`)
                }

                const data: { orders: Order[] } = await response.json()
                setOrders(data.orders)
            } catch (error) {
                console.error("Error fetching orders:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrders()
    }, [getToken])

    const handleOrderCreated = () => {
        console.log("Orden creada")
    }

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
        )
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow-md">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Vista General
            </TabsTrigger>
            <TabsTrigger
              value="trading"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
            >
              <LineChart className="h-4 w-4 mr-2" />
              Trading
            </TabsTrigger>
            <TabsTrigger
              value="portfolio"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Portafolio
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
            >
              <History className="h-4 w-4 mr-2" />
              Historial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <UserStats />
              <CryptoPrices />
              <Markets />
              <CryptoNews className="w-80 mx-auto" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Gráfico de Precios</CardTitle>
                </CardHeader>
                <CardContent>
                  <PriceChart priceUpdates={priceUpdates} />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Cuenta Demo</CardTitle>
                </CardHeader>
                <CardContent>
                  <DemoAccount />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trading" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Gráfico de Precios</CardTitle>
                </CardHeader>
                <CardContent>
                  <PriceChart priceUpdates={priceUpdates} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Nueva Orden</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderForm onOrderCreated={handleOrderCreated} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle>Tu Portafolio</CardTitle>
                <CardDescription>Una visión general de tus activos y rendimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <Portfolio />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Órdenes</CardTitle>
                <CardDescription>Un registro de todas tus transacciones pasadas</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <OrderHistory orders={orders} />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    )
}

export default Dashboard