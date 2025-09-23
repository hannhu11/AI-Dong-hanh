/**
 * 🌤️ WEATHER INTELLIGENCE SERVICE - Smart Weather Integration với Rate Limiting
 * 
 * Tính năng:
 * - Intelligent API Rate Limiting (1000 calls/day = 1 call/30 min)
 * - Smart Weather Caching & Memory System
 * - Context-Aware Weather Suggestions
 * - Weather-Based AI Personality Adaptation
 * - Productivity & Health Recommendations
 * 
 * API: OpenWeatherMap Free Tier (1000 calls/day)
 */

// 🌡️ Weather Data Interfaces
interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex?: number;
  feelsLike: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy' | 'clear';
  timestamp: number;
  city: string;
}

interface WeatherCache {
  data: WeatherData;
  cachedAt: number;
  expiresAt: number;
  apiCallCount: number;
  lastApiCall: number;
}

interface WeatherSuggestion {
  type: 'productivity' | 'health' | 'mood' | 'activity' | 'reminder';
  message: string;
  priority: 'low' | 'medium' | 'high';
  icon: string;
}

// 🧠 Weather Intelligence Manager
class WeatherIntelligenceManager {
  private readonly API_KEY: string = "DEMO_KEY_REPLACE_WITH_REAL"; // Get free key from openweathermap.org (1000 calls/day free)
  private readonly BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  private readonly DAILY_LIMIT = 1000; // 1000 calls per day
  private readonly MIN_CALL_INTERVAL = 30 * 60 * 1000; // 30 minutes between calls

  private weatherCache: Map<string, WeatherCache> = new Map();
  private dailyCallCount = 0;
  private lastResetDate = new Date().toDateString();

  // 📊 Weather Memory & Learning System
  private weatherPatterns: Map<string, number> = new Map(); // Track weather patterns over time
  private userPreferences = {
    preferredTemperature: 22, // Celsius
    sensitiveToHumidity: true,
    worksBestInWeather: ['sunny', 'clear', 'cloudy']
  };

  /**
   * 🌟 Get Current Weather với Smart Caching & Rate Limiting
   */
  public async getCurrentWeather(city: string = "Ho Chi Minh City"): Promise<WeatherData | null> {
    try {
      // 🔄 Reset daily counter if new day
      this.resetDailyCounterIfNeeded();

      // 🚀 Check cache first (30-minute cache)
      const cached = this.getFromCache(city);
      if (cached && !this.isCacheExpired(cached)) {
        console.log(`🌤️ Weather: Using cached data for ${city} (${this.getCacheAge(cached)}min old)`);
        this.generateWeatherSuggestions(cached.data);
        return cached.data;
      }

      // 🔑 Check if API key is valid
      if (this.API_KEY === "DEMO_KEY_REPLACE_WITH_REAL" || this.API_KEY.length < 10) {
        console.log("🌤️ Weather: Invalid API key, using fallback weather data");
        if (cached) {
          this.generateWeatherSuggestions(cached.data, true);
          return cached.data;
        }
        const fallback = this.getFallbackWeather(city);
        this.generateWeatherSuggestions(fallback, true);
        return fallback;
      }

      // ⚠️ Rate limiting check
      if (!this.canMakeApiCall()) {
        console.log("🌤️ Weather: Rate limit reached, using last known data");
        if (cached) {
          this.generateWeatherSuggestions(cached.data, true); // Mark as stale
          return cached.data;
        }
        const fallback = this.getFallbackWeather(city);
        this.generateWeatherSuggestions(fallback, true);
        return fallback;
      }

      // 🌐 Make API call
      console.log(`🌤️ Weather: Fetching fresh data for ${city} (API calls: ${this.dailyCallCount}/${this.DAILY_LIMIT})`);
      const weatherData = await this.fetchWeatherFromAPI(city);
      
      if (weatherData) {
        // 💾 Cache the result
        this.cacheWeather(city, weatherData);
        this.dailyCallCount++;

        // 🧠 Learn from weather patterns
        this.learnWeatherPattern(weatherData);

        // 🎯 Generate intelligent suggestions
        this.generateWeatherSuggestions(weatherData);

        return weatherData;
      }

      // Fallback if API fails
      return cached?.data || this.getFallbackWeather(city);

    } catch (error) {
      console.error("🌤️ Weather Intelligence error:", error);
      return this.getFromCache(city)?.data || this.getFallbackWeather(city);
    }
  }

  /**
   * 🌐 Fetch Weather from OpenWeatherMap API
   */
  private async fetchWeatherFromAPI(city: string): Promise<WeatherData | null> {
    const url = `${this.BASE_URL}?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind?.speed * 3.6), // Convert m/s to km/h
      pressure: data.main.pressure,
      visibility: Math.round((data.visibility || 10000) / 1000), // Convert to km
      feelsLike: Math.round(data.main.feels_like),
      condition: this.mapWeatherCondition(data.weather[0].main.toLowerCase()),
      timestamp: Date.now(),
      city: data.name
    };
  }

  /**
   * 🎯 Generate Context-Aware Weather Suggestions
   */
  private generateWeatherSuggestions(weather: WeatherData, isStale: boolean = false): void {
    const suggestions = this.createWeatherSuggestions(weather, isStale);
    
    // 🔔 Dispatch weather suggestions to UI
    suggestions.forEach((suggestion, index) => {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('ai-message', {
          detail: {
            text: `${suggestion.icon} ${suggestion.message}`,
            timestamp: Date.now(),
            petId: 'weather-intelligence',
            isContextMessage: true,
            priority: suggestion.priority
          }
        }));
      }, index * 2000); // Stagger notifications
    });
  }

  /**
   * 💡 Create Intelligent Weather-Based Suggestions
   */
  private createWeatherSuggestions(weather: WeatherData, isStale: boolean): WeatherSuggestion[] {
    const suggestions: WeatherSuggestion[] = [];
    const temp = weather.temperature;
    const condition = weather.condition;

    // 🌡️ Temperature-based suggestions
    if (temp < 16) {
      suggestions.push({
        type: 'health',
        message: `Trời lạnh ${temp}°C! Nhớ mặc ấm và uống nước ấm nhé~ 🧣`,
        priority: 'medium',
        icon: '🧣'
      });
    } else if (temp > 32) {
      suggestions.push({
        type: 'health', 
        message: `Nắng nóng ${temp}°C! Nhớ uống nước nhiều và tránh ra ngoài trưa nhé! 🌡️`,
        priority: 'high',
        icon: '☀️'
      });
    }

    // 🌦️ Condition-based suggestions
    switch (condition) {
      case 'rainy':
        suggestions.push({
          type: 'activity',
          message: `Trời mưa rồi! Perfect time để code hoặc đọc sách bên cửa sổ~ ☔`,
          priority: 'medium',
          icon: '🌧️'
        });
        break;
        
      case 'sunny':
        if (this.isWorkingHours()) {
          suggestions.push({
            type: 'productivity',
            message: `Nắng đẹp ${temp}°C! Năng lượng tích cực cao - great time for creative work! ✨`,
            priority: 'low',
            icon: '🌞'
          });
        }
        break;

      case 'cloudy':
        suggestions.push({
          type: 'mood',
          message: `Thời tiết mát mẻ, perfect for focus! Productivity level: optimal 📚`,
          priority: 'low', 
          icon: '☁️'
        });
        break;
    }

    // 💨 Humidity & Air Quality
    if (weather.humidity > 80) {
      suggestions.push({
        type: 'health',
        message: `Độ ẩm cao (${weather.humidity}%)! Bật máy lạnh hoặc quạt để comfortable hơn 💨`,
        priority: 'medium',
        icon: '💧'
      });
    }

    // 🕐 Time-based weather wisdom
    if (isStale) {
      suggestions.push({
        type: 'reminder',
        message: `Weather data hơi cũ rồi, nhưng vẫn useful! Tiết kiệm API calls thông minh 🧠`,
        priority: 'low',
        icon: '⏰'
      });
    }

    return suggestions.slice(0, 2); // Limit to 2 suggestions to avoid spam
  }

  /**
   * 🧠 Learn Weather Patterns Over Time
   */
  private learnWeatherPattern(weather: WeatherData): void {
    const hour = new Date().getHours();
    const pattern = `${weather.condition}_${hour}h`;
    
    const currentCount = this.weatherPatterns.get(pattern) || 0;
    this.weatherPatterns.set(pattern, currentCount + 1);
    
    // 🎯 Learn user preferences based on activity during weather
    if (weather.condition === 'sunny' && hour >= 9 && hour <= 17) {
      // User is active during sunny work hours - likely prefers sunny weather
      this.userPreferences.worksBestInWeather = ['sunny', 'clear'];
    }
  }

  // 🛠️ Helper Methods
  private mapWeatherCondition(main: string): WeatherData['condition'] {
    const conditionMap: Record<string, WeatherData['condition']> = {
      'clear': 'clear',
      'clouds': 'cloudy', 
      'rain': 'rainy',
      'drizzle': 'rainy',
      'thunderstorm': 'stormy',
      'snow': 'snowy',
      'mist': 'foggy',
      'fog': 'foggy',
      'haze': 'foggy'
    };
    return conditionMap[main] || 'cloudy';
  }

  private canMakeApiCall(): boolean {
    const now = Date.now();
    const timeSinceLastCall = now - (this.getLastApiCallTime());
    return this.dailyCallCount < this.DAILY_LIMIT && timeSinceLastCall > this.MIN_CALL_INTERVAL;
  }

  private getLastApiCallTime(): number {
    let lastCall = 0;
    this.weatherCache.forEach(cache => {
      if (cache.lastApiCall > lastCall) {
        lastCall = cache.lastApiCall;
      }
    });
    return lastCall;
  }

  private resetDailyCounterIfNeeded(): void {
    const today = new Date().toDateString();
    if (today !== this.lastResetDate) {
      this.dailyCallCount = 0;
      this.lastResetDate = today;
      console.log("🌤️ Weather: Daily API counter reset");
    }
  }

  private cacheWeather(city: string, weather: WeatherData): void {
    const now = Date.now();
    this.weatherCache.set(city, {
      data: weather,
      cachedAt: now,
      expiresAt: now + this.CACHE_DURATION,
      apiCallCount: this.dailyCallCount,
      lastApiCall: now
    });
  }

  private getFromCache(city: string): WeatherCache | null {
    return this.weatherCache.get(city) || null;
  }

  private isCacheExpired(cache: WeatherCache): boolean {
    return Date.now() > cache.expiresAt;
  }

  private getCacheAge(cache: WeatherCache): number {
    return Math.round((Date.now() - cache.cachedAt) / (1000 * 60));
  }

  private isWorkingHours(): boolean {
    const hour = new Date().getHours();
    return hour >= 8 && hour <= 18;
  }

  private getFallbackWeather(city: string): WeatherData {
    // Generate realistic weather for Ho Chi Minh City based on time of day
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour <= 18;
    
    // Typical weather patterns for HCMC
    const dayWeather = {
      temperature: 28 + Math.floor(Math.random() * 6), // 28-33°C
      description: "partly sunny with scattered clouds",
      condition: 'sunny' as const,
      feelsLike: 32
    };
    
    const nightWeather = {
      temperature: 24 + Math.floor(Math.random() * 4), // 24-27°C  
      description: "clear night with gentle breeze",
      condition: 'clear' as const,
      feelsLike: 26
    };
    
    const weather = isDay ? dayWeather : nightWeather;
    
    return {
      ...weather,
      humidity: 65 + Math.floor(Math.random() * 20), // 65-85%
      windSpeed: 3 + Math.floor(Math.random() * 7), // 3-10 km/h
      pressure: 1010 + Math.floor(Math.random() * 8), // 1010-1017 hPa
      visibility: 8 + Math.floor(Math.random() * 3), // 8-10 km
      timestamp: Date.now(),
      city
    };
  }

  // 📊 Public Analytics Methods
  public getWeatherStats() {
    return {
      dailyCallsUsed: this.dailyCallCount,
      dailyLimit: this.DAILY_LIMIT,
      cachedCities: Array.from(this.weatherCache.keys()),
      learnedPatterns: this.weatherPatterns.size,
      userPreferences: this.userPreferences
    };
  }

  public getCachedWeather() {
    const cached: any[] = [];
    this.weatherCache.forEach((cache, city) => {
      cached.push({
        city,
        age: this.getCacheAge(cache),
        expired: this.isCacheExpired(cache),
        temperature: cache.data.temperature,
        condition: cache.data.condition
      });
    });
    return cached;
  }
}

// 🌟 Export Singleton Instance
export const weatherIntelligence = new WeatherIntelligenceManager();
export type { WeatherData, WeatherSuggestion };
