import { useEffect, useState } from 'react';
import { CITIES, type WeatherData } from '../utils/types';

import {
  BiCloud as Cloud,
  BiCloudRain as CloudRain,
  BiCloudSnow as CloudSnow,
  BiSun as Sun,
  BiCloudDrizzle as CloudDrizzle,
  BiWind as Wind,
} from 'react-icons/bi';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const getWeatherInfo = (code: number) => {
    if (code === 0)
      return {
        condition: 'Clear',
        icon: <Sun className='w-4 h-4' />,
      };
    if (code <= 3)
      return {
        condition: 'Cloudy',
        icon: <Cloud className='w-4 h-4' />,
      };
    if (code <= 49)
      return {
        condition: 'Fog',
        icon: <Wind className='w-4 h-4' />,
      };
    if (code <= 59)
      return {
        condition: 'Drizzle',
        icon: <CloudDrizzle className='w-4 h-4' />,
      };
    if (code <= 69)
      return {
        condition: 'Rain',
        icon: <CloudRain className='w-4 h-4' />,
      };
    if (code <= 79)
      return {
        condition: 'Snow',
        icon: <CloudSnow className='w-4 h-4' />,
      };
    if (code <= 99)
      return {
        condition: 'Storm',
        icon: <CloudRain className='w-4 h-4' />,
      };
    return {
      condition: 'Unknown',
      icon: <Cloud className='w-4 h-4' />,
    };
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherPromises = CITIES.map(async (city) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`
          );
          const data = await response.json();
          const { condition, icon } = getWeatherInfo(
            data.current_weather.weathercode
          );
          return {
            city: city.name,
            temperature: Math.round(data.current_weather.temperature),
            condition,
            icon
          };
        });
        const results = await Promise.all(weatherPromises);
        setWeatherData(results);
        setIsLoading(false);
      } catch (error) {
        // console.error('Weather fetch error:', error);
        setError('OFFLINE');
        setIsLoading(false);
      }
      
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 6000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, []);

  return { weatherData, loading, error };
};
