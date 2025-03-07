import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
}
interface CryptoNewsProps {
  className?: string;
}

const CryptoNews = ({ className }: CryptoNewsProps) => {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`https://crypto-trading-platform-backend.onrender.com/api/crypto-news`,);
        if (!response.ok) {
          throw new Error(`Error fetching crypto news: ${response.statusText}`);
        }
        const data = await response.json();
        setNews(data.news);
      } catch (err) {
        console.error("Error fetching crypto news:", err);
        setError("Error al cargar las noticias de criptomonedas. Por favor, intente de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return <p className="text-center text-lg font-semibold">Cargando noticias...</p>;
  }

  return (
    <Card className={`max-w-lg mx-auto overflow-hidden ${className}`}>
      <CardHeader>
        <CardTitle>Noticias de Criptomonedas</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-4">
              {news.map((article, index) => (
                <div key={index} className="min-w-full sm:w-1/2 lg:w-1/3 p-4">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.urlToImage && (
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                    <h3 className="mt-2 text-lg font-bold">{article.title}</h3>
                  </a>
                  <p className="text-sm text-gray-600">{article.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoNews;
