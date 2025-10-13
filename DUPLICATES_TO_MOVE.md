# 📋 רשימת כפילויות להעברה לגיבוי

## ✅ כבר הועבר לגיבוי:
1. ✅ `components/lib/` → `backup_before_cleanup_20251013_143500/components/lib/`
2. ✅ `components/AdvanceDirectivesDocumentClean.tsx` → גיבוי
3. ✅ `app/documents/will-old/` → גיבוי
4. ✅ `app/documents/advance-directives-test/` → גיבוי

---

## 🔄 נותר להעביר:

### 1. Templates (7 files)
**מקור:** `public/templates/`  
**יעד:** `backup_before_cleanup_20251013_143500/public/templates/`

```
public/templates/clauses/closings-warehouse.json
public/templates/clauses/witnesses-warehouse.json
public/templates/clauses/openings-warehouse.json
public/templates/clauses/sections-warehouse.json
public/templates/will-mutual.json
public/templates/will-individual-female.json
public/templates/will-individual-male.json
```

**הסבר:** כפילות של `lib/templates/` - לשמור ב-lib, למחוק מ-public

---

### 2. AI Improvers (3 files) 
**מקור:** `components/`  
**יעד:** `backup_before_cleanup_20251013_143500/components/`

```
components/AIImprover.tsx
components/AdvancedAIImprover.tsx
components/RealtimeAIImprover.tsx
```

**לשמור:** `SimpleAIImprover.tsx` + `EnhancedAIImprover.tsx`

---

### 3. TemplateBuilder & TemplateEditor (4 files)
**מקור:** `components/`  
**יעד:** `backup_before_cleanup_20251013_143500/components/`

```
components/TemplateBuilder.tsx
components/AdvancedTemplateBuilder.tsx (קובץ בודד)
components/TemplateEditor.tsx  
components/DocumentPreview.tsx
```

**לשמור:** `components/AdvancedTemplateBuilder/` (תיקייה)

---

### 4. AdvancedEditor Directory (entire folder)
**מקור:** `components/AdvancedEditor/`  
**יעד:** `backup_before_cleanup_20251013_143500/components/AdvancedEditor/`

```
components/AdvancedEditor/TemplateEditor.tsx
components/AdvancedEditor/EditorBlock.tsx
components/AdvancedEditor/EditorToolbar.tsx
```

**הסבר:** נראה מיותר, כולל מעט שימושים

---

### 5. Document Pages (3 folders)
**מקור:** `app/`  
**יעד:** `backup_before_cleanup_20251013_143500/app/`

```
app/documents/advance-directives-simple/
app/test-advance-directives/
app/test-advance-directives-2/
app/test-advance-directives-3/
app/test-advance-directives-4/
```

**הסבר:** דפי טסט וגרסאות ישנות

---

### 6. Component Duplicates (9 files)
**מקור:** `components/`  
**יעד:** `backup_before_cleanup_20251013_143500/components/`

```
components/CategoryCard.tsx
components/FieldsForm.tsx
components/TemplateCard.tsx
components/SavedDocumentCard.tsx
components/SendEmailDialog.tsx
components/ProtectedRoute.tsx
components/Navbar.tsx
components/Footer.tsx
components/AIWritingAssistant.tsx
components/SimpleAdvanceDirectives.tsx
```

**לשמור:** גרסאות ב-`components/AdvancedTemplateBuilder/`

---

## 📊 סיכום:
- **סה"כ קבצים להעברה:** ~35 קבצים + 5 תיקיות
- **חיסכון משוער:** 40MB+ קוד מיותר
- **קבצים שכבר בגיבוי:** ~25 קבצים

---

## 🛠️ איך להעביר:

### אופציה 1: ידנית (מומלץ)
1. פתחי File Explorer
2. עברי לתיקיית הפרויקט
3. העבירי כל קובץ/תיקייה לגיבוי

### אופציה 2: PowerShell (אם רוצה)
```powershell
# הרץ זאת מתיקיית הפרויקט
$files = @(
    "public\templates",
    "components\AIImprover.tsx",
    "components\AdvancedAIImprover.tsx",
    "components\RealtimeAIImprover.tsx",
    "components\TemplateBuilder.tsx",
    "components\AdvancedTemplateBuilder.tsx",
    "components\TemplateEditor.tsx",
    "components\DocumentPreview.tsx",
    "components\AdvancedEditor",
    "app\documents\advance-directives-simple",
    "app\test-advance-directives",
    "app\test-advance-directives-2",
    "app\test-advance-directives-3",
    "app\test-advance-directives-4",
    "components\CategoryCard.tsx",
    "components\FieldsForm.tsx",
    "components\TemplateCard.tsx",
    "components\SavedDocumentCard.tsx",
    "components\SendEmailDialog.tsx",
    "components\ProtectedRoute.tsx",
    "components\Navbar.tsx",
    "components\Footer.tsx",
    "components\AIWritingAssistant.tsx",
    "components\SimpleAdvanceDirectives.tsx"
)

$backup = "backup_before_cleanup_20251013_143500"

foreach ($file in $files) {
    if (Test-Path $file) {
        $dest = Join-Path $backup $file
        $destDir = Split-Path $dest -Parent
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        if (Test-Path $file -PathType Container) {
            Copy-Item -Path $file -Destination $dest -Recurse -Force
            Remove-Item -Path $file -Recurse -Force
        } else {
            Copy-Item -Path $file -Destination $dest -Force
            Remove-Item -Path $file -Force
        }
        Write-Host "✓ Moved: $file"
    }
}
```

### אופציה 3: Git (הכי בטוח)
```bash
# אפשר גם להריץ זאת
git add backup_before_cleanup_20251013_143500/
git commit -m "backup: moved duplicate files before cleanup"
```

---

**האם תרצי שאנסה להעביר באופן אוטומטי או שתעשי זאת ידנית?**

