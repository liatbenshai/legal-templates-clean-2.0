'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

/**
 * Hook לניהול סעיפים מוסתרים בהנחיות מקדימות
 */
export function useAdvanceDirectivesHidden(userId: string) {
  const [hiddenSections, setHiddenSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // טעינת סעיפים מוסתרים
  const loadHiddenSections = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('advance_directives_hidden_sections')
        .select('section_id')
        .eq('user_id', userId);

      if (fetchError) throw fetchError;

      setHiddenSections(data?.map(item => item.section_id) || []);
    } catch (err) {
      console.error('Error loading hidden sections:', err);
      setError('שגיאה בטעינת סעיפים מוסתרים');
    } finally {
      setLoading(false);
    }
  };

  // הסתרת סעיף
  const hideSection = async (sectionId: string) => {
    try {
      const { error: insertError } = await supabase
        .from('advance_directives_hidden_sections')
        .insert({
          user_id: userId,
          section_id: sectionId
        });

      if (insertError) {
        // אם כבר קיים, לא בעיה
        if (insertError.code !== '23505') { // unique violation
          throw insertError;
        }
      }

      setHiddenSections(prev => [...prev, sectionId]);
    } catch (err) {
      console.error('Error hiding section:', err);
      throw err;
    }
  };

  // הצגת סעיף
  const showSection = async (sectionId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('advance_directives_hidden_sections')
        .delete()
        .eq('user_id', userId)
        .eq('section_id', sectionId);

      if (deleteError) throw deleteError;

      setHiddenSections(prev => prev.filter(id => id !== sectionId));
    } catch (err) {
      console.error('Error showing section:', err);
      throw err;
    }
  };

  // החלפה (הסתר/הצג)
  const toggleHideSection = async (sectionId: string) => {
    if (hiddenSections.includes(sectionId)) {
      await showSection(sectionId);
    } else {
      await hideSection(sectionId);
    }
  };

  // הצגת כל הסעיפים
  const showAllSections = async () => {
    try {
      const { error: deleteError } = await supabase
        .from('advance_directives_hidden_sections')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      setHiddenSections([]);
    } catch (err) {
      console.error('Error showing all sections:', err);
      throw err;
    }
  };

  // טעינה ראשונית
  useEffect(() => {
    if (userId) {
      loadHiddenSections();
    }
  }, [userId]);

  return {
    hiddenSections,
    loading,
    error,
    hideSection,
    showSection,
    toggleHideSection,
    showAllSections,
    reload: loadHiddenSections
  };
}

