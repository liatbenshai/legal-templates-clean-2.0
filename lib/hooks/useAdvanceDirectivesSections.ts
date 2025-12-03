/**
 * Hook לניהול סעיפי הנחיות מקדימות מ-Supabase
 * =============================================
 * 
 * מאפשר:
 * - טעינת סעיפים מה-DB
 * - עריכה ושמירה
 * - הוספת סעיפים חדשים
 * - מחיקה (סימון כלא פעיל)
 * - חיפוש וסינון
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';

// Types
export interface AdvanceDirectivesSection {
  id: string;
  section_id: string;
  category: 'property' | 'personal' | 'medical';
  subcategory: string;
  title: string;
  title_en?: string;
  content: string;
  variables: string[];
  gender_variables: {
    principal: boolean;
    attorney: boolean;
  };
  tags: string[];
  is_active: boolean;
  is_custom: boolean;
  usage_count: number;
  sort_order: number;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_en?: string;
  icon?: string;
  color?: string;
  parent_id?: string;
  sort_order: number;
}

interface UseAdvanceDirectivesSectionsReturn {
  // Data
  sections: AdvanceDirectivesSection[];
  categories: Category[];
  subcategories: Category[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSections: () => Promise<void>;
  fetchSectionsByCategory: (category: string) => Promise<AdvanceDirectivesSection[]>;
  searchSections: (query: string) => Promise<AdvanceDirectivesSection[]>;
  
  // CRUD
  createSection: (section: Partial<AdvanceDirectivesSection>) => Promise<AdvanceDirectivesSection | null>;
  updateSection: (id: string, updates: Partial<AdvanceDirectivesSection>) => Promise<boolean>;
  deleteSection: (id: string) => Promise<boolean>;
  
  // Utilities
  getSectionById: (sectionId: string) => AdvanceDirectivesSection | undefined;
  incrementUsage: (id: string) => Promise<void>;
}

export function useAdvanceDirectivesSections(): UseAdvanceDirectivesSectionsReturn {
  const [sections, setSections] = useState<AdvanceDirectivesSection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // טעינת כל הסעיפים
  const fetchSections = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('advance_directives_sections')
        .select('*')
        .eq('is_active', true)
        .order('category')
        .order('sort_order');

      if (fetchError) throw fetchError;
      
      setSections(data || []);
    } catch (err: any) {
      console.error('Error fetching sections:', err?.message || err);
      setError(err?.message || 'שגיאה בטעינת הסעיפים');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // טעינת קטגוריות
  const fetchCategories = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('advance_directives_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (fetchError) throw fetchError;
      
      // הפרדה בין קטגוריות ראשיות לתתי-קטגוריות
      const mainCats = data?.filter(c => !c.parent_id) || [];
      const subCats = data?.filter(c => c.parent_id) || [];
      
      setCategories(mainCats);
      setSubcategories(subCats);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  // טעינה ראשונית
  useEffect(() => {
    fetchSections();
    fetchCategories();
  }, [fetchSections, fetchCategories]);

  // טעינת סעיפים לפי קטגוריה
  const fetchSectionsByCategory = async (category: string): Promise<AdvanceDirectivesSection[]> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('advance_directives_sections')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('sort_order');

      if (fetchError) throw fetchError;
      
      return data || [];
    } catch (err) {
      console.error('Error fetching sections by category:', err);
      return [];
    }
  };

  // חיפוש סעיפים
  const searchSections = async (query: string): Promise<AdvanceDirectivesSection[]> => {
    if (!query.trim()) return sections;
    
    try {
      const { data, error: fetchError } = await supabase
        .from('advance_directives_sections')
        .select('*')
        .eq('is_active', true)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('sort_order');

      if (fetchError) throw fetchError;
      
      return data || [];
    } catch (err) {
      console.error('Error searching sections:', err);
      return [];
    }
  };

  // יצירת סעיף חדש
  const createSection = async (section: Partial<AdvanceDirectivesSection>): Promise<AdvanceDirectivesSection | null> => {
    try {
      // יצירת section_id חדש
      const nextId = `SEC_${String(sections.length + 100).padStart(3, '0')}`;
      
      const newSection = {
        section_id: nextId,
        category: section.category || 'personal',
        subcategory: section.subcategory || 'custom',
        title: section.title || 'סעיף חדש',
        title_en: section.title_en,
        content: section.content || '',
        variables: section.variables || [],
        gender_variables: section.gender_variables || { principal: false, attorney: false },
        tags: section.tags || [],
        is_custom: true,
        sort_order: sections.length + 1
      };

      const { data, error: insertError } = await supabase
        .from('advance_directives_sections')
        .insert(newSection)
        .select()
        .single();

      if (insertError) throw insertError;
      
      // עדכון הרשימה המקומית
      setSections(prev => [...prev, data]);
      
      return data;
    } catch (err) {
      console.error('Error creating section:', err);
      setError('שגיאה ביצירת הסעיף');
      return null;
    }
  };

  // עדכון סעיף
  const updateSection = async (id: string, updates: Partial<AdvanceDirectivesSection>): Promise<boolean> => {
    try {
      // שמירת ההיסטוריה
      const currentSection = sections.find(s => s.id === id);
      if (currentSection && (updates.content || updates.title)) {
        await supabase.from('advance_directives_edit_history').insert({
          section_id: id,
          previous_content: currentSection.content,
          new_content: updates.content || currentSection.content,
          previous_title: currentSection.title,
          new_title: updates.title || currentSection.title,
          edited_by: 'admin' // TODO: להחליף למשתמש אמיתי
        });
      }

      const { error: updateError } = await supabase
        .from('advance_directives_sections')
        .update({
          ...updates,
          version: (currentSection?.version || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) throw updateError;
      
      // עדכון מקומי
      setSections(prev => prev.map(s => 
        s.id === id ? { ...s, ...updates } : s
      ));
      
      return true;
    } catch (err) {
      console.error('Error updating section:', err);
      setError('שגיאה בעדכון הסעיף');
      return false;
    }
  };

  // מחיקת סעיף (סימון כלא פעיל)
  const deleteSection = async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('advance_directives_sections')
        .update({ is_active: false })
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      // הסרה מהרשימה המקומית
      setSections(prev => prev.filter(s => s.id !== id));
      
      return true;
    } catch (err) {
      console.error('Error deleting section:', err);
      setError('שגיאה במחיקת הסעיף');
      return false;
    }
  };

  // קבלת סעיף לפי ID
  const getSectionById = (sectionId: string): AdvanceDirectivesSection | undefined => {
    return sections.find(s => s.section_id === sectionId || s.id === sectionId);
  };

  // עדכון מונה שימוש
  const incrementUsage = async (id: string): Promise<void> => {
    try {
      const section = sections.find(s => s.id === id);
      if (!section) return;

      await supabase
        .from('advance_directives_sections')
        .update({ usage_count: (section.usage_count || 0) + 1 })
        .eq('id', id);

      setSections(prev => prev.map(s => 
        s.id === id ? { ...s, usage_count: (s.usage_count || 0) + 1 } : s
      ));
    } catch (err) {
      console.error('Error incrementing usage:', err);
    }
  };

  return {
    sections,
    categories,
    subcategories,
    isLoading,
    error,
    fetchSections,
    fetchSectionsByCategory,
    searchSections,
    createSection,
    updateSection,
    deleteSection,
    getSectionById,
    incrementUsage
  };
}

// Helper: קבלת סעיפים מקומית (fallback אם אין חיבור ל-Supabase)
export async function getLocalSections(): Promise<AdvanceDirectivesSection[]> {
  // ייבוא הסעיפים מהקובץ המקומי כ-fallback
  const { advanceDirectivesSectionsWarehouse } = await import('@/lib/sections-warehouses/advance-directives-warehouse');
  
  return advanceDirectivesSectionsWarehouse.map((s, index) => ({
    id: `local_${s.id}`,
    section_id: s.id,
    category: s.category,
    subcategory: s.subcategory,
    title: s.title,
    title_en: s.titleEn,
    content: s.content,
    variables: s.variables,
    gender_variables: s.genderVariables || { principal: false, attorney: false },
    tags: s.tags,
    is_active: true,
    is_custom: false,
    usage_count: 0,
    sort_order: index + 1,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
}

