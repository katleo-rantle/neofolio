import { useEffect, useState } from "react";
import { CITIES, type WeatherData } from "../utils/types";

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Logic to convert codes to strings ONLY (no JSX here)
  const getConditionName = (code: number) => {
    if (code === 0) return 'Clear';
    if (code <= 3) return 'Cloudy';
    if (code <= 49) return 'Fog';
    if (code <= 59) return 'Drizzle';
    if (code <= 69) return 'Rain';
    if (code <= 79) return 'Snow';
    return 'Storm';
  };

  useEffect(() => {
    const fetchWeather = async () => {
      const now = Date.now();
      const cached = localStorage.getItem('weather_cache');
      const cacheTime = localStorage.getItem('weather_cache_time');

      // 15-minute cache (900,000ms)
      if (cached && cacheTime && now - Number(cacheTime) < 900000) {
        setWeatherData(JSON.parse(cached));
        setIsLoading(false);
        return;
      }

      try {
        const weatherPromises = CITIES.map(async (city) => {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`,
          );
          if (!res.ok) throw new Error('API Error');

          const data = await res.json();
          return {
            city: city.name,
            temperature: Math.round(data.current_weather.temperature),
            condition: getConditionName(data.current_weather.weathercode),
          };
        });

        const results = await Promise.all(weatherPromises);

        setWeatherData(results);
        localStorage.setItem('weather_cache', JSON.stringify(results));
        localStorage.setItem('weather_cache_time', now.toString());
        setIsLoading(false);
        setError(null);
      } catch (err) {
        setError('OFFLINE');
        setIsLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 900000);
    return () => clearInterval(interval);
  }, []);

  return { weatherData, loading, error };
};
