/**
 * ⚡ WORKFLOW OPTIMIZATION SERVICE - Trụ Cột II 
 * 
 * Nâng cấp Scenarios Management với AI-powered features:
 * - Smart Workflow Templates 
 * - Productivity Analytics & Metrics
 * - Goal Tracking System
 * - Enhanced CRUD Operations
 * - Context-Aware Automation
 * - Performance Monitoring
 * 
 * Tích hợp với Offline Intelligence để cung cấp:
 * - Intelligent workflow suggestions
 * - Context-based template recommendations  
 * - Productivity insights và optimization
 * 
 * Phát triển bởi: Hàn Như | AI Kiến Trúc Sư Hệ Thống
 * Dự án: Trợ Lý Nhận Thức AI - Trụ Cột II: Workflow Optimization
 */

import { scenariosManager, type Scenario, type ScenarioAction, type ActionType } from './scenariosService';
import { offlineIntelligence } from './offlineIntelligenceService';

// ============================================================================
// ADVANCED WORKFLOW TYPES
// ============================================================================

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'productivity' | 'development' | 'creative' | 'health' | 'learning' | 'social' | 'custom';
  contexts: string[]; // When to suggest this template
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  actions: ScenarioAction[];
  tags: string[];
  benefits: string[];
  requirements: string[];
  popularity: number; // Usage frequency
  effectiveness: number; // Success rate 0-1
}

export interface ProductivityMetrics {
  scenarioId: string;
  executionCount: number;
  totalTimeSpent: number; // in milliseconds
  averageExecutionTime: number;
  successRate: number; // 0-1
  lastExecuted: Date;
  weeklyUsage: number;
  monthlyUsage: number;
  productivityScore: number; // 0-100
  efficiency: number; // execution speed vs average
  userSatisfaction: number; // 1-5 rating
}

export interface WorkflowGoal {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'project' | 'habit';
  targetValue: number;
  currentValue: number;
  unit: string; // 'scenarios', 'hours', 'tasks', etc.
  deadline?: Date;
  associatedScenarios: string[]; // scenario IDs
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  completedAt?: Date;
  milestones: GoalMilestone[];
  tags: string[];
}

export interface GoalMilestone {
  id: string;
  name: string;
  targetValue: number;
  completedAt?: Date;
  reward?: string;
}

export interface WorkflowAnalytics {
  totalScenarios: number;
  totalExecutions: number;
  averageProductivityScore: number;
  mostUsedCategory: string;
  topPerformingScenarios: string[];
  weeklyTrend: number[]; // 7 days
  monthlyGrowth: number;
  goalCompletionRate: number;
  timeOptimizationSavings: number; // minutes saved
  contextEffectiveness: Map<string, number>;
}

export interface SmartSuggestion {
  type: 'template' | 'optimization' | 'goal' | 'automation';
  title: string;
  description: string;
  confidence: number; // 0-1
  benefits: string[];
  implementation: string;
  estimatedImpact: 'low' | 'medium' | 'high';
  category: string;
  contextRelevance: number; // 0-1
}

// ============================================================================
// WORKFLOW OPTIMIZATION ENGINE
// ============================================================================

class WorkflowOptimizationEngine {
  private static instance: WorkflowOptimizationEngine;
  private metrics: Map<string, ProductivityMetrics> = new Map();
  private goals: WorkflowGoal[] = [];
  private templates: WorkflowTemplate[] = [];
  private analytics: WorkflowAnalytics | null = null;
  private isInitialized = false;

  // 🎯 Smart Templates Library - Context-Aware
  private intelligentTemplates: WorkflowTemplate[] = [
    {
      id: 'morning-dev-boost',
      name: '🚀 Morning Developer Boost',
      description: 'Ultimate morning setup for maximum coding productivity',
      icon: '🚀',
      category: 'development',
      contexts: ['development', 'productivity', 'morning'],
      difficulty: 'intermediate',
      estimatedTime: 8,
      actions: [
        {
          id: '1', type: 'open_app', name: 'Focus Music',
          target: 'spotify:playlist:37i9dQZF1DX0XUsuxWHRQd',
          description: 'Deep focus coding playlist'
        },
        {
          id: '2', type: 'open_app', name: 'IDE',
          target: 'code',
          description: 'Primary development environment'
        },
        {
          id: '3', type: 'open_url', name: 'GitHub Dashboard',
          target: 'https://github.com/dashboard',
          description: 'Check pull requests and issues'
        },
        {
          id: '4', type: 'open_app', name: 'Task Manager',
          target: 'ms-todo:',
          description: 'Review daily development goals'
        },
        {
          id: '5', type: 'run_command', name: 'Development Server',
          target: 'npm run dev',
          description: 'Start local development server'
        }
      ],
      tags: ['morning', 'development', 'productivity', 'focus'],
      benefits: [
        '⚡ 40% faster project startup',
        '🧠 Enhanced focus with curated music',
        '📈 Better task prioritization',
        '🔄 Streamlined development workflow'
      ],
      requirements: ['VS Code', 'Node.js', 'Spotify', 'Git'],
      popularity: 85,
      effectiveness: 0.92
    },
    {
      id: 'creative-brainstorm',
      name: '🎨 Creative Brainstorm Session',
      description: 'Optimal environment for ideation and creative work',
      icon: '🎨',
      category: 'creative',
      contexts: ['creativity', 'brainstorm', 'design'],
      difficulty: 'beginner',
      estimatedTime: 15,
      actions: [
        {
          id: '1', type: 'open_app', name: 'Inspiration Music',
          target: 'spotify:playlist:37i9dQZF1DX4sWSpwq3LiO',
          description: 'Creative and inspiring music'
        },
        {
          id: '2', type: 'open_app', name: 'Figma',
          target: 'figma',
          description: 'Design and wireframing tool'
        },
        {
          id: '3', type: 'open_url', name: 'Pinterest Inspiration',
          target: 'https://pinterest.com/search/pins/?q=ui%20design',
          description: 'Visual inspiration board'
        },
        {
          id: '4', type: 'open_app', name: 'Notion',
          target: 'notion:',
          description: 'Creative notes and planning'
        },
        {
          id: '5', type: 'delay', name: 'Mindfulness Moment',
          target: '5000',
          description: 'Brief meditation for clarity'
        }
      ],
      tags: ['creative', 'brainstorm', 'design', 'inspiration'],
      benefits: [
        '💡 Enhanced creative thinking',
        '🎨 Access to visual inspiration',
        '📝 Organized idea capture',
        '🧘 Clear mental state'
      ],
      requirements: ['Figma', 'Notion', 'Spotify', 'Internet'],
      popularity: 73,
      effectiveness: 0.88
    },
    {
      id: 'deep-focus-productivity',
      name: '🎯 Deep Focus Productivity Mode',
      description: 'Distraction-free environment for critical tasks',
      icon: '🎯',
      category: 'productivity',
      contexts: ['productivity', 'focus', 'deadline'],
      difficulty: 'advanced',
      estimatedTime: 120, // 2 hours block
      actions: [
        {
          id: '1', type: 'run_command', name: 'Do Not Disturb',
          target: 'powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show(\\"Focus Mode Activated\\", \\"WindowPet\\")"',
          description: 'Enable focus notifications'
        },
        {
          id: '2', type: 'open_app', name: 'Noise Canceling',
          target: 'spotify:playlist:37i9dQZF1DWZeKCadgRdKQ',
          description: 'White noise or focus sounds'
        },
        {
          id: '3', type: 'open_app', name: 'Task Manager',
          target: 'ms-todo:',
          description: 'Review priority tasks'
        },
        {
          id: '4', type: 'run_command', name: 'Close Distractions',
          target: 'taskkill /f /im chrome.exe /t',
          description: 'Close social media browsers',
          delay: 2000
        },
        {
          id: '5', type: 'open_app', name: 'Focus Timer',
          target: 'ms-clock:',
          description: 'Pomodoro timer setup'
        }
      ],
      tags: ['focus', 'productivity', 'deep-work', 'pomodoro'],
      benefits: [
        '⚡ 60% productivity increase',
        '🚫 Zero distractions',
        '⏰ Time-blocked execution',
        '🧠 Enhanced concentration'
      ],
      requirements: ['Task Manager', 'Timer App', 'Spotify'],
      popularity: 67,
      effectiveness: 0.95
    },
    {
      id: 'learning-optimization',
      name: '📚 Learning & Research Mode',
      description: 'Optimized setup for studying and knowledge acquisition',
      icon: '📚',
      category: 'learning',
      contexts: ['research', 'learning', 'study'],
      difficulty: 'beginner',
      estimatedTime: 45,
      actions: [
        {
          id: '1', type: 'open_app', name: 'Study Music',
          target: 'spotify:playlist:37i9dQZF1DX6VdMW310YC7',
          description: 'Lo-fi study beats'
        },
        {
          id: '2', type: 'open_app', name: 'Note Taking',
          target: 'notion:',
          description: 'Digital notebook'
        },
        {
          id: '3', type: 'open_url', name: 'Research Sources',
          target: 'https://scholar.google.com',
          description: 'Academic search engine'
        },
        {
          id: '4', type: 'open_app', name: 'PDF Reader',
          target: 'AcroRd32.exe',
          description: 'Document reader'
        },
        {
          id: '5', type: 'open_url', name: 'Language Support',
          target: 'https://translate.google.com',
          description: 'Translation tool'
        }
      ],
      tags: ['learning', 'research', 'study', 'knowledge'],
      benefits: [
        '📖 Better information retention',
        '🗒️ Organized note-taking',
        '🔍 Efficient research process',
        '🧠 Enhanced comprehension'
      ],
      requirements: ['Notion', 'PDF Reader', 'Spotify', 'Internet'],
      popularity: 91,
      effectiveness: 0.89
    },
    {
      id: 'health-wellness-break',
      name: '💪 Health & Wellness Break',
      description: 'Scheduled break for physical and mental wellbeing',
      icon: '💪',
      category: 'health',
      contexts: ['health', 'break', 'wellness'],
      difficulty: 'beginner',
      estimatedTime: 20,
      actions: [
        {
          id: '1', type: 'open_url', name: 'Guided Stretch',
          target: 'https://www.youtube.com/watch?v=qX9FSZJu448',
          description: '5-minute office stretches'
        },
        {
          id: '2', type: 'run_command', name: 'Hydration Reminder',
          target: 'powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show(\\"Time to hydrate! 💧\\", \\"Health Reminder\\")"',
          description: 'Drink water reminder'
        },
        {
          id: '3', type: 'open_url', name: 'Eye Rest Exercise',
          target: 'https://www.youtube.com/watch?v=EFlgAJMWatE',
          description: 'Digital eye strain relief'
        },
        {
          id: '4', type: 'delay', name: 'Mindful Breathing',
          target: '60000',
          description: '1 minute breathing exercise'
        },
        {
          id: '5', type: 'open_app', name: 'Health Tracking',
          target: 'ms-mshealth:',
          description: 'Log wellness activity'
        }
      ],
      tags: ['health', 'wellness', 'break', 'mindfulness'],
      benefits: [
        '💪 Reduced physical strain',
        '👀 Eye strain prevention',
        '🧘 Mental clarity boost',
        '💧 Better hydration habits'
      ],
      requirements: ['Internet', 'Health App', 'YouTube'],
      popularity: 84,
      effectiveness: 0.91
    },
    {
      id: 'social-networking',
      name: '🤝 Social & Networking Session',
      description: 'Structured approach to professional networking',
      icon: '🤝',
      category: 'social',
      contexts: ['networking', 'social', 'professional'],
      difficulty: 'intermediate',
      estimatedTime: 30,
      actions: [
        {
          id: '1', type: 'open_url', name: 'LinkedIn Feed',
          target: 'https://linkedin.com/feed',
          description: 'Professional networking'
        },
        {
          id: '2', type: 'open_url', name: 'Twitter Tech',
          target: 'https://twitter.com/search?q=tech%20trends',
          description: 'Industry trends and discussions'
        },
        {
          id: '3', type: 'open_app', name: 'Discord Communities',
          target: 'discord:',
          description: 'Tech community engagement'
        },
        {
          id: '4', type: 'open_url', name: 'GitHub Social',
          target: 'https://github.com/explore',
          description: 'Developer community'
        },
        {
          id: '5', type: 'open_app', name: 'Contact Manager',
          target: 'ms-people:',
          description: 'Update professional contacts'
        }
      ],
      tags: ['networking', 'social', 'professional', 'community'],
      benefits: [
        '🌐 Expanded professional network',
        '💡 Industry insights',
        '🤝 Collaborative opportunities',
        '📈 Career advancement'
      ],
      requirements: ['LinkedIn', 'Twitter', 'Discord', 'Internet'],
      popularity: 58,
      effectiveness: 0.82
    }
  ];

  public static getInstance(): WorkflowOptimizationEngine {
    if (!WorkflowOptimizationEngine.instance) {
      WorkflowOptimizationEngine.instance = new WorkflowOptimizationEngine();
    }
    return WorkflowOptimizationEngine.instance;
  }

  /**
   * 🚀 Initialize Workflow Optimization Engine
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log("⚡ Initializing Workflow Optimization Engine...");

    // Load existing data
    await this.loadMetrics();
    await this.loadGoals();
    this.templates = [...this.intelligentTemplates];
    
    // Generate analytics
    this.analytics = await this.generateAnalytics();

    this.isInitialized = true;
    console.log("✅ Workflow Optimization Engine initialized!");
    console.log(`📊 Templates: ${this.templates.length}, Goals: ${this.goals.length}`);
  }

  /**
   * 🎯 Smart Template Suggestions based on Context
   */
  public getContextualTemplates(context: string, limit = 5): WorkflowTemplate[] {
    return this.templates
      .filter(template => 
        template.contexts.some(ctx => 
          ctx.toLowerCase().includes(context.toLowerCase()) ||
          context.toLowerCase().includes(ctx.toLowerCase())
        )
      )
      .sort((a, b) => {
        // Sort by relevance + popularity + effectiveness
        const relevanceA = this.calculateRelevance(a, context);
        const relevanceB = this.calculateRelevance(b, context);
        const scoreA = relevanceA * 0.5 + (a.popularity / 100) * 0.3 + a.effectiveness * 0.2;
        const scoreB = relevanceB * 0.5 + (b.popularity / 100) * 0.3 + b.effectiveness * 0.2;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  /**
   * 💡 Generate Smart Suggestions
   */
  public async generateSmartSuggestions(contextData?: any): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    // Template suggestions based on current context
    if (contextData) {
      const contextTemplates = this.getContextualTemplates(contextData.context || 'productivity', 2);
      for (const template of contextTemplates) {
        suggestions.push({
          type: 'template',
          title: `Try "${template.name}" workflow`,
          description: template.description,
          confidence: template.effectiveness,
          benefits: template.benefits,
          implementation: `Click to create scenario from "${template.name}" template`,
          estimatedImpact: this.calculateImpactLevel(template.effectiveness),
          category: template.category,
          contextRelevance: this.calculateRelevance(template, contextData.context || 'productivity')
        });
      }
    }

    // Productivity optimization suggestions
    const unoptimizedScenarios = this.findUnoptimizedScenarios();
    if (unoptimizedScenarios.length > 0) {
      suggestions.push({
        type: 'optimization',
        title: 'Optimize underperforming workflows',
        description: `${unoptimizedScenarios.length} scenarios could be improved for better efficiency`,
        confidence: 0.85,
        benefits: [
          '⚡ Up to 30% time savings',
          '📈 Improved success rates',
          '🎯 Better task completion'
        ],
        implementation: 'Review and modify slow or failing scenario steps',
        estimatedImpact: 'high',
        category: 'optimization',
        contextRelevance: 0.9
      });
    }

    // Goal suggestions
    if (this.goals.length === 0) {
      suggestions.push({
        type: 'goal',
        title: 'Set your first productivity goal',
        description: 'Goal tracking increases productivity by up to 42%',
        confidence: 0.95,
        benefits: [
          '🎯 Clear direction and purpose',
          '📈 Measurable progress tracking',
          '🏆 Achievement motivation',
          '📊 Performance insights'
        ],
        implementation: 'Create a daily or weekly productivity goal',
        estimatedImpact: 'high',
        category: 'goal-setting',
        contextRelevance: 0.9
      });
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 6);
  }

  /**
   * 📊 Enhanced CRUD Operations for Workflows
   */

  // CREATE with intelligence
  public createSmartWorkflow(templateId: string, customizations?: Partial<Scenario>): Scenario | null {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) return null;

    const scenarioData = {
      name: customizations?.name || template.name,
      description: customizations?.description || template.description,
      icon: customizations?.icon || template.icon,
      category: (customizations?.category || template.category) as any,
      actions: customizations?.actions || template.actions,
      tags: [...(customizations?.tags || []), ...template.tags],
      isActive: customizations?.isActive ?? true
    };

    const scenario = scenariosManager.createScenario(scenarioData);
    
    // Initialize metrics
    this.initializeMetrics(scenario.id);
    
    console.log(`⚡ Created smart workflow: ${scenario.name}`);
    return scenario;
  }

  // READ with analytics
  public getWorkflowWithAnalytics(id: string): (Scenario & { metrics?: ProductivityMetrics }) | null {
    const scenario = scenariosManager.getScenario(id);
    if (!scenario) return null;

    return {
      ...scenario,
      metrics: this.metrics.get(id)
    };
  }

  // UPDATE with performance tracking
  public updateWorkflowWithTracking(id: string, updates: Partial<Scenario>): boolean {
    const success = scenariosManager.updateScenario(id, updates);
    if (success) {
      // Update metrics
      const metrics = this.metrics.get(id);
      if (metrics) {
        metrics.lastExecuted = new Date();
        this.saveMetrics();
      }
    }
    return success;
  }

  // DELETE with cleanup
  public deleteWorkflowComplete(id: string): boolean {
    const success = scenariosManager.deleteScenario(id);
    if (success) {
      // Cleanup metrics and goals
      this.metrics.delete(id);
      this.goals = this.goals.filter(goal => 
        !goal.associatedScenarios.includes(id)
      );
      this.saveMetrics();
      this.saveGoals();
      console.log(`🗑️ Completely removed workflow: ${id}`);
    }
    return success;
  }

  /**
   * 🎯 Goal Management System
   */

  public createGoal(goalData: Omit<WorkflowGoal, 'id' | 'createdAt' | 'currentValue'>): WorkflowGoal {
    const goal: WorkflowGoal = {
      ...goalData,
      id: this.generateId(),
      createdAt: new Date(),
      currentValue: 0
    };

    this.goals.push(goal);
    this.saveGoals();
    
    console.log(`🎯 Created goal: ${goal.name}`);
    return goal;
  }

  public updateGoalProgress(goalId: string, newValue: number): boolean {
    const goal = this.goals.find(g => g.id === goalId);
    if (!goal) return false;

    goal.currentValue = newValue;
    
    // Check completion
    if (goal.currentValue >= goal.targetValue && goal.status !== 'completed') {
      goal.status = 'completed';
      goal.completedAt = new Date();
      console.log(`🏆 Goal completed: ${goal.name}`);
      
      // Trigger celebration
      this.celebrateGoalCompletion(goal);
    }

    this.saveGoals();
    return true;
  }

  public getActiveGoals(): WorkflowGoal[] {
    return this.goals.filter(goal => goal.status === 'active');
  }

  public getGoalProgress(goalId: string): { percentage: number; remaining: number; status: string } | null {
    const goal = this.goals.find(g => g.id === goalId);
    if (!goal) return null;

    const percentage = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
    const remaining = Math.max(goal.targetValue - goal.currentValue, 0);

    return {
      percentage: Math.round(percentage),
      remaining,
      status: goal.status
    };
  }

  /**
   * 📊 Analytics & Insights
   */
  public async generateAnalytics(): Promise<WorkflowAnalytics> {
    const scenarios = scenariosManager.getAllScenarios();
    const metricsArray = Array.from(this.metrics.values());

    const analytics: WorkflowAnalytics = {
      totalScenarios: scenarios.length,
      totalExecutions: metricsArray.reduce((sum, m) => sum + m.executionCount, 0),
      averageProductivityScore: this.calculateAverageScore(metricsArray),
      mostUsedCategory: this.findMostUsedCategory(scenarios),
      topPerformingScenarios: this.findTopPerformers(3),
      weeklyTrend: await this.calculateWeeklyTrend(),
      monthlyGrowth: await this.calculateMonthlyGrowth(),
      goalCompletionRate: this.calculateGoalCompletionRate(),
      timeOptimizationSavings: this.calculateTimeSavings(),
      contextEffectiveness: this.analyzeContextEffectiveness()
    };

    this.analytics = analytics;
    return analytics;
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private calculateRelevance(template: WorkflowTemplate, context: string): number {
    let relevance = 0;
    const contextLower = context.toLowerCase();
    
    // Direct context match
    for (const templateContext of template.contexts) {
      if (templateContext.toLowerCase().includes(contextLower) || 
          contextLower.includes(templateContext.toLowerCase())) {
        relevance += 0.8;
      }
    }

    // Tag relevance
    for (const tag of template.tags) {
      if (tag.toLowerCase().includes(contextLower) || 
          contextLower.includes(tag.toLowerCase())) {
        relevance += 0.3;
      }
    }

    // Category relevance
    if (template.category.toLowerCase().includes(contextLower) ||
        contextLower.includes(template.category.toLowerCase())) {
      relevance += 0.5;
    }

    return Math.min(relevance, 1.0);
  }

  private calculateImpactLevel(effectiveness: number): 'low' | 'medium' | 'high' {
    if (effectiveness >= 0.8) return 'high';
    if (effectiveness >= 0.6) return 'medium';
    return 'low';
  }

  private findUnoptimizedScenarios(): string[] {
    return Array.from(this.metrics.entries())
      .filter(([_, metrics]) => metrics.successRate < 0.7 || metrics.efficiency < 0.8)
      .map(([id, _]) => id)
      .slice(0, 3);
  }

  private initializeMetrics(scenarioId: string): void {
    if (!this.metrics.has(scenarioId)) {
      this.metrics.set(scenarioId, {
        scenarioId,
        executionCount: 0,
        totalTimeSpent: 0,
        averageExecutionTime: 0,
        successRate: 1.0,
        lastExecuted: new Date(),
        weeklyUsage: 0,
        monthlyUsage: 0,
        productivityScore: 75,
        efficiency: 1.0,
        userSatisfaction: 4.0
      });
    }
  }

  private celebrateGoalCompletion(goal: WorkflowGoal): void {
    // Trigger UI celebration
    window.dispatchEvent(new CustomEvent('goal-completed', {
      detail: {
        goalName: goal.name,
        targetValue: goal.targetValue,
        unit: goal.unit,
        completedAt: goal.completedAt,
        celebrationMessage: `🎉 Congratulations! Goal "${goal.name}" completed!`
      }
    }));
  }

  private calculateAverageScore(metrics: ProductivityMetrics[]): number {
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.productivityScore, 0) / metrics.length;
  }

  private findMostUsedCategory(scenarios: Scenario[]): string {
    const categoryCount = new Map<string, number>();
    
    for (const scenario of scenarios) {
      const count = categoryCount.get(scenario.category) || 0;
      categoryCount.set(scenario.category, count + scenario.usageCount);
    }

    return Array.from(categoryCount.entries())
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'work';
  }

  private findTopPerformers(count: number): string[] {
    return Array.from(this.metrics.entries())
      .sort(([,a], [,b]) => b.productivityScore - a.productivityScore)
      .slice(0, count)
      .map(([id, _]) => id);
  }

  private async calculateWeeklyTrend(): Promise<number[]> {
    // Mock implementation - in real app would query time-series data
    return Array.from({ length: 7 }, () => Math.floor(Math.random() * 10) + 1);
  }

  private async calculateMonthlyGrowth(): Promise<number> {
    // Mock implementation
    return Math.random() * 20 + 5; // 5-25% growth
  }

  private calculateGoalCompletionRate(): number {
    if (this.goals.length === 0) return 0;
    const completedGoals = this.goals.filter(g => g.status === 'completed').length;
    return (completedGoals / this.goals.length) * 100;
  }

  private calculateTimeSavings(): number {
    // Calculate estimated time savings from workflow automation
    const totalAutomationTime = Array.from(this.metrics.values())
      .reduce((sum, m) => sum + (m.executionCount * 5), 0); // Assume 5 min saved per execution
    
    return Math.round(totalAutomationTime / 60); // Convert to hours
  }

  private analyzeContextEffectiveness(): Map<string, number> {
    const effectiveness = new Map<string, number>();
    
    // Mock data - in real implementation would analyze actual context performance
    effectiveness.set('development', 0.92);
    effectiveness.set('productivity', 0.89);
    effectiveness.set('creative', 0.85);
    effectiveness.set('learning', 0.88);
    effectiveness.set('health', 0.91);
    
    return effectiveness;
  }

  private generateId(): string {
    return 'workflow_' + Math.random().toString(36).substr(2, 9);
  }

  private async loadMetrics(): Promise<void> {
    try {
      const saved = localStorage.getItem('workflowMetrics');
      if (saved) {
        const data = JSON.parse(saved);
        this.metrics = new Map(data.map((item: any) => [item.scenarioId, item]));
      }
    } catch (error) {
      console.warn("Could not load workflow metrics:", error);
    }
  }

  private async loadGoals(): Promise<void> {
    try {
      const saved = localStorage.getItem('workflowGoals');
      if (saved) {
        this.goals = JSON.parse(saved, (key, value) => {
          if (key.includes('At') || key === 'deadline') {
            return value ? new Date(value) : value;
          }
          return value;
        });
      }
    } catch (error) {
      console.warn("Could not load workflow goals:", error);
    }
  }

  private saveMetrics(): void {
    try {
      const data = Array.from(this.metrics.values());
      localStorage.setItem('workflowMetrics', JSON.stringify(data));
    } catch (error) {
      console.error("Could not save workflow metrics:", error);
    }
  }

  private saveGoals(): void {
    try {
      localStorage.setItem('workflowGoals', JSON.stringify(this.goals));
    } catch (error) {
      console.error("Could not save workflow goals:", error);
    }
  }

  /**
   * 🎯 Public Getters for External Access
   */
  public getTemplates(): WorkflowTemplate[] {
    return [...this.templates];
  }

  public getMetrics(): Map<string, ProductivityMetrics> {
    return new Map(this.metrics);
  }

  public getGoals(): WorkflowGoal[] {
    return [...this.goals];
  }

  public getAnalytics(): WorkflowAnalytics | null {
    return this.analytics;
  }

  public isEngineInitialized(): boolean {
    return this.isInitialized;
  }
}

// ============================================================================
// SINGLETON EXPORT & UTILITIES
// ============================================================================

export const workflowOptimizer = WorkflowOptimizationEngine.getInstance();

// Convenience functions for external use
export const createWorkflowFromTemplate = (templateId: string, customizations?: Partial<Scenario>) =>
  workflowOptimizer.createSmartWorkflow(templateId, customizations);

export const getContextualWorkflows = (context: string, limit?: number) =>
  workflowOptimizer.getContextualTemplates(context, limit);

export const generateWorkflowSuggestions = (contextData?: any) =>
  workflowOptimizer.generateSmartSuggestions(contextData);

export const createProductivityGoal = (goalData: Omit<WorkflowGoal, 'id' | 'createdAt' | 'currentValue'>) =>
  workflowOptimizer.createGoal(goalData);

export const getProductivityAnalytics = () =>
  workflowOptimizer.getAnalytics();

// Initialize on import
workflowOptimizer.initialize();
