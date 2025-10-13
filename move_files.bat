@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo === Moving duplicate files to backup ===
echo.

REM 1. public/templates
if exist "public\templates" (
    echo Moving: public\templates
    robocopy "public\templates" "backup_before_cleanup_20251013_143500\public\templates" /E /MOVE /NFL /NDL /NJH /NJS
)

REM 2. AI Improvers
if exist "components\AIImprover.tsx" (
    echo Moving: components\AIImprover.tsx
    mkdir "backup_before_cleanup_20251013_143500\components" 2>nul
    move /Y "components\AIImprover.tsx" "backup_before_cleanup_20251013_143500\components\"
)
if exist "components\AdvancedAIImprover.tsx" (
    echo Moving: components\AdvancedAIImprover.tsx
    move /Y "components\AdvancedAIImprover.tsx" "backup_before_cleanup_20251013_143500\components\"
)
if exist "components\RealtimeAIImprover.tsx" (
    echo Moving: components\RealtimeAIImprover.tsx
    move /Y "components\RealtimeAIImprover.tsx" "backup_before_cleanup_20251013_143500\components\"
)

REM 3. Advance Directives Clean (was moved already)

REM 4. TemplateBuilder duplicates
if exist "components\TemplateBuilder.tsx" (
    echo Moving: components\TemplateBuilder.tsx
    move /Y "components\TemplateBuilder.tsx" "backup_before_cleanup_20251013_143500\components\"
)
if exist "components\AdvancedTemplateBuilder.tsx" (
    echo Moving: components\AdvancedTemplateBuilder.tsx
    move /Y "components\AdvancedTemplateBuilder.tsx" "backup_before_cleanup_20251013_143500\components\"
)

REM 5. TemplateEditor duplicates
if exist "components\TemplateEditor.tsx" (
    echo Moving: components\TemplateEditor.tsx
    move /Y "components\TemplateEditor.tsx" "backup_before_cleanup_20251013_143500\components\"
)
if exist "components\AdvancedEditor\TemplateEditor.tsx" (
    echo Moving: components\AdvancedEditor\TemplateEditor.tsx
    mkdir "backup_before_cleanup_20251013_143500\components\AdvancedEditor" 2>nul
    move /Y "components\AdvancedEditor\TemplateEditor.tsx" "backup_before_cleanup_20251013_143500\components\AdvancedEditor\"
)

REM 6. DocumentPreview duplicates
if exist "components\DocumentPreview.tsx" (
    echo Moving: components\DocumentPreview.tsx
    move /Y "components\DocumentPreview.tsx" "backup_before_cleanup_20251013_143500\components\"
)

REM 7. Document pages duplicates (were moved already)

REM 8. Other duplicate components
if exist "components\CategoryCard.tsx" (
    echo Moving: components\CategoryCard.tsx
    move /Y "components\CategoryCard.tsx" "backup_before_cleanup_20251013_143500\components\"
)
if exist "components\FieldsForm.tsx" (
    echo Moving: components\FieldsForm.tsx
    move /Y "components\FieldsForm.tsx" "backup_before_cleanup_20251013_143500\components\"
)
if exist "components\TemplateCard.tsx" (
    echo Moving: components\TemplateCard.tsx
    move /Y "components\TemplateCard.tsx" "backup_before_cleanup_20251013_143500\components\"
)
if exist "components\SavedDocumentCard.tsx" (
    echo Moving: components\SavedDocumentCard.tsx
    move /Y "components\SavedDocumentCard.tsx" "backup_before_cleanup_20251013_143500\components\"
)
if exist "components\SendEmailDialog.tsx" (
    echo Moving: components\SendEmailDialog.tsx
    move /Y "components\SendEmailDialog.tsx" "backup_before_cleanup_20251013_143500\components\"
)
if exist "components\ProtectedRoute.tsx" (
    echo Moving: components\ProtectedRoute.tsx
    move /Y "components\ProtectedRoute.tsx" "backup_before_cleanup_20251013_143500\components\"
)
if exist "components\Navbar.tsx" (
    echo Moving: components\Navbar.tsx
    move /Y "components\Navbar.tsx" "backup_before_cleanup_20251013_143500\components\"
)
if exist "components\Footer.tsx" (
    echo Moving: components\Footer.tsx
    move /Y "components\Footer.tsx" "backup_before_cleanup_20251013_143500\components\"
)
if exist "components\AIWritingAssistant.tsx" (
    echo Moving: components\AIWritingAssistant.tsx
    move /Y "components\AIWritingAssistant.tsx" "backup_before_cleanup_20251013_143500\components\"
)

REM 9. SimpleAdvanceDirectives
if exist "components\SimpleAdvanceDirectives.tsx" (
    echo Moving: components\SimpleAdvanceDirectives.tsx
    move /Y "components\SimpleAdvanceDirectives.tsx" "backup_before_cleanup_20251013_143500\components\"
)

REM 10. AdvancedEditor directory
if exist "components\AdvancedEditor" (
    echo Moving: components\AdvancedEditor directory
    robocopy "components\AdvancedEditor" "backup_before_cleanup_20251013_143500\components\AdvancedEditor" /E /MOVE /NFL /NDL /NJH /NJS
)

REM 11. Test pages
if exist "app\test-advance-directives" (
    echo Moving: app\test-advance-directives
    mkdir "backup_before_cleanup_20251013_143500\app" 2>nul
    robocopy "app\test-advance-directives" "backup_before_cleanup_20251013_143500\app\test-advance-directives" /E /MOVE /NFL /NDL /NJH /NJS
)
if exist "app\test-advance-directives-2" (
    echo Moving: app\test-advance-directives-2
    robocopy "app\test-advance-directives-2" "backup_before_cleanup_20251013_143500\app\test-advance-directives-2" /E /MOVE /NFL /NDL /NJH /NJS
)
if exist "app\test-advance-directives-3" (
    echo Moving: app\test-advance-directives-3
    robocopy "app\test-advance-directives-3" "backup_before_cleanup_20251013_143500\app\test-advance-directives-3" /E /MOVE /NFL /NDL /NJH /NJS
)
if exist "app\test-advance-directives-4" (
    echo Moving: app\test-advance-directives-4
    robocopy "app\test-advance-directives-4" "backup_before_cleanup_20251013_143500\app\test-advance-directives-4" /E /MOVE /NFL /NDL /NJH /NJS
)
if exist "app\documents\advance-directives-simple" (
    echo Moving: app\documents\advance-directives-simple
    robocopy "app\documents\advance-directives-simple" "backup_before_cleanup_20251013_143500\app\documents\advance-directives-simple" /E /MOVE /NFL /NDL /NJH /NJS
)

echo.
echo === Done! ===
echo Check backup_before_cleanup_20251013_143500\ for moved files.
pause

