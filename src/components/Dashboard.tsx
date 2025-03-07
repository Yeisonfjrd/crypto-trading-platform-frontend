'use client';

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Loader2, LayoutDashboard, LineChart, History, Brain, PlayCircle, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import UserStats from "./UserStats";
import DemoAccount from "./DemoAccount";
import CryptoPrices from "./CryptoPrices";
import Portfolio from "./Portfolio";
import OrderForm from "./OrderForm";
import OrderHistory from "./OrderHistory";
import PriceChart from "./PriceChart";
import Markets from './Markets';
import CryptoNews from './CryptoNews';
import AIAnalytics from './AIAnalytics';
import SimulatorDashboard from './SimulatorDashboard';
import Chatbot from './Chatbot';

interface PriceUpdate {
  pair: string;
  price: number;
  timestamp: number;
}

interface Order {
  id: number;
  pair: string;
  amount: number;
  price: number;
  type: "buy" | "sell";
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdate[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();
  const pingInterval = useRef<NodeJS.Timeout | undefined>(undefined);
  const wsRef = useRef<WebSocket | undefined>(undefined);

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout | undefined;
    let reconnectAttempts = 0;

    const connectWebSocket = () => {
      const backendUrl = process.env.VITE_BACKEND_URL || 'https://crypto-trading-platform-backend.onrender.com';
      const wsUrl = backendUrl.replace('https', 'wss').replace('http', 'ws');
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("Conectado al WebSocket:", wsUrl);
        reconnectAttempts = 0;

        pingInterval.current = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "ping" }));
          }
        }, 15000);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "pong") return;

          if (data.type === "price_update") {
            setPriceUpdates(prev => [...prev, data]);
          } else if (data.type === "order_completed") {
            setOrders(prevOrders =>
              prevOrders.map(order => {
                const completedOrder = data.orders.find((completed: Order) => completed.id === order.id);
                return completedOrder ? { ...order, status: completedOrder.status } : order;
              })
            );
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      wsRef.current.onclose = () => {
        clearInterval(pingInterval.current);
        const reconnectDelay = Math.min(2 ** reconnectAttempts * 1000, 60000);
        reconnectTimeout = setTimeout(connectWebSocket, reconnectDelay);
        reconnectAttempts++;
      };

      wsRef.current.onerror = () => {
        wsRef.current?.close();
      };
    };

    connectWebSocket();

    return () => {
      if (pingInterval.current) clearInterval(pingInterval.current);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const url = `https://crypto-trading-platform-backend.onrender.com/api/orders`;
        console.log("Fetching orders from:", url);
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Error fetching orders: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Orders data:", data);
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [getToken]);

  const handleOrderCreated = () => {
    console.log("Orden creada");
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="sticky top-0 z-10 bg-gradient-to-b from-gray-50 to-transparent dark:from-gray-900 pb-4">
          <TabsList className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-1 rounded-lg shadow-md flex flex-wrap justify-start gap-2">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Vista General
            </TabsTrigger>
            <TabsTrigger
              value="ai-analytics"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
            >
              <Brain className="h-4 w-4 mr-2" />
              AI Analytics
            </TabsTrigger>
            <TabsTrigger
              value="simulator"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Simulador
            </TabsTrigger>
              <TabsTrigger
                value="trading"
                className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
              >
                <LineChart className="h-4 w-4 mr-2" />
                Trading
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
              >
                <History className="h-4 w-4 mr-2" />
                Historial
              </TabsTrigger>
              <TabsTrigger
                value="chatbot"
                className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chatbot
              </TabsTrigger>
            </TabsList>
          </div>
  
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            )}

          <TabsContent value="overview" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
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
          </motion.div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <UserStats />
              <CryptoPrices />
              <Markets />
              <CryptoNews className="w-80 mx-auto" />
            </div>
          </TabsContent>

          <TabsContent value="trading" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
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
          </motion.div>
          </TabsContent>

          <TabsContent value="portfolio">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Tu Portafolio</CardTitle>
                <CardDescription>Una visión general de tus activos y rendimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <Portfolio />
              </CardContent>
            </Card>
          </motion.div>
          </TabsContent>

          <TabsContent value="history">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
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
          </motion.div>
          </TabsContent>
          <TabsContent value="ai-analytics">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Mercado AI</CardTitle>
                <CardDescription>
                  Análisis avanzado del mercado usando inteligencia artificial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIAnalytics />
              </CardContent>
            </Card>
          </div>
          </motion.div>
          </TabsContent>

          <TabsContent value="simulator">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            >
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Simulador de Trading</CardTitle>
                  <CardDescription>
                    Practica tus estrategias de trading sin riesgo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SimulatorDashboard />
                </CardContent>
              </Card>
            </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="chatbot" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Chatbot</CardTitle>
                    <CardDescription>Interactúa con el chatbot para obtener asistencia en el trading</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Chatbot />
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;