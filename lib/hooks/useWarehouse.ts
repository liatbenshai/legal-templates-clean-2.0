'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

export interface WarehouseSection {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  service_type?: string;
  tags: string[];
  usage_count: number;
  average_rating: number;
  is_public: boolean;
  is_hidden: boolean;
  created_at: string;
  last_used: string;
  updated_at: string;
  created_by?: string;
  level?: 'main' | 'sub' | 'sub-sub';
  order?: number;
  parent_id?: string;
  sub_sections?: any[];
}

export interface UseWarehouseOptions {
  category?: string;
  includePublic?: boolean;
  includeHidden?: boolean;
}

/**
 * Hook לניהול מחסן הסעיפים עם Supabase
 */
export function useWarehouse(userId: string, options: UseWarehouseOptions = {}) {
  const [sections, setSections] = useState<WarehouseSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // טעינת סעיפים
  const loadSections = async () => {
    try {
      setLoading(true);
      setError(null);

      // בדיקה ש-userId תקין - עבור anonymous users, נטען רק תבניות ציבוריות
      if (!userId || userId === '') {
        console.warn('useWarehouse: userId is missing, skipping user sections');
        setSections([]);
        setLoading(false);
        return;
      }
      
      const isAnonymous = userId === 'anonymous';

      // עבור anonymous users, נדלג על טעינת סעיפים אישיים
      let data: any[] | null = null;
      
      if (!isAnonymous) {
        let query = supabase
          .from('warehouse_sections')
          .select('*')
          .eq('user_id', userId);

        // סינון לפי קטגוריה
        if (options.category && options.category !== 'all') {
          query = query.eq('category', options.category);
        }

        // סינון סעיפים מוסתרים
        if (!options.includeHidden) {
          query = query.eq('is_hidden', false);
        }

        // מיון לפי שימוש אחרון
        query = query.order('last_used', { ascending: false });

        const { data: userData, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        data = userData;
      }

      // טעינת תבניות מ-section_templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('section_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (templatesError) {
        console.error('Error loading templates:', templatesError);
      }

      // המרת תבניות לסעיפים עם היררכיה מלאה
      const templateSections: WarehouseSection[] = [];
      if (templatesData) {
        templatesData.forEach((template: any) => {
          console.log('Loading template:', template.title, 'child_sections:', template.child_sections);
          
          // הוספת הסעיף הראשי עם כל התבנית - רק סעיף אחד!
          templateSections.push({
            id: `template_${template.id}`,
            user_id: userId,
            title: template.main_section?.title || template.title,
            content: template.main_section?.content || '',
            category: 'template',
            tags: ['template', 'hierarchical'],
            usage_count: 0,
            average_rating: 0,
            is_public: true,
            is_hidden: false,
            created_at: template.created_at,
            last_used: template.updated_at,
            updated_at: template.updated_at,
            created_by: 'system',
            level: 'main',
            order: template.main_section?.order || 1,
            sub_sections: template.child_sections || []
          });
        });
      }

      // אם מבוקש, הוסף גם סעיפים ציבוריים
      if (options.includePublic) {
        let publicQuery = supabase
          .from('warehouse_sections')
          .select('*')
          .eq('is_public', true);
        
        // עבור anonymous, נטען את כל הסעיפים הציבוריים
        if (!isAnonymous) {
          publicQuery = publicQuery.neq('user_id', userId);
        }
        
        publicQuery = publicQuery.order('usage_count', { ascending: false })
          .limit(50);

        const { data: publicData, error: publicError } = await publicQuery;

        if (!publicError && publicData) {
          setSections([...(data || []), ...publicData, ...templateSections]);
        } else {
          setSections([...(data || []), ...templateSections]);
        }
      } else {
        setSections([...(data || []), ...templateSections]);
      }
    } catch (err) {
      // טיפול משופר בשגיאות
      let errorMessage = 'שגיאה בטעינת סעיפים';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        console.error('Error loading sections:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
      } else if (err && typeof err === 'object') {
        // נסה לחלץ מידע מהשגיאה
        const errorObj = err as any;
        errorMessage = errorObj.message || errorObj.error || errorObj.code || JSON.stringify(err);
        console.error('Error loading sections (object):', {
          error: errorObj,
          message: errorObj.message,
          code: errorObj.code,
          details: errorObj.details
        });
      } else {
        console.error('Error loading sections (unknown):', err);
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // הוספת סעיף חדש
  const addSection = async (section: Omit<WarehouseSection, 'id' | 'created_at' | 'updated_at' | 'last_used' | 'user_id'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('warehouse_sections')
        .insert({
          ...section,
          user_id: userId,
          last_used: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (data) {
        setSections(prev => [data, ...prev]);
      }

      return data;
    } catch (err) {
      console.error('Error adding section:', err);
      throw err;
    }
  };

  // עדכון סעיף
  const updateSection = async (id: string, updates: Partial<WarehouseSection>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('warehouse_sections')
        .update({
          ...updates,
          last_used: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) throw updateError;

      if (data) {
        setSections(prev => prev.map(s => s.id === id ? data : s));
      }

      return data;
    } catch (err) {
      console.error('Error updating section:', err);
      throw err;
    }
  };

  // מחיקת סעיף
  const deleteSection = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('warehouse_sections')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      setSections(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting section:', err);
      throw err;
    }
  };

  // הסתרת/הצגת סעיף
  const toggleHideSection = async (id: string) => {
    try {
      const section = sections.find(s => s.id === id);
      if (!section) return;

      await updateSection(id, { is_hidden: !section.is_hidden });
    } catch (err) {
      console.error('Error toggling hide:', err);
      throw err;
    }
  };

  // הצגת כל הסעיפים המוסתרים
  const showAllHidden = async () => {
    try {
      const hiddenIds = sections.filter(s => s.is_hidden).map(s => s.id);
      
      if (hiddenIds.length === 0) return;

      const { error: updateError } = await supabase
        .from('warehouse_sections')
        .update({ is_hidden: false })
        .in('id', hiddenIds)
        .eq('user_id', userId);

      if (updateError) throw updateError;

      await loadSections();
    } catch (err) {
      console.error('Error showing hidden:', err);
      throw err;
    }
  };

  // עדכון מונה שימוש
  const incrementUsage = async (id: string) => {
    try {
      await supabase.rpc('increment_section_usage', { p_section_id: id });
      
      setSections(prev => prev.map(s => 
        s.id === id ? { ...s, usage_count: s.usage_count + 1, last_used: new Date().toISOString() } : s
      ));
    } catch (err) {
      console.error('Error incrementing usage:', err);
    }
  };

  // העברת קטגוריה
  const moveToCategory = async (id: string, newCategory: string) => {
    try {
      await updateSection(id, { category: newCategory });
    } catch (err) {
      console.error('Error moving category:', err);
      throw err;
    }
  };

  // חיפוש סעיפים
  const searchSections = async (query: string) => {
    if (!query.trim()) {
      await loadSections();
      return;
    }

    try {
      const { data, error: searchError } = await supabase
        .from('warehouse_sections')
        .select('*')
        .eq('user_id', userId)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('usage_count', { ascending: false });

      if (searchError) throw searchError;

      setSections(data || []);
    } catch (err) {
      console.error('Error searching:', err);
      setError('שגיאה בחיפוש');
    }
  };

  // טעינה ראשונית
  useEffect(() => {
    if (userId) {
      loadSections();
    }
  }, [userId, options.category]);

  // Real-time subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('warehouse_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'warehouse_sections',
          filter: `user_id=eq.${userId}`
        },
        () => {
          loadSections();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {
    sections,
    loading,
    error,
    addSection,
    updateSection,
    deleteSection,
    toggleHideSection,
    showAllHidden,
    incrementUsage,
    moveToCategory,
    searchSections,
    reload: loadSections
  };
}

