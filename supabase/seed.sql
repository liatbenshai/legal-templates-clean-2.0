-- Seed data for hierarchical sections
-- This file is automatically executed after migrations during db reset

-- Insert sample hierarchical sections for fee agreements
INSERT INTO hierarchical_sections (user_id, title, content, level, parent_id, order_index, category, tags, is_public) VALUES
('system', 'שכר טרחה בסיסי', 'הלקוח ישלם לעורך הדין שכר טרחה בסך של _______ ש"ח בתוספת מע"מ כחוק.', 'main', NULL, 1, 'fee_agreement', ARRAY['שכר', 'טרחה', 'בסיסי'], true),
('system', 'שכר טרחה למפגש ראשון', 'שכר הטרחה למפגש הראשון יעמוד על סך של _______ ש"ח בתוספת מע"מ.', 'sub', (SELECT id FROM hierarchical_sections WHERE title = 'שכר טרחה בסיסי' AND user_id = 'system'), 1, 'fee_agreement', ARRAY['שכר', 'מפגש', 'ראשון'], true),
('system', 'הכנת הצוואה', 'כולל הכנת הצוואה המלאה על פי הוראות הלקוח.', 'sub-sub', (SELECT id FROM hierarchical_sections WHERE title = 'שכר טרחה למפגש ראשון' AND user_id = 'system'), 1, 'fee_agreement', ARRAY['הכנה', 'צוואה'], true),
('system', 'תיעוד הוראות', 'כולל תיעוד מפורט של כל הוראות הלקוח.', 'sub-sub', (SELECT id FROM hierarchical_sections WHERE title = 'שכר טרחה למפגש ראשון' AND user_id = 'system'), 2, 'fee_agreement', ARRAY['תיעוד', 'הוראות'], true),
('system', 'שכר טרחה למפגש שני', 'שכר הטרחה למפגש השני יעמוד על סך של _______ ש"ח בתוספת מע"מ.', 'sub', (SELECT id FROM hierarchical_sections WHERE title = 'שכר טרחה בסיסי' AND user_id = 'system'), 2, 'fee_agreement', ARRAY['שכר', 'מפגש', 'שני'], true),
('system', 'הגהה וחתימה', 'כולל הגהה סופית של הצוואה וחתימה עליה.', 'sub-sub', (SELECT id FROM hierarchical_sections WHERE title = 'שכר טרחה למפגש שני' AND user_id = 'system'), 1, 'fee_agreement', ARRAY['הגהה', 'חתימה'], true),
('system', 'שמירה ועזרה', 'כולל שמירת הצוואה במקום בטוח ועזרה בהגשה.', 'sub-sub', (SELECT id FROM hierarchical_sections WHERE title = 'שכר טרחה למפגש שני' AND user_id = 'system'), 2, 'fee_agreement', ARRAY['שמירה', 'עזרה'], true);

-- Insert sample warehouse sections
INSERT INTO warehouse_sections (user_id, title, content, category, tags, is_public) VALUES
('system', 'סעיף שכר טרחה בסיסי', 'הלקוח ישלם לעורך הדין שכר טרחה בסך של _______ ש"ח בתוספת מע"מ כחוק.', 'fee_agreement', ARRAY['שכר', 'טרחה', 'בסיסי'], true),
('system', 'סעיף מקדמה', 'הלקוח ישלם מקדמה בסך של _______ ש"ח במעמד החתימה על הסכם זה.', 'fee_agreement', ARRAY['מקדמה', 'תשלום'], true),
('system', 'סעיף הוצאות', 'כל ההוצאות הנוספות יחויבו על הלקוח בנפרד.', 'fee_agreement', ARRAY['הוצאות', 'נוספות'], true);
