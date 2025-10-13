# Script to move duplicate files to backup
# Run from project root

$ErrorActionPreference = "Continue"
$backup = "backup_before_cleanup_20251013_143500"

Write-Host "=== Moving duplicate files to backup ===" -ForegroundColor Cyan
Write-Host ""

$moved = 0
$skipped = 0

function Move-Item-Safe {
    param($source, $relativeDest)
    
    if (Test-Path $source) {
        $dest = Join-Path $backup $relativeDest
        $destDir = Split-Path $dest -Parent
        
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        
        if (Test-Path $source -PathType Container) {
            Copy-Item -Path $source -Destination $dest -Recurse -Force -ErrorAction SilentlyContinue
            if ($?) {
                Remove-Item -Path $source -Recurse -Force -ErrorAction SilentlyContinue
                Write-Host "[OK] Moved folder: $source" -ForegroundColor Green
                return $true
            }
        } else {
            Copy-Item -Path $source -Destination $dest -Force -ErrorAction SilentlyContinue
            if ($?) {
                Remove-Item -Path $source -Force -ErrorAction SilentlyContinue
                Write-Host "[OK] Moved file: $source" -ForegroundColor Green
                return $true
            }
        }
    } else {
        Write-Host "[SKIP] Not found: $source" -ForegroundColor Yellow
        return $false
    }
    return $false
}

# 1. public/templates
Write-Host "`n1. Moving public/templates..." -ForegroundColor White
if (Move-Item-Safe "public\templates" "public\templates") { $moved++ } else { $skipped++ }

# 2. AI Improvers
Write-Host "`n2. Moving AI Improvers..." -ForegroundColor White
if (Move-Item-Safe "components\AIImprover.tsx" "components\AIImprover.tsx") { $moved++ } else { $skipped++ }
if (Move-Item-Safe "components\AdvancedAIImprover.tsx" "components\AdvancedAIImprover.tsx") { $moved++ } else { $skipped++ }
if (Move-Item-Safe "components\RealtimeAIImprover.tsx" "components\RealtimeAIImprover.tsx") { $moved++ } else { $skipped++ }

# 3. TemplateBuilder & Editor
Write-Host "`n3. Moving TemplateBuilder & Editor..." -ForegroundColor White
if (Move-Item-Safe "components\TemplateBuilder.tsx" "components\TemplateBuilder.tsx") { $moved++ } else { $skipped++ }
if (Move-Item-Safe "components\AdvancedTemplateBuilder.tsx" "components\AdvancedTemplateBuilder.tsx") { $moved++ } else { $skipped++ }
if (Move-Item-Safe "components\TemplateEditor.tsx" "components\TemplateEditor.tsx") { $moved++ } else { $skipped++ }
if (Move-Item-Safe "components\DocumentPreview.tsx" "components\DocumentPreview.tsx") { $moved++ } else { $skipped++ }

# 4. AdvancedEditor
Write-Host "`n4. Moving AdvancedEditor..." -ForegroundColor White
if (Move-Item-Safe "components\AdvancedEditor" "components\AdvancedEditor") { $moved++ } else { $skipped++ }

# 5. Test pages
Write-Host "`n5. Moving test pages..." -ForegroundColor White
if (Move-Item-Safe "app\documents\advance-directives-simple" "app\documents\advance-directives-simple") { $moved++ } else { $skipped++ }
if (Move-Item-Safe "app\test-advance-directives" "app\test-advance-directives") { $moved++ } else { $skipped++ }
if (Move-Item-Safe "app\test-advance-directives-2" "app\test-advance-directives-2") { $moved++ } else { $skipped++ }
if (Move-Item-Safe "app\test-advance-directives-3" "app\test-advance-directives-3") { $moved++ } else { $skipped++ }
if (Move-Item-Safe "app\test-advance-directives-4" "app\test-advance-directives-4") { $moved++ } else { $skipped++ }

# 6. Duplicate components
Write-Host "`n6. Moving duplicate components..." -ForegroundColor White
if (Move-Item-Safe "components\CategoryCard.tsx" "components\CategoryCard.tsx") { $moved++ } else { $skipped++ }
if (Move-Item-Safe "components\FieldsForm.tsx" "components\FieldsForm.tsx") { $moved++ } else { $skipped++ }
if (Move-Item-Safe "components\TemplateCard.tsx" "components\TemplateCard.tsx") { $moved++ } else { $skipped++ }
if (Move-Item-Safe "components\SavedDocumentCard.tsx" "components\SavedDocumentCard.tsx") { $moved++ } else { $skipped++ }
if (Move-Item-Safe "components\SendEmailDialog.tsx" "components\SendEmailDialog.tsx") { $moved++ } else { $skipped++ }
if (Move-Item-Safe "components\ProtectedRoute.tsx" "components\ProtectedRoute.tsx") { $moved++ } else { $skipped++ }
if (Move-Item-Safe "components\Navbar.tsx" "components\Navbar.tsx") { $moved++ } else { $skipped++ }
if (Move-Item-Safe "components\Footer.tsx" "components\Footer.tsx") { $moved++ } else { $skipped++ }
if (Move-Item-Safe "components\AIWritingAssistant.tsx" "components\AIWritingAssistant.tsx") { $moved++ } else { $skipped++ }
if (Move-Item-Safe "components\SimpleAdvanceDirectives.tsx" "components\SimpleAdvanceDirectives.tsx") { $moved++ } else { $skipped++ }

# Summary
Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Moved: $moved items" -ForegroundColor Green
Write-Host "Skipped: $skipped items" -ForegroundColor Yellow
Write-Host "`nBackup location: $backup" -ForegroundColor White
Write-Host "`nDone!" -ForegroundColor Green

