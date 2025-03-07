'use client'

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import axios from "axios"

interface ChatbotProps {
  className?: string
}

const Chatbot: React.FC<ChatbotProps> = ({ className }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([])
  const [input, setInput] = useState("")

  const sendMessage = async () => {
    if (!input.trim()) return

    setMessages([...messages, { sender: "user", text: input }])

    try {
      const { data } = await axios.post(`${process.env.VITE_BACKEND_URL}/api/chatbot`, { message: input })
      setMessages((prev) => [...prev, { sender: "bot", text: data.response }])
    } catch (error) {
      console.error(error)
      setMessages((prev) => [...prev, { sender: "bot", text: "Error al obtener respuesta" }])
    }

    setInput("")
  }

  return (
<Card className={`w-full max-w-2xl ${className} bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/80 dark:supports-[backdrop-filter]:bg-gray-900/60`}>
  <CardHeader>
    <CardTitle className="text-gray-900 dark:text-gray-100">Asistente</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="h-64 overflow-y-auto space-y-2 p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`p-2 rounded-md ${msg.sender === "user" ? "bg-purple-400 text-gray-900" : "bg-purple-300 text-gray-900"}`}
        >
          {msg.text}
        </div>
      ))}
    </div>

    <div className="flex gap-2 mt-4">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe un mensaje..."
        className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
      />
    <Button
    onClick={sendMessage}
    className="bg-purple-400 text-gray-900 dark:text-gray-100 w-32 hover:bg-gradient-to-r hover:from-purple-400 hover:to-purple-600 transition-all duration-300 ease-in-out"
    >
    Enviar
    </Button>
    </div>
  </CardContent>
</Card>

  )
}

export default Chatbot
