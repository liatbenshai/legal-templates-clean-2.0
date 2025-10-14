'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Edit3, Save, X, Lightbulb, BookOpen, Brain, CheckCircle } from 'lucide-react';
import { EditableSection as EditableSectionType, SectionEditAction } from '@/lib/learning-system/types';
import { learningEngine } from '@/lib/learning-system/learning-engine';

interface EditableSectionProps {
  section: EditableSectionType;
  onUpdate: (section: EditableSectionType) => void;
  onSaveToWarehouse: (section: EditableSectionType) => void;
  onSaveToLearning: (section: EditableSectionType) => void;
  userId: string;
  showAIInsights?: boolean;
}

export default function EditableSection({
  section,
  onUpdate,
  onSaveToWarehouse,
  onSaveToLearning,
  userId,
  showAIInsights = true
}: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(section.content);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(0, 0);
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(section.content);
  };

  const handleSave = () => {
    const updatedSection: EditableSectionType = {
      ...section,
      content: editContent,
      originalContent: section.originalContent || section.content,
      version: section.version + 1,
      lastModified: new Date().toISOString(),
      modifiedBy: userId
    };

    onUpdate(updatedSection);

    // שמירת נתוני למידה
    learningEngine.saveLearningData({
      sectionId: section.id,
      originalText: section.content,
      editedText: editContent,
      editType: 'manual',
      context: {
        serviceType: section.serviceType || '',
        category: section.category,
        userType: 'lawyer'
      },
      timestamp: new Date().toISOString(),
      userId
    });

    setIsEditing(false);
    loadAIInsights();
  };

  const handleCancel = () => {
    setEditContent(section.content);
    setIsEditing(false);
  };

  const handleSaveToWarehouse = () => {
    onSaveToWarehouse(section);
    
    const action: SectionEditAction = {
      type: 'save_to_warehouse',
      sectionId: section.id,
      newContent: section.content,
      reason: 'שמירה למחסן האישי',
      userId,
      timestamp: new Date().toISOString()
    };

    learningEngine.saveToWarehouse(action, {
      id: section.id,
      title: section.title,
      content: section.content,
      category: section.category,
      tags: [section.category, section.serviceType || 'general'],
      usageCount: 1,
      averageRating: 5,
      isPublic: false,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    });
  };

  const handleSaveToLearning = () => {
    onSaveToLearning(section);
    
    const action: SectionEditAction = {
      type: 'save_to_learning',
      sectionId: section.id,
      newContent: section.content,
      reason: 'שמירה למערכת הלמידה',
      userId,
      timestamp: new Date().toISOString()
    };

    learningEngine.saveToLearning(action, {
      sectionId: section.id,
      originalText: section.originalContent || section.content,
      editedText: section.content,
      editType: 'manual',
      userFeedback: 'approved',
      context: {
        serviceType: section.serviceType || '',
        category: section.category,
        userType: 'lawyer'
      },
      timestamp: new Date().toISOString(),
      userId
    });
  };

  const loadAIInsights = async () => {
    if (showAIInsights) {
      const insights = learningEngine.getInsightsForUser(userId);
      setAiInsights(insights.filter(insight => insight.sectionId === section.id));
    }
  };

  useEffect(() => {
    if (showAIInsights) {
      loadAIInsights();
    }
  }, [section.id, userId, showAIInsights]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
      {/* כותרת הסעיף */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          {section.title}
          {section.isCustom && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              מותאם אישית
            </span>
          )}
        </h3>
        
        <div className="flex items-center gap-2">
          {showAIInsights && (
            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
              title="תובנות AI"
            >
              <Brain className="w-4 h-4" />
            </button>
          )}
          
          {section.isEditable && !isEditing && (
            <button
              onClick={handleEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="עריכה"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* תוכן הסעיף */}
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            ref={textareaRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={6}
            dir="rtl"
            style={{ fontFamily: 'David', fontSize: '14pt', lineHeight: '1.6' }}
          />
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Save className="w-4 h-4" />
              שמור
            </button>
            
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              <X className="w-4 h-4" />
              ביטול
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div 
            className="text-gray-700 leading-relaxed"
            style={{ fontFamily: 'David', fontSize: '14pt', lineHeight: '1.6' }}
            dir="rtl"
          >
            {section.content}
          </div>
          
          {/* כפתורי פעולה */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={handleSaveToWarehouse}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
            >
              <BookOpen className="w-4 h-4" />
              שמור למחסן
            </button>
            
            <button
              onClick={handleSaveToLearning}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
            >
              <CheckCircle className="w-4 h-4" />
              שמור ללמידה
            </button>
            
            <div className="text-xs text-gray-500 mr-auto">
              גרסה {section.version} • עודכן: {new Date(section.lastModified).toLocaleDateString('he-IL')}
            </div>
          </div>
        </div>
      )}

      {/* פאנל תובנות AI */}
      {showAIPanel && aiInsights.length > 0 && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="text-sm font-semibold text-orange-800 mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            הצעות AI
          </h4>
          
          {aiInsights.map((insight, index) => (
            <div key={index} className="mb-2 p-2 bg-white rounded border border-orange-100">
              <div className="text-sm text-orange-700 mb-1">
                <strong>{insight.type === 'clarity' ? 'שיפור בהירות' : 
                         insight.type === 'style' ? 'שיפור סגנון' : 
                         insight.type === 'legal_accuracy' ? 'דיוק משפטי' : 'שיפור כללי'}:</strong>
                {insight.reason}
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-1" dir="rtl">
                {insight.suggestion}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                רמת ביטחון: {Math.round(insight.confidence * 100)}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
