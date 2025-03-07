'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Alert, AlertDescription } from "./ui/alert"
import { Skeleton } from "./ui/skeleton"
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react"
import { Box, Grid, Typography } from '@mui/material'

const mockAnalysis = {
  symbol: "BTC",
  trend: {
    direction: 'neutral',
    strength: 0.65
  },
  support: [40000],
  resistance: [45000],
  volatility: 0.12,
  lastUpdate: new Date().toISOString()
}

const mockRecommendations: TradeRecommendation[] = [
  {
    type: 'buy',
    confidence: 0.75,
    reason: "Soporte fuerte encontrado",
    price: 42000
  }
]

type MarketAnalysis = {
  symbol: string
  trend: {
    direction: string
    strength: number
  }
  support: number[]
  resistance: number[]
  volatility: number
  lastUpdate: string
}

type TradeRecommendation = {
  type: string
  confidence: number
  reason: string
  price: number
}

const AIAnalytics: React.FC = () => {
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null)
  const [recommendations, setRecommendations] = useState<TradeRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getTrendIcon = (direction: string) => {
    if (direction === 'up') return <TrendingUp />;
    if (direction === 'down') return <TrendingDown />;
    return <ArrowRight />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        try {
          const [analysisRes, recsRes] = await Promise.all([
            fetch('/api/ai/analysis/BTC'),
            fetch('/api/ai/recommendations/BTC')
          ])
          
          if (!analysisRes.ok || !recsRes.ok) throw new Error()
          
          setAnalysis(await analysisRes.json())
          setRecommendations(await recsRes.json())
        } catch {
          setAnalysis(mockAnalysis)
          setRecommendations(mockRecommendations)
        }
      } catch (err) {
        setError('Error al cargar el análisis de mercado')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 300000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-6">
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Análisis de Mercado AI
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" display="flex" alignItems="center" gutterBottom>
                  Tendencia Actual
                </Typography>
                {analysis && (
                  <>
                    <Box display="flex" alignItems="center" mb={2}>
                      {getTrendIcon(analysis.trend.direction)}
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        {analysis.trend.direction.toUpperCase()}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Fuerza de la tendencia: {(analysis.trend.strength * 100).toFixed(1)}%
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" display="flex" alignItems="center" gutterBottom>
                  Niveles Técnicos
                </Typography>
                {analysis && (
                  <>
                    <Typography variant="body2" gutterBottom>
                      Resistencia: ${analysis.resistance[0]?.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Soporte: ${analysis.support[0]?.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Volatilidad: {(analysis.volatility * 100).toFixed(1)}%
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recomendaciones de Trading
                </Typography>
                <Grid container spacing={2}>
                  {recommendations.map((rec, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card>
                        <CardContent>
                          <Typography color={
                            rec.type === 'buy' ? 'success.main' : 
                            rec.type === 'sell' ? 'error.main' : 
                            'text.secondary'
                          } variant="h6" gutterBottom>
                            {rec.type.toUpperCase()}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            Precio: ${rec.price.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            Confianza: {(rec.confidence * 100).toFixed(1)}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {rec.reason}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {analysis && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Última actualización: {new Date(analysis.lastUpdate).toLocaleString()}
          </Typography>
        )}
      </Box>
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className="grid gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Mercado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </CardContent>
    </Card>
  </div>
)

export default AIAnalytics
