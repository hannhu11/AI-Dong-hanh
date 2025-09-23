/**
 * 📚 KNOWLEDGE SYNTHESIS SERVICE - Trụ Cột IV
 * 
 * Advanced Knowledge Management & Synthesis System:
 * - Smart Summarization & Key Extraction
 * - Knowledge Base với Semantic Search
 * - Learning Path Generation
 * - Content Organization & Tagging
 * - Research Assistant Features
 * - Memory Palace & Note Management
 * 
 * Tích hợp với Offline Intelligence để:
 * - Intelligent content analysis và classification
 * - Context-aware knowledge suggestions
 * - Automated knowledge graph generation
 * 
 * Phát triển bởi: Hàn Như | AI Kiến Trúc Sư Hệ Thống
 * Dự án: Trợ Lý Nhận Thức AI - Trụ Cột IV: Knowledge Synthesis
 */

import { offlineIntelligence } from './offlineIntelligenceService';

// ============================================================================
// KNOWLEDGE SYNTHESIS TYPES
// ============================================================================

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  keyPoints: string[];
  tags: string[];
  category: 'article' | 'code' | 'research' | 'note' | 'reference' | 'tutorial' | 'documentation';
  source: string; // URL, book, document name
  createdAt: Date;
  lastModified: Date;
  accessCount: number;
  importance: number; // 1-10 scale
  connections: string[]; // Related knowledge item IDs
  metadata: Record<string, any>;
}

export interface SmartSummary {
  originalLength: number;
  summaryLength: number;
  compressionRatio: number;
  keyPoints: string[];
  mainTopics: string[];
  actionItems: string[];
  questions: string[];
  readingTime: number; // minutes
  complexity: 'basic' | 'intermediate' | 'advanced';
  confidence: number; // 0-1
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  goal: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // hours
  prerequisites: string[];
  steps: LearningStep[];
  resources: KnowledgeItem[];
  progress: number; // 0-100%
  createdAt: Date;
  completedAt?: Date;
}

export interface LearningStep {
  id: string;
  title: string;
  description: string;
  type: 'read' | 'practice' | 'project' | 'quiz' | 'discussion';
  estimatedTime: number; // minutes
  resources: string[]; // Knowledge item IDs
  completed: boolean;
  completedAt?: Date;
  notes?: string;
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  clusters: GraphCluster[];
  metrics: GraphMetrics;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'concept' | 'topic' | 'skill' | 'resource';
  weight: number;
  connections: number;
  metadata: Record<string, any>;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  type: 'related' | 'prerequisite' | 'example' | 'application';
}

export interface GraphCluster {
  id: string;
  name: string;
  nodes: string[];
  coherence: number; // 0-1
}

export interface GraphMetrics {
  totalNodes: number;
  totalEdges: number;
  avgConnections: number;
  density: number;
  clusters: number;
  coverage: number; // Knowledge domain coverage 0-1
}

export interface ResearchQuery {
  id: string;
  query: string;
  context: string;
  results: KnowledgeItem[];
  suggestions: string[];
  searchTime: Date;
  relevanceScores: number[];
}

export interface MemoryPalace {
  id: string;
  name: string;
  description: string;
  rooms: MemoryRoom[];
  totalItems: number;
  createdAt: Date;
  lastVisited: Date;
}

export interface MemoryRoom {
  id: string;
  name: string;
  theme: string;
  items: KnowledgeItem[];
  capacity: number;
  organization: 'chronological' | 'topical' | 'importance' | 'custom';
}

// ============================================================================
// KNOWLEDGE SYNTHESIS ENGINE
// ============================================================================

class KnowledgeSynthesisEngine {
  private static instance: KnowledgeSynthesisEngine;
  private knowledgeItems: Map<string, KnowledgeItem> = new Map();
  private learningPaths: LearningPath[] = [];
  private knowledgeGraph: KnowledgeGraph | null = null;
  private memoryPalaces: MemoryPalace[] = [];
  private recentQueries: ResearchQuery[] = [];
  private isInitialized = false;

  // 🧠 Advanced Text Processing Patterns
  private summaryPatterns = {
    // Key phrase indicators
    keyIndicators: [
      'important', 'key', 'main', 'primary', 'essential', 'crucial', 
      'significant', 'major', 'fundamental', 'critical', 'vital'
    ],
    
    // Action words
    actionWords: [
      'implement', 'create', 'build', 'develop', 'design', 'analyze',
      'optimize', 'improve', 'fix', 'solve', 'research', 'study'
    ],
    
    // Question patterns
    questionStarters: [
      'how', 'what', 'why', 'when', 'where', 'which', 'who',
      'should', 'could', 'would', 'can', 'does', 'is', 'are'
    ],

    // Summary connectors
    connectors: [
      'therefore', 'however', 'furthermore', 'moreover', 'additionally',
      'consequently', 'meanwhile', 'nevertheless', 'otherwise'
    ]
  };

  // 📚 Knowledge Categories & Auto-tagging
  private knowledgeCategorizer = {
    'programming': ['code', 'function', 'class', 'api', 'framework', 'library', 'algorithm'],
    'research': ['study', 'analysis', 'data', 'experiment', 'hypothesis', 'methodology'],
    'business': ['strategy', 'market', 'revenue', 'customer', 'product', 'sales'],
    'design': ['ui', 'ux', 'interface', 'visual', 'layout', 'typography'],
    'science': ['theory', 'formula', 'experiment', 'research', 'discovery'],
    'tutorial': ['step', 'guide', 'how to', 'tutorial', 'walkthrough'],
    'reference': ['definition', 'specification', 'documentation', 'manual'],
    'personal': ['note', 'thought', 'idea', 'reflection', 'journal']
  };

  public static getInstance(): KnowledgeSynthesisEngine {
    if (!KnowledgeSynthesisEngine.instance) {
      KnowledgeSynthesisEngine.instance = new KnowledgeSynthesisEngine();
    }
    return KnowledgeSynthesisEngine.instance;
  }

  /**
   * 🚀 Initialize Knowledge Synthesis Engine
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log("📚 Initializing Knowledge Synthesis Engine...");

    // Load existing data
    await this.loadKnowledgeItems();
    await this.loadLearningPaths();
    await this.loadMemoryPalaces();
    
    // Generate knowledge graph if we have items
    if (this.knowledgeItems.size > 0) {
      this.knowledgeGraph = await this.generateKnowledgeGraph();
    }

    this.isInitialized = true;
    console.log("✅ Knowledge Synthesis Engine initialized!");
    console.log(`📚 Items: ${this.knowledgeItems.size}, Paths: ${this.learningPaths.length}, Palaces: ${this.memoryPalaces.length}`);
  }

  /**
   * 📝 SMART SUMMARIZATION SYSTEM
   */

  public generateSmartSummary(content: string, maxLength: number = 150): SmartSummary {
    const sentences = this.extractSentences(content);
    const keyPoints = this.extractKeyPoints(content);
    const mainTopics = this.extractMainTopics(content);
    const actionItems = this.extractActionItems(content);
    const questions = this.extractQuestions(content);

    // Smart sentence ranking
    const rankedSentences = this.rankSentences(sentences, keyPoints);
    const summaryText = this.generateSummaryText(rankedSentences, maxLength);

    const summary: SmartSummary = {
      originalLength: content.length,
      summaryLength: summaryText.length,
      compressionRatio: summaryText.length / content.length,
      keyPoints,
      mainTopics,
      actionItems,
      questions,
      readingTime: Math.ceil(content.split(' ').length / 200), // 200 WPM
      complexity: this.determineComplexity(content),
      confidence: this.calculateConfidence(content, keyPoints)
    };

    return summary;
  }

  public extractKeyPoints(content: string): string[] {
    const keyPoints: string[] = [];
    const sentences = this.extractSentences(content);
    
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      
      // Check for key indicators
      const hasKeyIndicator = this.summaryPatterns.keyIndicators.some(indicator =>
        lowerSentence.includes(indicator)
      );

      // Check for numbered/bulleted lists
      const isListItem = /^[\d\-\*\•]/.test(sentence.trim());
      
      // Check for emphasis (capitals, bold markers)
      const hasEmphasis = /[A-Z]{2,}/.test(sentence) || sentence.includes('**');

      if ((hasKeyIndicator || isListItem || hasEmphasis) && sentence.length > 20) {
        keyPoints.push(sentence.trim());
      }
    }

    return keyPoints.slice(0, 5); // Top 5 key points
  }

  /**
   * 🔍 INTELLIGENT KNOWLEDGE MANAGEMENT
   */

  public addKnowledgeItem(data: Omit<KnowledgeItem, 'id' | 'createdAt' | 'lastModified' | 'accessCount'>): KnowledgeItem {
    // Use offline intelligence for enhanced analysis
    const analysis = offlineIntelligence.analyzeContent(data.content);
    
    const item: KnowledgeItem = {
      ...data,
      id: this.generateId(),
      createdAt: new Date(),
      lastModified: new Date(),
      accessCount: 0,
      // Enhanced with AI analysis
      summary: data.summary || this.generateSmartSummary(data.content, 100).keyPoints.join('. '),
      keyPoints: data.keyPoints.length > 0 ? data.keyPoints : this.extractKeyPoints(data.content),
      tags: [...data.tags, ...this.autoGenerateTags(data.content, analysis)],
      category: data.category || this.categorizeContent(data.content, analysis),
      importance: data.importance || this.calculateImportance(data.content, analysis),
      connections: []
    };

    this.knowledgeItems.set(item.id, item);
    this.saveKnowledgeItems();

    // Update knowledge graph
    this.updateKnowledgeGraph(item);

    console.log(`📚 Knowledge item added: ${item.title}`);
    return item;
  }

  public searchKnowledge(query: string, limit: number = 10): ResearchQuery {
    const searchId = this.generateId();
    const results: KnowledgeItem[] = [];
    const relevanceScores: number[] = [];

    // Use offline intelligence for query analysis
    const queryAnalysis = offlineIntelligence.analyzeContent(query);
    
    // Search through knowledge items
    for (const [id, item] of this.knowledgeItems) {
      const score = this.calculateRelevanceScore(query, item, queryAnalysis);
      
      if (score > 0.3) { // Threshold for relevance
        results.push(item);
        relevanceScores.push(score);
        item.accessCount++;
      }
    }

    // Sort by relevance score
    const sortedResults = results
      .map((item, index) => ({ item, score: relevanceScores[index] }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    const searchResults = sortedResults.map(r => r.item);
    const finalScores = sortedResults.map(r => r.score);

    const researchQuery: ResearchQuery = {
      id: searchId,
      query,
      context: queryAnalysis.primaryContext,
      results: searchResults,
      suggestions: this.generateSearchSuggestions(query, queryAnalysis),
      searchTime: new Date(),
      relevanceScores: finalScores
    };

    this.recentQueries.unshift(researchQuery);
    this.recentQueries = this.recentQueries.slice(0, 50); // Keep last 50 searches

    return researchQuery;
  }

  /**
   * 🎓 LEARNING PATH GENERATION
   */

  public createLearningPath(goal: string, knowledgeLevel: 'beginner' | 'intermediate' | 'advanced'): LearningPath {
    const relevantItems = this.findRelevantKnowledgeItems(goal);
    const steps = this.generateLearningSteps(goal, knowledgeLevel, relevantItems);
    
    const learningPath: LearningPath = {
      id: this.generateId(),
      name: `Learning Path: ${goal}`,
      description: `Structured learning path to achieve: ${goal}`,
      goal,
      difficulty: knowledgeLevel,
      estimatedTime: steps.reduce((total, step) => total + step.estimatedTime, 0) / 60, // Convert to hours
      prerequisites: this.identifyPrerequisites(goal, knowledgeLevel),
      steps,
      resources: relevantItems,
      progress: 0,
      createdAt: new Date()
    };

    this.learningPaths.push(learningPath);
    this.saveLearningPaths();

    console.log(`🎓 Learning path created: ${learningPath.name}`);
    return learningPath;
  }

  /**
   * 🧠 MEMORY PALACE SYSTEM
   */

  public createMemoryPalace(name: string, description: string): MemoryPalace {
    const palace: MemoryPalace = {
      id: this.generateId(),
      name,
      description,
      rooms: [],
      totalItems: 0,
      createdAt: new Date(),
      lastVisited: new Date()
    };

    this.memoryPalaces.push(palace);
    this.saveMemoryPalaces();

    console.log(`🏰 Memory palace created: ${name}`);
    return palace;
  }

  public addRoomToPalace(palaceId: string, roomName: string, theme: string): MemoryRoom | null {
    const palace = this.memoryPalaces.find(p => p.id === palaceId);
    if (!palace) return null;

    const room: MemoryRoom = {
      id: this.generateId(),
      name: roomName,
      theme,
      items: [],
      capacity: 20, // Optimal for memory retention
      organization: 'importance'
    };

    palace.rooms.push(room);
    this.saveMemoryPalaces();

    return room;
  }

  /**
   * 🔗 KNOWLEDGE GRAPH GENERATION
   */

  private async generateKnowledgeGraph(): Promise<KnowledgeGraph> {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // Create nodes from knowledge items
    for (const [id, item] of this.knowledgeItems) {
      nodes.push({
        id: item.id,
        label: item.title,
        type: this.mapCategoryToNodeType(item.category),
        weight: item.importance,
        connections: item.connections.length,
        metadata: {
          category: item.category,
          tags: item.tags,
          accessCount: item.accessCount
        }
      });
    }

    // Generate edges based on content similarity and connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const item1 = this.knowledgeItems.get(nodes[i].id)!;
        const item2 = this.knowledgeItems.get(nodes[j].id)!;
        
        const similarity = this.calculateContentSimilarity(item1, item2);
        
        if (similarity > 0.4) {
          edges.push({
            source: nodes[i].id,
            target: nodes[j].id,
            weight: similarity,
            type: this.determineRelationshipType(item1, item2)
          });
        }
      }
    }

    const clusters = this.identifyGraphClusters(nodes, edges);
    const metrics = this.calculateGraphMetrics(nodes, edges, clusters);

    return {
      nodes,
      edges,
      clusters,
      metrics
    };
  }

  /**
   * 🔧 HELPER METHODS
   */

  private extractSentences(content: string): string[] {
    return content
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);
  }

  private extractMainTopics(content: string): string[] {
    const analysis = offlineIntelligence.analyzeContent(content);
    return analysis.detectedPatterns
      .slice(0, 3)
      .map(p => p.type)
      .filter((type, index, arr) => arr.indexOf(type) === index);
  }

  private extractActionItems(content: string): string[] {
    const sentences = this.extractSentences(content);
    return sentences.filter(sentence => {
      const lowerSentence = sentence.toLowerCase();
      return this.summaryPatterns.actionWords.some(action =>
        lowerSentence.includes(action)
      );
    }).slice(0, 3);
  }

  private extractQuestions(content: string): string[] {
    const sentences = this.extractSentences(content);
    return sentences.filter(sentence => {
      const trimmedSentence = sentence.trim();
      return trimmedSentence.endsWith('?') || 
             this.summaryPatterns.questionStarters.some(starter =>
               trimmedSentence.toLowerCase().startsWith(starter)
             );
    }).slice(0, 3);
  }

  private rankSentences(sentences: string[], keyPoints: string[]): Array<{sentence: string, score: number}> {
    return sentences.map(sentence => {
      let score = 0;
      
      // Boost score for key indicators
      const lowerSentence = sentence.toLowerCase();
      this.summaryPatterns.keyIndicators.forEach(indicator => {
        if (lowerSentence.includes(indicator)) score += 2;
      });

      // Boost score if sentence appears in key points
      if (keyPoints.some(kp => kp.includes(sentence))) score += 3;

      // Boost score for sentence length (optimal around 15-25 words)
      const wordCount = sentence.split(' ').length;
      if (wordCount >= 10 && wordCount <= 30) score += 1;

      // Boost score for connectors indicating important information
      this.summaryPatterns.connectors.forEach(connector => {
        if (lowerSentence.includes(connector)) score += 1;
      });

      return { sentence, score };
    }).sort((a, b) => b.score - a.score);
  }

  private generateSummaryText(rankedSentences: Array<{sentence: string, score: number}>, maxLength: number): string {
    let summary = '';
    let currentLength = 0;

    for (const {sentence} of rankedSentences) {
      if (currentLength + sentence.length <= maxLength) {
        summary += sentence + '. ';
        currentLength += sentence.length + 2;
      } else {
        break;
      }
    }

    return summary.trim();
  }

  private determineComplexity(content: string): 'basic' | 'intermediate' | 'advanced' {
    const analysis = offlineIntelligence.analyzeContent(content);
    const avgWordLength = content.split(' ').reduce((sum, word) => sum + word.length, 0) / content.split(' ').length;
    const technicalTerms = analysis.detectedPatterns.filter(p => p.type === 'technical' || p.type === 'code').length;
    
    if (avgWordLength > 6 || technicalTerms > 3) return 'advanced';
    if (avgWordLength > 4 || technicalTerms > 1) return 'intermediate';
    return 'basic';
  }

  private calculateConfidence(content: string, keyPoints: string[]): number {
    let confidence = 0.5; // Base confidence
    
    // Boost confidence for clear structure
    if (keyPoints.length >= 3) confidence += 0.2;
    
    // Boost confidence for reasonable content length
    if (content.length >= 200 && content.length <= 5000) confidence += 0.15;
    
    // Boost confidence for clear sentences
    const sentences = this.extractSentences(content);
    if (sentences.length >= 3) confidence += 0.15;
    
    return Math.min(confidence, 1.0);
  }

  private autoGenerateTags(content: string, analysis: any): string[] {
    const tags: string[] = [];
    
    // Add tags based on detected patterns
    analysis.detectedPatterns.forEach((pattern: any) => {
      tags.push(pattern.type);
      pattern.keywords.slice(0, 2).forEach((keyword: string) => {
        if (keyword.length > 3) tags.push(keyword);
      });
    });

    // Add category-based tags
    const lowerContent = content.toLowerCase();
    Object.entries(this.knowledgeCategorizer).forEach(([category, keywords]) => {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        tags.push(category);
      }
    });

    return [...new Set(tags)].slice(0, 8); // Unique tags, max 8
  }

  private categorizeContent(content: string, analysis: any): KnowledgeItem['category'] {
    // Use offline intelligence patterns
    const primaryPattern = analysis.detectedPatterns[0];
    
    if (primaryPattern) {
      switch (primaryPattern.type) {
        case 'code': return 'code';
        case 'document': return 'article';
        case 'question': return 'reference';
        default: break;
      }
    }

    // Fallback categorization
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('tutorial') || lowerContent.includes('how to')) return 'tutorial';
    if (lowerContent.includes('research') || lowerContent.includes('study')) return 'research';
    if (lowerContent.includes('documentation') || lowerContent.includes('spec')) return 'documentation';
    
    return 'note'; // Default
  }

  private calculateImportance(content: string, analysis: any): number {
    let importance = 5; // Base importance

    // Boost for high-priority patterns
    if (analysis.priority === 'urgent' || analysis.priority === 'high') importance += 3;
    
    // Boost for content length (longer = more comprehensive)
    if (content.length > 1000) importance += 1;
    if (content.length > 3000) importance += 1;

    // Boost for multiple patterns (comprehensive content)
    importance += Math.min(analysis.detectedPatterns.length, 2);

    return Math.min(importance, 10);
  }

  private calculateRelevanceScore(query: string, item: KnowledgeItem, queryAnalysis: any): number {
    let score = 0;

    // Title match
    if (item.title.toLowerCase().includes(query.toLowerCase())) score += 0.5;

    // Content match
    if (item.content.toLowerCase().includes(query.toLowerCase())) score += 0.3;

    // Tag match
    const queryTags = queryAnalysis.detectedPatterns.map((p: any) => p.type);
    const tagMatches = item.tags.filter(tag => queryTags.includes(tag)).length;
    score += tagMatches * 0.2;

    // Category match
    if (queryAnalysis.detectedPatterns.some((p: any) => p.type === item.category)) score += 0.2;

    // Key points match
    const keyPointMatches = item.keyPoints.filter(kp => 
      kp.toLowerCase().includes(query.toLowerCase())
    ).length;
    score += keyPointMatches * 0.1;

    return Math.min(score, 1.0);
  }

  private generateSearchSuggestions(query: string, analysis: any): string[] {
    const suggestions = [
      `Related to ${analysis.primaryContext}`,
      `${query} tutorial`,
      `${query} examples`,
      `Advanced ${query}`,
      `${query} best practices`
    ];

    return suggestions.slice(0, 3);
  }

  private findRelevantKnowledgeItems(goal: string): KnowledgeItem[] {
    const searchResult = this.searchKnowledge(goal, 10);
    return searchResult.results;
  }

  private generateLearningSteps(goal: string, level: string, items: KnowledgeItem[]): LearningStep[] {
    const steps: LearningStep[] = [];
    
    // Basic structure based on level
    const stepTemplates = {
      'beginner': [
        'Understand the fundamentals',
        'Learn basic concepts',
        'Practice with examples',
        'Build a simple project'
      ],
      'intermediate': [
        'Review fundamentals',
        'Explore advanced concepts',
        'Study real-world applications',
        'Create a comprehensive project'
      ],
      'advanced': [
        'Master complex concepts',
        'Research cutting-edge techniques',
        'Contribute to community',
        'Lead a major project'
      ]
    };

    const templates = stepTemplates[level as keyof typeof stepTemplates];
    
    templates.forEach((template, index) => {
      steps.push({
        id: this.generateId(),
        title: template,
        description: `${template} related to ${goal}`,
        type: index < 2 ? 'read' : (index === 2 ? 'practice' : 'project'),
        estimatedTime: 60 + (index * 30), // Increasing time per step
        resources: items.slice(index * 2, (index + 1) * 2).map(item => item.id),
        completed: false
      });
    });

    return steps;
  }

  private identifyPrerequisites(goal: string, level: string): string[] {
    const prerequisites: Record<string, string[]> = {
      'programming': ['basic computer literacy', 'logical thinking'],
      'design': ['creative thinking', 'basic software skills'],
      'business': ['communication skills', 'analytical thinking'],
      'research': ['critical thinking', 'reading comprehension']
    };

    // Simple goal categorization
    const lowerGoal = goal.toLowerCase();
    for (const [category, reqs] of Object.entries(prerequisites)) {
      if (lowerGoal.includes(category)) {
        return level === 'beginner' ? reqs : [...reqs, `intermediate ${category}`];
      }
    }

    return ['basic knowledge in the field'];
  }

  private mapCategoryToNodeType(category: KnowledgeItem['category']): GraphNode['type'] {
    const mapping: Record<KnowledgeItem['category'], GraphNode['type']> = {
      'code': 'skill',
      'tutorial': 'resource',
      'research': 'concept',
      'article': 'concept',
      'note': 'resource',
      'reference': 'resource',
      'documentation': 'resource'
    };

    return mapping[category] || 'concept';
  }

  private calculateContentSimilarity(item1: KnowledgeItem, item2: KnowledgeItem): number {
    let similarity = 0;

    // Tag similarity
    const commonTags = item1.tags.filter(tag => item2.tags.includes(tag));
    similarity += (commonTags.length / Math.max(item1.tags.length, item2.tags.length)) * 0.4;

    // Category similarity
    if (item1.category === item2.category) similarity += 0.3;

    // Content keyword similarity (simplified)
    const words1 = item1.content.toLowerCase().split(' ');
    const words2 = item2.content.toLowerCase().split(' ');
    const commonWords = words1.filter(word => words2.includes(word) && word.length > 3);
    similarity += (commonWords.length / Math.max(words1.length, words2.length)) * 0.3;

    return Math.min(similarity, 1.0);
  }

  private determineRelationshipType(item1: KnowledgeItem, item2: KnowledgeItem): GraphEdge['type'] {
    if (item1.category === 'tutorial' && item2.category === 'code') return 'example';
    if (item1.category === 'research' && item2.category === 'article') return 'application';
    if (item1.importance > item2.importance + 2) return 'prerequisite';
    return 'related';
  }

  private identifyGraphClusters(nodes: GraphNode[], edges: GraphEdge[]): GraphCluster[] {
    // Simplified clustering based on categories
    const clusters = new Map<string, GraphNode[]>();
    
    nodes.forEach(node => {
      const category = node.metadata.category || 'general';
      if (!clusters.has(category)) {
        clusters.set(category, []);
      }
      clusters.get(category)!.push(node);
    });

    return Array.from(clusters.entries()).map(([category, clusterNodes]) => ({
      id: this.generateId(),
      name: category,
      nodes: clusterNodes.map(n => n.id),
      coherence: clusterNodes.length > 1 ? 0.8 : 0.5
    }));
  }

  private calculateGraphMetrics(nodes: GraphNode[], edges: GraphEdge[], clusters: GraphCluster[]): GraphMetrics {
    return {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      avgConnections: edges.length > 0 ? (edges.length * 2) / nodes.length : 0,
      density: nodes.length > 1 ? edges.length / (nodes.length * (nodes.length - 1) / 2) : 0,
      clusters: clusters.length,
      coverage: Math.min(nodes.length / 100, 1.0) // Assumes 100 nodes is full coverage
    };
  }

  private updateKnowledgeGraph(newItem: KnowledgeItem): void {
    // Simplified graph update - in real implementation would be more sophisticated
    if (this.knowledgeGraph && this.knowledgeItems.size > 1) {
      this.generateKnowledgeGraph().then(graph => {
        this.knowledgeGraph = graph;
      });
    }
  }

  private generateId(): string {
    return 'knowledge_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * 💾 DATA PERSISTENCE
   */

  private async loadKnowledgeItems(): Promise<void> {
    try {
      const saved = localStorage.getItem('knowledgeItems');
      if (saved) {
        const items = JSON.parse(saved, (key, value) => {
          if (key.includes('At') || key.includes('Date')) {
            return value ? new Date(value) : value;
          }
          return value;
        });
        
        items.forEach((item: KnowledgeItem) => {
          this.knowledgeItems.set(item.id, item);
        });
      }
    } catch (error) {
      console.warn("Could not load knowledge items:", error);
    }
  }

  private async loadLearningPaths(): Promise<void> {
    try {
      const saved = localStorage.getItem('learningPaths');
      if (saved) {
        this.learningPaths = JSON.parse(saved, (key, value) => {
          if (key.includes('At') || key.includes('Date')) {
            return value ? new Date(value) : value;
          }
          return value;
        });
      }
    } catch (error) {
      console.warn("Could not load learning paths:", error);
    }
  }

  private async loadMemoryPalaces(): Promise<void> {
    try {
      const saved = localStorage.getItem('memoryPalaces');
      if (saved) {
        this.memoryPalaces = JSON.parse(saved, (key, value) => {
          if (key.includes('At') || key.includes('Date')) {
            return value ? new Date(value) : value;
          }
          return value;
        });
      }
    } catch (error) {
      console.warn("Could not load memory palaces:", error);
    }
  }

  private saveKnowledgeItems(): void {
    try {
      const items = Array.from(this.knowledgeItems.values());
      localStorage.setItem('knowledgeItems', JSON.stringify(items));
    } catch (error) {
      console.error("Could not save knowledge items:", error);
    }
  }

  private saveLearningPaths(): void {
    try {
      localStorage.setItem('learningPaths', JSON.stringify(this.learningPaths));
    } catch (error) {
      console.error("Could not save learning paths:", error);
    }
  }

  private saveMemoryPalaces(): void {
    try {
      localStorage.setItem('memoryPalaces', JSON.stringify(this.memoryPalaces));
    } catch (error) {
      console.error("Could not save memory palaces:", error);
    }
  }

  /**
   * 🎯 PUBLIC API METHODS
   */

  public getKnowledgeItems(): KnowledgeItem[] {
    return Array.from(this.knowledgeItems.values());
  }

  public getKnowledgeItem(id: string): KnowledgeItem | undefined {
    return this.knowledgeItems.get(id);
  }

  public getLearningPaths(): LearningPath[] {
    return [...this.learningPaths];
  }

  public getMemoryPalaces(): MemoryPalace[] {
    return [...this.memoryPalaces];
  }

  public getKnowledgeGraph(): KnowledgeGraph | null {
    return this.knowledgeGraph;
  }

  public getRecentQueries(): ResearchQuery[] {
    return [...this.recentQueries];
  }

  public isEngineInitialized(): boolean {
    return this.isInitialized;
  }

  public getKnowledgeStats(): {
    totalItems: number;
    totalPaths: number;
    totalPalaces: number;
    totalGraphNodes: number;
    averageImportance: number;
  } {
    const items = Array.from(this.knowledgeItems.values());
    
    return {
      totalItems: items.length,
      totalPaths: this.learningPaths.length,
      totalPalaces: this.memoryPalaces.length,
      totalGraphNodes: this.knowledgeGraph?.nodes.length || 0,
      averageImportance: items.length > 0 
        ? items.reduce((sum, item) => sum + item.importance, 0) / items.length
        : 0
    };
  }
}

// ============================================================================
// SINGLETON EXPORT & UTILITIES
// ============================================================================

export const knowledgeManager = KnowledgeSynthesisEngine.getInstance();

// Convenience functions
export const addKnowledge = (data: Omit<KnowledgeItem, 'id' | 'createdAt' | 'lastModified' | 'accessCount'>) =>
  knowledgeManager.addKnowledgeItem(data);

export const searchKnowledge = (query: string, limit?: number) =>
  knowledgeManager.searchKnowledge(query, limit);

export const summarizeContent = (content: string, maxLength?: number) =>
  knowledgeManager.generateSmartSummary(content, maxLength);

export const createLearningPath = (goal: string, level: 'beginner' | 'intermediate' | 'advanced') =>
  knowledgeManager.createLearningPath(goal, level);

export const createMemoryPalace = (name: string, description: string) =>
  knowledgeManager.createMemoryPalace(name, description);

export const getKnowledgeStats = () =>
  knowledgeManager.getKnowledgeStats();

// Initialize on import
knowledgeManager.initialize();
