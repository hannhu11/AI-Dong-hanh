/**
 * 🧠 INTERACTION COORDINATOR - ZENITH API OPTIMIZATION
 * 
 * Giải quyết "API Saturation Crisis" - chuyển từ "phản ứng với mọi thứ" 
 * sang "hành động khi cần thiết" với cooldown logic thông minh.
 * 
 * TRIẾT LÝ: "FROM REACTIVE CHAOS TO PROACTIVE HARMONY"
 * 
 * Architecture: Zenith Intelligence Pattern
 * Author: AI Systems Architect  
 */

import { generateThoughtMessage } from './geminiService';
import { getCurrentTimeInfo } from './weatherService';
import { useSettingStore } from '../hooks/useSettingStore';

interface SignalData {
  type: 'window_change' | 'clipboard_update' | 'idle_detected' | 'activity_spike' | 'weather_update';
  data: any;
  timestamp: number;
  source: string;
}

interface ThoughtBubbleMessage {
  icon: string;
  message: string;
  timestamp: number;
  context?: any;
}

interface CoordinatorState {
  lastAPICall: number;
  totalSignalsReceived: number;
  totalAPICallsMade: number;
  signalQueue: SignalData[];
  cooldownActive: boolean;
  emergencyMode: boolean;
}

class InteractionCoordinatorSingleton {
  private static instance: InteractionCoordinatorSingleton;
  
  // ⏰ COOLDOWN CONFIGURATION
  private readonly COOLDOWN_DURATION = 4 * 60 * 1000; // 4 minutes (balanced between 3-5)
  private readonly EMERGENCY_COOLDOWN = 10 * 60 * 1000; // 10 minutes for emergency mode
  private readonly MAX_QUEUE_SIZE = 10; // Prevent memory bloat
  private readonly PRIORITY_SIGNALS = ['idle_detected', 'activity_spike'];

  // 📊 STATE TRACKING
  private state: CoordinatorState = {
    lastAPICall: 0,
    totalSignalsReceived: 0,
    totalAPICallsMade: 0,
    signalQueue: [],
    cooldownActive: false,
    emergencyMode: false
  };

  // 📡 EVENT LISTENERS
  private thoughtBubbleListeners: ((message: ThoughtBubbleMessage) => void)[] = [];

  private constructor() {
    console.log("🧠 InteractionCoordinator: Intelligent cooldown system initialized");
    this.startCooldownMonitoring();
  }

  public static getInstance(): InteractionCoordinatorSingleton {
    if (!InteractionCoordinatorSingleton.instance) {
      InteractionCoordinatorSingleton.instance = new InteractionCoordinatorSingleton();
    }
    return InteractionCoordinatorSingleton.instance;
  }

  /**
   * 📡 SIGNAL RECEPTION - Main entry point for all services
   */
  public signalReceived(type: SignalData['type'], data: any, source: string): void {
    const signal: SignalData = {
      type,
      data,
      timestamp: Date.now(),
      source
    };

    this.state.totalSignalsReceived++;

    // 🚨 Emergency mode check (too many API failures)
    if (this.state.emergencyMode) {
      console.log(`🚨 InteractionCoordinator: Emergency mode - ignoring signal from ${source}`);
      return;
    }

    // 📝 Add to queue with size limit
    this.state.signalQueue.push(signal);
    if (this.state.signalQueue.length > this.MAX_QUEUE_SIZE) {
      this.state.signalQueue.shift(); // Remove oldest signal
    }

    console.log(`📡 InteractionCoordinator: Signal received [${type}] from ${source} (queue: ${this.state.signalQueue.length})`);

    // 🎯 Process signal if cooldown allows
    this.processSignalQueue();
  }

  /**
   * 🎯 INTELLIGENT SIGNAL PROCESSING
   */
  private async processSignalQueue(): Promise<void> {
    // ⏰ Check cooldown
    const now = Date.now();
    const cooldownPeriod = this.state.emergencyMode ? this.EMERGENCY_COOLDOWN : this.COOLDOWN_DURATION;
    const timeSinceLastCall = now - this.state.lastAPICall;

    if (timeSinceLastCall < cooldownPeriod) {
      this.state.cooldownActive = true;
      const remainingCooldown = Math.ceil((cooldownPeriod - timeSinceLastCall) / 1000);
      console.log(`⏰ InteractionCoordinator: Cooldown active (${remainingCooldown}s remaining)`);
      return;
    }

    // 🎯 Select best signal to process
    const selectedSignal = this.selectBestSignal();
    if (!selectedSignal) {
      console.log("🤔 InteractionCoordinator: No worthy signals to process");
      return;
    }

    // 🚀 Make API call
    await this.makeIntelligentAPICall(selectedSignal);
  }

  /**
   * 🎯 SIGNAL PRIORITIZATION ALGORITHM
   */
  private selectBestSignal(): SignalData | null {
    if (this.state.signalQueue.length === 0) return null;

    // 🏆 Priority 1: Emergency signals
    const prioritySignal = this.state.signalQueue.find(signal => 
      this.PRIORITY_SIGNALS.includes(signal.type)
    );
    if (prioritySignal) {
      this.removeSignalFromQueue(prioritySignal);
      return prioritySignal;
    }

    // 🏆 Priority 2: Most recent signal
    const latestSignal = this.state.signalQueue[this.state.signalQueue.length - 1];
    this.state.signalQueue.pop();
    
    return latestSignal;
  }

  /**
   * 🚀 INTELLIGENT API CALL
   */
  private async makeIntelligentAPICall(signal: SignalData): Promise<void> {
    try {
      this.state.cooldownActive = true;
      this.state.lastAPICall = Date.now();
      this.state.totalAPICallsMade++;

      console.log(`🚀 InteractionCoordinator: Making API call for [${signal.type}] (Call #${this.state.totalAPICallsMade})`);

      // 📋 Create lightweight context (no heavy data)
      const lightweightContext = this.createLightweightContext(signal);

      // 🧠 Call Gemini API with optimized prompt
      const aiResponse = await generateThoughtMessage(lightweightContext);

      if (aiResponse.success && (aiResponse.message || aiResponse.thoughtBubble)) {
        // 🎨 ZENITH JSON FORMAT: Use structured thought bubble if available
        const thoughtBubble: ThoughtBubbleMessage = aiResponse.thoughtBubble 
          ? {
              icon: aiResponse.thoughtBubble.icon,
              message: aiResponse.thoughtBubble.message,
              timestamp: Date.now(),
              context: {
                signalType: signal.type,
                source: signal.source,
                format: 'json_structured'
              }
            }
          : {
              icon: this.selectContextualIcon(signal.type, lightweightContext),
              message: aiResponse.message,
              timestamp: Date.now(),
              context: {
                signalType: signal.type,
                source: signal.source,
                format: 'text_fallback'
              }
            };

        // 📢 Notify all listeners
        this.notifyThoughtBubbleListeners(thoughtBubble);

        console.log(`✨ InteractionCoordinator: ${aiResponse.thoughtBubble ? 'JSON' : 'Text'} thought bubble created [${thoughtBubble.icon}] "${thoughtBubble.message}"`);

        // 📊 Success metrics
        this.state.emergencyMode = false; // Reset emergency mode on success

      } else {
        throw new Error(aiResponse.error || 'API call failed');
      }

    } catch (error) {
      console.error(`❌ InteractionCoordinator: API call failed:`, error);
      
      // 🚨 Emergency mode activation check
      this.handleAPIFailure(error);
    } finally {
      this.state.cooldownActive = false;
    }
  }

  /**
   * 📋 CREATE LIGHTWEIGHT CONTEXT (No heavy data!)
   */
  private createLightweightContext(signal: SignalData): any {
    const timeInfo = getCurrentTimeInfo();
    const { city } = useSettingStore.getState();

    // 🎯 Context based on signal type
    let specificContext = {};
    
    switch (signal.type) {
      case 'window_change':
        specificContext = {
          windowTitle: signal.data?.title || 'Unknown App',
          action: 'switched_to'
        };
        break;
      case 'idle_detected':
        specificContext = {
          idleDuration: signal.data?.duration || 'unknown',
          action: 'idle_break'
        };
        break;
      case 'activity_spike':
        specificContext = {
          activityType: signal.data?.type || 'work',
          action: 'productivity_boost'
        };
        break;
      default:
        specificContext = {
          action: 'general_context'
        };
    }

    return {
      timeOfDay: timeInfo.timeOfDay,
      city: city,
      signalType: signal.type,
      timestamp: new Date().toISOString(),
      ...specificContext
    };
  }

  /**
   * 🎨 SELECT CONTEXTUAL ICON
   */
  private selectContextualIcon(signalType: string, context: any): string {
    const iconMap: Record<string, string> = {
      window_change: '💻',
      clipboard_update: '📋', 
      idle_detected: '😴',
      activity_spike: '⚡',
      weather_update: '🌤️'
    };

    return iconMap[signalType] || '💭';
  }

  /**
   * 🚨 HANDLE API FAILURE
   */
  private handleAPIFailure(error: any): void {
    // 🚨 Emergency mode if too many consecutive failures
    if (error.message?.includes('429')) {
      console.log("🚨 InteractionCoordinator: Rate limit hit - activating emergency mode");
      this.state.emergencyMode = true;
      
      // 📢 Send fallback offline message
      this.sendOfflineFallbackMessage();
    }
  }

  /**
   * 💾 OFFLINE FALLBACK MESSAGE
   */
  private sendOfflineFallbackMessage(): void {
    const fallbackMessages = [
      "💭 Tôi đang nghỉ giải lao một chút...",
      "🌟 Hãy tập trung vào công việc nhé!",
      "☕ Đã đến lúc uống nước chưa?",
      "🎯 Bạn đang làm rất tốt!",
      "🌸 Đừng quên nghỉ ngơi đúng lúc!"
    ];

    const randomMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
    
    const fallbackBubble: ThoughtBubbleMessage = {
      icon: '💭',
      message: randomMessage,
      timestamp: Date.now(),
      context: { source: 'offline_fallback' }
    };

    this.notifyThoughtBubbleListeners(fallbackBubble);
  }

  /**
   * ⏰ COOLDOWN MONITORING
   */
  private startCooldownMonitoring(): void {
    setInterval(() => {
      const now = Date.now();
      const cooldownPeriod = this.state.emergencyMode ? this.EMERGENCY_COOLDOWN : this.COOLDOWN_DURATION;
      const timeSinceLastCall = now - this.state.lastAPICall;

      if (this.state.cooldownActive && timeSinceLastCall >= cooldownPeriod) {
        this.state.cooldownActive = false;
        console.log("✅ InteractionCoordinator: Cooldown expired - ready for next API call");
        
        // 🎯 Process any queued signals
        if (this.state.signalQueue.length > 0) {
          this.processSignalQueue();
        }
      }

      // 🔄 Auto-exit emergency mode after extended cooldown
      if (this.state.emergencyMode && timeSinceLastCall > this.EMERGENCY_COOLDOWN * 2) {
        this.state.emergencyMode = false;
        console.log("🔄 InteractionCoordinator: Emergency mode auto-disabled");
      }

    }, 30000); // Check every 30 seconds
  }

  /**
   * 🗑️ UTILITY FUNCTIONS
   */
  private removeSignalFromQueue(signal: SignalData): void {
    const index = this.state.signalQueue.findIndex(s => s.timestamp === signal.timestamp);
    if (index !== -1) {
      this.state.signalQueue.splice(index, 1);
    }
  }

  /**
   * 📢 LISTENER MANAGEMENT
   */
  public addThoughtBubbleListener(listener: (message: ThoughtBubbleMessage) => void): void {
    this.thoughtBubbleListeners.push(listener);
  }

  public removeThoughtBubbleListener(listener: (message: ThoughtBubbleMessage) => void): void {
    const index = this.thoughtBubbleListeners.indexOf(listener);
    if (index !== -1) {
      this.thoughtBubbleListeners.splice(index, 1);
    }
  }

  private notifyThoughtBubbleListeners(message: ThoughtBubbleMessage): void {
    this.thoughtBubbleListeners.forEach(listener => {
      try {
        listener(message);
      } catch (error) {
        console.error("❌ Error notifying thought bubble listener:", error);
      }
    });
  }

  /**
   * 📊 ANALYTICS & DIAGNOSTICS
   */
  public getCoordinatorStats(): CoordinatorState & {
    apiEfficiencyRatio: number;
    cooldownTimeRemaining: number;
  } {
    const now = Date.now();
    const cooldownPeriod = this.state.emergencyMode ? this.EMERGENCY_COOLDOWN : this.COOLDOWN_DURATION;
    const timeSinceLastCall = now - this.state.lastAPICall;
    const cooldownTimeRemaining = Math.max(0, cooldownPeriod - timeSinceLastCall);

    return {
      ...this.state,
      apiEfficiencyRatio: this.state.totalSignalsReceived > 0 
        ? (this.state.totalAPICallsMade / this.state.totalSignalsReceived) 
        : 0,
      cooldownTimeRemaining: Math.ceil(cooldownTimeRemaining / 1000) // in seconds
    };
  }

  /**
   * 🧹 RESET (for testing)
   */
  public reset(): void {
    this.state = {
      lastAPICall: 0,
      totalSignalsReceived: 0,
      totalAPICallsMade: 0,
      signalQueue: [],
      cooldownActive: false,
      emergencyMode: false
    };
    console.log("🧹 InteractionCoordinator: State reset");
  }
}

// Export singleton instance
export const interactionCoordinator = InteractionCoordinatorSingleton.getInstance();

// Export helper functions for easy access  
export const sendSignal = (type: SignalData['type'], data: any, source: string) => 
  interactionCoordinator.signalReceived(type, data, source);

export const addThoughtListener = (listener: (message: ThoughtBubbleMessage) => void) =>
  interactionCoordinator.addThoughtBubbleListener(listener);

export const removeThoughtListener = (listener: (message: ThoughtBubbleMessage) => void) =>
  interactionCoordinator.removeThoughtBubbleListener(listener);

export const getCoordinatorStats = () =>
  interactionCoordinator.getCoordinatorStats();

export const resetCoordinator = () =>
  interactionCoordinator.reset();

export type { SignalData, ThoughtBubbleMessage, CoordinatorState };

console.log("🧠 InteractionCoordinator: Zenith Intelligence System loaded");
