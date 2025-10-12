/**
 * מחסן סעיפים להסכמי מקרקעין - מכר ושכירות
 */

export interface PropertySectionTemplate {
  id: string;
  title: string;
  category: 'opening' | 'property-description' | 'payment' | 'possession' | 'warranties' | 'obligations' | 'termination' | 'special-terms' | 'closing';
  content: string;
  variables: string[];
  aiPrompt: string;
  usageInstructions: string;
  agreementTypes: ('sale' | 'rental' | 'lease')[];
}

export const propertySectionsWarehouse: PropertySectionTemplate[] = [
  // תיאור נכסים מפורט
  {
    id: 'detailed-property-description',
    title: 'תיאור מפורט של הנכס',
    category: 'property-description',
    content: `תיאור הנכס:

הנכס הינו {{property_type}} הממוקם ב{{full_address}}, קומה {{floor}}, {{rooms_count}} חדרים, בשטח של {{area}} מ"ר.

הנכס כולל את הפרטים הבאים:
- חדרי שינה: {{bedrooms}}
- חדרי רחצה: {{bathrooms}}
- מרפסות: {{balconies}}
- חניות: {{parking}}
- מחסן: {{storage}}

המצב הפיזי של הנכס: {{property_condition}}.

ציוד וריהוט הכלול במכירה: {{included_items}}.

{{additional_property_details}}`,
    variables: ['property_type', 'full_address', 'floor', 'rooms_count', 'area', 'bedrooms', 'bathrooms', 'balconies', 'parking', 'storage', 'property_condition', 'included_items', 'additional_property_details'],
    aiPrompt: 'תאר את הנכס בצורה מדויקת ומקצועית, כלול כל פרט רלוונטי',
    usageInstructions: 'השתמש לתיאור מפורט של נכס במכר או בשכירות',
    agreementTypes: ['sale', 'rental', 'lease']
  },

  // תנאי תשלום
  {
    id: 'installment-payment-plan',
    title: 'תכנית תשלומים מדורגת',
    category: 'payment',
    content: `תכנית תשלומים:

התמורה הכוללת עבור הנכס הינה {{total_price}} ש"ח, אשר תשולם כדלקמן:

1. מקדמה בסך {{down_payment}} ש"ח ששולמה ביום {{down_payment_date}}.

2. תשלום ראשון בסך {{payment1}} ש"ח ביום {{payment1_date}}.

3. תשלום שני בסך {{payment2}} ש"ח ביום {{payment2_date}}.

4. יתרה בסך {{final_payment}} ש"ח תשולם ביום {{final_payment_date}}.

כל תשלום יבוצע באמצעות {{payment_method}}.

באיחור בתשלום: {{late_payment_terms}}.`,
    variables: ['total_price', 'down_payment', 'down_payment_date', 'payment1', 'payment1_date', 'payment2', 'payment2_date', 'final_payment', 'final_payment_date', 'payment_method', 'late_payment_terms'],
    aiPrompt: 'פרט את תכנית התשלומים בבהירות, כלול תנאים לאיחור',
    usageInstructions: 'השתמש כאשר יש תשלומים מדורגים במקום תשלום אחד',
    agreementTypes: ['sale', 'rental']
  },

  {
    id: 'linked-to-dollar',
    title: 'הצמדת תשלום למדד או למטבע',
    category: 'payment',
    content: `הצמדה:

התמורה הינה בסך {{base_amount}} {{base_currency}}.

הסכום יהיה צמוד ל{{linkage_type}} (מדד המחירים לצרכן / דולר ארה"ב / יורו).

{{linkage_type}} הבסיס הוא {{base_index}}, שפורסם ביום {{base_date}}.

בכל מועד תשלום, יחושב ההפרש בין {{linkage_type}} הבסיס ל{{linkage_type}} הידוע ביום התשלום בפועל.

{{additional_linkage_terms}}`,
    variables: ['base_amount', 'base_currency', 'linkage_type', 'base_index', 'base_date', 'additional_linkage_terms'],
    aiPrompt: 'הסבר את מנגנון ההצמדה בצורה ברורה, כלול דוגמה אם אפשר',
    usageInstructions: 'השתמש כאשר רוצים להצמיד תשלומים למדד או למטבע',
    agreementTypes: ['sale', 'rental', 'lease']
  },

  // אחזקה ותחזוקה בשכירות
  {
    id: 'maintenance-responsibilities-rental',
    title: 'חלוקת אחריות לתחזוקה בשכירות',
    category: 'obligations',
    content: `חובות תחזוקה:

השוכר אחראי ל:
- {{tenant_responsibilities}}
- תיקונים שוטפים בסכום של עד {{minor_repairs_limit}} ש"ח
- ניקיון שוטף

המשכיר אחראי ל:
- {{landlord_responsibilities}}  
- תיקונים מבניים
- {{major_repairs}}

בכל מקרה של תקלה, השוכר ידווח למשכיר תוך {{reporting_time}}.

המשכיר יתקן תקלות תוך {{repair_time}} מקבלת הדיווח.

{{additional_maintenance_terms}}`,
    variables: ['tenant_responsibilities', 'minor_repairs_limit', 'landlord_responsibilities', 'major_repairs', 'reporting_time', 'repair_time', 'additional_maintenance_terms'],
    aiPrompt: 'חלק באופן הוגן את חובות התחזוקה, הסבר מה נחשב תיקון שוטף ומה מבני',
    usageInstructions: 'השתמש להגדרת אחריות תחזוקה בשכירות',
    agreementTypes: ['rental', 'lease']
  },

  {
    id: 'property-condition-documentation',
    title: 'תיעוד מצב הנכס',
    category: 'possession',
    content: `תיעוד מצב:

הצדדים ערכו ביום {{inspection_date}} סיור משותף בנכס ותיעדו את מצבו.

תיעוד המצב כולל: {{documentation_type}} (תמונות / וידאו / דו"ח כתוב).

ליקויים שנמצאו: {{existing_defects}}.

הצדדים מסכימים כי {{defects_agreement}}.

העתק מהתיעוד מצורף להסכם זה ומהווה חלק בלתי נפרד ממנו.

במועד סיום ההסכם, יערך סיור נוסף ומצב הנכס יושווה למצב המתועד.`,
    variables: ['inspection_date', 'documentation_type', 'existing_defects', 'defects_agreement'],
    aiPrompt: 'הדגש חשיבות תיעוד מצב הנכס למניעת מחלוקות עתידיות',
    usageInstructions: 'השתמש לתיעוד מצב נכס בתחילת שכירות',
    agreementTypes: ['rental', 'lease']
  },

  // ביטול והארכה
  {
    id: 'early-termination-terms',
    title: 'תנאים לסיום מוקדם של השכירות',
    category: 'termination',
    content: `סיום מוקדם:

השוכר רשאי לסיים את ההסכם לפני תום התקופה בתנאים הבאים:

1. הודעה מוקדמת של {{notice_period}} חודשים.

2. תשלום פיצוי למשכיר בסך {{early_termination_fee}}.

3. {{additional_termination_conditions}}.

המשכיר רשאי לסיים את ההסכם מוקדם במקרים הבאים:
- {{landlord_termination_grounds}}

בכל מקרה של סיום מוקדם, {{final_settlement_terms}}.`,
    variables: ['notice_period', 'early_termination_fee', 'additional_termination_conditions', 'landlord_termination_grounds', 'final_settlement_terms'],
    aiPrompt: 'פרט את תנאי הסיום המוקדם בצורה מאוזנת ל שני הצדדים',
    usageInstructions: 'השתמש להגדרת אפשרות לסיום מוקדם של שכירות',
    agreementTypes: ['rental', 'lease']
  },

  {
    id: 'automatic-renewal',
    title: 'הארכה אוטומטית של ההסכם',
    category: 'termination',
    content: `הארכה אוטומטית:

בתום תקופת ההסכם, ההסכם יוארך אוטומטית ל{{renewal_period}} נוספת/ים.

בכל הארכה, דמי השכירות יעודכנו ב{{rent_increase}}.

כל צד רשאי למנוע את ההארכה האוטומטית על ידי מתן הודעה בכתב {{notice_period}} חודשים לפני תום התקופה.

ההארכה האוטומטית תתאפשר עד {{max_renewals}} פעמים.

לאחר {{max_renewals}} הארכות, {{after_max_renewals}}.`,
    variables: ['renewal_period', 'rent_increase', 'notice_period', 'max_renewals', 'after_max_renewals'],
    aiPrompt: 'הסבר את מנגנון ההארכה האוטומטית בבהירות, כלול תנאי עדכון שכר',
    usageInstructions: 'השתמש כאשר רוצים הארכה אוטומטית של שכירות',
    agreementTypes: ['rental', 'lease']
  },

  // ערבויות
  {
    id: 'guarantor-clause',
    title: 'ערבות אישית',
    category: 'warranties',
    content: `ערבות אישית:

{{guarantor_name}}, ת.ז. {{guarantor_id}}, מכתובת {{guarantor_address}}, מתחייב בזאת כערב ל{{tenant_name}} לקיום כל התחייבויות השוכר על פי הסכם זה.

הערבות הינה {{guarantee_type}} (ערבות רגילה / ערבות מוגבלת).

היקף הערבות: {{guarantee_scope}}.

הערבות תהיה בתוקף עד {{guarantee_end_date}}.

הערב מוותר על טענת "דיון" ועל כל טענת הגנה אחרת המוקנית לערב על פי דין.

{{additional_guarantee_terms}}`,
    variables: ['guarantor_name', 'guarantor_id', 'guarantor_address', 'tenant_name', 'guarantee_type', 'guarantee_scope', 'guarantee_end_date', 'additional_guarantee_terms'],
    aiPrompt: 'הסבר את היקף הערבות בבהירות, כלול ויתורים מקובלים',
    usageInstructions: 'השתמש כאשר נדרשת ערבות אישית לשכירות',
    agreementTypes: ['rental', 'lease']
  },

  {
    id: 'bank-guarantee',
    title: 'ערבות בנקאית',
    category: 'warranties',
    content: `ערבות בנקאית:

השוכר יפקיד בידי המשכיר ערבות בנקאית אוטונומית מבנק {{bank_name}} בסך {{guarantee_amount}} ש"ח.

הערבות תהיה בתוקף עד {{guarantee_end_date}}.

המשכיר רשאי לממש את הערבות ב{{redemption_conditions}}.

השוכר מתחייב לחדש את הערבות הבנקאית {{renewal_terms}}.

בתום תקופת השכירות ולאחר {{return_conditions}}, תוחזר הערבות לשוכר.`,
    variables: ['bank_name', 'guarantee_amount', 'guarantee_end_date', 'redemption_conditions', 'renewal_terms', 'return_conditions'],
    aiPrompt: 'פרט את תנאי הערבות הבנקאית, הסבר מתי ניתן למימוש',
    usageInstructions: 'השתמש כאשר נדרשת ערבות בנקאית',
    agreementTypes: ['rental', 'lease', 'sale']
  },

  // שימושים מיוחדים
  {
    id: 'commercial-use-terms',
    title: 'שימוש מסחרי בנכס',
    category: 'special-terms',
    content: `שימוש מסחרי:

הנכס מיועד לשימוש עסקי/מסחרי בלבד לצורך {{business_purpose}}.

השוכר רשאי לנהל בנכס את העסק {{business_description}}.

השוכר אינו רשאי לשנות את ייעוד הנכס ללא אישור המשכיר בכתב מראש.

שעות פעילות: {{operating_hours}}.

השוכר מתחייב שלא לגרום למטרדים ל{{neighbors_protection}}.

השוכר אחראי לקבלת כל האישורים והרישיונות הנדרשים לניהול העסק, לרבות {{required_licenses}}.

{{additional_commercial_terms}}`,
    variables: ['business_purpose', 'business_description', 'operating_hours', 'neighbors_protection', 'required_licenses', 'additional_commercial_terms'],
    aiPrompt: 'התאם לסוג העסק, כלול הגבלות והתחייבויות רלוונטיות',
    usageInstructions: 'השתמש בשכירות למטרות עסקיות',
    agreementTypes: ['rental', 'lease']
  },

  {
    id: 'sublease-permission',
    title: 'אישור להשכרת משנה',
    category: 'special-terms',
    content: `השכרת משנה:

השוכר רשאי להשכיר את הנכס או חלק ממנו לצד שלישי {{sublease_conditions}}.

לפני השכרת משנה, השוכר ימסור למשכיר {{sublease_notice}}.

המשכיר רשאי {{landlord_veto}}.

בכל מקרה של השכרת משנה:
- {{sublease_terms1}}
- {{sublease_terms2}}
- {{sublease_terms3}}

השוכר נשאר אחראי למילוי מלוא התחייבויותיו כלפי המשכיר גם בתקופת השכרת המשנה.`,
    variables: ['sublease_conditions', 'sublease_notice', 'landlord_veto', 'sublease_terms1', 'sublease_terms2', 'sublease_terms3'],
    aiPrompt: 'הסבר את תנאי השכרת המשנה בבהירות, שמור על הגנת המשכיר',
    usageInstructions: 'השתמש כאשר מאשרים השכרת משנה',
    agreementTypes: ['rental', 'lease']
  },

  // הצהרות והתחייבויות במכר
  {
    id: 'seller-warranties-sale',
    title: 'הצהרות המוכר על מצב הנכס',
    category: 'warranties',
    content: `הצהרות המוכר:

המוכר מצהיר ומתחייב כדלקמן:

1. המוכר הוא הבעלים הרשום והבלעדי של הנכס בלשכת רישום המקרקעין.

2. הנכס חופשי מכל שעבוד, עיקול, משכנתא או זכות צד שלישי, למעט {{existing_encumbrances}}.

3. אין כל חוב ארנונה, ועד בית או מים/חשמל על הנכס, למעט {{existing_debts}}.

4. {{building_permit_status}}.

5. לא קיימות כנגד המוכר תביעות משפטיות הקשורות לנכס.

6. {{additional_warranties}}.

המוכר מתחייב לספק לקונה {{documents_to_provide}}.`,
    variables: ['existing_encumbrances', 'existing_debts', 'building_permit_status', 'additional_warranties', 'documents_to_provide'],
    aiPrompt: 'רשום הצהרות מפורטות וברורות, הגן על זכויות הקונה',
    usageInstructions: 'השתמש במכר נכסים להצהרות המוכר',
    agreementTypes: ['sale']
  },

  {
    id: 'possession-transfer-terms',
    title: 'תנאי מסירת החזקה',
    category: 'possession',
    content: `מסירת חזקה:

הנכס יימסר לקונה ביום {{possession_date}}.

במועד המסירה, הנכס יהיה {{possession_condition}}.

המוכר מתחייב לפנות את הנכס לחלוטין, כולל {{items_to_remove}}.

ציוד הנכלל במכירה שיימסר לקונה: {{included_equipment}}.

במעמד המסירה ייערך פרוטוקול חתום על ידי שני הצדדים.

במידה והמוכר לא יפנה את הנכס במועד, {{late_penalty}}.`,
    variables: ['possession_date', 'possession_condition', 'items_to_remove', 'included_equipment', 'late_penalty'],
    aiPrompt: 'פרט את תנאי המסירה בבהירות, כלול סנקציות לאיחור',
    usageInstructions: 'השתמש להגדרת תנאי מסירת חזקה במכר',
    agreementTypes: ['sale']
  },

  // תנאים מיוחדים
  {
    id: 'pets-policy',
    title: 'מדיניות החזקת חיות מחמד',
    category: 'special-terms',
    content: `החזקת חיות מחמד:

{{pets_allowed}} (מותר / אסור) להחזיק חיות מחמד בנכס.

במידה ומותר, התנאים הם:
- סוגי חיות מותרות: {{allowed_pets}}
- מספר מקסימלי: {{max_pets}}
- {{pet_conditions}}

השוכר אחראי לכל נזק שייגרם על ידי חיית המחמד.

השוכר מתחייב {{pet_responsibilities}}.

במקרה של הפרת תנאי זה, {{pet_violation_consequence}}.`,
    variables: ['pets_allowed', 'allowed_pets', 'max_pets', 'pet_conditions', 'pet_responsibilities', 'pet_violation_consequence'],
    aiPrompt: 'הסבר את מדיניות החיות בבהירות, כלול סנקציות',
    usageInstructions: 'השתמש להגדרת מדיניות חיות מחמד',
    agreementTypes: ['rental', 'lease']
  },

  {
    id: 'parking-allocation',
    title: 'הקצאת חניה',
    category: 'special-terms',
    content: `חניה:

כחלק מההסכם, {{parking_included}}.

מקומות החניה הם:
- חניה מס' {{parking_number1}} {{parking_type1}} (מקורה / פתוחה)
- חניה מס' {{parking_number2}} {{parking_type2}}

החניה מיועדת ל{{parking_restrictions}}.

אין להשכיר את מקום החניה לצד שלישי {{parking_sublease}}.

{{additional_parking_terms}}`,
    variables: ['parking_included', 'parking_number1', 'parking_type1', 'parking_number2', 'parking_type2', 'parking_restrictions', 'parking_sublease', 'additional_parking_terms'],
    aiPrompt: 'פרט את הסדרי החניה, כלול מספרים ומיקומים מדויקים',
    usageInstructions: 'השתמש להגדרת הקצאת חניה',
    agreementTypes: ['rental', 'lease', 'sale']
  }
];

/**
 * פונקציה לקבלת סעיפים לפי סוג הסכם
 */
export function getPropertySectionsForType(agreementType: string): PropertySectionTemplate[] {
  return propertySectionsWarehouse.filter(section => 
    section.agreementTypes.includes(agreementType as any)
  );
}

/**
 * פונקציה לקבלת סעיפים לפי קטגוריה
 */
export function getPropertySectionsByCategory(category: string): PropertySectionTemplate[] {
  return propertySectionsWarehouse.filter(section => section.category === category);
}

