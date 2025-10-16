'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

export interface LearningData {
  id: string;
  user_id: string;
  section_id: string;
  original_text: string;
  edited_text: string;
  edit_type: 'manual' | 'ai_suggested' | 'ai_approved';
  user_feedback?: 'approved' | 'rejected' | 'improved';
  context: {
    serviceType: string;
    category: string;
    userType: string;
  };
  created_at: string;
}

export interface UserPreferences {
  user_id: string;
  preferred_style: {
    formalLevel: 'high' | 'medium' | 'low';
    languageStyle: 'formal' | 'casual' | 'technical';
    preferredTerms: string[];
  };
  hidden_section_ids: string[];
  custom_settings: any;
  ai_preferences: {
    autoSuggest: boolean;
    learningEnabled: boolean;
    styleAdaptation: boolean;
  };
}

/**
 * Hook למערכת הלמידה עם Supabase
 */
export function useLearning(userId: string) {
  const [learningData, setLearningData] = useState<LearningData[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // טעינת נתוני למידה
  const loadLearningData = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('learning_data')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (fetchError) throw fetchError;

      setLearningData(data || []);
    } catch (err) {
      console.error('Error loading learning data:', err);
    }
  };

  // טעינת העדפות משתמש
  const loadPreferences = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // Not found error
        throw fetchError;
      }

      if (data) {
        setPreferences(data);
      } else {
        // יצירת העדפות ברירת מחדל
        await createDefaultPreferences();
      }
    } catch (err) {
      console.error('Error loading preferences:', err);
      setError('שגיאה בטעינת העדפות');
    } finally {
      setLoading(false);
    }
  };

  // יצירת העדפות ברירת מחדל
  const createDefaultPreferences = async () => {
    const defaultPrefs: Omit<UserPreferences, 'user_id'> = {
      preferred_style: {
        formalLevel: 'medium',
        languageStyle: 'formal',
        preferredTerms: []
      },
      hidden_section_ids: [],
      custom_settings: {},
      ai_preferences: {
        autoSuggest: true,
        learningEnabled: true,
        styleAdaptation: true
      }
    };

    try {
      const { data, error: insertError } = await supabase
        .from('user_preferences')
        .insert({
          user_id: userId,
          ...defaultPrefs
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setPreferences(data);
    } catch (err) {
      console.error('Error creating preferences:', err);
    }
  };

  // שמירת נתוני למידה
  const saveLearningData = async (data: Omit<LearningData, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: newData, error: insertError } = await supabase
        .from('learning_data')
        .insert({
          ...data,
          user_id: userId
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (newData) {
        setLearningData(prev => [newData, ...prev]);
      }

      return newData;
    } catch (err) {
      console.error('Error saving learning data:', err);
      throw err;
    }
  };

  // עדכון העדפות
  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) throw updateError;

      setPreferences(data);
    } catch (err) {
      console.error('Error updating preferences:', err);
      throw err;
    }
  };

  // הוספת/הסרת סעיף מוסתר
  const toggleHiddenSection = async (sectionId: string) => {
    if (!preferences) return;

    const hiddenIds = preferences.hidden_section_ids || [];
    const newHiddenIds = hiddenIds.includes(sectionId)
      ? hiddenIds.filter(id => id !== sectionId)
      : [...hiddenIds, sectionId];

    await updatePreferences({ hidden_section_ids: newHiddenIds });
  };

  // קבלת סטטיסטיקות
  const getStatistics = () => {
    const totalEdits = learningData.length;
    const byType = learningData.reduce((acc, item) => {
      acc[item.edit_type] = (acc[item.edit_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCategory = learningData.reduce((acc, item) => {
      const category = item.context?.category || 'unknown';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEdits,
      manualEdits: byType.manual || 0,
      aiSuggested: byType.ai_suggested || 0,
      aiApproved: byType.ai_approved || 0,
      byCategory,
      mostEditedCategory: Object.entries(byCategory).sort(([,a], [,b]) => b - a)[0]?.[0]
    };
  };

  // טעינה ראשונית
  useEffect(() => {
    if (userId) {
      loadPreferences();
      loadLearningData();
    }
  }, [userId]);

  return {
    learningData,
    preferences,
    loading,
    error,
    saveLearningData,
    updatePreferences,
    toggleHiddenSection,
    getStatistics,
    reload: () => {
      loadPreferences();
      loadLearningData();
    }
  };
}

