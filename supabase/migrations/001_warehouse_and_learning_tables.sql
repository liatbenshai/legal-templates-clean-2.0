-- Migration: Warehouse and Learning System Tables
-- Created: 2024
-- Description: Creates tables for warehouse sections, learning data, and user preferences

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. WAREHOUSE SECTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS warehouse_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
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
  CONSTRAINT valid_usage_count CHECK (usage_count >= 0)
);

-- Indexes for performance
CREATE INDEX idx_warehouse_user_id ON warehouse_sections(user_id);
CREATE INDEX idx_warehouse_category ON warehouse_sections(category);
CREATE INDEX idx_warehouse_user_category ON warehouse_sections(user_id, category);
CREATE INDEX idx_warehouse_public ON warehouse_sections(is_public) WHERE is_public = true;
CREATE INDEX idx_warehouse_hidden ON warehouse_sections(user_id, is_hidden);
-- Full-text search index (using 'simple' config for multi-language support including Hebrew)
CREATE INDEX idx_warehouse_search ON warehouse_sections USING gin(to_tsvector('simple', title || ' ' || content));

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_warehouse_sections_updated_at
  BEFORE UPDATE ON warehouse_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. LEARNING DATA TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS learning_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  section_id TEXT NOT NULL,
  original_text TEXT NOT NULL,
  edited_text TEXT NOT NULL,
  edit_type TEXT NOT NULL CHECK (edit_type IN ('manual', 'ai_suggested', 'ai_approved')),
  user_feedback TEXT CHECK (user_feedback IN ('approved', 'rejected', 'improved', NULL)),
  context JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT different_texts CHECK (original_text != edited_text)
);

-- Indexes
CREATE INDEX idx_learning_user_id ON learning_data(user_id);
CREATE INDEX idx_learning_section_id ON learning_data(section_id);
CREATE INDEX idx_learning_created_at ON learning_data(created_at DESC);
CREATE INDEX idx_learning_edit_type ON learning_data(edit_type);
CREATE INDEX idx_learning_context ON learning_data USING gin(context);

-- ============================================
-- 3. USER PREFERENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY,
  preferred_style JSONB DEFAULT '{"formalLevel": "medium", "languageStyle": "formal", "preferredTerms": []}',
  hidden_section_ids TEXT[] DEFAULT '{}',
  custom_settings JSONB DEFAULT '{}',
  ai_preferences JSONB DEFAULT '{"autoSuggest": true, "learningEnabled": true, "styleAdaptation": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for updated_at
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. SAVED SECTIONS TABLE (for AI Learning)
-- ============================================
CREATE TABLE IF NOT EXISTS saved_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_saved_sections_created_at ON saved_sections(created_at DESC);

-- ============================================
-- 5. WAREHOUSE SECTIONS TABLE (for useWarehouse hook)
-- ============================================
CREATE TABLE IF NOT EXISTS warehouse_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
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
  CONSTRAINT valid_usage_count CHECK (usage_count >= 0)
);

-- Indexes for performance
CREATE INDEX idx_warehouse_user_id ON warehouse_sections(user_id);
CREATE INDEX idx_warehouse_category ON warehouse_sections(category);
CREATE INDEX idx_warehouse_user_category ON warehouse_sections(user_id, category);
CREATE INDEX idx_warehouse_public ON warehouse_sections(is_public) WHERE is_public = true;
CREATE INDEX idx_warehouse_hidden ON warehouse_sections(user_id, is_hidden);

-- Trigger to update updated_at
CREATE TRIGGER update_warehouse_sections_updated_at
  BEFORE UPDATE ON warehouse_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. SECTION TEMPLATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS section_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  main_section JSONB NOT NULL,
  child_sections JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_section_templates_created_at ON section_templates(created_at DESC);

-- ============================================
-- 6. ADVANCE DIRECTIVES HIDDEN SECTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS advance_directives_hidden_sections (
  user_id TEXT NOT NULL,
  section_id TEXT NOT NULL,
  hidden_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (user_id, section_id)
);

-- Index
CREATE INDEX idx_ad_hidden_user_id ON advance_directives_hidden_sections(user_id);

-- ============================================
-- 5. AI INSIGHTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  section_id TEXT NOT NULL,
  suggestion TEXT NOT NULL,
  reason TEXT NOT NULL,
  confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  insight_type TEXT NOT NULL CHECK (insight_type IN ('improvement', 'clarity', 'legal_accuracy', 'style')),
  is_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_insights_user_id ON ai_insights(user_id);
CREATE INDEX idx_insights_section_id ON ai_insights(section_id);
CREATE INDEX idx_insights_applied ON ai_insights(is_applied);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE warehouse_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_directives_hidden_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - WAREHOUSE SECTIONS
-- ============================================

-- Users can view their own sections
CREATE POLICY "Users can view own sections"
  ON warehouse_sections FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR is_public = true);

-- Users can insert their own sections
CREATE POLICY "Users can insert own sections"
  ON warehouse_sections FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can update their own sections
CREATE POLICY "Users can update own sections"
  ON warehouse_sections FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can delete their own sections
CREATE POLICY "Users can delete own sections"
  ON warehouse_sections FOR DELETE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- ============================================
-- RLS POLICIES - LEARNING DATA
-- ============================================

CREATE POLICY "Users can view own learning data"
  ON learning_data FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own learning data"
  ON learning_data FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- ============================================
-- RLS POLICIES - USER PREFERENCES
-- ============================================

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- ============================================
-- RLS POLICIES - ADVANCE DIRECTIVES HIDDEN
-- ============================================

CREATE POLICY "Users can manage own hidden sections"
  ON advance_directives_hidden_sections FOR ALL
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- ============================================
-- RLS POLICIES - SECTION TEMPLATES
-- ============================================

CREATE POLICY "Enable read access for all users" ON section_templates FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON section_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON section_templates FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON section_templates FOR DELETE USING (true);

-- ============================================
-- RLS POLICIES - AI INSIGHTS
-- ============================================

CREATE POLICY "Users can view own insights"
  ON ai_insights FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own insights"
  ON ai_insights FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own insights"
  ON ai_insights FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_warehouse_stats(p_user_id TEXT)
RETURNS TABLE (
  total_sections INTEGER,
  public_sections INTEGER,
  hidden_sections INTEGER,
  total_usage INTEGER,
  avg_rating DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_sections,
    COUNT(*) FILTER (WHERE is_public = true)::INTEGER as public_sections,
    COUNT(*) FILTER (WHERE is_hidden = true)::INTEGER as hidden_sections,
    COALESCE(SUM(usage_count), 0)::INTEGER as total_usage,
    COALESCE(AVG(average_rating), 0)::DECIMAL as avg_rating
  FROM warehouse_sections
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_section_usage(p_section_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE warehouse_sections
  SET usage_count = usage_count + 1,
      last_used = NOW()
  WHERE id = p_section_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================

-- Insert sample categories for reference
-- Note: This is just for documentation, actual categories are stored as TEXT
COMMENT ON COLUMN warehouse_sections.category IS 'Categories: financial, personal, business, health, couple, children, property, digital, custom';

-- ============================================
-- GRANTS
-- ============================================

-- Grant access to authenticated users
GRANT ALL ON warehouse_sections TO authenticated;
GRANT ALL ON learning_data TO authenticated;
GRANT ALL ON user_preferences TO authenticated;
GRANT ALL ON advance_directives_hidden_sections TO authenticated;
GRANT ALL ON ai_insights TO authenticated;

-- Grant usage on sequences (if any)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- COMPLETED
-- ============================================

-- Add comment to track migration
COMMENT ON TABLE warehouse_sections IS 'Migration 001: Warehouse and Learning System - Created at 2024';

