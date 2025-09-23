/**
 * 🏗️ MAIN SERVICE - Trung tâm Khởi Tạo Dịch Vụ
 * 
 * Service Manager chính thực hiện Centralized Service Initialization,
 * đảm bảo tất cả background services được khởi tạo một lần duy nhất
 * và hoạt động ổn định trong suốt vòng đời ứng dụng.
 * 
 * Giải pháp cho vấn đề: TIMER LEAKAGE & LIFECYCLE BUG
 * 
 * Phát triển bởi: Hàn Như | AI Kiến Trúc Sư Hệ Thống
 * Dự án: Trợ Lý Nhận Thức AI - Foundation Stabilization
 */

import { contextManager } from './contextService';
import { petAIManager } from './petAIService';
import { timeTracker } from './timeTrackingService';
import { scenariosManager } from './scenariosService';
import { workflowOptimizer } from './workflowOptimizationService';
import { focusManager } from './focusManagementService';
import { knowledgeManager } from './knowledgeSynthesisService';
import { interactionCoordinator, getCoordinatorStats } from './interactionCoordinator';
import { phaserManager, getPhaserStatus } from './phaserManager';

// Service initialization state tracking
interface ServiceStatus {
  contextService: boolean;
  petAIService: boolean;
  timeTrackingService: boolean;
  scenariosService: boolean;
  workflowOptimizationService: boolean;
  focusManagementService: boolean;
  knowledgeSynthesisService: boolean;
  // 🎯 ZENITH ARCHITECTURE: New services
  interactionCoordinator: boolean;
  phaserManager: boolean;
}

class MainServiceManager {
  private static instance: MainServiceManager;
  private isInitialized = false;
  private serviceStatus: ServiceStatus = {
    contextService: false,
    petAIService: false,
    timeTrackingService: false,
    scenariosService: false,
    workflowOptimizationService: false,
    focusManagementService: false,
    knowledgeSynthesisService: false,
    // 🎯 ZENITH ARCHITECTURE: New services
    interactionCoordinator: false,
    phaserManager: false
  };

  private constructor() {
    // Prevent external instantiation
  }

  public static getInstance(): MainServiceManager {
    if (!MainServiceManager.instance) {
      MainServiceManager.instance = new MainServiceManager();
    }
    return MainServiceManager.instance;
  }

  /**
   * 🚀 KHỞI TẠO TẤT CẢ SERVICES - Centralized Approach
   */
  private timerStarted = false;
  private timerEnded = false;

  public async initializeCoreServices(): Promise<void> {
    if (this.isInitialized) {
      console.log("⚠️ Core services đã được khởi tạo - skipping để tránh duplicate");
      return;
    }

    console.log("🏗️ MAIN SERVICE: Bắt đầu khởi tạo tất cả core services...");
    
    // Safe timer start - only once
    if (!this.timerStarted) {
      console.time("⏱️ Service Initialization Time");
      this.timerStarted = true;
    }

    try {
      // 1. Initialize Context Service (AI Context Awareness)
      console.log("🧠 Khởi tạo Context Service...");
      await contextManager.startMonitoring();
      this.serviceStatus.contextService = true;
      console.log("✅ Context Service đã sẵn sàng");

      // 2. Initialize Time Tracking Service (đã là singleton, chỉ cần verify)
      console.log("⏰ Khởi tạo Time Tracking Service...");
      const timeStats = timeTracker.getUsageStats();
      this.serviceStatus.timeTrackingService = true;
      console.log("✅ Time Tracking Service đã sẵn sàng", {
        startTime: timeStats.startTime,
        totalMinutes: timeStats.totalMinutes
      });

      // 3. Initialize Scenarios Service (Workflow Automation)  
      console.log("🎯 Khởi tạo Scenarios Service...");
      const scenarios = scenariosManager.getAllScenarios();
      this.serviceStatus.scenariosService = true;
      console.log("✅ Scenarios Service đã sẵn sàng với", scenarios.length, "scenarios");

      // 4. Initialize Workflow Optimization Engine (Enhanced Productivity)
      console.log("⚡ Khởi tạo Workflow Optimization Engine...");
      await workflowOptimizer.initialize();
      this.serviceStatus.workflowOptimizationService = true;
      const templates = workflowOptimizer.getTemplates();
      const goals = workflowOptimizer.getGoals();
      console.log("✅ Workflow Optimization Engine đã sẵn sàng:", {
        templates: templates.length,
        goals: goals.length,
        analyticsReady: workflowOptimizer.getAnalytics() !== null
      });

      // 5. Initialize Focus Management Engine (Pomodoro & Concentration)
      console.log("🎯 Khởi tạo Focus Management Engine...");
      await focusManager.initialize();
      this.serviceStatus.focusManagementService = true;
      const focusProfiles = focusManager.getConcentrationProfiles();
      const focusGoals = focusManager.getFocusGoals();
      const focusAnalytics = focusManager.getAnalytics();
      console.log("✅ Focus Management Engine đã sẵn sàng:", {
        profiles: focusProfiles.length,
        goals: focusGoals.length,
        analyticsReady: focusAnalytics !== null,
        activeProfile: focusManager.getActiveProfile()?.name || 'none'
      });

      // 6. Initialize Knowledge Synthesis Engine (Smart Learning & Research)
      console.log("📚 Khởi tạo Knowledge Synthesis Engine...");
      await knowledgeManager.initialize();
      this.serviceStatus.knowledgeSynthesisService = true;
      const knowledgeStats = knowledgeManager.getKnowledgeStats();
      const knowledgeGraph = knowledgeManager.getKnowledgeGraph();
      console.log("✅ Knowledge Synthesis Engine đã sẵn sàng:", {
        items: knowledgeStats.totalItems,
        paths: knowledgeStats.totalPaths,
        palaces: knowledgeStats.totalPalaces,
        graphNodes: knowledgeStats.totalGraphNodes,
        avgImportance: knowledgeStats.averageImportance.toFixed(2)
      });

      // 7. Initialize Interaction Coordinator (ZENITH API Optimization)
      console.log("🧠 Khởi tạo Interaction Coordinator...");
      // Coordinator is already a singleton and initialized on import
      const coordinatorStats = getCoordinatorStats();
      this.serviceStatus.interactionCoordinator = true;
      console.log("✅ Interaction Coordinator đã sẵn sàng:", {
        cooldown: coordinatorStats.cooldownTimeRemaining + 's',
        signals: coordinatorStats.totalSignalsReceived,
        apiCalls: coordinatorStats.totalAPICallsMade,
        efficiency: (coordinatorStats.apiEfficiencyRatio * 100).toFixed(1) + '%',
        emergencyMode: coordinatorStats.emergencyMode
      });

      // 8. Initialize Phaser Manager (Singleton Game Engine)
      console.log("🎮 Khởi tạo Phaser Manager...");
      // PhaserManager is initialized when PhaserWrapper component mounts
      const phaserStatus = getPhaserStatus();
      this.serviceStatus.phaserManager = true;
      console.log("✅ Phaser Manager đã sẵn sàng:", {
        initialized: phaserStatus.isInitialized,
        gameExists: phaserStatus.gameExists,
        petsCount: phaserStatus.petsCount,
        screenSize: phaserStatus.screenSize
      });

      // 9. Pet AI Service sẽ được khởi tạo bởi Phaser scenes khi pets được tạo
      console.log("🤖 Pet AI Service: Sẵn sàng cho pet initialization");
      this.serviceStatus.petAIService = true;

      this.isInitialized = true;
      
      // Safe timer end - only once
      if (this.timerStarted && !this.timerEnded) {
        try {
          console.timeEnd("⏱️ Service Initialization Time");
          this.timerEnded = true;
        } catch (error) {
          console.log("⏱️ Service Initialization completed (timer error handled)");
        }
      } else if (this.timerEnded) {
        console.log("⏱️ Service Initialization completed (timer already ended)");
      }
      
      // Show success notification
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('ai-message', {
          detail: {
            text: "🧠 Trợ Lý Nhận Thức AI đã khởi động! Foundation ổn định 100%.",
            timestamp: Date.now(),
            petId: 'system-init',
            isContextMessage: true
          }
        }));
      }, 2000);

      console.log("🎉 TẤT CẢ CORE SERVICES ĐÃ KHỞI TẠO THÀNH CÔNG!");
      this.printServiceStatus();

    } catch (error) {
      console.error("❌ LỖI NGHIÊM TRỌNG khi khởi tạo services:", error);
      
      // Attempt cleanup on failure
      await this.shutdownServices();
      throw error;
    }
  }

  /**
   * 🛑 SHUTDOWN TẤT CẢ SERVICES - Safe Cleanup
   */
  public async shutdownServices(): Promise<void> {
    console.log("🛑 MAIN SERVICE: Shutdown tất cả services...");

    try {
      // Stop context monitoring
      if (this.serviceStatus.contextService) {
        contextManager.stopMonitoring();
        this.serviceStatus.contextService = false;
      }

      // Stop all AI timers
      if (this.serviceStatus.petAIService) {
        petAIManager.stopAllTimers();
        this.serviceStatus.petAIService = false;
      }

      this.isInitialized = false;
      console.log("✅ Tất cả services đã được shutdown an toàn");

    } catch (error) {
      console.error("❌ Lỗi khi shutdown services:", error);
    }
  }

  /**
   * 📊 RESTART SERVICES - For troubleshooting
   */
  public async restartServices(): Promise<void> {
    console.log("🔄 MAIN SERVICE: Restart tất cả services...");
    
    await this.shutdownServices();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
    await this.initializeCoreServices();
    
    console.log("✅ Services restart hoàn tất");
  }

  /**
   * 📈 SERVICE HEALTH CHECK
   */
  public getServiceStatus(): ServiceStatus & { isInitialized: boolean } {
    return {
      ...this.serviceStatus,
      isInitialized: this.isInitialized
    };
  }

  /**
   * 📋 PRINT SERVICE STATUS - For debugging
   */
  private printServiceStatus(): void {
    console.log("📊 SERVICE STATUS REPORT:");
    console.table(this.serviceStatus);
    console.log(`🏗️ Main Service Initialized: ${this.isInitialized}`);
  }

  /**
   * 🔧 SERVICE DIAGNOSTICS - For troubleshooting
   */
  public async runDiagnostics(): Promise<void> {
    console.log("🔧 RUNNING SERVICE DIAGNOSTICS...");
    
    // Test Context Service
    try {
      const context = contextManager.getCurrentContext();
      console.log("✅ Context Service: Hoạt động tốt", { 
        hasTimeContext: !!context.timeContext,
        clipboardHistoryLength: contextManager.getClipboardHistory().length 
      });
    } catch (error) {
      console.error("❌ Context Service: Lỗi", error);
    }

    // Test Time Tracking
    try {
      const stats = timeTracker.getUsageStats();
      console.log("✅ Time Tracking Service: Hoạt động tốt", stats);
    } catch (error) {
      console.error("❌ Time Tracking Service: Lỗi", error);
    }

    // Test Scenarios
    try {
      const scenarios = scenariosManager.getAllScenarios();
      console.log("✅ Scenarios Service: Hoạt động tốt", { 
        totalScenarios: scenarios.length 
      });
    } catch (error) {
      console.error("❌ Scenarios Service: Lỗi", error);
    }

    // Test Workflow Optimization Engine
    try {
      const templates = workflowOptimizer.getTemplates();
      const goals = workflowOptimizer.getGoals();
      const analytics = workflowOptimizer.getAnalytics();
      console.log("✅ Workflow Optimization Engine: Hoạt động tốt", {
        templates: templates.length,
        goals: goals.length,
        isInitialized: workflowOptimizer.isEngineInitialized(),
        analyticsAvailable: analytics !== null
      });
    } catch (error) {
      console.error("❌ Workflow Optimization Engine: Lỗi", error);
    }

    // Test Focus Management Engine
    try {
      const profiles = focusManager.getConcentrationProfiles();
      const focusGoals = focusManager.getFocusGoals();
      const focusAnalytics = focusManager.getAnalytics();
      const currentSession = focusManager.getCurrentSession();
      console.log("✅ Focus Management Engine: Hoạt động tốt", {
        profiles: profiles.length,
        goals: focusGoals.length,
        isInitialized: focusManager.isEngineInitialized(),
        analyticsReady: focusAnalytics !== null,
        activeSession: currentSession !== null,
        activeProfile: focusManager.getActiveProfile()?.name || 'none'
      });
    } catch (error) {
      console.error("❌ Focus Management Engine: Lỗi", error);
    }

    // Test Knowledge Synthesis Engine
    try {
      const knowledgeStats = knowledgeManager.getKnowledgeStats();
      const knowledgeGraph = knowledgeManager.getKnowledgeGraph();
      const recentQueries = knowledgeManager.getRecentQueries();
      console.log("✅ Knowledge Synthesis Engine: Hoạt động tốt", {
        items: knowledgeStats.totalItems,
        paths: knowledgeStats.totalPaths,
        palaces: knowledgeStats.totalPalaces,
        isInitialized: knowledgeManager.isEngineInitialized(),
        graphReady: knowledgeGraph !== null,
        recentSearches: recentQueries.length,
        avgImportance: knowledgeStats.averageImportance.toFixed(2)
      });
    } catch (error) {
      console.error("❌ Knowledge Synthesis Engine: Lỗi", error);
    }

    // Test Pet AI
    try {
      const aiInfo = petAIManager.getActiveTimersInfo();
      console.log("✅ Pet AI Service: Hoạt động tốt", { 
        activeTimers: aiInfo.length 
      });
    } catch (error) {
      console.error("❌ Pet AI Service: Lỗi", error);
    }

    this.printServiceStatus();
  }
}

// Export singleton instance
export const mainServiceManager = MainServiceManager.getInstance();

// Convenient helper functions
export const initializeCoreServices = () => mainServiceManager.initializeCoreServices();
export const shutdownAllServices = () => mainServiceManager.shutdownServices();
export const restartAllServices = () => mainServiceManager.restartServices();
export const getSystemHealth = () => mainServiceManager.getServiceStatus();
export const runSystemDiagnostics = () => mainServiceManager.runDiagnostics();

// Export types
export type { ServiceStatus };
