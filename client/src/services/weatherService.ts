export interface LiveWeatherData {
  temperature: number;
  feelsLike: number;
  condition: string;
  climateLabel: string;
  icon: string;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  city: string;
  aiTip?: string;
  isLive: boolean;
}

export class WeatherService {
  /**
   * Converts raw weather numbers into friendly climate labels
   */
  public static getClimateLabel(temp: number, humidity: number): string {
    if (temp >= 36) return "Very Hot";
    if (temp >= 28 && humidity >= 70) return "Warm & Humid";
    if (temp >= 25) return "Warm";
    if (temp >= 18) return "Pleasant";
    if (temp >= 11) return "Cool";
    if (temp >= 3) return "Cold";
    return "Freezing";
  }

  /**
   * Maps WMO weather codes to human-readable conditions and icons
   */
  public static parseWeatherCode(code: number): { condition: string; icon: string } {
    switch (code) {
      case 0:
        return { condition: "Clear Sky", icon: "☀️" };
      case 1:
        return { condition: "Mainly Clear", icon: "🌤️" };
      case 2:
        return { condition: "Partly Cloudy", icon: "⛅" };
      case 3:
        return { condition: "Overcast", icon: "☁️" };
      case 45:
      case 48:
        return { condition: "Foggy", icon: "🌫️" };
      case 51:
      case 53:
      case 55:
        return { condition: "Light Drizzle", icon: "🌧️" };
      case 56:
      case 57:
        return { condition: "Freezing Drizzle", icon: "🌧️" };
      case 61:
      case 63:
      case 65:
        return { condition: "Rainy", icon: "🌧️" };
      case 66:
      case 67:
        return { condition: "Freezing Rain", icon: "🌧️" };
      case 71:
      case 73:
      case 75:
      case 77:
        return { condition: "Snowy", icon: "❄️" };
      case 80:
      case 81:
      case 82:
        return { condition: "Rain Showers", icon: "🌧️" };
      case 85:
      case 86:
        return { condition: "Snow Showers", icon: "❄️" };
      case 95:
      case 96:
      case 99:
        return { condition: "Thunderstorm", icon: "🌩️" };
      default:
        return { condition: "Mild Weather", icon: "🌤️" };
    }
  }

  /**
   * Generates intelligent AI Tips based on climate conditions
   */
  public static generateAITip(temp: number, feelsLike: number, condition: string, precip: number): string | undefined {
    const condLower = condition.toLowerCase();
    if (precip > 0 || condLower.includes("rain") || condLower.includes("drizzle") || condLower.includes("thunderstorm")) {
      return "Light showers expected today. Carry a lightweight waterproof layer or umbrella.";
    }
    if (temp <= 12 || feelsLike <= 12) {
      return "Cold conditions today. Layering with a warm sweater or coat is recommended.";
    }
    if (temp <= 16 || feelsLike <= 16) {
      return "Cool conditions today. A lightweight jacket is recommended.";
    }
    if (temp >= 28 || feelsLike >= 30) {
      return "Warm weather today. Breathable fabrics like cotton and linen are recommended.";
    }
    if ((condLower.includes("clear") || condLower.includes("sunny")) && temp >= 22) {
      return "Sunny & bright today. Consider sunglasses for outdoor activities.";
    }
    return "Pleasant weather today. Breathable core garments will keep you comfortable.";
  }

  /**
   * Reverse geocodes latitude/longitude to city/locality name using free reverse-geocode API
   */
  private static async getCityName(lat: number, lon: number): Promise<string> {
    try {
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
      if (res.ok) {
        const data = await res.json();
        const city = data.city || data.locality || data.principalSubdivision;
        if (city) return city;
      }
    } catch (e) {
      // Fallback
    }

    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}`);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          return data.results[0].name || data.results[0].admin1 || "Delhi";
        }
      }
    } catch (e) {
      // Fallback
    }

    return "Delhi";
  }

  /**
   * Fetches live weather from Open-Meteo API using latitude & longitude
   */
  public static async fetchLiveWeather(lat: number, lon: number): Promise<LiveWeatherData> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m`;

    const [weatherRes, city] = await Promise.all([
      fetch(url),
      this.getCityName(lat, lon)
    ]);

    if (!weatherRes.ok) {
      throw new Error(`Weather API returned status ${weatherRes.status}`);
    }

    const data = await weatherRes.json();
    const current = data.current;

    const temp = Math.round(current.temperature_2m ?? 22);
    const feelsLike = Math.round(current.apparent_temperature ?? temp);
    const humidity = Math.round(current.relative_humidity_2m ?? 50);
    const windSpeed = Math.round(current.wind_speed_10m ?? 5);
    const precip = current.precipitation ?? 0;
    const weatherCode = current.weather_code ?? 0;

    const { condition, icon } = this.parseWeatherCode(weatherCode);
    const climateLabel = this.getClimateLabel(temp, humidity);
    const aiTip = this.generateAITip(temp, feelsLike, condition, precip);

    return {
      temperature: temp,
      feelsLike,
      condition,
      climateLabel,
      icon,
      weatherCode,
      humidity,
      windSpeed,
      precipitation: precip,
      city,
      aiTip,
      isLive: true,
    };
  }

  /**
   * Formats LiveWeatherData into a clean, friendly string for recommendation algorithms
   */
  public static formatWeatherString(weather: LiveWeatherData): string {
    return `${weather.climateLabel} (${weather.condition} ${weather.temperature}°C)`;
  }
}
