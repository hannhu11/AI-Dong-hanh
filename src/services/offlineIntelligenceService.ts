/**
 * 🧠 OFFLINE INTELLIGENCE SERVICE
 * 
 * Advanced Pattern Recognition & Context Analysis Engine
 * Không phụ thuộc vào external API - Pure AI Logic
 * 
 * Tính năng:
 * - Smart Pattern Detection
 * - Context Classification  
 * - Intelligent Content Analysis
 * - Contextual Suggestions Generation
 * - Thought Bubble Intelligence
 * 
 * Phát triển bởi: Hàn Như | AI Kiến Trúc Sư Hệ Thống
 * Dự án: Trợ Lý Nhận Thức AI - Trụ Cột I: Context Awareness
 */

export interface ContentPattern {
  type: 'code' | 'email' | 'url' | 'document' | 'data' | 'question' | 'task' | 'creative' | 'technical' | 'conversation';
  confidence: number;
  keywords: string[];
  suggestedActions: string[];
  context: string;
}

export interface ContextAnalysis {
  content: string;
  detectedPatterns: ContentPattern[];
  primaryContext: string;
  suggestions: string[];
  thoughtBubbleMessage: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface WindowContext {
  title: string;
  detectedApp: string;
  context: 'development' | 'research' | 'communication' | 'creativity' | 'productivity' | 'entertainment' | 'unknown';
  suggestions: string[];
  focusLevel: number;
}

class OfflineIntelligenceEngine {
  private static instance: OfflineIntelligenceEngine;
  
  // 🧠 Advanced Pattern Libraries
  private patterns = {
    code: {
      keywords: ['function', 'const', 'let', 'var', 'class', 'import', 'export', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'async', 'await', 'interface', 'type', 'enum'],
      indicators: ['{', '}', ';', '()', '=>', '[]', 'console.log', 'npm', 'yarn', 'git', 'docker'],
      confidence: 0.8
    },
    email: {
      keywords: ['dear', 'hello', 'hi', 'regards', 'sincerely', 'best', 'thank you', 'please', 'urgent', 'meeting', 'schedule', 'attached'],
      indicators: ['@', '.com', '.org', 'subject:', 'from:', 'to:', 'cc:', 'bcc:'],
      confidence: 0.9
    },
    url: {
      keywords: ['http', 'https', 'www', '.com', '.org', '.net', 'github', 'stackoverflow', 'google', 'youtube'],
      indicators: ['://', 'www.', '.com/', '.org/', 'github.com', 'docs.', 'api.'],
      confidence: 0.95
    },
    document: {
      keywords: ['introduction', 'conclusion', 'summary', 'analysis', 'research', 'study', 'report', 'chapter', 'section', 'abstract'],
      indicators: ['1.', '2.', '3.', 'a)', 'b)', 'c)', '•', '-', 'table of contents'],
      confidence: 0.7
    },
    data: {
      keywords: ['data', 'statistics', 'analysis', 'chart', 'graph', 'percentage', 'average', 'total', 'sum', 'count'],
      indicators: ['%', '$', '€', '₫', 'csv', 'json', 'excel', 'database', 'sql'],
      confidence: 0.8
    },
    question: {
      keywords: ['how', 'what', 'when', 'where', 'why', 'who', 'which', 'can', 'could', 'would', 'should', 'help', 'explain'],
      indicators: ['?', 'how to', 'what is', 'can you', 'help me', 'i need', 'problem', 'issue', 'error'],
      confidence: 0.85
    },
    task: {
      keywords: ['todo', 'task', 'deadline', 'urgent', 'priority', 'complete', 'finish', 'done', 'schedule', 'meeting', 'reminder'],
      indicators: ['[ ]', '[x]', '☐', '☑', 'due:', 'deadline:', 'priority:', 'urgent:', 'asap'],
      confidence: 0.9
    },
    creative: {
      keywords: ['story', 'poem', 'creative', 'imagination', 'character', 'plot', 'scene', 'dialogue', 'narrative', 'fiction'],
      indicators: ['"', '"', '"', 'chapter', 'scene', 'character:', 'dialogue:', 'once upon', 'the end'],
      confidence: 0.7
    }
  };

  private appContexts = {
    'chrome': { context: 'research', focusBonus: 0.6 },
    'firefox': { context: 'research', focusBonus: 0.6 },
    'edge': { context: 'research', focusBonus: 0.6 },
    'cursor': { context: 'development', focusBonus: 0.9 },
    'vscode': { context: 'development', focusBonus: 0.9 },
    'visual studio': { context: 'development', focusBonus: 0.9 },
    'notepad++': { context: 'development', focusBonus: 0.7 },
    'sublime': { context: 'development', focusBonus: 0.8 },
    'word': { context: 'productivity', focusBonus: 0.7 },
    'excel': { context: 'productivity', focusBonus: 0.8 },
    'powerpoint': { context: 'creativity', focusBonus: 0.6 },
    'photoshop': { context: 'creativity', focusBonus: 0.8 },
    'figma': { context: 'creativity', focusBonus: 0.8 },
    'slack': { context: 'communication', focusBonus: 0.4 },
    'discord': { context: 'communication', focusBonus: 0.3 },
    'teams': { context: 'communication', focusBonus: 0.5 },
    'zoom': { context: 'communication', focusBonus: 0.7 },
    'youtube': { context: 'entertainment', focusBonus: 0.2 },
    'spotify': { context: 'entertainment', focusBonus: 0.3 },
    'netflix': { context: 'entertainment', focusBonus: 0.1 }
  };

  public static getInstance(): OfflineIntelligenceEngine {
    if (!OfflineIntelligenceEngine.instance) {
      OfflineIntelligenceEngine.instance = new OfflineIntelligenceEngine();
    }
    return OfflineIntelligenceEngine.instance;
  }

  /**
   * 🔍 ADVANCED CONTENT ANALYSIS
   */
  public analyzeContent(content: string): ContextAnalysis {
    const detectedPatterns = this.detectPatterns(content);
    const primaryContext = this.determinePrimaryContext(detectedPatterns);
    const suggestions = this.generateSuggestions(detectedPatterns, content);
    const thoughtBubbleMessage = this.generateThoughtBubble(detectedPatterns, content);
    const priority = this.calculatePriority(detectedPatterns, content);

    return {
      content,
      detectedPatterns,
      primaryContext,
      suggestions,
      thoughtBubbleMessage,
      priority
    };
  }

  /**
   * 🪟 WINDOW CONTEXT ANALYSIS
   */
  public analyzeWindow(windowTitle: string): WindowContext {
    const detectedApp = this.detectApplication(windowTitle);
    const context = this.determineWindowContext(windowTitle, detectedApp);
    const suggestions = this.generateWindowSuggestions(windowTitle, context);
    const focusLevel = this.calculateFocusLevel(detectedApp, windowTitle);

    return {
      title: windowTitle,
      detectedApp,
      context,
      suggestions,
      focusLevel
    };
  }

  /**
   * 🔍 Pattern Detection Engine
   */
  private detectPatterns(content: string): ContentPattern[] {
    const patterns: ContentPattern[] = [];
    const lowercaseContent = content.toLowerCase();

    for (const [type, config] of Object.entries(this.patterns)) {
      let confidence = 0;
      const matchedKeywords: string[] = [];

      // Check keywords
      for (const keyword of config.keywords) {
        if (lowercaseContent.includes(keyword.toLowerCase())) {
          confidence += 0.1;
          matchedKeywords.push(keyword);
        }
      }

      // Check indicators
      for (const indicator of config.indicators) {
        if (content.includes(indicator)) {
          confidence += 0.15;
          matchedKeywords.push(indicator);
        }
      }

      // Normalize confidence
      confidence = Math.min(confidence, 1.0);

      if (confidence > 0.3) {
        patterns.push({
          type: type as ContentPattern['type'],
          confidence,
          keywords: matchedKeywords,
          suggestedActions: this.generatePatternActions(type as ContentPattern['type'], content),
          context: this.generatePatternContext(type as ContentPattern['type'])
        });
      }
    }

    return patterns.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * 🎯 Primary Context Determination
   */
  private determinePrimaryContext(patterns: ContentPattern[]): string {
    if (patterns.length === 0) return 'general';
    
    const topPattern = patterns[0];
    const contextMap = {
      'code': 'Đang làm việc với code - Tôi có thể hỗ trợ debug, optimize, hoặc giải thích logic.',
      'email': 'Soạn thảo email - Tôi có thể giúp cải thiện tone, grammar, hoặc structure.',
      'url': 'Đang nghiên cứu online - Tôi có thể tóm tắt nội dung hoặc gợi ý tài liệu liên quan.',
      'document': 'Viết văn bản - Tôi có thể hỗ trợ cấu trúc, grammar, hoặc làm phong phú nội dung.',
      'data': 'Phân tích dữ liệu - Tôi có thể giúp visualize, interpret, hoặc tìm patterns.',
      'question': 'Đang tìm hiểu vấn đề - Tôi có thể cung cấp explanations chi tiết.',
      'task': 'Quản lý công việc - Tôi có thể giúp prioritize, schedule, hoặc break down tasks.',
      'creative': 'Sáng tạo nội dung - Tôi có thể inspire ideas hoặc enhance creativity.',
      'technical': 'Làm việc kỹ thuật - Tôi có thể support với documentation hoặc troubleshooting.',
      'conversation': 'Giao tiếp - Tôi có thể improve communication effectiveness.'
    };

    return contextMap[topPattern.type] || 'Đang xử lý nội dung - Tôi sẵn sàng hỗ trợ!';
  }

  /**
   * 💡 Smart Suggestions Generation
   */
  private generateSuggestions(patterns: ContentPattern[], content: string): string[] {
    const suggestions: string[] = [];

    for (const pattern of patterns.slice(0, 3)) { // Top 3 patterns
      suggestions.push(...pattern.suggestedActions);
    }

    // Content length based suggestions
    if (content.length > 1000) {
      suggestions.push("📄 Tóm tắt nội dung dài này");
      suggestions.push("🔍 Trích xuất key points");
    }

    if (content.length < 50 && patterns.some(p => p.type === 'question')) {
      suggestions.push("💬 Elaborate câu hỏi để được support tốt hơn");
    }

    return [...new Set(suggestions)].slice(0, 5); // Unique, max 5
  }

  /**
   * 💭 Intelligent Thought Bubble Generation
   */
  private generateThoughtBubble(patterns: ContentPattern[], content: string): string {
    const thoughtTemplates = {
      'code': [
        "🤖 Hmm, code này có thể optimize được...",
        "💡 Tôi thấy pattern thú vị trong logic này!",
        "🔧 Architecture này có thể improve...",
        "✨ Code clean và elegant! Good job!",
        "🐛 Có vẻ như có potential bug ở đây..."
      ],
      'email': [
        "📧 Email tone có thể professional hơn...",
        "💼 Structure này clear và concise!",
        "📝 Có thể add call-to-action rõ ràng hơn",
        "🎯 Message này straight to the point!",
        "💬 Có thể customize cho audience cụ thể..."
      ],
      'url': [
        "🔗 Link thú vị! Tôi có thể tóm tắt content...",
        "🌐 Web resource này có valuable information!",
        "📚 Có thể research deeper về topic này",
        "🔍 Link này open up new learning opportunity!",
        "💾 Worth bookmarking for future reference!"
      ],
      'document': [
        "📚 Nội dung này có potential để develop thêm!",
        "✍️ Flow của document khá smooth...",
        "🎨 Có thể enhance với visuals...",
        "📊 Structure logic và easy to follow!",
        "💭 Ideas này deserve deeper exploration..."
      ],
      'data': [
        "📊 Data patterns rất interesting...",
        "📈 Numbers tell a compelling story!",
        "🔍 Có insights hidden trong dataset này",
        "💡 Visualization có thể make this clearer",
        "📋 Summary statistics sẽ helpful!"
      ],
      'question': [
        "🤔 Câu hỏi thú vị! Tôi có insights...",
        "💡 This opens up interesting possibilities...",
        "🔍 Deep question - cần approach đa chiều",
        "🧠 Tôi có experience với vấn đề này!",
        "⚡ Quick answer hoặc detailed analysis?"
      ],
      'task': [
        "📋 Task này có thể break down thành steps...",
        "⏰ Timeline realistic cho deliverables này",
        "🎯 Priorities clear, execution sẽ smooth!",
        "🚀 Ready to tackle this challenge!",
        "📈 This will boost productivity significantly!"
      ],
      'creative': [
        "🎨 Creative energy flowing strong!",
        "✨ Ideas brewing - tôi có thể contribute!",
        "💭 Imagination mode activated!",
        "🌟 Artistic vision taking shape!",
        "🦋 Creativity unleashed!"
      ],
      'technical': [
        "🔧 Technical challenge detected!",
        "⚙️ System architecture thinking required",
        "🛠️ Engineering solution coming up!",
        "📊 Technical specs need attention",
        "💻 Implementation strategy forming..."
      ],
      'conversation': [
        "💬 Communication flow is smooth!",
        "🤝 Great collaboration energy!",
        "🗣️ Message clarity is important",
        "📞 Connection established!",
        "💭 Understanding is mutual!"
      ]
    };

    if (patterns.length === 0) {
      const generalThoughts = [
        "🧠 Tôi đang analyze nội dung này...",
        "💭 Interesting information to process!",
        "✨ Có thể tôi support gì không nhỉ?",
        "🤖 AI brain đang hoạt động...",
        "💡 Sẵn sàng assist bất cứ lúc nào!"
      ];
      return generalThoughts[Math.floor(Math.random() * generalThoughts.length)];
    }

    const topPattern = patterns[0].type;
    const templates = thoughtTemplates[topPattern as keyof typeof thoughtTemplates] || thoughtTemplates.question;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * ⚡ Priority Calculation
   */
  private calculatePriority(patterns: ContentPattern[], content: string): 'low' | 'medium' | 'high' | 'urgent' {
    const urgentKeywords = ['urgent', 'asap', 'emergency', 'critical', 'deadline', 'error', 'bug', 'issue'];
    const highKeywords = ['important', 'priority', 'meeting', 'presentation', 'client', 'boss'];
    
    const hasUrgent = urgentKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    );
    
    const hasHigh = highKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    );

    if (hasUrgent) return 'urgent';
    if (hasHigh) return 'high';
    if (patterns.some(p => p.type === 'code' || p.type === 'task')) return 'medium';
    return 'low';
  }

  /**
   * 🎯 Application Detection
   */
  private detectApplication(windowTitle: string): string {
    const title = windowTitle.toLowerCase();
    
    for (const [app, _] of Object.entries(this.appContexts)) {
      if (title.includes(app.toLowerCase())) {
        return app;
      }
    }

    // Advanced detection
    if (title.includes('browser') || title.includes('chrome') || title.includes('firefox') || title.includes('edge')) {
      return 'browser';
    }
    if (title.includes('code') || title.includes('ide')) {
      return 'development';
    }

    return 'unknown';
  }

  /**
   * 🪟 Window Context Determination
   */
  private determineWindowContext(windowTitle: string, detectedApp: string): WindowContext['context'] {
    const appInfo = this.appContexts[detectedApp as keyof typeof this.appContexts];
    if (appInfo) {
      return appInfo.context as WindowContext['context'];
    }

    // Fallback analysis based on title content
    const title = windowTitle.toLowerCase();
    if (title.includes('code') || title.includes('programming') || title.includes('github')) {
      return 'development';
    }
    if (title.includes('research') || title.includes('study') || title.includes('learn')) {
      return 'research';
    }
    if (title.includes('chat') || title.includes('message') || title.includes('mail')) {
      return 'communication';
    }
    if (title.includes('design') || title.includes('creative') || title.includes('art')) {
      return 'creativity';
    }
    if (title.includes('document') || title.includes('excel') || title.includes('sheet')) {
      return 'productivity';
    }

    return 'unknown';
  }

  /**
   * 💡 Window Suggestions
   */
  private generateWindowSuggestions(windowTitle: string, context: WindowContext['context']): string[] {
    const suggestionMap = {
      'development': [
        "🚀 Tối ưu development workflow",
        "🔧 Code review và suggestions",
        "📚 Documentation tự động",
        "🐛 Debug support"
      ],
      'research': [
        "📄 Tóm tắt thông tin research",
        "🔗 Tìm tài liệu liên quan",
        "📊 Organize findings",
        "💡 Generate insights"
      ],
      'communication': [
        "💬 Improve message clarity",
        "📧 Professional email templates",
        "🎯 Effective communication tips",
        "⚡ Quick response suggestions"
      ],
      'creativity': [
        "🎨 Creative inspiration",
        "✨ Design feedback",
        "💭 Brainstorm ideas",
        "🎯 Project direction"
      ],
      'productivity': [
        "📋 Task organization",
        "⏰ Time management",
        "📈 Productivity boost",
        "🎯 Goal tracking"
      ],
      'entertainment': [
        "🎵 Curated playlists",
        "📺 Content recommendations",
        "🎮 Break time optimization"
      ],
      'unknown': [
        "💡 Contextual assistance",
        "🤖 AI support available",
        "⚡ Optimize workflow"
      ]
    };

    return suggestionMap[context as keyof typeof suggestionMap] || suggestionMap.unknown;
  }

  /**
   * 🎯 Focus Level Calculation
   */
  private calculateFocusLevel(detectedApp: string, windowTitle: string): number {
    const appInfo = this.appContexts[detectedApp as keyof typeof this.appContexts];
    let baseScore = appInfo?.focusBonus || 0.5;

    // Boost for deep work indicators
    const deepWorkIndicators = ['coding', 'programming', 'development', 'writing', 'research', 'analysis'];
    if (deepWorkIndicators.some(indicator => windowTitle.toLowerCase().includes(indicator))) {
      baseScore += 0.2;
    }

    // Penalty for distraction indicators
    const distractionIndicators = ['social', 'entertainment', 'video', 'game', 'news'];
    if (distractionIndicators.some(indicator => windowTitle.toLowerCase().includes(indicator))) {
      baseScore -= 0.3;
    }

    return Math.max(0, Math.min(1, baseScore));
  }

  /**
   * 🎯 Generate Pattern Actions
   */
  private generatePatternActions(patternType: ContentPattern['type'], content: string): string[] {
    const actionMap = {
      'code': ["🔧 Code review", "📚 Add documentation", "⚡ Performance optimize", "🧪 Suggest tests"],
      'email': ["✨ Improve tone", "📝 Grammar check", "🎯 Add CTA", "📋 Structure enhance"],
      'url': ["📄 Summarize content", "🔗 Find related links", "📊 Extract key data", "💾 Archive important"],
      'document': ["📝 Grammar enhance", "📚 Content expand", "🎨 Format improve", "🔍 Fact check"],
      'data': ["📊 Visualize data", "🔍 Find patterns", "📈 Generate insights", "📋 Create summary"],
      'question': ["💡 Provide answer", "📚 Detailed explanation", "🔗 Find resources", "💭 Alternative perspectives"],
      'task': ["📋 Break down steps", "⏰ Set timeline", "🎯 Prioritize items", "📈 Track progress"],
      'creative': ["💡 Inspire ideas", "✨ Enhance creativity", "🎨 Style suggestions", "📝 Develop concept"],
      'technical': ["📚 Technical docs", "🔧 Troubleshoot", "⚡ Optimize performance", "🧪 Testing strategy"],
      'conversation': ["💬 Improve clarity", "🎯 Better engagement", "📝 Communication tips", "⚡ Quick responses"]
    };

    return actionMap[patternType] || ["💡 General assistance", "🤖 AI support", "⚡ Quick help"];
  }

  /**
   * 📝 Generate Pattern Context
   */
  private generatePatternContext(patternType: ContentPattern['type']): string {
    const contextMap = {
      'code': "Software development context detected",
      'email': "Professional communication context",
      'url': "Web research and information gathering",
      'document': "Document creation and editing",
      'data': "Data analysis and processing",
      'question': "Information seeking and problem solving",
      'task': "Task management and productivity",
      'creative': "Creative work and ideation",
      'technical': "Technical work and documentation",
      'conversation': "Communication and collaboration"
    };

    return contextMap[patternType] || "General content processing";
  }
}

// Export singleton instance
export const offlineIntelligence = OfflineIntelligenceEngine.getInstance();
