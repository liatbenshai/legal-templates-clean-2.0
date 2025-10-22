-- Migration: Hierarchical Sections Table
-- Created: 2024
-- Description: Creates table for hierarchical sections with drag-and-drop support

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- HIERARCHICAL SECTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS hierarchical_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('main', 'sub', 'sub-sub')),
  parent_id UUID REFERENCES hierarchical_sections(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  usage_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  is_public BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  
  -- Constraints
  CONSTRAINT valid_rating CHECK (average_rating >= 0 AND average_rating <= 5),
  CONSTRAINT valid_usage_count CHECK (usage_count >= 0),
  CONSTRAINT valid_order_index CHECK (order_index >= 0)
);

-- Indexes for performance
CREATE INDEX idx_hierarchical_user_id ON hierarchical_sections(user_id);
CREATE INDEX idx_hierarchical_category ON hierarchical_sections(category);
CREATE INDEX idx_hierarchical_user_category ON hierarchical_sections(user_id, category);
CREATE INDEX idx_hierarchical_level ON hierarchical_sections(level);
CREATE INDEX idx_hierarchical_parent_id ON hierarchical_sections(parent_id);
CREATE INDEX idx_hierarchical_order ON hierarchical_sections(user_id, category, order_index);
CREATE INDEX idx_hierarchical_public ON hierarchical_sections(is_public) WHERE is_public = true;
CREATE INDEX idx_hierarchical_hidden ON hierarchical_sections(user_id, is_hidden);
-- Full-text search index
CREATE INDEX idx_hierarchical_search ON hierarchical_sections USING gin(to_tsvector('simple', title || ' ' || content));

-- Trigger to update updated_at
CREATE TRIGGER update_hierarchical_sections_updated_at
  BEFORE UPDATE ON hierarchical_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE hierarchical_sections ENABLE ROW LEVEL SECURITY;

-- Users can view their own sections and public sections
CREATE POLICY "Users can view own and public sections"
  ON hierarchical_sections FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR is_public = true);

-- Users can insert their own sections
CREATE POLICY "Users can insert own sections"
  ON hierarchical_sections FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can update their own sections
CREATE POLICY "Users can update own sections"
  ON hierarchical_sections FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can delete their own sections
CREATE POLICY "Users can delete own sections"
  ON hierarchical_sections FOR DELETE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get hierarchical sections tree
CREATE OR REPLACE FUNCTION get_hierarchical_sections_tree(p_user_id TEXT, p_category TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  level TEXT,
  parent_id UUID,
  order_index INTEGER,
  category TEXT,
  tags TEXT[],
  usage_count INTEGER,
  average_rating DECIMAL,
  is_public BOOLEAN,
  is_hidden BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  last_used TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT,
  children JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE section_tree AS (
    -- Base case: main sections
    SELECT 
      hs.id,
      hs.title,
      hs.content,
      hs.level,
      hs.parent_id,
      hs.order_index,
      hs.category,
      hs.tags,
      hs.usage_count,
      hs.average_rating,
      hs.is_public,
      hs.is_hidden,
      hs.created_at,
      hs.last_used,
      hs.updated_at,
      hs.created_by,
      '[]'::JSONB as children
    FROM hierarchical_sections hs
    WHERE hs.user_id = p_user_id 
      AND hs.level = 'main'
      AND (p_category IS NULL OR hs.category = p_category)
      AND hs.is_hidden = false
    
    UNION ALL
    
    -- Recursive case: sub-sections
    SELECT 
      hs.id,
      hs.title,
      hs.content,
      hs.level,
      hs.parent_id,
      hs.order_index,
      hs.category,
      hs.tags,
      hs.usage_count,
      hs.average_rating,
      hs.is_public,
      hs.is_hidden,
      hs.created_at,
      hs.last_used,
      hs.updated_at,
      hs.created_by,
      '[]'::JSONB as children
    FROM hierarchical_sections hs
    INNER JOIN section_tree st ON hs.parent_id = st.id
    WHERE hs.is_hidden = false
  )
  SELECT * FROM section_tree
  ORDER BY order_index;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reorder sections
CREATE OR REPLACE FUNCTION reorder_hierarchical_sections(
  p_user_id TEXT,
  p_section_id UUID,
  p_new_order INTEGER
)
RETURNS VOID AS $$
DECLARE
  v_old_order INTEGER;
  v_parent_id UUID;
BEGIN
  -- Get current order and parent
  SELECT order_index, parent_id INTO v_old_order, v_parent_id
  FROM hierarchical_sections
  WHERE id = p_section_id AND user_id = p_user_id;
  
  IF v_old_order IS NULL THEN
    RAISE EXCEPTION 'Section not found or access denied';
  END IF;
  
  -- Update the target section
  UPDATE hierarchical_sections
  SET order_index = p_new_order
  WHERE id = p_section_id AND user_id = p_user_id;
  
  -- Shift other sections if needed
  IF p_new_order > v_old_order THEN
    -- Moving down: shift sections up
    UPDATE hierarchical_sections
    SET order_index = order_index - 1
    WHERE user_id = p_user_id
      AND parent_id = v_parent_id
      AND order_index > v_old_order
      AND order_index <= p_new_order
      AND id != p_section_id;
  ELSE
    -- Moving up: shift sections down
    UPDATE hierarchical_sections
    SET order_index = order_index + 1
    WHERE user_id = p_user_id
      AND parent_id = v_parent_id
      AND order_index >= p_new_order
      AND order_index < v_old_order
      AND id != p_section_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to move section to different parent
CREATE OR REPLACE FUNCTION move_hierarchical_section(
  p_user_id TEXT,
  p_section_id UUID,
  p_new_parent_id UUID,
  p_new_order INTEGER
)
RETURNS VOID AS $$
DECLARE
  v_old_parent_id UUID;
  v_old_order INTEGER;
BEGIN
  -- Get current parent and order
  SELECT parent_id, order_index INTO v_old_parent_id, v_old_order
  FROM hierarchical_sections
  WHERE id = p_section_id AND user_id = p_user_id;
  
  IF v_old_parent_id IS NULL THEN
    RAISE EXCEPTION 'Section not found or access denied';
  END IF;
  
  -- Update the section
  UPDATE hierarchical_sections
  SET parent_id = p_new_parent_id, order_index = p_new_order
  WHERE id = p_section_id AND user_id = p_user_id;
  
  -- Shift sections in old parent
  UPDATE hierarchical_sections
  SET order_index = order_index - 1
  WHERE user_id = p_user_id
    AND parent_id = v_old_parent_id
    AND order_index > v_old_order;
  
  -- Shift sections in new parent
  UPDATE hierarchical_sections
  SET order_index = order_index + 1
  WHERE user_id = p_user_id
    AND parent_id = p_new_parent_id
    AND order_index >= p_new_order
    AND id != p_section_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- GRANTS
-- ============================================

-- Grant access to authenticated users
GRANT ALL ON hierarchical_sections TO authenticated;
GRANT EXECUTE ON FUNCTION get_hierarchical_sections_tree(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION reorder_hierarchical_sections(TEXT, UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION move_hierarchical_section(TEXT, UUID, UUID, INTEGER) TO authenticated;

-- ============================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================

-- Insert sample hierarchical sections for fee agreements
INSERT INTO hierarchical_sections (user_id, title, content, level, parent_id, order_index, category, tags, is_public) VALUES
('system', 'שכר טרחה בסיסי', 'הלקוח ישלם לעורך הדין שכר טרחה בסך של _______ ש"ח בתוספת מע"מ כחוק.', 'main', NULL, 1, 'fee_agreement', ARRAY['שכר', 'טרחה', 'בסיסי'], true),
('system', 'שכר טרחה למפגש ראשון', 'שכר הטרחה למפגש הראשון יעמוד על סך של _______ ש"ח בתוספת מע"מ.', 'sub', (SELECT id FROM hierarchical_sections WHERE title = 'שכר טרחה בסיסי' AND user_id = 'system'), 1, 'fee_agreement', ARRAY['שכר', 'מפגש', 'ראשון'], true),
('system', 'הכנת הצוואה', 'כולל הכנת הצוואה המלאה על פי הוראות הלקוח.', 'sub-sub', (SELECT id FROM hierarchical_sections WHERE title = 'שכר טרחה למפגש ראשון' AND user_id = 'system'), 1, 'fee_agreement', ARRAY['הכנה', 'צוואה'], true),
('system', 'תיעוד הוראות', 'כולל תיעוד מפורט של כל הוראות הלקוח.', 'sub-sub', (SELECT id FROM hierarchical_sections WHERE title = 'שכר טרחה למפגש ראשון' AND user_id = 'system'), 2, 'fee_agreement', ARRAY['תיעוד', 'הוראות'], true),
('system', 'שכר טרחה למפגש שני', 'שכר הטרחה למפגש השני יעמוד על סך של _______ ש"ח בתוספת מע"מ.', 'sub', (SELECT id FROM hierarchical_sections WHERE title = 'שכר טרחה בסיסי' AND user_id = 'system'), 2, 'fee_agreement', ARRAY['שכר', 'מפגש', 'שני'], true),
('system', 'הגהה וחתימה', 'כולל הגהה סופית של הצוואה וחתימה עליה.', 'sub-sub', (SELECT id FROM hierarchical_sections WHERE title = 'שכר טרחה למפגש שני' AND user_id = 'system'), 1, 'fee_agreement', ARRAY['הגהה', 'חתימה'], true),
('system', 'שמירה ועזרה', 'כולל שמירת הצוואה במקום בטוח ועזרה בהגשה.', 'sub-sub', (SELECT id FROM hierarchical_sections WHERE title = 'שכר טרחה למפגש שני' AND user_id = 'system'), 2, 'fee_agreement', ARRAY['שמירה', 'עזרה'], true);

-- ============================================
-- COMPLETED
-- ============================================

-- Add comment to track migration
COMMENT ON TABLE hierarchical_sections IS 'Migration 002: Hierarchical Sections - Created at 2024';
