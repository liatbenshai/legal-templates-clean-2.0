-- Migration: Advance Directives Sections Table
-- Created: 2025
-- Description: Creates table for managing advance directives sections (ייפוי כוח מתמשך - הנחיות מקדימות)

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- HELPER FUNCTION (if not exists)
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ADVANCE DIRECTIVES SECTIONS TABLE
-- ============================================
-- טבלה לניהול סעיפי ההנחיות המקדימות
-- מאפשרת עריכה, הוספה ומחיקה של סעיפים

CREATE TABLE IF NOT EXISTS advance_directives_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id TEXT UNIQUE NOT NULL,  -- מזהה טקסטואלי כמו SEC_001
  category TEXT NOT NULL CHECK (category IN ('property', 'personal', 'medical')),
  subcategory TEXT NOT NULL,
  title TEXT NOT NULL,
  title_en TEXT,
  content TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  gender_variables JSONB DEFAULT '{"principal": false, "attorney": false}',
  tags TEXT[] DEFAULT '{}',
  
  -- מידע על עריכות
  is_active BOOLEAN DEFAULT true,
  is_custom BOOLEAN DEFAULT false,  -- סעיף מותאם אישית
  created_by TEXT,
  last_modified_by TEXT,
  
  -- מטא-דאטה
  usage_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1,
  
  -- תאריכים
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- אינדקסים לביצועים
CREATE INDEX idx_ad_sections_category ON advance_directives_sections(category);
CREATE INDEX idx_ad_sections_subcategory ON advance_directives_sections(subcategory);
CREATE INDEX idx_ad_sections_section_id ON advance_directives_sections(section_id);
CREATE INDEX idx_ad_sections_active ON advance_directives_sections(is_active);
CREATE INDEX idx_ad_sections_sort ON advance_directives_sections(category, sort_order);

-- חיפוש טקסט מלא (עברית)
CREATE INDEX idx_ad_sections_search ON advance_directives_sections 
  USING gin(to_tsvector('simple', title || ' ' || content));

-- Trigger לעדכון updated_at
CREATE TRIGGER update_ad_sections_updated_at
  BEFORE UPDATE ON advance_directives_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CATEGORIES & SUBCATEGORIES TABLE
-- ============================================
-- טבלת קטגוריות ותתי-קטגוריות

CREATE TABLE IF NOT EXISTS advance_directives_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  icon TEXT,
  color TEXT,
  parent_id TEXT REFERENCES advance_directives_categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SECTION EDIT HISTORY
-- ============================================
-- היסטוריית עריכות סעיפים

CREATE TABLE IF NOT EXISTS advance_directives_edit_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES advance_directives_sections(id) ON DELETE CASCADE,
  previous_content TEXT NOT NULL,
  new_content TEXT NOT NULL,
  previous_title TEXT,
  new_title TEXT,
  edited_by TEXT NOT NULL,
  edit_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ad_edit_history_section ON advance_directives_edit_history(section_id);
CREATE INDEX idx_ad_edit_history_date ON advance_directives_edit_history(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE advance_directives_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_directives_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_directives_edit_history ENABLE ROW LEVEL SECURITY;

-- כולם יכולים לקרוא סעיפים פעילים
CREATE POLICY "Anyone can read active sections"
  ON advance_directives_sections FOR SELECT
  USING (is_active = true);

-- רק מנהלים יכולים לערוך (בהמשך נוסיף בדיקת תפקיד)
CREATE POLICY "Admins can manage sections"
  ON advance_directives_sections FOR ALL
  USING (true);

CREATE POLICY "Anyone can read categories"
  ON advance_directives_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage categories"
  ON advance_directives_categories FOR ALL
  USING (true);

CREATE POLICY "Anyone can read edit history"
  ON advance_directives_edit_history FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert edit history"
  ON advance_directives_edit_history FOR INSERT
  WITH CHECK (true);

-- ============================================
-- GRANTS
-- ============================================

GRANT ALL ON advance_directives_sections TO authenticated;
GRANT ALL ON advance_directives_categories TO authenticated;
GRANT ALL ON advance_directives_edit_history TO authenticated;
GRANT SELECT ON advance_directives_sections TO anon;
GRANT SELECT ON advance_directives_categories TO anon;

-- ============================================
-- INSERT CATEGORIES
-- ============================================

INSERT INTO advance_directives_categories (id, name, name_en, icon, color, sort_order) VALUES
  ('property', 'עניינים רכושיים', 'Property Matters', '🏠', '#27ae60', 1),
  ('personal', 'עניינים אישיים', 'Personal Matters', '👤', '#3498db', 2),
  ('medical', 'עניינים רפואיים', 'Medical Matters', '⚕️', '#e74c3c', 3)
ON CONFLICT (id) DO NOTHING;

-- תתי-קטגוריות רכושי
INSERT INTO advance_directives_categories (id, name, name_en, parent_id, sort_order) VALUES
  ('real_estate', 'נדל"ן', 'Real Estate', 'property', 1),
  ('banking', 'בנקאות', 'Banking', 'property', 2),
  ('allowances', 'קצבאות', 'Allowances', 'property', 3),
  ('vehicle', 'רכב', 'Vehicle', 'property', 4),
  ('prohibitions', 'איסורים', 'Prohibitions', 'property', 5)
ON CONFLICT (id) DO NOTHING;

-- תתי-קטגוריות אישי
INSERT INTO advance_directives_categories (id, name, name_en, parent_id, sort_order) VALUES
  ('residence', 'מגורים', 'Residence', 'personal', 1),
  ('caregiver', 'מטפלים', 'Caregivers', 'personal', 2),
  ('social', 'קשרים חברתיים', 'Social Connections', 'personal', 3),
  ('cleanliness', 'ניקיון', 'Cleanliness', 'personal', 4),
  ('maintenance', 'תחזוקה', 'Maintenance', 'personal', 5),
  ('nutrition', 'תזונה', 'Nutrition', 'personal', 6),
  ('personal_care', 'טיפוח אישי', 'Personal Care', 'personal', 7),
  ('physical_activity', 'פעילות גופנית', 'Physical Activity', 'personal', 8),
  ('culture', 'תרבות ופנאי', 'Culture & Leisure', 'personal', 9),
  ('technology', 'טכנולוגיה', 'Technology', 'personal', 10),
  ('security', 'אבטחה', 'Security', 'personal', 11),
  ('travel', 'נסיעות', 'Travel', 'personal', 12)
ON CONFLICT (id) DO NOTHING;

-- תתי-קטגוריות רפואי
INSERT INTO advance_directives_categories (id, name, name_en, parent_id, sort_order) VALUES
  ('decisions', 'החלטות רפואיות', 'Medical Decisions', 'medical', 1),
  ('treatment', 'עקרונות טיפול', 'Treatment Principles', 'medical', 2),
  ('second_opinion', 'חוות דעת שנייה', 'Second Opinion', 'medical', 3),
  ('clinical_trials', 'ניסויים קליניים', 'Clinical Trials', 'medical', 4),
  ('end_of_life', 'סוף חיים', 'End of Life', 'medical', 5),
  ('pain', 'ניהול כאב', 'Pain Management', 'medical', 6),
  ('resuscitation', 'החייאה', 'Resuscitation', 'medical', 7),
  ('chronic', 'מחלות כרוניות', 'Chronic Diseases', 'medical', 8),
  ('providers', 'נותני שירות', 'Service Providers', 'medical', 9),
  ('insurance', 'ביטוחים', 'Insurance', 'medical', 10),
  ('organ_donation', 'תרומת איברים', 'Organ Donation', 'medical', 11)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- פונקציה לקבלת סעיפים לפי קטגוריה
CREATE OR REPLACE FUNCTION get_sections_by_category(p_category TEXT)
RETURNS SETOF advance_directives_sections AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM advance_directives_sections
  WHERE category = p_category AND is_active = true
  ORDER BY sort_order, section_id;
END;
$$ LANGUAGE plpgsql;

-- פונקציה לחיפוש סעיפים
CREATE OR REPLACE FUNCTION search_ad_sections(p_query TEXT)
RETURNS SETOF advance_directives_sections AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM advance_directives_sections
  WHERE is_active = true
    AND (
      title ILIKE '%' || p_query || '%'
      OR content ILIKE '%' || p_query || '%'
      OR p_query = ANY(tags)
    )
  ORDER BY 
    CASE WHEN title ILIKE '%' || p_query || '%' THEN 1 ELSE 2 END,
    sort_order;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMPLETED
-- ============================================

COMMENT ON TABLE advance_directives_sections IS 'Migration 003: Advance Directives Sections for ייפוי כוח מתמשך';

