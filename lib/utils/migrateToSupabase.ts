'use client';

import { supabase } from '@/lib/supabase-client';

interface MigrationResult {
  success: boolean;
  warehouseMigrated: number;
  learningMigrated: number;
  preferencesMigrated: boolean;
  errors: string[];
}

/**
 * מיגרציה חד-פעמית מ-localStorage ל-Supabase
 * פונקציה זו צריכה לרוץ פעם אחת בלבד עבור כל משתמש
 */
export async function migrateLocalStorageToSupabase(userId: string): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    warehouseMigrated: 0,
    learningMigrated: 0,
    preferencesMigrated: false,
    errors: []
  };

  console.log('🔄 Starting migration from localStorage to Supabase...');

  try {
    // בדיקה אם כבר בוצעה מיגרציה
    const migrationKey = `migrated_to_supabase_${userId}`;
    if (localStorage.getItem(migrationKey)) {
      console.log('✅ Migration already completed for this user');
      result.success = true;
      return result;
    }

    // 1. מיגרצ**ת מחסן הסעיפים**
    console.log('📦 Migrating warehouse sections...');
    try {
      const warehouseData = localStorage.getItem(`warehouse_${userId}`);
      if (warehouseData) {
        const parsed = JSON.parse(warehouseData);
        const sections = parsed.sections || [];

        if (sections.length > 0) {
          // הוספה ל-Supabase
          const { data, error } = await supabase
            .from('warehouse_sections')
            .insert(
              sections.map((section: any) => ({
                user_id: userId,
                title: section.title,
                content: section.content,
                category: section.category,
                tags: section.tags || [],
                usage_count: section.usageCount || 0,
                average_rating: section.averageRating || 0,
                is_public: section.isPublic || false,
                is_hidden: false,
                created_by: section.createdBy || userId,
                last_used: section.lastUsed || new Date().toISOString()
              }))
            );

          if (error) {
            console.error('Error migrating warehouse:', error);
            result.errors.push(`Warehouse: ${error.message}`);
          } else {
            result.warehouseMigrated = sections.length;
            console.log(`✅ Migrated ${sections.length} warehouse sections`);
          }
        }
      }
    } catch (err) {
      console.error('Error in warehouse migration:', err);
      result.errors.push(`Warehouse migration failed: ${err}`);
    }

    // 2. מיגרציה של נתוני למידה
    console.log('🧠 Migrating learning data...');
    try {
      const learningKey = 'learningEngine';
      const learningData = localStorage.getItem(learningKey);
      if (learningData) {
        const parsed = JSON.parse(learningData);
        const learningItems = parsed.learningData || [];

        if (learningItems.length > 0) {
          const { data, error } = await supabase
            .from('learning_data')
            .insert(
              learningItems.map((item: any) => ({
                user_id: userId,
                section_id: item.sectionId,
                original_text: item.originalText,
                edited_text: item.editedText,
                edit_type: item.editType,
                user_feedback: item.userFeedback,
                context: item.context || {}
              }))
            );

          if (error) {
            console.error('Error migrating learning data:', error);
            result.errors.push(`Learning: ${error.message}`);
          } else {
            result.learningMigrated = learningItems.length;
            console.log(`✅ Migrated ${learningItems.length} learning records`);
          }
        }

        // מיגרציה של פרופיל משתמש
        const userProfiles = new Map(parsed.userProfiles || []);
        const userProfile = userProfiles.get(userId) as any;
        
        if (userProfile) {
          const { error: prefError } = await supabase
            .from('user_preferences')
            .upsert({
              user_id: userId,
              preferred_style: userProfile.preferredStyle || {},
              ai_preferences: userProfile.aiPreferences || {},
              custom_settings: {}
            });

          if (prefError) {
            console.error('Error migrating preferences:', prefError);
            result.errors.push(`Preferences: ${prefError.message}`);
          } else {
            result.preferencesMigrated = true;
            console.log('✅ Migrated user preferences');
          }
        }
      }
    } catch (err) {
      console.error('Error in learning migration:', err);
      result.errors.push(`Learning migration failed: ${err}`);
    }

    // 3. מיגרציה של סעיפים מוסתרים
    console.log('🙈 Migrating hidden sections...');
    try {
      const hiddenKey = `hiddenSections_${userId}`;
      const hiddenData = localStorage.getItem(hiddenKey);
      if (hiddenData) {
        const hiddenIds = JSON.parse(hiddenData);
        
        if (hiddenIds.length > 0) {
          // עדכון הסעיפים המוסתרים ב-Supabase
          const { error: hideError } = await supabase
            .from('warehouse_sections')
            .update({ is_hidden: true })
            .in('id', hiddenIds)
            .eq('user_id', userId);

          if (hideError) {
            console.error('Error migrating hidden sections:', hideError);
          } else {
            console.log(`✅ Migrated ${hiddenIds.length} hidden sections`);
          }
        }
      }

      // הנחיות מקדימות מוסתרות
      const advanceHiddenKey = 'hiddenAdvanceDirectivesSections';
      const advanceHiddenData = localStorage.getItem(advanceHiddenKey);
      if (advanceHiddenData) {
        const hiddenIds = JSON.parse(advanceHiddenData);
        
        if (hiddenIds.length > 0) {
          const { error: advanceError } = await supabase
            .from('advance_directives_hidden_sections')
            .insert(
              hiddenIds.map((sectionId: string) => ({
                user_id: userId,
                section_id: sectionId
              }))
            );

          if (advanceError) {
            console.error('Error migrating advance directives hidden:', advanceError);
          }
        }
      }
    } catch (err) {
      console.error('Error in hidden sections migration:', err);
    }

    // 4. סימון שהמיגרציה בוצעה
    localStorage.setItem(migrationKey, new Date().toISOString());
    
    result.success = result.errors.length === 0;
    
    console.log('✅ Migration completed!');
    console.log('📊 Results:', result);

    return result;
  } catch (err) {
    console.error('❌ Migration failed:', err);
    result.errors.push(`General error: ${err}`);
    return result;
  }
}

/**
 * ניקוי localStorage אחרי מיגרציה מוצלחת
 */
export function cleanupLocalStorageAfterMigration(userId: string) {
  const keysToRemove = [
    `warehouse_${userId}`,
    `hiddenSections_${userId}`,
    'hiddenAdvanceDirectivesSections',
    'learningEngine',
    'upgraded_warehouse_loaded'
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Removed ${key}`);
  });

  console.log('✅ localStorage cleaned up');
}

/**
 * בדיקה אם המיגרציה כבר בוצעה
 */
export function isMigrationCompleted(userId: string): boolean {
  const migrationKey = `migrated_to_supabase_${userId}`;
  return !!localStorage.getItem(migrationKey);
}

/**
 * איפוס מיגרציה (לבדיקות בלבד!)
 */
export function resetMigration(userId: string) {
  const migrationKey = `migrated_to_supabase_${userId}`;
  localStorage.removeItem(migrationKey);
  console.log('⚠️ Migration reset - will run again on next load');
}

