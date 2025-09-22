import { getCurrentWeather, getCurrentTimeInfo } from './weatherService';
import { generateThoughtMessage } from './geminiService';
import { timeTracker } from './timeTrackingService';
import { useSettingStore } from '../hooks/useSettingStore';

export interface PetAIManagerConfig {
  petId: string;
  minIntervalMs: number; // Tối thiểu 1 phút (60000ms)
  maxIntervalMs: number; // Tối đa 3 phút (180000ms)
}

export interface AIMessage {
  text: string;
  timestamp: number;
  petId: string;
  isLongSessionMessage: boolean;
}

class PetAIManager {
  private activeTimers: Map<string, NodeJS.Timeout> = new Map();
  private lastMessageTime: Map<string, number> = new Map();
  private readonly DEFAULT_MIN_INTERVAL = 60000; // 1 phút
  private readonly DEFAULT_MAX_INTERVAL = 180000; // 3 phút
  
  /**
   * Khởi tạo timer AI cho một pet cụ thể
   */
  public startAITimer(config: PetAIManagerConfig, onMessage: (message: AIMessage) => void): void {
    // Dừng timer cũ nếu có
    this.stopAITimer(config.petId);
    
    // Tạo delay ngẫu nhiên cho lần đầu tiên
    const initialDelay = this.getRandomInterval(config.minIntervalMs, config.maxIntervalMs);
    
    const timer = setTimeout(async () => {
      await this.generateAndEmitMessage(config, onMessage);
      // Sau khi gửi message, đặt lại timer cho lần tiếp theo
      this.scheduleNextMessage(config, onMessage);
    }, initialDelay);
    
    this.activeTimers.set(config.petId, timer);
    console.log(`🤖 AI Timer started cho pet ${config.petId}, delay đầu tiên: ${Math.round(initialDelay / 1000)}s`);
  }
  
  /**
   * Dừng timer AI cho một pet cụ thể
   */
  public stopAITimer(petId: string): void {
    const timer = this.activeTimers.get(petId);
    if (timer) {
      clearTimeout(timer);
      this.activeTimers.delete(petId);
      console.log(`🛑 AI Timer stopped cho pet ${petId}`);
    }
  }
  
  /**
   * Dừng tất cả timer AI
   */
  public stopAllTimers(): void {
    this.activeTimers.forEach((timer, petId) => {
      clearTimeout(timer);
      console.log(`🛑 AI Timer stopped cho pet ${petId}`);
    });
    this.activeTimers.clear();
  }
  
  /**
   * Lên lịch cho message tiếp theo
   */
  private scheduleNextMessage(config: PetAIManagerConfig, onMessage: (message: AIMessage) => void): void {
    const nextDelay = this.getRandomInterval(config.minIntervalMs, config.maxIntervalMs);
    
    const timer = setTimeout(async () => {
      await this.generateAndEmitMessage(config, onMessage);
      this.scheduleNextMessage(config, onMessage); // Tiếp tục lên lịch
    }, nextDelay);
    
    this.activeTimers.set(config.petId, timer);
    console.log(`⏰ Scheduled next AI message cho pet ${config.petId} sau ${Math.round(nextDelay / 1000)}s`);
  }
  
  /**
   * Tạo message AI và gọi callback
   */
  private async generateAndEmitMessage(config: PetAIManagerConfig, onMessage: (message: AIMessage) => void): Promise<void> {
    try {
      // Lấy thông tin bối cảnh
      const timeInfo = getCurrentTimeInfo();
      const { city } = useSettingStore.getState();
      const isLongSession = timeTracker.isLongSession();
      
      // Lấy thông tin thời tiết (không chặn nếu lỗi)
      let weatherDescription: string | null = null;
      try {
        const weatherData = await getCurrentWeather(city);
        if ('description' in weatherData) {
          weatherDescription = weatherData.description;
        }
      } catch (error) {
        console.warn("Không thể lấy thông tin thời tiết:", error);
      }
      
      // Tạo context cho AI
      const context = {
        timeOfDay: timeInfo.timeOfDay,
        weather: weatherDescription,
        city: city,
        isLongSession: isLongSession,
      };
      
      console.log(`🧠 Generating AI message cho pet ${config.petId} với context:`, context);
      
      // Gọi AI để tạo message
      const aiResponse = await generateThoughtMessage(context);
      
      if (aiResponse.success && aiResponse.message) {
        const message: AIMessage = {
          text: aiResponse.message,
          timestamp: Date.now(),
          petId: config.petId,
          isLongSessionMessage: isLongSession,
        };
        
        // Reset timer theo dõi thời gian nếu là message nghỉ ngơi
        if (isLongSession) {
          timeTracker.resetTimer();
        }
        
        // Gọi callback
        onMessage(message);
        this.lastMessageTime.set(config.petId, Date.now());
        
        console.log(`✨ AI Message generated cho pet ${config.petId}: "${aiResponse.message}"`);
      } else {
        console.warn(`⚠️ AI failed cho pet ${config.petId}:`, aiResponse.error);
      }
      
    } catch (error) {
      console.error(`❌ Error generating AI message cho pet ${config.petId}:`, error);
    }
  }
  
  /**
   * Tạo khoảng thời gian ngẫu nhiên
   */
  private getRandomInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  /**
   * Lấy thông tin về timer đang hoạt động
   */
  public getActiveTimersInfo(): Array<{ petId: string; lastMessage?: number }> {
    const result: Array<{ petId: string; lastMessage?: number }> = [];
    
    this.activeTimers.forEach((timer, petId) => {
      result.push({
        petId,
        lastMessage: this.lastMessageTime.get(petId),
      });
    });
    
    return result;
  }
}

// Export singleton instance
export const petAIManager = new PetAIManager();
