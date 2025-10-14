// מנוע הלמידה - לומד מהשינויים ומציע שיפורים

import { 
  LearningData, 
  UserLearningProfile, 
  AIInsight, 
  SectionEditAction,
  WarehouseSection 
} from './types';

class LearningEngine {
  private learningData: LearningData[] = [];
  private userProfiles: Map<string, UserLearningProfile> = new Map();
  private insights: AIInsight[] = [];

  constructor() {
    this.loadFromStorage();
  }

  // שמירת נתוני למידה
  saveLearningData(data: LearningData): void {
    this.learningData.push(data);
    this.updateUserProfile(data);
    this.generateInsights(data);
    this.saveToStorage();
  }

  // עדכון פרופיל משתמש
  private updateUserProfile(data: LearningData): void {
    const userId = data.userId;
    
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, {
        userId,
        preferredStyle: {
          formalLevel: 'medium',
          languageStyle: 'formal',
          preferredTerms: []
        },
        editingHistory: [],
        customSections: [],
        aiPreferences: {
          autoSuggest: true,
          learningEnabled: true,
          styleAdaptation: true
        }
      });
    }

    const profile = this.userProfiles.get(userId)!;
    profile.editingHistory.push(data);

    // למידת סגנון המשתמש
    this.learnUserStyle(profile, data);
  }

  // למידת סגנון המשתמש
  private learnUserStyle(profile: UserLearningProfile, data: LearningData): void {
    const { originalText, editedText } = data;
    
    // ניתוח השינויים
    const changes = this.analyzeChanges(originalText, editedText);
    
    // עדכון העדפות
    if (changes.addedFormality > 0) {
      profile.preferredStyle.formalLevel = 'high';
    } else if (changes.addedFormality < 0) {
      profile.preferredStyle.formalLevel = 'low';
    }

    // למידת מונחים מועדפים
    const newTerms = this.extractLegalTerms(editedText);
    profile.preferredStyle.preferredTerms = [
      ...new Set([...profile.preferredStyle.preferredTerms, ...newTerms])
    ].slice(0, 50); // שמירה על 50 מונחים מועדפים
  }

  // ניתוח שינויים בטקסט
  private analyzeChanges(original: string, edited: string) {
    const originalWords = original.split(' ').length;
    const editedWords = edited.split(' ').length;
    
    // זיהוי רמת פורמליות
    const formalTerms = ['בהתאם', 'לפיכך', 'היות ו', 'מבלי לגרוע'];
    const casualTerms = ['כמו', 'בגלל', 'בגלל ש', 'לכן'];
    
    const addedFormality = formalTerms.filter(term => 
      edited.includes(term) && !original.includes(term)
    ).length - casualTerms.filter(term => 
      edited.includes(term) && !original.includes(term)
    ).length;

    return {
      wordCountChange: editedWords - originalWords,
      addedFormality,
      complexityChange: this.calculateComplexity(edited) - this.calculateComplexity(original)
    };
  }

  // חישוב מורכבות טקסט
  private calculateComplexity(text: string): number {
    const sentences = text.split(/[.!?]/).length;
    const words = text.split(' ').length;
    const avgWordsPerSentence = words / sentences;
    
    // חישוב פשוט של מורכבות
    return avgWordsPerSentence * 0.3 + (text.length / 100) * 0.7;
  }

  // חילוץ מונחים משפטיים
  private extractLegalTerms(text: string): string[] {
    const legalTerms = [
      'שכר טרחה', 'הסכם', 'לקוח', 'עורך דין', 'תיק', 'בית משפט',
      'אגרות', 'הוצאות', 'מקדמה', 'תשלום', 'התקשרות', 'סיום',
      'תנאי', 'סעיף', 'הוראה', 'התחייבות', 'זכות', 'חובה'
    ];
    
    return legalTerms.filter(term => text.includes(term));
  }

  // יצירת תובנות AI
  private generateInsights(data: LearningData): void {
    const changes = this.analyzeChanges(data.originalText, data.editedText);
    const userProfile = this.userProfiles.get(data.userId);
    
    if (!userProfile) return;

    // הצעות שיפור
    const suggestions = this.generateSuggestions(data, changes, userProfile);
    
    this.insights.push(...suggestions);
  }

  // יצירת הצעות שיפור
  private generateSuggestions(
    data: LearningData, 
    changes: any, 
    profile: UserLearningProfile
  ): AIInsight[] {
    const suggestions: AIInsight[] = [];

    // הצעת שיפור בהירות
    if (changes.complexityChange > 2) {
      suggestions.push({
        sectionId: data.sectionId,
        suggestion: this.simplifyText(data.editedText),
        reason: 'הטקסט יכול להיות ברור יותר',
        confidence: 0.8,
        type: 'clarity'
      });
    }

    // הצעת שיפור סגנון
    if (profile.preferredStyle.formalLevel === 'high' && changes.addedFormality < 0) {
      suggestions.push({
        sectionId: data.sectionId,
        suggestion: this.makeMoreFormal(data.editedText),
        reason: 'התאמה לסגנון הפורמלי המועדף',
        confidence: 0.7,
        type: 'style'
      });
    }

    return suggestions;
  }

  // פישוט טקסט
  private simplifyText(text: string): string {
    // פישוט בסיסי - החלפת ביטויים מורכבים
    return text
      .replace(/בהתאם להוראות/g, 'לפי')
      .replace(/מבלי לגרוע מהוראות/g, 'בלי לפגוע ב')
      .replace(/לפיכך הוסכם/g, 'לכן הסכימו');
  }

  // הפיכת טקסט לפורמלי יותר
  private makeMoreFormal(text: string): string {
    return text
      .replace(/לכן/g, 'לפיכך')
      .replace(/בגלל/g, 'בהתאם ל')
      .replace(/כמו/g, 'בדומה ל');
  }

  // קבלת תובנות למשתמש
  getInsightsForUser(userId: string): AIInsight[] {
    return this.insights.filter(insight => 
      this.learningData.some(data => 
        data.userId === userId && data.sectionId === insight.sectionId
      )
    );
  }

  // קבלת פרופיל משתמש
  getUserProfile(userId: string): UserLearningProfile | undefined {
    return this.userProfiles.get(userId);
  }

  // שמירה למחסן
  saveToWarehouse(action: SectionEditAction, section: WarehouseSection): void {
    const profile = this.userProfiles.get(action.userId);
    if (profile) {
      profile.customSections.push(section);
      this.saveToStorage();
    }
  }

  // שמירה למידה
  saveToLearning(action: SectionEditAction, data: LearningData): void {
    this.saveLearningData(data);
  }

  // שמירה ללוקל סטורג'
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('learningEngine', JSON.stringify({
        learningData: this.learningData,
        userProfiles: Array.from(this.userProfiles.entries()),
        insights: this.insights
      }));
    }
  }

  // טעינה מלוקל סטורג'
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('learningEngine');
      if (stored) {
        const data = JSON.parse(stored);
        this.learningData = data.learningData || [];
        this.userProfiles = new Map(data.userProfiles || []);
        this.insights = data.insights || [];
      }
    }
  }

  // קבלת סטטיסטיקות
  getStatistics(userId?: string) {
    const relevantData = userId ? 
      this.learningData.filter(d => d.userId === userId) : 
      this.learningData;

    return {
      totalEdits: relevantData.length,
      uniqueUsers: new Set(relevantData.map(d => d.userId)).size,
      averageEditLength: relevantData.reduce((sum, d) => 
        sum + d.editedText.length, 0) / relevantData.length,
      mostEditedCategories: this.getMostEditedCategories(relevantData),
      insights: this.insights.length
    };
  }

  private getMostEditedCategories(data: LearningData[]): string[] {
    const categories = data.reduce((acc, d) => {
      acc[d.context.category] = (acc[d.context.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category]) => category);
  }
}

export const learningEngine = new LearningEngine();
