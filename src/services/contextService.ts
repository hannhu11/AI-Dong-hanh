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
   * 🚀 Khởi động monitoring context
   */
  public async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log("🧠 Context AI đã khởi động - bắt đầu giám sát ngữ cảnh...");

    // Monitor clipboard changes
    this.startClipboardMonitoring();
    
    // Monitor active window
    this.startWindowMonitoring();
    
    // Update time context
    setInterval(() => {
      this.currentContext.timeContext = getCurrentTimeInfo();
    }, 30000); // Update every 30s
  }

  /**
   * 📋 Giám sát clipboard changes
   */
  private async startClipboardMonitoring(): Promise<void> {
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
    
    // Check every 2 seconds
    setInterval(checkClipboard, 2000);
  }

  /**
   * 🪟 Giám sát active window
   */
  private async startWindowMonitoring(): Promise<void> {
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
        console.warn("Không thể lấy active window:", error);
      }
    };
    
    // Check every 5 seconds
    setInterval(checkActiveWindow, 5000);
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
   * 🤖 Phân tích clipboard content bằng AI
   */
  private async analyzeClipboardContent(event: ClipboardEvent): Promise<void> {
    try {
      let analysisPrompt = "";
      
      switch (event.type) {
        case 'error':
          analysisPrompt = `Phân tích lỗi sau và đưa ra gợi ý khắc phục ngắn gọn (< 30 từ): "${event.content.substring(0, 200)}..."`;
          break;
        case 'code':
          analysisPrompt = `Phân tích đoạn code sau và đưa ra nhận xét hữu ích (< 30 từ): "${event.content.substring(0, 200)}..."`;
          break;
        case 'long_text':
          analysisPrompt = `Tóm tắt đoạn văn bản dài này thành 3 điểm chính: "${event.content.substring(0, 300)}..."`;
          break;
        default:
          return; // Không phân tích text ngắn thường
      }

      const aiResponse = await generateThoughtMessage({
        timeOfDay: this.currentContext.timeContext.timeOfDay,
        weather: null,
        city: "Ho Chi Minh City", 
        isLongSession: false,
        customPrompt: analysisPrompt
      });

      if (aiResponse.success && aiResponse.message) {
        this.currentContext.suggestions = [aiResponse.message];
        
        // Emit context event for UI
        window.dispatchEvent(new CustomEvent('context-suggestion', {
          detail: {
            type: event.type,
            suggestion: aiResponse.message,
            content: event.content.substring(0, 100) + "...",
            timestamp: Date.now()
          }
        }));
      }
    } catch (error) {
      console.error("Error analyzing clipboard:", error);
    }
  }

  /**
   * 💡 Tạo suggestions dựa trên window title
   */
  private async generateWindowSuggestions(windowTitle: string): Promise<void> {
    try {
      const windowPrompt = `Dựa trên tiêu đề cửa sổ "${windowTitle}", đưa ra một lời gợi ý hữu ích cho người dùng (< 25 từ)`;
      
      const aiResponse = await generateThoughtMessage({
        timeOfDay: this.currentContext.timeContext.timeOfDay,
        weather: null,
        city: "Ho Chi Minh City",
        isLongSession: false,
        customPrompt: windowPrompt
      });

      if (aiResponse.success && aiResponse.message) {
        // Show as thought bubble occasionally (20% chance)
        if (Math.random() < 0.2) {
          window.dispatchEvent(new CustomEvent('ai-message', {
            detail: {
              text: aiResponse.message,
              timestamp: Date.now(),
              petId: 'context-ai',
              isContextMessage: true
            }
          }));
        }
      }
    } catch (error) {
      console.error("Error generating window suggestions:", error);
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
   * 🛑 Stop monitoring
   */
  public stopMonitoring(): void {
    this.isMonitoring = false;
    console.log("🛑 Context monitoring đã dừng");
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

// Types export
export type { ClipboardEvent, ContextData, ContextAnalysis };
