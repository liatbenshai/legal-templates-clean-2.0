/**
 * מחסן סעיפים לכתבי בית משפט
 * כולל: כתבי תביעה, ערעורים, כתבי הגנה, בקשות
 */

export interface CourtSectionTemplate {
  id: string;
  title: string;
  category: 'opening' | 'facts' | 'legal-claims' | 'evidence' | 'remedies' | 'procedural' | 'closing';
  content: string;
  variables: string[];
  aiPrompt: string;
  usageInstructions: string;
  documentTypes: ('court-petition' | 'appeal' | 'court' | 'inheritance' | 'will-contest' | 'guardianship' | 'monetary-agreement')[];
}

export const courtSectionsWarehouse: CourtSectionTemplate[] = [
  // פתיחות לכתבי תביעה
  {
    id: 'court-opening-basic',
    title: 'פתיחת כתב תביעה בסיסית',
    category: 'opening',
    content: `לכבוד בית המשפט המוקר {{court_name}}

הנדון: {{case_subject}}

אני הח"מ {{plaintiff_name}}, ת.ז. {{plaintiff_id}}, מכתובת {{plaintiff_address}}, באמצעות ב"כ עו"ד {{lawyer_name}}, מגיש בזאת כתב תביעה נגד {{defendant_name}}, ת.ז. {{defendant_id}}, מכתובת {{defendant_address}} (להלן: "הנתבע").`,
    variables: ['court_name', 'case_subject', 'plaintiff_name', 'plaintiff_id', 'plaintiff_address', 'lawyer_name', 'defendant_name', 'defendant_id', 'defendant_address'],
    aiPrompt: 'שפר את פתיחת כתב התביעה, וודא שהפרטים מדויקים והניסוח משפטי תקין',
    usageInstructions: 'השתמש בסעיף זה לפתיחת כל כתב תביעה אזרחי',
    documentTypes: ['court-petition', 'court']
  },

  {
    id: 'court-opening-inheritance',
    title: 'פתיחת בקשה לצו ירושה',
    category: 'opening',
    content: `לכבוד בית המשפט לענייני משפחה {{court_location}}

הנדון: בקשה לצו ירושה לפי חוק הירושה, התשכ"ה-1965

אני הח"מ {{applicant_name}}, ת.ז. {{applicant_id}}, מכתובת {{applicant_address}}, {{relationship_to_deceased}} של המנוח/ה {{deceased_name}}, ת.ז. {{deceased_id}}, אשר נפטר/ה ביום {{death_date}} (להלן: "המנוח/ה"), מבקש/ת בזאת מבית המשפט הנכבד להוציא צו ירושה.`,
    variables: ['court_location', 'applicant_name', 'applicant_id', 'applicant_address', 'relationship_to_deceased', 'deceased_name', 'deceased_id', 'death_date'],
    aiPrompt: 'שפר את פתיחת הבקשה לצו ירושה, התאם לפרטי המקרה הספציפי',
    usageInstructions: 'השתמש בסעיף זה לפתיחת בקשות לצו ירושה',
    documentTypes: ['inheritance']
  },

  // רקע עובדתי
  {
    id: 'factual-background-dispute',
    title: 'רקע עובדתי לסכסוך',
    category: 'facts',
    content: `רקע עובדתי:

1. ביום {{incident_date}} התרחש האירוע שבגינו מוגשת תביעה זו.

2. הנסיבות העובדתיות הן כדלקמן: {{factual_description}}

3. כתוצאה מהאירוע הנ"ל, נגרם לתובע נזק {{damage_type}} בסך של {{damage_amount}} ש"ח.

4. התובע פנה לנתבע בתאריך {{demand_date}} בדרישה לפיצוי, אך הנתבע סירב לשלם.`,
    variables: ['incident_date', 'factual_description', 'damage_type', 'damage_amount', 'demand_date'],
    aiPrompt: 'הרחב את הרקע העובדתי, הוסף פרטים רלוונטיים ווודא רצף לוגי של האירועים',
    usageInstructions: 'השתמש לתיאור הרקע העובדתי בכתבי תביעה אזרחיים',
    documentTypes: ['court-petition', 'court']
  },

  {
    id: 'inheritance-facts',
    title: 'עובדות לצו ירושה',
    category: 'facts',
    content: `עובדות:

1. המנוח/ה נפטר/ה ביום {{death_date}} במקום {{death_location}}.

2. המנוח/ה השאיר/ה אחריו/ה את הרכוש הבא:
   {{estate_description}}

3. היורשים החוקיים של המנוח/ה הם:
   {{heirs_list}}

4. {{additional_facts}}

5. לא קיימת צוואה / קיימת צוואה מיום {{will_date}} (יש למחוק את הלא רלוונטי).`,
    variables: ['death_date', 'death_location', 'estate_description', 'heirs_list', 'additional_facts', 'will_date'],
    aiPrompt: 'ארגן את העובדות בצורה ברורה וקוהרנטית, הוסף פרטים חשובים לצו הירושה',
    usageInstructions: 'השתמש לתיאור העובדות בבקשות לצו ירושה',
    documentTypes: ['inheritance']
  },

  // טיעונים משפטיים
  {
    id: 'legal-claim-breach-contract',
    title: 'טיעון משפטי - הפרת חוזה',
    category: 'legal-claims',
    content: `הטיעון המשפטי:

1. בין הצדדים נכרת חוזה ביום {{contract_date}} לביצוע {{contract_subject}}.

2. התובע מילא את כל התחייבויותיו על פי החוזה במלואן ובמועדן.

3. הנתבע הפר את החוזה באופן יסודי על ידי {{breach_description}}.

4. הפרה זו מהווה הפרה יסודית כמשמעותה בחוק החוזים (תרופות בשל הפרת חוזה), התשכ"א-1970.

5. כתוצאה מההפרה נגרם לתובע נזק ישיר בסך {{direct_damage}} ש"ח ונזק עקיף בסך {{indirect_damage}} ש"ח.`,
    variables: ['contract_date', 'contract_subject', 'breach_description', 'direct_damage', 'indirect_damage'],
    aiPrompt: 'חזק את הטיעון המשפטי, הוסף סעיפי חוק רלוונטיים ופסיקה אם רלוונטי',
    usageInstructions: 'השתמש בתביעות בגין הפרת חוזה',
    documentTypes: ['court-petition', 'court']
  },

  {
    id: 'legal-claim-negligence',
    title: 'טיעון משפטי - רשלנות',
    category: 'legal-claims',
    content: `טיעון רשלנות:

1. על הנתבע חלה חובת זהירות כלפי התובע בנסיבות המקרה.

2. הנתבע הפר את חובת הזהירות על ידי {{negligence_description}}.

3. הפרת חובת הזהירות הייתה הגורם הישיר לנזק שנגרם לתובע.

4. הנזק שנגרם הוא {{damage_description}} בסך של {{damage_amount}} ש"ח.

5. הנזק היה צפוי ונמנע, ולו נהג הנתבע בזהירות הנדרשת, הנזק לא היה נגרם.`,
    variables: ['negligence_description', 'damage_description', 'damage_amount'],
    aiPrompt: 'חזק את טיעון הרשלנות, הוסף אלמנטים של חובת זהירות וקשר סיבתי',
    usageInstructions: 'השתמש בתביעות נזיקין בגין רשלנות',
    documentTypes: ['court-petition', 'court']
  },

  // ראיות
  {
    id: 'evidence-documents',
    title: 'ראיות מסמכיות',
    category: 'evidence',
    content: `ראיות:

התובע מבקש להגיש את הראיות הבאות:

1. {{document1_type}} מיום {{document1_date}} - {{document1_relevance}}

2. {{document2_type}} מיום {{document2_date}} - {{document2_relevance}}

3. {{document3_type}} מיום {{document3_date}} - {{document3_relevance}}

4. עדות מומחה של {{expert_name}}, {{expert_title}} - {{expert_opinion}}

הראיות הנ"ל מוכיחות את טענות התובע ומבססות את זכותו לסעד המבוקש.`,
    variables: ['document1_type', 'document1_date', 'document1_relevance', 'document2_type', 'document2_date', 'document2_relevance', 'document3_type', 'document3_date', 'document3_relevance', 'expert_name', 'expert_title', 'expert_opinion'],
    aiPrompt: 'ארגן את הראיות בצורה משכנעת, הדגש את הרלוונטיות של כל ראיה לטענות',
    usageInstructions: 'השתמש לארגון ראיות בכתבי תביעה',
    documentTypes: ['court-petition', 'court']
  },

  // סעדים
  {
    id: 'remedies-monetary',
    title: 'בקשת סעדים כספיים',
    category: 'remedies',
    content: `הסעד המבוקש:

לפיכך, מתכבד התובע לבקש מבית המשפט הנכבד:

1. לחייב את הנתבע לשלם לתובע סך של {{main_amount}} ש"ח בגין {{main_damage_reason}}.

2. לחייב את הנתבע לשלם לתובע סך של {{additional_amount}} ש"ח בגין {{additional_damage_reason}}.

3. לחייב את הנתבע בהוצאות המשפט ושכר טרחת עורך דין.

4. לחייב את הנתבע בריבית וצמדה על הסכומים הנ"ל מיום {{interest_start_date}} ועד לתשלום בפועל.

5. {{additional_remedy}}`,
    variables: ['main_amount', 'main_damage_reason', 'additional_amount', 'additional_damage_reason', 'interest_start_date', 'additional_remedy'],
    aiPrompt: 'חזק את בקשת הסעדים, וודא שהסכומים מוצדקים והסעדים מתאימים לנזק',
    usageInstructions: 'השתמש לבקשת סעדים כספיים בכתבי תביעה',
    documentTypes: ['court-petition', 'court']
  },

  {
    id: 'remedies-injunction',
    title: 'בקשת צו מניעה',
    category: 'remedies',
    content: `בקשת צו מניעה:

מתכבד התובע לבקש מבית המשפט הנכבד:

1. להוציא צו מניעה זמני האוסר על הנתבע {{prohibited_action}}.

2. להפוך את צו המניעה הזמני לקבוע לאחר שמיעת הצדדים.

3. הצו מתבקש בשל {{urgency_reason}} והצורך למנוע נזק בלתי הפיך.

4. התובע מתחייב לשפות את הנתבע בגין כל נזק שייגרם לו אם יתברר שהצו הוצא שלא כדין.

5. {{additional_injunction_terms}}`,
    variables: ['prohibited_action', 'urgency_reason', 'additional_injunction_terms'],
    aiPrompt: 'חזק את בקשת צו המניעה, הדגש את הדחיפות והצורך במניעת נזק בלתי הפיך',
    usageInstructions: 'השתמש לבקשות צו מניעה דחופות',
    documentTypes: ['court-petition', 'court']
  },

  // סעיפי ערעור
  {
    id: 'appeal-grounds',
    title: 'עילות ערעור',
    category: 'legal-claims',
    content: `עילות הערעור:

1. בית המשפט קמא שגה בקביעותיו העובדתיות באשר ל{{factual_error}}.

2. בית המשפט קמא שגה בפרשנותו המשפטית של {{legal_error}}.

3. בית המשפט קמא לא נתן משקל ראוי לראיות {{ignored_evidence}}.

4. פסק הדין סותר את הפסיקה הקבועה בעניין {{precedent_case}}.

5. {{additional_appeal_ground}}

עילות אלו מצדיקות ביטול פסק הדין ומתן פסק דין חדש לטובת המערער.`,
    variables: ['factual_error', 'legal_error', 'ignored_evidence', 'precedent_case', 'additional_appeal_ground'],
    aiPrompt: 'חזק את עילות הערעור, הוסף התייחסות לפסיקה רלוונטית ולשגיאות ספציפיות',
    usageInstructions: 'השתמש בכתבי ערעור לבתי משפט עליונים',
    documentTypes: ['appeal']
  },

  // סעיפי סיום
  {
    id: 'court-closing-standard',
    title: 'סיום כתב תביעה סטנדרטי',
    category: 'closing',
    content: `לסיכום:

התובע סבור כי הוכח מעל לכל ספק סביר כי הנתבע אחראי לנזקים שנגרמו לו, ולפיכך זכאי התובע לסעדים המבוקשים.

התובע מבקש מבית המשפט הנכבד לקבל את התביעה במלואה ולחייב את הנתבע בתשלום הסכומים הנדרשים בתוספת הוצאות והריבית.

בכבוד רב,

{{lawyer_name}}, עו"ד
מטעם התובע`,
    variables: ['lawyer_name'],
    aiPrompt: 'שפר את סיום כתב התביעה, הדגש את חוזק הטענות ואת הזכאות לסעד',
    usageInstructions: 'השתמש לסיום כתבי תביעה אזרחיים',
    documentTypes: ['court-petition', 'court']
  },

  // סעיפים פרוצדורליים
  {
    id: 'procedural-service',
    title: 'בקשה למשלוח כתב תביעה',
    category: 'procedural',
    content: `בקשה פרוצדורלית:

מתכבד התובע לבקש מבית המשפט:

1. לקבוע דיון בתביעה זו ליום {{requested_hearing_date}} או למועד הקרוב ביותר שיתאפשר.

2. להורות על משלוח כתב התביעה לנתבע לכתובת {{service_address}}.

3. {{additional_procedural_request}}

4. לחייב את הנתבע במתן תשובה לכתב התביעה תוך {{response_deadline}} ימים ממועד קבלתו.`,
    variables: ['requested_hearing_date', 'service_address', 'additional_procedural_request', 'response_deadline'],
    aiPrompt: 'התאם את הבקשות הפרוצדורליות לסוג התיק והדחיפות',
    usageInstructions: 'השתמש לבקשות פרוצדורליות בכתבי תביעה',
    documentTypes: ['court-petition', 'court']
  },

  // סעיפי חירום
  {
    id: 'urgent-application',
    title: 'בקשה דחופה',
    category: 'procedural',
    content: `בקשה דחופה:

מתכבד התובע לבקש מבית המשפט לדון בתביעה זו בדחיפות מהטעמים הבאים:

1. {{urgency_reason1}}

2. {{urgency_reason2}}

3. דחיית הדיון עלולה לגרום נזק בלתי הפיך של {{irreversible_damage}}.

4. התובע מוכן להתחייב בערבות בסך {{guarantee_amount}} ש"ח להבטחת תשלום נזקים אם יתברר שהבקשה הוגשה שלא כדין.

לפיכך מתבקש בית המשפט לקבוע דיון דחוף תוך {{urgent_timeframe}} ימים.`,
    variables: ['urgency_reason1', 'urgency_reason2', 'irreversible_damage', 'guarantee_amount', 'urgent_timeframe'],
    aiPrompt: 'הדגש את הדחיפות והצורך בדיון מהיר, חזק את הנימוקים',
    usageInstructions: 'השתמש במקרים דחופים הדורשים טיפול מיידי',
    documentTypes: ['court-petition', 'court']
  },

  // סעיפי הוכחה
  {
    id: 'burden-of-proof',
    title: 'חלוקת נטל הוכחה',
    category: 'legal-claims',
    content: `נטל ההוכחה:

1. התובע הוכיח את {{plaintiff_proved}} כנדרש על פי דין.

2. נטל ההוכחה עבר לנתבע להוכיח כי {{defendant_must_prove}}.

3. הנתבע לא הצליח לעמוד בנטל ההוכחה החל עליו.

4. לפיכך, יש לקבל את טענות התובע ולדחות את טענות ההגנה של הנתבע.

5. {{additional_burden_argument}}`,
    variables: ['plaintiff_proved', 'defendant_must_prove', 'additional_burden_argument'],
    aiPrompt: 'חזק את הטיעון בנושא נטל ההוכחה, הוסף התייחסות לחוקים רלוונטיים',
    usageInstructions: 'השתמש כאשר יש ויכוח על נטל ההוכחה',
    documentTypes: ['court-petition', 'court', 'appeal']
  },

  // התנגדויות לצוואה
  {
    id: 'will-contest-opening',
    title: 'פתיחת התנגדות לצוואה',
    category: 'opening',
    content: `לכבוד בית המשפט לענייני משפחה {{court_location}}

הנדון: התנגדות לצוואה ולבקשה לצו קיום צוואה

אני הח"מ {{contestant_name}}, ת.ז. {{contestant_id}}, מכתובת {{contestant_address}}, {{relationship_to_deceased}} של המנוח/ה {{deceased_name}} ז"ל, באמצעות ב"כ עו"ד {{lawyer_name}}, מתנגד/ת בזאת לצוואה מיום {{will_date}} ולבקשה לצו קיום צוואה שהוגשה על ידי {{petitioner_name}}.`,
    variables: ['court_location', 'contestant_name', 'contestant_id', 'contestant_address', 'relationship_to_deceased', 'deceased_name', 'will_date', 'petitioner_name', 'lawyer_name'],
    aiPrompt: 'התאם את פתיחת ההתנגדות לנסיבות המקרה ולקרבת המשפחה של המתנגד',
    usageInstructions: 'השתמש לפתיחת התנגדויות לצוואות',
    documentTypes: ['will-contest']
  },

  {
    id: 'will-contest-grounds',
    title: 'עילות התנגדות לצוואה',
    category: 'legal-claims',
    content: `עילות ההתנגדות:

1. הצוואה נכתבה שלא מדעתו הטובה של המנוח/ה עקב {{mental_capacity_issue}}.

2. המנוח/ה היה/תה תחת השפעה בלתי הוגנת של {{undue_influence_person}} בעת כתיבת הצוואה.

3. הצוואה לא נחתמה כדין בהתאם לדרישות חוק הירושה:
   - {{formal_defect1}}
   - {{formal_defect2}}

4. קיימות ראיות לכך ש{{fraud_allegation}}.

5. הצוואה פוגעת בזכויות הירושה החוקיות של המתנגד/ת בניגוד לחוק.

6. {{additional_contest_ground}}`,
    variables: ['mental_capacity_issue', 'undue_influence_person', 'formal_defect1', 'formal_defect2', 'fraud_allegation', 'additional_contest_ground'],
    aiPrompt: 'חזק את עילות ההתנגדות בהתאם לחוק הירושה, הוסף התייחסות לפסיקה רלוונטית',
    usageInstructions: 'השתמש בהתנגדויות לצוואות עם עילות משפטיות חזקות',
    documentTypes: ['will-contest']
  },

  // בקשות אפוטרופוסות
  {
    id: 'guardianship-opening',
    title: 'פתיחת בקשה לאפוטרופוסות',
    category: 'opening',
    content: `לכבוד בית המשפט לענייני משפחה {{court_location}}

הנדון: בקשה למינוי אפוטרופוס לפי חוק הכשרות המשפטית והאפוטרופוסות, התשכ"ב-1962

אני הח"מ {{petitioner_name}}, ת.ז. {{petitioner_id}}, מכתובת {{petitioner_address}}, {{relationship_to_ward}} של {{ward_name}}, ת.ז. {{ward_id}} (להלן: "הקטין/ה" או "חסר/ת הכשרות"), מבקש/ת בזאת מבית המשפט הנכבד למנות אותי כאפוטרופוס/ת ל{{ward_name}}.`,
    variables: ['court_location', 'petitioner_name', 'petitioner_id', 'petitioner_address', 'relationship_to_ward', 'ward_name', 'ward_id'],
    aiPrompt: 'התאם את הבקשה לסוג האפוטרופוסות (קטין, חסר כשרות, נפקד) ולקרבת המשפחה',
    usageInstructions: 'השתמש בבקשות למינוי אפוטרופוס לקטינים או חסרי כשרות',
    documentTypes: ['guardianship']
  },

  {
    id: 'guardianship-reasons',
    title: 'נימוקים למינוי אפוטרופוס',
    category: 'facts',
    content: `הנימוקים למינוי:

1. {{ward_name}} זקוק/ה לאפוטרופוס מהסיבות הבאות: {{guardianship_reasons}}.

2. המצב הרפואי/נפשי: {{medical_condition}} (מצורף אישור רפואי).

3. הרכוש הטעון ניהול כולל: {{assets_description}}.

4. המבקש/ת מתאים/ה לשמש כאפוטרופוס/ת מהטעמים הבאים:
   - קרבת משפחה: {{family_relationship}}
   - יכולת כלכלית: {{financial_capability}}
   - זמינות: {{availability}}
   - ניסיון: {{relevant_experience}}

5. אין מתנגדים למינוי / קיימים המתנגדים הבאים: {{objections}} (יש למחוק את הלא רלוונטי).`,
    variables: ['ward_name', 'guardianship_reasons', 'medical_condition', 'assets_description', 'family_relationship', 'financial_capability', 'availability', 'relevant_experience', 'objections'],
    aiPrompt: 'חזק את הנימוקים למינוי, הדגש את התאמת המבקש ואת הצורך באפוטרופוסות',
    usageInstructions: 'השתמש להצדקת הצורך באפוטרופוסות ובהתאמת המבקש',
    documentTypes: ['guardianship']
  },

  // הסכמי ממון
  {
    id: 'monetary-agreement-opening',
    title: 'פתיחת הסכם ממון',
    category: 'opening',
    content: `הסכם ממון

בין:     {{spouse1_name}}, ת.ז. {{spouse1_id}}, מכתובת {{spouse1_address}} (להלן: "{{spouse1_title}}")

לבין:    {{spouse2_name}}, ת.ז. {{spouse2_id}}, מכתובת {{spouse2_address}} (להלן: "{{spouse2_title}}")

הואיל והצדדים נשואים זה לזו מיום {{marriage_date}} / מתכוונים להינשא ביום {{planned_marriage_date}} (יש למחוק את הלא רלוונטי);

והואיל והצדדים מעוניינים לקבוע את יחסיהם הכספיים והרכושיים בהסכם ממון על פי סעיף 2 לחוק יחסי ממון בין בני זוג, התשל"ג-1973;

לפיכך הוסכם, הותנה והוצהר בין הצדדים כדלקמן:`,
    variables: ['spouse1_name', 'spouse1_id', 'spouse1_address', 'spouse1_title', 'spouse2_name', 'spouse2_id', 'spouse2_address', 'spouse2_title', 'marriage_date', 'planned_marriage_date'],
    aiPrompt: 'התאם את פתיחת הסכם הממון לסטטוס הנישואין (לפני או אחרי) ולנסיבות הספציפיות',
    usageInstructions: 'השתמש בהסכמי ממון לפני או אחרי נישואין',
    documentTypes: ['monetary-agreement']
  },

  {
    id: 'property-separation',
    title: 'הפרדת רכוש בהסכם ממון',
    category: 'legal-claims',
    content: `הפרדת רכוש:

1. הצדדים מסכימים על הפרדת רכוש מוחלטת בהתאם לסעיף 2(א) לחוק יחסי ממון.

2. רכושו של כל בן/בת זוג, שהיה בבעלותו לפני הנישואין או שירכוש לאחר הנישואין, יישאר בבעלותו הבלעדית.

3. רכוש {{spouse1_title}} כולל: {{spouse1_assets}}

4. רכוש {{spouse2_title}} כולל: {{spouse2_assets}}

5. רכוש משותף (אם יירכש): {{joint_assets_policy}}

6. בגירושין או במוות, כל בן/בת זוג יהיה זכאי/ת לרכושו/ה הנפרד בלבד.

7. {{additional_separation_terms}}`,
    variables: ['spouse1_title', 'spouse1_assets', 'spouse2_title', 'spouse2_assets', 'joint_assets_policy', 'additional_separation_terms'],
    aiPrompt: 'התאם את הפרדת הרכוש לנכסים הספציפיים של כל בן זוג, וודא הגינות',
    usageInstructions: 'השתמש בהסכמי ממון עם הפרדת רכוש מוחלטת',
    documentTypes: ['monetary-agreement']
  },

  {
    id: 'spousal-support-waiver',
    title: 'ויתור על מזונות בין בני זוג',
    category: 'legal-claims',
    content: `ויתור על מזונות:

1. הצדדים מוותרים בזאת ויתור מוחלט ובלתי חוזר על כל זכות למזונות זה מזה.

2. הויתור חל על:
   - מזונות במהלך הנישואין
   - מזונות לאחר גירושין
   - מזונות לאחר מוות

3. הויתור תקף גם במקרים של {{waiver_exceptions}}.

4. כל בן/בת זוג מצהיר/ה כי הוא/היא בעל/ת יכולת כלכלית עצמאית ואינו/ה זקוק/ה למזונות.

5. הכנסותיו/ה של {{spouse1_title}}: {{spouse1_income}}
   הכנסותיו/ה של {{spouse2_title}}: {{spouse2_income}}

6. ויתור זה לא יחול על {{waiver_exclusions}}.`,
    variables: ['waiver_exceptions', 'spouse1_title', 'spouse1_income', 'spouse2_title', 'spouse2_income', 'waiver_exclusions'],
    aiPrompt: 'התאם את הויתור על מזונות למצב הכלכלי של הצדדים, וודא חוקיות',
    usageInstructions: 'השתמש בהסכמי ממון כאשר הצדדים רוצים לוותר על מזונות',
    documentTypes: ['monetary-agreement']
  },

  // בקשות אפוטרופוסות מתקדמות
  {
    id: 'guardianship-property-management',
    title: 'ניהול רכוש באפוטרופוסות',
    category: 'facts',
    content: `ניהול הרכוש:

1. רכושו/ה של {{ward_name}} כולל:
   - נכסי מקרקעין: {{real_estate_assets}}
   - נכסים פיננסיים: {{financial_assets}}
   - נכסים אחרים: {{other_assets}}
   - הכנסות חודשיות: {{monthly_income}}

2. הרכוש טעון ניהול פעיל בשל: {{management_needs}}.

3. החלטות שיש לקבל בקרוב: {{urgent_decisions}}.

4. האפוטרופוס המבוקש מתחייב:
   - לנהל את הרכוש בזהירות ובתום לב
   - לקבל אישור בית משפט למכירת נכסים
   - להגיש דוחות שנתיים
   - לשמור על רישומים מדויקים

5. {{additional_management_terms}}`,
    variables: ['ward_name', 'real_estate_assets', 'financial_assets', 'other_assets', 'monthly_income', 'management_needs', 'urgent_decisions', 'additional_management_terms'],
    aiPrompt: 'פרט את נכסי הקטין/חסר הכשרות ואת הצורך בניהול, הדגש אחריות האפוטרופוס',
    usageInstructions: 'השתמש בבקשות אפוטרופוסות הכוללות ניהול רכוש משמעותי',
    documentTypes: ['guardianship']
  },

  // הסכמי חיים משותפים
  {
    id: 'cohabitation-opening',
    title: 'פתיחת הסכם חיים משותפים',
    category: 'opening',
    content: `הסכם חיים משותפים

בין:     {{partner1_name}}, ת.ז. {{partner1_id}}, מכתובת {{partner1_address}} (להלן: "{{partner1_title}}")

לבין:    {{partner2_name}}, ת.ז. {{partner2_id}}, מכתובת {{partner2_address}} (להלן: "{{partner2_title}}")

הואיל והצדדים חיים יחד בחיים משותפים מיום {{cohabitation_start_date}};

והואיל והצדדים מעוניינים לקבוע את זכויותיהם וחובותיהם בתקופת החיים המשותפים ובמקרה של פרידה;

והואיל והצדדים מעוניינים להסדיר את יחסיהם הכספיים והרכושיים;

לפיכך הוסכם, הותנה והוצהר בין הצדדים כדלקמן:`,
    variables: ['partner1_name', 'partner1_id', 'partner1_address', 'partner1_title', 'partner2_name', 'partner2_id', 'partner2_address', 'partner2_title', 'cohabitation_start_date'],
    aiPrompt: 'התאם את פתיחת ההסכם לאורך תקופת החיים המשותפים ולנסיבות הזוג',
    usageInstructions: 'השתמש בהסכמי חיים משותפים לזוגות שאינם נשואים',
    documentTypes: ['monetary-agreement']
  },

  {
    id: 'cohabitation-property-rights',
    title: 'זכויות רכוש בחיים משותפים',
    category: 'legal-claims',
    content: `זכויות רכוש:

1. כל צד שומר על הבעלות הבלעדית ברכושו שהיה בבעלותו לפני תחילת החיים המשותפים.

2. רכוש שנרכש במהלך החיים המשותפים:
   - רכוש שנרכש בכספי {{partner1_title}} בלבד - יהיה בבעלותו/ה הבלעדית
   - רכוש שנרכש בכספי {{partner2_title}} בלבד - יהיה בבעלותו/ה הבלעדית  
   - רכוש שנרכש בכספים משותפים - {{joint_property_policy}}

3. דירת המגורים ב{{residence_address}}:
   {{residence_ownership_terms}}

4. במקרה של פרידה:
   {{separation_property_division}}

5. {{additional_property_terms}}`,
    variables: ['partner1_title', 'partner2_title', 'joint_property_policy', 'residence_address', 'residence_ownership_terms', 'separation_property_division', 'additional_property_terms'],
    aiPrompt: 'התאם את זכויות הרכוש למצב הכלכלי של הצדדים ולרכוש הקיים',
    usageInstructions: 'השתמש להסדרת זכויות רכוש בחיים משותפים',
    documentTypes: ['monetary-agreement']
  },

  {
    id: 'child-support-cohabitation',
    title: 'מזונות ילדים בחיים משותפים',
    category: 'legal-claims',
    content: `מזונות ילדים:

1. לצדדים יש ילדים משותפים: {{shared_children_details}}.

2. {{partner1_title}} מביא/ה לקשר ילדים מקשר קודם: {{partner1_children}}.

3. {{partner2_title}} מביא/ה לקשר ילדים מקשר קודם: {{partner2_children}}.

4. במהלך החיים המשותפים:
   - הוצאות הילדים המשותפים יחולקו {{shared_expenses_division}}
   - הוצאות ילדי {{partner1_title}} יחולו על {{partner1_children_expenses}}
   - הוצאות ילדי {{partner2_title}} יחולו על {{partner2_children_expenses}}

5. במקרה של פרידה:
   {{separation_child_support_terms}}

6. {{additional_children_terms}}`,
    variables: ['shared_children_details', 'partner1_title', 'partner1_children', 'partner2_title', 'partner2_children', 'shared_expenses_division', 'partner1_children_expenses', 'partner2_children_expenses', 'separation_child_support_terms', 'additional_children_terms'],
    aiPrompt: 'התאם את הסדרי הילדים למבנה המשפחה המורכב, וודא הגינות לכל הילדים',
    usageInstructions: 'השתמש בהסכמי חיים משותפים עם ילדים ממערכות יחסים קודמות',
    documentTypes: ['monetary-agreement']
  }
];

/**
 * פונקציה לקבלת סעיפים לפי סוג מסמך
 */
export function getCourtSectionsForDocument(documentType: string): CourtSectionTemplate[] {
  return courtSectionsWarehouse.filter(section => 
    section.documentTypes.includes(documentType as any)
  );
}

/**
 * פונקציה לקבלת סעיפים לפי קטגוריה
 */
export function getCourtSectionsByCategory(category: string): CourtSectionTemplate[] {
  return courtSectionsWarehouse.filter(section => section.category === category);
}
