/**
 * 🎯 FOCUS MANAGEMENT SERVICE - Trụ Cột III
 * 
 * Advanced Focus & Concentration Management System:
 * - Pomodoro Timer với customizable intervals
 * - Concentration Mode với distraction blocking
 * - Focus Analytics & Productivity Tracking
 * - Ambient Sound & Environment Control
 * - Break Reminders & Health Integration
 * - Focus Goals & Achievement System
 * 
 * Tích hợp với Offline Intelligence để:
 * - Smart break suggestions based on context
 * - Productivity pattern recognition
 * - Optimal work session recommendations
 * 
 * Phát triển bởi: Hàn Như | AI Kiến Trúc Sư Hệ Thống
 * Dự án: Trợ Lý Nhận Thức AI - Trụ Cột III: Focus Management
 */

import { offlineIntelligence } from './offlineIntelligenceService';

// ============================================================================
// FOCUS MANAGEMENT TYPES
// ============================================================================

export interface PomodoroSession {
  id: string;
  type: 'focus' | 'short_break' | 'long_break';
  duration: number; // in minutes
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  interrupted: boolean;
  interruptionReason?: string;
  productivity: number; // 1-10 scale
  context: string; // what they were working on
  distractions: number; // count of interruptions
  sessionNotes?: string;
}

export interface ConcentrationProfile {
  id: string;
  name: string;
  description: string;
  focusDuration: number; // in minutes
  shortBreakDuration: number; // in minutes  
  longBreakDuration: number; // in minutes
  longBreakInterval: number; // after how many sessions
  ambientSound: string; // sound URL or type
  blockDistractions: boolean;
  dimLights: boolean;
  showMotivation: boolean;
  customSettings: Record<string, any>;
}

export interface FocusAnalytics {
  dailyFocusTime: number; // minutes
  weeklyFocusTime: number; // minutes
  monthlyFocusTime: number; // minutes
  averageSessionLength: number; // minutes
  completionRate: number; // percentage
  peakFocusHours: string[]; // array of hours like ["09:00", "14:00"]
  productivityTrend: number[]; // last 7 days
  distractionPattern: { type: string; count: number; avgDuration: number }[];
  bestFocusContext: string; // most productive activity
  streakDays: number; // consecutive days with focus sessions
  totalSessions: number;
  focusScore: number; // overall focus effectiveness 0-100
}

export interface FocusGoal {
  id: string;
  name: string;
  type: 'daily_focus_time' | 'session_count' | 'completion_rate' | 'streak' | 'custom';
  targetValue: number;
  currentValue: number;
  unit: string; // 'minutes', 'sessions', 'days', '%'
  deadline?: Date;
  reward?: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
  completedAt?: Date;
}

export interface AmbientEnvironment {
  id: string;
  name: string;
  soundUrl?: string;
  soundType: 'nature' | 'white_noise' | 'cafe' | 'rain' | 'ocean' | 'forest' | 'silence';
  volume: number; // 0-100
  visualTheme?: string;
  lightingMode: 'dim' | 'normal' | 'bright' | 'dynamic';
  temperature?: number; // preference tracking
}

export interface BreakActivity {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  category: 'physical' | 'mental' | 'social' | 'creative' | 'rest';
  energyLevel: 'low' | 'medium' | 'high';
  location: 'desk' | 'indoor' | 'outdoor' | 'any';
  benefits: string[];
  instructions: string[];
}

// ============================================================================
// FOCUS MANAGEMENT ENGINE
// ============================================================================

class FocusManagementEngine {
  private static instance: FocusManagementEngine;
  private currentSession: PomodoroSession | null = null;
  private sessionTimer: NodeJS.Timeout | null = null;
  private concentrationProfiles: ConcentrationProfile[] = [];
  private activeProfile: ConcentrationProfile | null = null;
  private sessions: PomodoroSession[] = [];
  private analytics: FocusAnalytics | null = null;
  private goals: FocusGoal[] = [];
  private isInitialized = false;

  // 🎯 Predefined Concentration Profiles
  private defaultProfiles: ConcentrationProfile[] = [
    {
      id: 'classic-pomodoro',
      name: '🍅 Classic Pomodoro',
      description: 'Traditional 25/5/15 minute intervals',
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
      ambientSound: 'silence',
      blockDistractions: false,
      dimLights: false,
      showMotivation: true,
      customSettings: {}
    },
    {
      id: 'deep-focus-mode',
      name: '🧠 Deep Focus Mode',
      description: 'Extended 45-minute sessions for complex tasks',
      focusDuration: 45,
      shortBreakDuration: 10,
      longBreakDuration: 20,
      longBreakInterval: 3,
      ambientSound: 'white_noise',
      blockDistractions: true,
      dimLights: true,
      showMotivation: false,
      customSettings: { 
        strictMode: true,
        noNotifications: true
      }
    },
    {
      id: 'creative-flow',
      name: '🎨 Creative Flow',
      description: 'Flexible timing for creative work',
      focusDuration: 35,
      shortBreakDuration: 8,
      longBreakDuration: 25,
      longBreakInterval: 3,
      ambientSound: 'nature',
      blockDistractions: false,
      dimLights: false,
      showMotivation: true,
      customSettings: {
        flexibleBreaks: true,
        inspirationMode: true
      }
    },
    {
      id: 'sprint-productivity',
      name: '⚡ Sprint Productivity',
      description: 'Short bursts for high-energy tasks',
      focusDuration: 15,
      shortBreakDuration: 3,
      longBreakDuration: 10,
      longBreakInterval: 5,
      ambientSound: 'cafe',
      blockDistractions: false,
      dimLights: false,
      showMotivation: true,
      customSettings: {
        highEnergy: true,
        quickTransitions: true
      }
    },
    {
      id: 'marathon-mode',
      name: '🏃 Marathon Mode',
      description: 'Extended sessions with wellness breaks',
      focusDuration: 60,
      shortBreakDuration: 15,
      longBreakDuration: 30,
      longBreakInterval: 2,
      ambientSound: 'ocean',
      blockDistractions: true,
      dimLights: true,
      showMotivation: true,
      customSettings: {
        healthFocus: true,
        stretchReminders: true
      }
    }
  ];

  // 🎵 Ambient Sound Library
  private ambientSounds = {
    'silence': { name: 'Silence', url: null },
    'white_noise': { name: 'White Noise', url: 'https://www.soundslate.com/white-noise.mp3' },
    'nature': { name: 'Nature Sounds', url: 'https://www.soundslate.com/forest.mp3' },
    'rain': { name: 'Rain', url: 'https://www.soundslate.com/rain.mp3' },
    'ocean': { name: 'Ocean Waves', url: 'https://www.soundslate.com/ocean.mp3' },
    'cafe': { name: 'Cafe Ambiance', url: 'https://www.soundslate.com/cafe.mp3' },
    'forest': { name: 'Forest', url: 'https://www.soundslate.com/deep-forest.mp3' }
  };

  // 🏃 Break Activities Library
  private breakActivities: BreakActivity[] = [
    {
      id: 'desk-stretch',
      name: '🧘 Desk Stretches',
      description: 'Simple stretches to do at your desk',
      duration: 3,
      category: 'physical',
      energyLevel: 'low',
      location: 'desk',
      benefits: ['Reduces muscle tension', 'Improves posture', 'Increases blood flow'],
      instructions: [
        'Neck rolls (5 each direction)',
        'Shoulder shrugs (10 reps)',
        'Wrist rotations',
        'Back twists in chair'
      ]
    },
    {
      id: 'breathing-exercise',
      name: '🫁 Breathing Exercise',
      description: 'Deep breathing for mental clarity',
      duration: 2,
      category: 'mental',
      energyLevel: 'low',
      location: 'any',
      benefits: ['Reduces stress', 'Improves focus', 'Oxygenates brain'],
      instructions: [
        'Sit comfortably',
        'Breathe in for 4 counts',
        'Hold for 4 counts',
        'Breathe out for 6 counts',
        'Repeat 5-10 times'
      ]
    },
    {
      id: 'walk-around',
      name: '🚶 Quick Walk',
      description: 'Short walk to refresh mind and body',
      duration: 5,
      category: 'physical',
      energyLevel: 'medium',
      location: 'indoor',
      benefits: ['Boosts circulation', 'Mental refresh', 'Reduces eye strain'],
      instructions: [
        'Walk around your space',
        'Focus on different objects',
        'Take deep breaths',
        'Gentle movement'
      ]
    },
    {
      id: 'hydration-snack',
      name: '🥤 Hydration & Snack',
      description: 'Refuel your body and brain',
      duration: 4,
      category: 'rest',
      energyLevel: 'low',
      location: 'any',
      benefits: ['Maintains energy', 'Prevents fatigue', 'Brain nutrition'],
      instructions: [
        'Drink a glass of water',
        'Healthy snack if needed',
        'Avoid heavy foods',
        'Mindful consumption'
      ]
    },
    {
      id: 'creativity-boost',
      name: '🎨 Creative Doodling',
      description: 'Quick creative exercise to stimulate right brain',
      duration: 3,
      category: 'creative',
      energyLevel: 'medium',
      location: 'desk',
      benefits: ['Stimulates creativity', 'Relaxes mind', 'Different thinking'],
      instructions: [
        'Get paper and pen',
        'Draw random shapes',
        'Let your mind wander',
        'No judgment, just create'
      ]
    }
  ];

  public static getInstance(): FocusManagementEngine {
    if (!FocusManagementEngine.instance) {
      FocusManagementEngine.instance = new FocusManagementEngine();
    }
    return FocusManagementEngine.instance;
  }

  /**
   * 🚀 Initialize Focus Management Engine
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log("🎯 Initializing Focus Management Engine...");

    // Load saved data
    await this.loadSessions();
    await this.loadGoals();
    await this.loadProfiles();

    // Set default profile if none exists
    if (this.concentrationProfiles.length === 0) {
      this.concentrationProfiles = [...this.defaultProfiles];
      this.saveProfiles();
    }

    // Set active profile
    if (!this.activeProfile) {
      this.activeProfile = this.concentrationProfiles[0];
    }

    // Generate analytics
    this.analytics = await this.generateAnalytics();

    this.isInitialized = true;
    console.log("✅ Focus Management Engine initialized!");
    console.log(`🎯 Profiles: ${this.concentrationProfiles.length}, Sessions: ${this.sessions.length}, Goals: ${this.goals.length}`);
  }

  /**
   * ⏰ POMODORO TIMER SYSTEM
   */

  public startFocusSession(context: string = 'work', customDuration?: number): boolean {
    if (this.currentSession && !this.currentSession.completed) {
      console.warn("Focus session already in progress");
      return false;
    }

    if (!this.activeProfile) {
      console.error("No active concentration profile");
      return false;
    }

    const duration = customDuration || this.activeProfile.focusDuration;
    
    this.currentSession = {
      id: this.generateSessionId(),
      type: 'focus',
      duration,
      startTime: new Date(),
      completed: false,
      interrupted: false,
      productivity: 0,
      context,
      distractions: 0
    };

    // Start timer
    this.sessionTimer = setTimeout(() => {
      this.completeSession();
    }, duration * 60 * 1000);

    // Apply concentration environment
    this.activateConcentrationMode();

    // Emit session start event
    this.emitSessionEvent('session-started', {
      session: this.currentSession,
      profile: this.activeProfile,
      expectedEndTime: new Date(Date.now() + duration * 60 * 1000)
    });

    console.log(`🎯 Focus session started: ${duration} minutes for ${context}`);
    return true;
  }

  public startBreak(type: 'short' | 'long' = 'short'): boolean {
    if (this.currentSession && !this.currentSession.completed) {
      console.warn("Please complete current session first");
      return false;
    }

    if (!this.activeProfile) {
      console.error("No active concentration profile");
      return false;
    }

    const duration = type === 'short' 
      ? this.activeProfile.shortBreakDuration 
      : this.activeProfile.longBreakDuration;

    this.currentSession = {
      id: this.generateSessionId(),
      type: type === 'short' ? 'short_break' : 'long_break',
      duration,
      startTime: new Date(),
      completed: false,
      interrupted: false,
      productivity: 0,
      context: 'break',
      distractions: 0
    };

    // Start timer
    this.sessionTimer = setTimeout(() => {
      this.completeSession();
    }, duration * 60 * 1000);

    // Suggest break activity
    const suggestedActivity = this.suggestBreakActivity(duration, type);

    // Emit break start event
    this.emitSessionEvent('break-started', {
      session: this.currentSession,
      suggestedActivity,
      expectedEndTime: new Date(Date.now() + duration * 60 * 1000)
    });

    console.log(`☕ Break started: ${duration} minutes (${type})`);
    return true;
  }

  public pauseSession(): boolean {
    if (!this.currentSession || this.currentSession.completed) {
      return false;
    }

    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }

    this.emitSessionEvent('session-paused', {
      session: this.currentSession,
      pausedAt: new Date()
    });

    console.log("⏸️ Session paused");
    return true;
  }

  public resumeSession(): boolean {
    if (!this.currentSession || this.currentSession.completed) {
      return false;
    }

    const elapsed = Date.now() - this.currentSession.startTime.getTime();
    const remaining = (this.currentSession.duration * 60 * 1000) - elapsed;

    if (remaining <= 0) {
      this.completeSession();
      return true;
    }

    this.sessionTimer = setTimeout(() => {
      this.completeSession();
    }, remaining);

    this.emitSessionEvent('session-resumed', {
      session: this.currentSession,
      resumedAt: new Date(),
      remainingTime: Math.ceil(remaining / 1000 / 60)
    });

    console.log("▶️ Session resumed");
    return true;
  }

  public skipSession(): boolean {
    if (!this.currentSession) {
      return false;
    }

    this.currentSession.interrupted = true;
    this.currentSession.interruptionReason = 'manually_skipped';
    this.completeSession();

    console.log("⏭️ Session skipped");
    return true;
  }

  private completeSession(): void {
    if (!this.currentSession) return;

    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }

    this.currentSession.endTime = new Date();
    this.currentSession.completed = true;

    // Calculate productivity (basic implementation)
    if (this.currentSession.type === 'focus') {
      this.currentSession.productivity = Math.max(1, 10 - this.currentSession.distractions);
    }

    // Save session
    this.sessions.push({ ...this.currentSession });
    this.saveSessions();

    // Update analytics
    this.updateAnalytics();

    // Check goal progress
    this.updateGoalProgress();

    // Emit completion event
    this.emitSessionEvent('session-completed', {
      session: this.currentSession,
      completedAt: new Date(),
      nextSuggestion: this.getNextSessionSuggestion()
    });

    // Deactivate concentration mode
    if (this.currentSession.type === 'focus') {
      this.deactivateConcentrationMode();
    }

    console.log(`✅ Session completed: ${this.currentSession.type} (${this.currentSession.duration}min)`);
    
    this.currentSession = null;
  }

  /**
   * 🧠 CONCENTRATION MODE SYSTEM
   */

  private activateConcentrationMode(): void {
    if (!this.activeProfile) return;

    // Apply environment settings
    if (this.activeProfile.ambientSound !== 'silence') {
      this.playAmbientSound(this.activeProfile.ambientSound);
    }

    if (this.activeProfile.blockDistractions) {
      this.enableDistractionBlocking();
    }

    if (this.activeProfile.showMotivation) {
      this.showMotivationalMessage();
    }

    // Emit concentration mode event
    this.emitSessionEvent('concentration-activated', {
      profile: this.activeProfile,
      settings: this.activeProfile.customSettings
    });

    console.log(`🧠 Concentration mode activated: ${this.activeProfile.name}`);
  }

  private deactivateConcentrationMode(): void {
    // Stop ambient sound
    this.stopAmbientSound();

    // Disable distraction blocking
    this.disableDistractionBlocking();

    // Emit concentration mode event
    this.emitSessionEvent('concentration-deactivated', {
      completedAt: new Date()
    });

    console.log("🧠 Concentration mode deactivated");
  }

  private playAmbientSound(soundType: string): void {
    const sound = this.ambientSounds[soundType as keyof typeof this.ambientSounds];
    if (sound && sound.url) {
      // In a real implementation, this would play the audio
      console.log(`🎵 Playing ambient sound: ${sound.name}`);
    }
  }

  private stopAmbientSound(): void {
    console.log("🎵 Ambient sound stopped");
  }

  private enableDistractionBlocking(): void {
    // Emit distraction blocking event for UI to handle
    this.emitSessionEvent('distraction-blocking-enabled', {
      blockedApps: ['chrome', 'firefox', 'discord', 'teams'],
      blockedWebsites: ['facebook.com', 'twitter.com', 'youtube.com', 'instagram.com'],
      allowedApps: ['vscode', 'notion', 'sublime']
    });

    console.log("🚫 Distraction blocking enabled");
  }

  private disableDistractionBlocking(): void {
    this.emitSessionEvent('distraction-blocking-disabled', {
      disabledAt: new Date()
    });

    console.log("🚫 Distraction blocking disabled");
  }

  private showMotivationalMessage(): void {
    const messages = [
      "🎯 Focus time! You've got this!",
      "🧠 Deep work mode activated!",
      "⚡ Your best work happens when you focus!",
      "🚀 Time to create something amazing!",
      "💪 Concentration is your superpower!",
      "🌟 Every focused minute counts!",
      "🔥 In the zone! Stay strong!",
      "🎨 Your creativity flows when you focus!"
    ];

    const message = messages[Math.floor(Math.random() * messages.length)];
    
    this.emitSessionEvent('motivational-message', {
      message,
      showAt: new Date()
    });
  }

  /**
   * 📊 ANALYTICS & INSIGHTS
   */

  private async generateAnalytics(): Promise<FocusAnalytics> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const todaySessions = this.sessions.filter(s => s.startTime >= today);
    const weekSessions = this.sessions.filter(s => s.startTime >= weekAgo);
    const monthSessions = this.sessions.filter(s => s.startTime >= monthAgo);

    const focusSessions = this.sessions.filter(s => s.type === 'focus' && s.completed);

    const analytics: FocusAnalytics = {
      dailyFocusTime: this.calculateFocusTime(todaySessions),
      weeklyFocusTime: this.calculateFocusTime(weekSessions),
      monthlyFocusTime: this.calculateFocusTime(monthSessions),
      averageSessionLength: this.calculateAverageSessionLength(focusSessions),
      completionRate: this.calculateCompletionRate(focusSessions),
      peakFocusHours: this.findPeakFocusHours(focusSessions),
      productivityTrend: this.calculateProductivityTrend(),
      distractionPattern: this.analyzeDistractionPattern(focusSessions),
      bestFocusContext: this.findBestFocusContext(focusSessions),
      streakDays: this.calculateStreakDays(),
      totalSessions: focusSessions.length,
      focusScore: this.calculateFocusScore(focusSessions)
    };

    return analytics;
  }

  /**
   * 🎯 GOAL MANAGEMENT
   */

  public createFocusGoal(goalData: Omit<FocusGoal, 'id' | 'currentValue' | 'createdAt'>): FocusGoal {
    const goal: FocusGoal = {
      ...goalData,
      id: this.generateSessionId(),
      currentValue: 0,
      createdAt: new Date()
    };

    this.goals.push(goal);
    this.saveGoals();

    console.log(`🎯 Focus goal created: ${goal.name}`);
    return goal;
  }

  private updateGoalProgress(): void {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    for (const goal of this.goals.filter(g => g.status === 'active')) {
      let newValue = goal.currentValue;

      switch (goal.type) {
        case 'daily_focus_time':
          const todayFocus = this.calculateFocusTime(
            this.sessions.filter(s => s.startTime >= todayStart && s.type === 'focus')
          );
          newValue = todayFocus;
          break;

        case 'session_count':
          const completedToday = this.sessions.filter(s => 
            s.startTime >= todayStart && s.type === 'focus' && s.completed
          ).length;
          newValue = completedToday;
          break;

        case 'completion_rate':
          const recentSessions = this.sessions.filter(s => s.type === 'focus');
          if (recentSessions.length > 0) {
            const completed = recentSessions.filter(s => s.completed && !s.interrupted).length;
            newValue = Math.round((completed / recentSessions.length) * 100);
          }
          break;

        case 'streak':
          newValue = this.calculateStreakDays();
          break;
      }

      if (newValue !== goal.currentValue) {
        goal.currentValue = newValue;

        // Check if goal is completed
        if (goal.currentValue >= goal.targetValue && goal.status !== 'completed') {
          goal.status = 'completed';
          goal.completedAt = new Date();
          this.celebrateFocusGoal(goal);
        }
      }
    }

    this.saveGoals();
  }

  private celebrateFocusGoal(goal: FocusGoal): void {
    this.emitSessionEvent('focus-goal-completed', {
      goal,
      completedAt: new Date(),
      celebrationMessage: `🎉 Focus Goal Achieved: ${goal.name}!`,
      reward: goal.reward
    });

    console.log(`🎉 Focus goal completed: ${goal.name}`);
  }

  /**
   * 💡 INTELLIGENT SUGGESTIONS
   */

  private getNextSessionSuggestion(): string {
    if (!this.activeProfile) return "Ready for your next focus session!";

    const recentSessions = this.sessions.slice(-5);
    const focusCount = recentSessions.filter(s => s.type === 'focus').length;
    const breakCount = recentSessions.filter(s => s.type.includes('break')).length;

    // Suggest based on pattern
    if (focusCount >= this.activeProfile.longBreakInterval) {
      return "🛋️ Time for a long break! You've earned it.";
    } else if (breakCount === 0 && focusCount > 0) {
      return "☕ Take a short break to recharge!";
    } else {
      return "🎯 Ready to focus? Let's dive in!";
    }
  }

  private suggestBreakActivity(duration: number, type: 'short' | 'long'): BreakActivity {
    const suitableActivities = this.breakActivities.filter(activity => 
      activity.duration <= duration &&
      (type === 'short' ? activity.energyLevel !== 'high' : true)
    );

    if (suitableActivities.length === 0) {
      return this.breakActivities[0]; // fallback
    }

    // Use context intelligence for better suggestions
    const context = this.currentSession?.context || 'work';
    const analysis = offlineIntelligence.analyzeContent(context);
    
    // Prioritize based on detected patterns
    if (analysis.detectedPatterns.some(p => p.type === 'code')) {
      // For coding sessions, prefer physical activities
      const physical = suitableActivities.filter(a => a.category === 'physical');
      if (physical.length > 0) {
        return physical[Math.floor(Math.random() * physical.length)];
      }
    } else if (analysis.detectedPatterns.some(p => p.type === 'creative')) {
      // For creative work, prefer mental or creative breaks
      const creative = suitableActivities.filter(a => 
        a.category === 'creative' || a.category === 'mental'
      );
      if (creative.length > 0) {
        return creative[Math.floor(Math.random() * creative.length)];
      }
    }

    // Random selection from suitable activities
    return suitableActivities[Math.floor(Math.random() * suitableActivities.length)];
  }

  /**
   * 🔧 HELPER METHODS
   */

  private calculateFocusTime(sessions: PomodoroSession[]): number {
    return sessions
      .filter(s => s.type === 'focus' && s.completed)
      .reduce((total, s) => total + s.duration, 0);
  }

  private calculateAverageSessionLength(sessions: PomodoroSession[]): number {
    if (sessions.length === 0) return 0;
    return sessions.reduce((total, s) => total + s.duration, 0) / sessions.length;
  }

  private calculateCompletionRate(sessions: PomodoroSession[]): number {
    if (sessions.length === 0) return 100;
    const completed = sessions.filter(s => s.completed && !s.interrupted).length;
    return Math.round((completed / sessions.length) * 100);
  }

  private findPeakFocusHours(sessions: PomodoroSession[]): string[] {
    const hourCounts = new Map<string, number>();
    
    sessions.forEach(session => {
      const hour = session.startTime.getHours().toString().padStart(2, '0') + ':00';
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });

    return Array.from(hourCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => hour);
  }

  private calculateProductivityTrend(): number[] {
    const trend = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const daySessions = this.sessions.filter(s => 
        s.startTime >= dayStart && s.startTime < dayEnd && s.type === 'focus'
      );

      const avgProductivity = daySessions.length > 0 
        ? daySessions.reduce((sum, s) => sum + s.productivity, 0) / daySessions.length
        : 0;

      trend.push(Math.round(avgProductivity));
    }

    return trend;
  }

  private analyzeDistractionPattern(sessions: PomodoroSession[]): { type: string; count: number; avgDuration: number }[] {
    // Mock implementation - in real app would track actual distractions
    return [
      { type: 'notifications', count: 12, avgDuration: 2 },
      { type: 'social_media', count: 8, avgDuration: 5 },
      { type: 'phone_calls', count: 3, avgDuration: 8 }
    ];
  }

  private findBestFocusContext(sessions: PomodoroSession[]): string {
    const contextCounts = new Map<string, number>();
    const contextProductivity = new Map<string, number[]>();

    sessions.forEach(session => {
      contextCounts.set(session.context, (contextCounts.get(session.context) || 0) + 1);
      
      if (!contextProductivity.has(session.context)) {
        contextProductivity.set(session.context, []);
      }
      contextProductivity.get(session.context)!.push(session.productivity);
    });

    let bestContext = 'work';
    let bestScore = 0;

    contextProductivity.forEach((scores, context) => {
      const avgProductivity = scores.reduce((a, b) => a + b, 0) / scores.length;
      const sessionCount = contextCounts.get(context) || 0;
      const score = avgProductivity * Math.min(sessionCount / 10, 1); // Weight by frequency

      if (score > bestScore) {
        bestScore = score;
        bestContext = context;
      }
    });

    return bestContext;
  }

  private calculateStreakDays(): number {
    const today = new Date();
    let streak = 0;

    for (let i = 0; i < 365; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const dayFocusSessions = this.sessions.filter(s =>
        s.startTime >= dayStart && s.startTime < dayEnd && 
        s.type === 'focus' && s.completed
      );

      if (dayFocusSessions.length > 0) {
        streak++;
      } else if (i > 0) {
        break; // Streak broken
      }
    }

    return streak;
  }

  private calculateFocusScore(sessions: PomodoroSession[]): number {
    if (sessions.length === 0) return 0;

    const completionRate = this.calculateCompletionRate(sessions);
    const avgProductivity = sessions.reduce((sum, s) => sum + s.productivity, 0) / sessions.length;
    const consistency = Math.min(sessions.length / 50, 1) * 100; // Max score at 50+ sessions

    return Math.round((completionRate * 0.4) + (avgProductivity * 10 * 0.4) + (consistency * 0.2));
  }

  private generateSessionId(): string {
    return 'focus_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private emitSessionEvent(eventName: string, data: any): void {
    window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
  }

  private updateAnalytics(): void {
    this.generateAnalytics().then(analytics => {
      this.analytics = analytics;
    });
  }

  /**
   * 💾 DATA PERSISTENCE
   */

  private async loadSessions(): Promise<void> {
    try {
      const saved = localStorage.getItem('focusSessions');
      if (saved) {
        this.sessions = JSON.parse(saved, (key, value) => {
          if (key.includes('Time') || key.includes('At')) {
            return value ? new Date(value) : value;
          }
          return value;
        });
      }
    } catch (error) {
      console.warn("Could not load focus sessions:", error);
    }
  }

  private async loadGoals(): Promise<void> {
    try {
      const saved = localStorage.getItem('focusGoals');
      if (saved) {
        this.goals = JSON.parse(saved, (key, value) => {
          if (key.includes('At') || key === 'deadline') {
            return value ? new Date(value) : value;
          }
          return value;
        });
      }
    } catch (error) {
      console.warn("Could not load focus goals:", error);
    }
  }

  private async loadProfiles(): Promise<void> {
    try {
      const saved = localStorage.getItem('concentrationProfiles');
      if (saved) {
        const profiles = JSON.parse(saved);
        this.concentrationProfiles = profiles;
        
        const activeId = localStorage.getItem('activeConcentrationProfile');
        if (activeId) {
          this.activeProfile = this.concentrationProfiles.find(p => p.id === activeId) || null;
        }
      }
    } catch (error) {
      console.warn("Could not load concentration profiles:", error);
    }
  }

  private saveSessions(): void {
    try {
      localStorage.setItem('focusSessions', JSON.stringify(this.sessions));
    } catch (error) {
      console.error("Could not save focus sessions:", error);
    }
  }

  private saveGoals(): void {
    try {
      localStorage.setItem('focusGoals', JSON.stringify(this.goals));
    } catch (error) {
      console.error("Could not save focus goals:", error);
    }
  }

  private saveProfiles(): void {
    try {
      localStorage.setItem('concentrationProfiles', JSON.stringify(this.concentrationProfiles));
      if (this.activeProfile) {
        localStorage.setItem('activeConcentrationProfile', this.activeProfile.id);
      }
    } catch (error) {
      console.error("Could not save concentration profiles:", error);
    }
  }

  /**
   * 🎯 PUBLIC API METHODS
   */

  public getCurrentSession(): PomodoroSession | null {
    return this.currentSession;
  }

  public getConcentrationProfiles(): ConcentrationProfile[] {
    return [...this.concentrationProfiles];
  }

  public getActiveProfile(): ConcentrationProfile | null {
    return this.activeProfile;
  }

  public setActiveProfile(profileId: string): boolean {
    const profile = this.concentrationProfiles.find(p => p.id === profileId);
    if (profile) {
      this.activeProfile = profile;
      this.saveProfiles();
      return true;
    }
    return false;
  }

  public getAnalytics(): FocusAnalytics | null {
    return this.analytics;
  }

  public getFocusGoals(): FocusGoal[] {
    return [...this.goals];
  }

  public getBreakActivities(): BreakActivity[] {
    return [...this.breakActivities];
  }

  public isEngineInitialized(): boolean {
    return this.isInitialized;
  }

  public getSessionHistory(limit: number = 50): PomodoroSession[] {
    return this.sessions
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }
}

// ============================================================================
// SINGLETON EXPORT & UTILITIES
// ============================================================================

export const focusManager = FocusManagementEngine.getInstance();

// Convenience functions
export const startFocusSession = (context?: string, duration?: number) =>
  focusManager.startFocusSession(context, duration);

export const startBreakSession = (type?: 'short' | 'long') =>
  focusManager.startBreak(type);

export const pauseFocusSession = () =>
  focusManager.pauseSession();

export const resumeFocusSession = () =>
  focusManager.resumeSession();

export const skipCurrentSession = () =>
  focusManager.skipSession();

export const createFocusGoal = (goalData: Omit<FocusGoal, 'id' | 'currentValue' | 'createdAt'>) =>
  focusManager.createFocusGoal(goalData);

export const getFocusAnalytics = () =>
  focusManager.getAnalytics();

export const switchConcentrationProfile = (profileId: string) =>
  focusManager.setActiveProfile(profileId);

// Initialize on import
focusManager.initialize();
