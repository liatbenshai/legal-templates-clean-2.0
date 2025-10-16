import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';

export interface SavedDocument {
  id: string;
  document_type: string;
  section_name: string;
  title?: string;
  content: string;
  original_content?: string;
  created_at: string;
  updated_at: string;
}

export function useDocuments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // שמירה של סעיף משופר
  const saveSection = async (
    documentType: 'will-single' | 'will-couple' | 'advance-directives' | 'fee-agreement',
    sectionName: string,
    content: string,
    originalContent?: string,
    title?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      // בדוק אם המשתמש מחובר
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('יש להתחבר כדי לשמור סעיפים');
      }

      // בדוק אם קיים סעיף כזה כבר
      const { data: existing } = await supabase
        .from('saved_documents')
        .select('id')
        .eq('user_id', user.id)
        .eq('document_type', documentType)
        .eq('section_name', sectionName)
        .single();

      if (existing) {
        // עדכן את הסעיף הקיים
        const { error: updateError } = await supabase
          .from('saved_documents')
          .update({
            content,
            original_content: originalContent || existing.content,
            title: title || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
        return { success: true, isUpdate: true };
      } else {
        // הוסף סעיף חדש
        const { error: insertError } = await supabase
          .from('saved_documents')
          .insert([
            {
              user_id: user.id,
              document_type: documentType,
              section_name: sectionName,
              title: title || null,
              content,
              original_content: originalContent,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (insertError) throw insertError;
        return { success: true, isUpdate: false };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'שגיאה בשמירת הסעיף';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // טעינת סעיף ספציפי
  const loadSection = async (
    documentType: string,
    sectionName: string
  ): Promise<SavedDocument | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data, error: fetchError } = await supabase
        .from('saved_documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('document_type', documentType)
        .eq('section_name', sectionName)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      return data || null;
    } catch (err) {
      console.error('Error loading section:', err);
      return null;
    }
  };

  // טעינת כל הסעיפים של משתמש למסמך מסוים
  const loadDocumentSections = async (
    documentType: string
  ): Promise<SavedDocument[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return [];

      const { data, error: fetchError } = await supabase
        .from('saved_documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('document_type', documentType)
        .order('section_name', { ascending: true });

      if (fetchError) throw fetchError;

      return data || [];
    } catch (err) {
      console.error('Error loading document sections:', err);
      return [];
    }
  };

  // מחיקת סעיף
  const deleteSection = async (
    documentType: string,
    sectionName: string
  ): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('יש להתחבר');

      const { error: deleteError } = await supabase
        .from('saved_documents')
        .delete()
        .eq('user_id', user.id)
        .eq('document_type', documentType)
        .eq('section_name', sectionName);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      console.error('Error deleting section:', err);
      return false;
    }
  };

  return {
    saveSection,
    loadSection,
    loadDocumentSections,
    deleteSection,
    loading,
    error,
  };
}
