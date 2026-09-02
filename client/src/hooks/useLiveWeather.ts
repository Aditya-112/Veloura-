import { useState, useEffect, useCallback } from "react";
import { WeatherService, type LiveWeatherData } from "../services/weatherService";

export function useLiveWeather() {
  const [weather, setWeather] = useState<LiveWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  const fetchWeather = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setPermissionDenied(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const data = await WeatherService.fetchLiveWeather(lat, lon);
          setWeather(data);
          setPermissionDenied(false);
        } catch (err: any) {
          console.error("Live Weather Fetch Error:", err);
          setError("Unable to fetch live weather.");
        } finally {
          setLoading(false);
        }
      },
      (geoErr) => {
        console.warn("Geolocation permission denied or error:", geoErr);
        setPermissionDenied(true);
        setError("Unable to fetch live weather.");
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return {
    weather,
    loading,
    error,
    permissionDenied,
    refetchWeather: fetchWeather,
  };
}
