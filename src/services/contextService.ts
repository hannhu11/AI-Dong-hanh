/**
 * 🧠 CONTEXT SERVICE - Trái tim Nhận thức của Trợ Lý AI
 * 
 * Service này giám sát clipboard và context người dùng để:
 * - Phát hiện nội dung quan trọng (errors, code, văn bản dài)
 * - Phân tích ngữ cảnh làm việc
 * - Kích hoạt AI hỗ trợ thông minh
 * 
 * Phát triển bởi: Hàn Như | Dự án: Trợ Lý Nhận Thức AI
 */

import { invoke } from '@tauri-apps/api/tauri';
import { generateThoughtMessage } from './geminiService';
import { getCurrentTimeInfo } from './weatherService';
import { offlineIntelligence, type ContextAnalysis as OfflineContextAnalysis, type WindowContext } from './offlineIntelligenceService';
import { weatherIntelligence, type WeatherData } from './weatherIntelligenceService';

// Types
interface ClipboardEvent {
  content: string;
  timestamp: number;
  type: 'text' | 'error' | 'code' | 'url' | 'long_text';
  wordCount: number;
}

interface ContextData {
  activeWindow: string | null;
  clipboard: ClipboardEvent | null;
  timeContext: any;
  weatherContext: WeatherData | null;
  suggestions: string[];
}

interface ContextAnalysis {
  isError: boolean;
  isCode: boolean;
  isImportant: boolean;
  contentType: string;
  aiSuggestion: string;
}

// Singleton Context Manager
class ContextManager {
  private static instance: ContextManager;
  private clipboardHistory: ClipboardEvent[] = [];
  private currentContext: ContextData;
  private isMonitoring = false;
  private listeners: Array<(context: ContextData) => void> = [];
  
  // 🔧 ENHANCED TIMER MANAGEMENT SYSTEM
  private clipboardTimer: NodeJS.Timeout | null = null;
  private windowTimer: NodeJS.Timeout | null = null;
  private contextUpdateTimer: NodeJS.Timeout | null = null;
  private weatherTimer: NodeJS.Timeout | null = null;
  
  // Patterns for content analysis
  private readonly ERROR_PATTERNS = [
    /error/gi, /exception/gi, /failed/gi, /cannot/gi, 
    /undefined/gi, /null pointer/gi, /stack trace/gi,
    /404/gi, /500/gi, /timeout/gi
  ];
  
  private readonly CODE_PATTERNS = [
    /function\s+\w+/gi, /class\s+\w+/gi, /def\s+\w+/gi,
    /import\s+\w+/gi, /from\s+\w+/gi, /console\.log/gi,
    /SELECT\s+\*/gi, /INSERT\s+INTO/gi, /<\w+>/gi
  ];
  
  private readonly LONG_TEXT_THRESHOLD = 100; // words

  private constructor() {
    this.currentContext = {
      activeWindow: null,
      clipboard: null,
      timeContext: getCurrentTimeInfo(),
      weatherContext: null,
      suggestions: []
    };
  }

  public static getInstance(): ContextManager {
    if (!ContextManager.instance) {
      ContextManager.instance = new ContextManager();
    }
    return ContextManager.instance;
  }

  /**
   * 🚀 Khởi động monitoring context - với Enhanced Timer Management
   */
  public async startMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      console.log("⚠️ Context monitoring đã đang chạy - restart để đảm bảo ổn định");
      this.stopMonitoring(); // Cleanup trước khi restart
    }
    
    this.isMonitoring = true;
    console.log("🧠 Context AI khởi động với Enhanced Timer Management...");

    // Monitor clipboard changes
    this.startClipboardMonitoring();
    
    // Monitor active window
    this.startWindowMonitoring();
    
    // Monitor weather (30-minute intervals for intelligent API usage)
    this.startWeatherMonitoring();
    
    // Update time context với timer tracking
    this.contextUpdateTimer = setInterval(() => {
      this.currentContext.timeContext = getCurrentTimeInfo();
    }, 30000); // Update every 30s
    
    console.log("✅ Context AI đã sẵn sàng với timer management cải tiến + Weather Intelligence!");
  }

  /**
   * 📋 Giám sát clipboard changes - Enhanced với Timer Tracking
   */
  private async startClipboardMonitoring(): Promise<void> {
    // Clear existing timer nếu có
    if (this.clipboardTimer) {
      clearInterval(this.clipboardTimer);
      this.clipboardTimer = null;
    }
    
    let lastClipboardContent = '';
    
    const checkClipboard = async () => {
      try {
        // Sử dụng Tauri clipboard API (cần implement command)
        const currentContent = await invoke<string>('get_clipboard_text');
        
        if (currentContent && currentContent !== lastClipboardContent && currentContent.length > 10) {
          lastClipboardContent = currentContent;
          
          const clipboardEvent: ClipboardEvent = {
            content: currentContent,
            timestamp: Date.now(),
            type: this.detectContentType(currentContent),
            wordCount: this.getWordCount(currentContent)
          };
          
          this.clipboardHistory.push(clipboardEvent);
          this.currentContext.clipboard = clipboardEvent;
          
          // Giữ lại chỉ 10 entries gần nhất
          if (this.clipboardHistory.length > 10) {
            this.clipboardHistory = this.clipboardHistory.slice(-10);
          }
          
          // Phân tích và đưa ra suggestions
          await this.analyzeClipboardContent(clipboardEvent);
          
          this.notifyListeners();
          
          console.log(`📋 Clipboard update: ${clipboardEvent.type} (${clipboardEvent.wordCount} words)`);
        }
      } catch (error) {
        console.warn("Không thể đọc clipboard:", error);
      }
    };
    
    // Set timer với tracking
    this.clipboardTimer = setInterval(checkClipboard, 2000);
    console.log("📋 Clipboard monitoring timer đã được khởi tạo");
  }

  /**
   * 🪟 Giám sát active window - Enhanced với Timer Tracking
   */
  private async startWindowMonitoring(): Promise<void> {
    // Clear existing timer nếu có
    if (this.windowTimer) {
      clearInterval(this.windowTimer);
      this.windowTimer = null;
    }
    
    const checkActiveWindow = async () => {
      try {
        const windowTitle = await invoke<string>('get_active_window_title');
        
        if (windowTitle && windowTitle !== this.currentContext.activeWindow) {
          this.currentContext.activeWindow = windowTitle;
          
          // Generate context-based suggestions
          await this.generateWindowSuggestions(windowTitle);
          
          this.notifyListeners();
          console.log(`🪟 Active window: ${windowTitle}`);
        }
      } catch (error) {
        // Only log warning if it's an unexpected error (not permission-related)
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (!errorMessage.includes('Failed to get window title') && !errorMessage.includes('permission')) {
          console.warn("🪟 Window monitoring error (non-critical):", errorMessage);
        }
        // Set fallback window for offline intelligence
        this.currentContext.activeWindow = "Unknown Application";
      }
    };
    
    // Set timer với tracking
    this.windowTimer = setInterval(checkActiveWindow, 5000);
    console.log("🪟 Window monitoring timer đã được khởi tạo");
  }

  /**
   * 🌤️ Giám sát thời tiết - Smart Weather Intelligence với 30-minute intervals
   */
  private async startWeatherMonitoring(): Promise<void> {
    // Clear existing timer nếu có
    if (this.weatherTimer) {
      clearInterval(this.weatherTimer);
      this.weatherTimer = null;
    }

    // Immediate weather fetch on startup
    await this.updateWeatherContext();

    // Set 30-minute interval for weather updates (intelligent API usage)
    this.weatherTimer = setInterval(async () => {
      await this.updateWeatherContext();
    }, 30 * 60 * 1000); // 30 minutes

    console.log("🌤️ Weather Intelligence monitoring khởi tạo (30-min intervals)");
  }

  /**
   * 🌡️ Update Weather Context với Intelligence
   */
  private async updateWeatherContext(): Promise<void> {
    try {
      const weather = await weatherIntelligence.getCurrentWeather("Ho Chi Minh City");
      
      if (weather) {
        this.currentContext.weatherContext = weather;
        this.notifyListeners();
        
        console.log(`🌤️ Weather updated: ${weather.temperature}°C, ${weather.condition} (${weather.description})`);
        
        // 📊 Log weather stats for debugging
        const stats = weatherIntelligence.getWeatherStats();
        console.log(`🌤️ API Usage: ${stats.dailyCallsUsed}/${stats.dailyLimit} calls`);
      }
    } catch (error) {
      console.warn("🌤️ Weather update error (non-critical):", error);
      // Keep existing weather data if available
    }
  }

  /**
   * 🔍 Phát hiện loại nội dung
   */
  private detectContentType(content: string): ClipboardEvent['type'] {
    if (this.ERROR_PATTERNS.some(pattern => pattern.test(content))) {
      return 'error';
    }
    
    if (this.CODE_PATTERNS.some(pattern => pattern.test(content))) {
      return 'code';
    }
    
    if (content.startsWith('http://') || content.startsWith('https://')) {
      return 'url';
    }
    
    if (this.getWordCount(content) > this.LONG_TEXT_THRESHOLD) {
      return 'long_text';
    }
    
    return 'text';
  }

  /**
   * 📊 Đếm số từ
   */
  private getWordCount(text: string): number {
    return text.trim().split(/\s+/).length;
  }

  /**
   * 🧠 ENHANCED AI Phân tích clipboard với Offline Intelligence
   */
  private async analyzeClipboardContent(event: ClipboardEvent): Promise<void> {
    try {
      // 🚀 PRIMARY: Offline Intelligence Analysis (Fast & Reliable)
      const offlineAnalysis = offlineIntelligence.analyzeContent(event.content);
      
      // Apply offline analysis immediately
      this.currentContext.suggestions = offlineAnalysis.suggestions;
      
      // Emit enhanced context event với offline intelligence
      window.dispatchEvent(new CustomEvent('context-suggestion', {
        detail: {
          type: event.type,
          suggestion: offlineAnalysis.suggestions[0] || "📋 Content analyzed successfully",
          content: event.content.substring(0, 100) + "...",
          timestamp: Date.now(),
          analysis: {
            patterns: offlineAnalysis.detectedPatterns,
            context: offlineAnalysis.primaryContext,
            priority: offlineAnalysis.priority,
            thoughtBubble: offlineAnalysis.thoughtBubbleMessage
          }
        }
      }));

      // 💭 Show intelligent thought bubble với random chance
      if (Math.random() < 0.3) { // 30% chance for thought bubble
        window.dispatchEvent(new CustomEvent('ai-message', {
          detail: {
            text: offlineAnalysis.thoughtBubbleMessage,
            timestamp: Date.now(),
            petId: 'offline-ai',
            isContextMessage: true,
            priority: offlineAnalysis.priority
          }
        }));
      }

      // 🌐 FALLBACK: Try external API if high priority content
      if (offlineAnalysis.priority === 'urgent' || offlineAnalysis.priority === 'high') {
        this.tryExternalAPIAnalysis(event, offlineAnalysis);
      }
      
    } catch (error) {
      console.error("Error in enhanced clipboard analysis:", error);
      
      // Ultimate fallback
      this.currentContext.suggestions = ["📋 Content processed - AI support available"];
    }
  }

  /**
   * 🌐 Fallback External API Analysis (with rate limiting to prevent 429 errors)
   */
  private lastExternalAPICall: number = 0;
  private readonly API_CALL_COOLDOWN = 60000; // 60 seconds between API calls to prevent quota exhaustion
  
  private async tryExternalAPIAnalysis(event: ClipboardEvent, offlineAnalysis: OfflineContextAnalysis): Promise<void> {
    try {
      // 🚫 RATE LIMITING: Prevent API spam and 429 errors
      const now = Date.now();
      if (now - this.lastExternalAPICall < this.API_CALL_COOLDOWN) {
        console.log("⏰ API rate limited - using offline intelligence (cooldown active)");
        return;
      }

      // 🎯 SELECTIVE API USAGE: Only for truly urgent content
      if (offlineAnalysis.priority !== 'urgent') {
        console.log("📊 Content priority not urgent - offline intelligence sufficient");
        return;
      }

      let analysisPrompt = "";
      
      switch (event.type) {
        case 'error':
          analysisPrompt = `Phân tích lỗi sau và đưa ra gợi ý khắc phục ngắn gọn (< 30 từ): "${event.content.substring(0, 200)}..."`;
          break;
        case 'code':
          // Only analyze complex code, not simple snippets
          if (event.content.length < 100) {
            console.log("🔧 Simple code - offline analysis sufficient");
            return;
          }
          analysisPrompt = `Phân tích đoạn code phức tạp sau và đưa ra nhận xét hữu ích (< 30 từ): "${event.content.substring(0, 200)}..."`;
          break;
        case 'long_text':
          // Only analyze very long text (>500 words)
          if (event.content.split(' ').length < 500) {
            console.log("📝 Text not long enough for API analysis");
            return;
          }
          analysisPrompt = `Tóm tắt đoạn văn bản dài này thành 3 điểm chính: "${event.content.substring(0, 300)}..."`;
          break;
        default:
          return;
      }

      console.log("🚀 Making strategic API call for urgent content (with rate limiting)...");
      this.lastExternalAPICall = now;

      const aiResponse = await generateThoughtMessage({
        timeOfDay: this.currentContext.timeContext.timeOfDay,
        weather: null,
        city: "Ho Chi Minh City", 
        isLongSession: false,
        customPrompt: analysisPrompt
      });

      if (aiResponse.success && aiResponse.message) {
        // Enhance suggestions với external AI
        this.currentContext.suggestions = [
          aiResponse.message, 
          ...offlineAnalysis.suggestions.slice(0, 2)
        ];
        
        // Enhanced thought bubble với external AI
        window.dispatchEvent(new CustomEvent('ai-message', {
          detail: {
            text: aiResponse.message,
            timestamp: Date.now(),
            petId: 'enhanced-ai',
            isContextMessage: true,
            priority: 'high'
          }
        }));
        
        console.log("✅ Enhanced API analysis completed successfully");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log("🔄 External API unavailable (expected with quota limits), using offline intelligence:", errorMessage);
      // Offline intelligence already applied - no action needed
    }
  }

  /**
   * 🧠 ENHANCED Window Analysis với Offline Intelligence
   */
  private async generateWindowSuggestions(windowTitle: string): Promise<void> {
    try {
      // 🚀 PRIMARY: Offline Intelligence Window Analysis
      const windowAnalysis = offlineIntelligence.analyzeWindow(windowTitle);
      
      // Update context suggestions
      this.currentContext.suggestions = windowAnalysis.suggestions;
      
      // 💭 Intelligent thought bubble based on window context
      const thoughtBubbleChance = this.calculateThoughtBubbleChance(windowAnalysis.focusLevel, windowAnalysis.context);
      
      if (Math.random() < thoughtBubbleChance) {
        const contextMessages = this.generateContextAwareMessages(windowAnalysis);
        const selectedMessage = contextMessages[Math.floor(Math.random() * contextMessages.length)];
        
        window.dispatchEvent(new CustomEvent('ai-message', {
          detail: {
            text: selectedMessage,
            timestamp: Date.now(),
            petId: 'window-ai',
            isContextMessage: true,
            contextInfo: {
              app: windowAnalysis.detectedApp,
              context: windowAnalysis.context,
              focusLevel: windowAnalysis.focusLevel
            }
          }
        }));
      }

      // 🌐 ENHANCED: Try external API for development context (very rarely to prevent API spam)
      if (windowAnalysis.context === 'development' && Math.random() < 0.02) { // Reduced from 10% to 2%
        this.tryExternalWindowAnalysis(windowTitle, windowAnalysis);
      }
      
    } catch (error) {
      console.error("Error in enhanced window analysis:", error);
    }
  }

  /**
   * 🎯 Calculate Thought Bubble Probability
   */
  private calculateThoughtBubbleChance(focusLevel: number, context: WindowContext['context']): number {
    let baseChance = 0.15; // 15% base chance
    
    // Boost for high-focus activities
    if (focusLevel > 0.8) baseChance += 0.1;
    
    // Context-specific adjustments
    const contextBonus = {
      'development': 0.15,
      'research': 0.1,
      'productivity': 0.1,
      'creativity': 0.05,
      'communication': 0.05,
      'entertainment': -0.1,
      'unknown': 0
    };
    
    return Math.max(0.05, Math.min(0.35, baseChance + (contextBonus[context] || 0)));
  }

  /**
   * 💬 Generate Context-Aware Messages
   */
  private generateContextAwareMessages(analysis: WindowContext): string[] {
    const baseMessages = {
      'development': [
        `🚀 Deep focus mode với ${analysis.detectedApp}! Coding tốt nhé!`,
        `💻 ${analysis.title.includes('error') ? 'Debug time! Tôi có thể support.' : 'Code flow đang smooth!'}`,
        `🧠 Dev environment detected - tôi sẵn sàng assist!`,
        `⚡ ${analysis.focusLevel > 0.8 ? 'High productivity zone!' : 'Đang warm up coding spirit?'}`,
        `🔧 Architecture thinking mode activated!`
      ],
      'research': [
        `🔍 Research mode ON! Đang tìm hiểu gì thú vị vậy?`,
        `📚 Knowledge gathering phase - tôi có thể tóm tắt!`,
        `💡 Discovery mode! Findings nào hay ho?`,
        `📊 Info processing - cần organize data không?`,
        `🧠 Learning in progress - tôi có thể giải thích!`
      ],
      'productivity': [
        `📋 Productive session detected! Làm tốt lắm!`,
        `⏰ Focus time - maintain the momentum!`,
        `🎯 Task completion mode - keep going!`,
        `📈 Efficiency boost activated!`,
        `💼 Professional mode ON!`
      ],
      'creativity': [
        `🎨 Creative flow state detected!`,
        `✨ Imagination mode - ideas brewing?`,
        `💭 Creative energy high! Inspire mode ON!`,
        `🌟 Art in progress - looking good!`,
        `🦋 Creativity unleashed!`
      ],
      'communication': [
        `💬 Communication hub active!`,
        `🤝 Connecting with team - great collaboration!`,
        `📞 Meeting mode - tôi có thể take notes!`,
        `💼 Professional communication flowing!`,
        `🗣️ Voice của bạn được heard!`
      ],
      'entertainment': [
        `🎵 Break time detected - enjoy!`,
        `🍿 Entertainment mode - relax thôi!`,
        `🎮 Fun time! Đừng quên hydrate nhé!`,
        `🎬 Media consumption - chill mode ON!`
      ]
    };

    const contextMessages = baseMessages[analysis.context as keyof typeof baseMessages] || [
      `💻 Đang làm việc với ${analysis.title}!`,
      `🧠 AI companion sẵn sàng support!`,
      `⚡ Workflow optimization mode!`,
      `🤖 Context awareness activated!`
    ];

    return contextMessages;
  }

  /**
   * 🌐 Fallback External Window Analysis
   */
  private async tryExternalWindowAnalysis(windowTitle: string, analysis: WindowContext): Promise<void> {
    try {
      const windowPrompt = `Dựa trên tiêu đề cửa sổ "${windowTitle}", đưa ra một lời gợi ý hữu ích cho developer (< 25 từ)`;
      
      const aiResponse = await generateThoughtMessage({
        timeOfDay: this.currentContext.timeContext.timeOfDay,
        weather: null,
        city: "Ho Chi Minh City",
        isLongSession: false,
        customPrompt: windowPrompt
      });

      if (aiResponse.success && aiResponse.message) {
        // Enhanced thought bubble with external AI
        window.dispatchEvent(new CustomEvent('ai-message', {
          detail: {
            text: `🌐 ${aiResponse.message}`,
            timestamp: Date.now(),
            petId: 'enhanced-window-ai',
            isContextMessage: true,
            priority: 'medium'
          }
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log("External window API unavailable, using offline intelligence:", errorMessage);
      // Offline intelligence already applied
    }
  }

  /**
   * 👂 Subscribe to context changes
   */
  public addListener(callback: (context: ContextData) => void): void {
    this.listeners.push(callback);
  }

  /**
   * 🔇 Unsubscribe from context changes  
   */
  public removeListener(callback: (context: ContextData) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  /**
   * 📢 Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentContext);
      } catch (error) {
        console.error("Error in context listener:", error);
      }
    });
  }

  /**
   * 📊 Get current context
   */
  public getCurrentContext(): ContextData {
    return { ...this.currentContext };
  }

  /**
   * 📋 Get clipboard history
   */
  public getClipboardHistory(): ClipboardEvent[] {
    return [...this.clipboardHistory];
  }

  /**
   * 🛑 Stop monitoring - Enhanced với Complete Timer Cleanup
   */
  public stopMonitoring(): void {
    this.isMonitoring = false;
    
    // Cleanup all timers
    if (this.clipboardTimer) {
      clearInterval(this.clipboardTimer);
      this.clipboardTimer = null;
      console.log("🧹 Clipboard timer đã được cleanup");
    }
    
    if (this.windowTimer) {
      clearInterval(this.windowTimer);
      this.windowTimer = null;
      console.log("🧹 Window timer đã được cleanup");
    }
    
    if (this.contextUpdateTimer) {
      clearInterval(this.contextUpdateTimer);
      this.contextUpdateTimer = null;
      console.log("🧹 Context update timer đã được cleanup");
    }

    if (this.weatherTimer) {
      clearInterval(this.weatherTimer);
      this.weatherTimer = null;
      console.log("🧹 Weather timer đã được cleanup");
    }
    
    // Clear listeners
    this.listeners = [];
    
    console.log("🛑 Context monitoring đã dừng hoàn toàn với full cleanup");
  }
}

// Export singleton instance
export const contextManager = ContextManager.getInstance();

// Helper functions for external use
export const startContextMonitoring = () => contextManager.startMonitoring();
export const getCurrentContext = () => contextManager.getCurrentContext();
export const getClipboardHistory = () => contextManager.getClipboardHistory();
export const addContextListener = (callback: (context: ContextData) => void) => 
  contextManager.addListener(callback);
export const removeContextListener = (callback: (context: ContextData) => void) => 
  contextManager.removeListener(callback);

// 🌤️ Weather Intelligence Helper Functions for Console Testing  
export const getWeatherContext = () => contextManager.getCurrentContext().weatherContext;
export const forceWeatherUpdate = async () => {
  // @ts-ignore - Access private method for testing
  return await contextManager.updateWeatherContext();
};
export const getWeatherStats = () => weatherIntelligence.getWeatherStats();
export const getCachedWeather = () => weatherIntelligence.getCachedWeather();

// Types export
export type { ClipboardEvent, ContextData, ContextAnalysis };
