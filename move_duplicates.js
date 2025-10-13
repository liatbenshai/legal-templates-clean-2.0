const fs = require('fs');
const path = require('path');

// Use __dirname to get the current script directory
const WORKSPACE = __dirname;
const BACKUP_DIR = path.join(WORKSPACE, 'backup_before_cleanup_20251013_143500');

// Helper function to create directory if it doesn't exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Helper function to copy directory recursively
function copyDir(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Helper function to remove directory recursively
function removeDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// Helper function to move file/directory
function moveItem(src, dest) {
  const srcPath = path.join(WORKSPACE, src);
  const destPath = path.join(BACKUP_DIR, dest);
  
  if (fs.existsSync(srcPath)) {
    console.log(`Moving: ${src} -> backup/${dest}`);
    ensureDir(path.dirname(destPath));
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
      removeDir(srcPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      fs.unlinkSync(srcPath);
    }
    return true;
  } else {
    console.log(`Skipped (not found): ${src}`);
    return false;
  }
}

console.log('=== Moving duplicate files to backup ===\n');

// 1. public/templates (duplicate of lib/templates)
moveItem('public\\templates', 'public\\templates');

// 2. AI Improvers (keeping SimpleAIImprover and EnhancedAIImprover)
moveItem('components\\AIImprover.tsx', 'components\\AIImprover.tsx');
moveItem('components\\AdvancedAIImprover.tsx', 'components\\AdvancedAIImprover.tsx');
moveItem('components\\RealtimeAIImprover.tsx', 'components\\RealtimeAIImprover.tsx');

// 3. Advance Directives duplicates
moveItem('components\\AdvanceDirectivesDocumentClean.tsx', 'components\\AdvanceDirectivesDocumentClean.tsx');

// 4. TemplateBuilder duplicates (keeping AdvancedTemplateBuilder directory)
moveItem('components\\TemplateBuilder.tsx', 'components\\TemplateBuilder.tsx');
moveItem('components\\AdvancedTemplateBuilder.tsx', 'components\\AdvancedTemplateBuilder.tsx');

// 5. TemplateEditor duplicates (keeping AdvancedTemplateBuilder/TemplateEditor.tsx)
moveItem('components\\TemplateEditor.tsx', 'components\\TemplateEditor.tsx');
moveItem('components\\AdvancedEditor\\TemplateEditor.tsx', 'components\\AdvancedEditor\\TemplateEditor.tsx');

// 6. DocumentPreview duplicates
moveItem('components\\DocumentPreview.tsx', 'components\\DocumentPreview.tsx');

// 7. Document pages duplicates
moveItem('app\\documents\\will-old', 'app\\documents\\will-old');
moveItem('app\\documents\\advance-directives-test', 'app\\documents\\advance-directives-test');
moveItem('app\\documents\\advance-directives-simple', 'app\\documents\\advance-directives-simple');

// 8. Other duplicate components (keeping ones in AdvancedTemplateBuilder directory)
moveItem('components\\CategoryCard.tsx', 'components\\CategoryCard.tsx');
moveItem('components\\FieldsForm.tsx', 'components\\FieldsForm.tsx');
moveItem('components\\TemplateCard.tsx', 'components\\TemplateCard.tsx');
moveItem('components\\SavedDocumentCard.tsx', 'components\\SavedDocumentCard.tsx');
moveItem('components\\SendEmailDialog.tsx', 'components\\SendEmailDialog.tsx');
moveItem('components\\ProtectedRoute.tsx', 'components\\ProtectedRoute.tsx');
moveItem('components\\Navbar.tsx', 'components\\Navbar.tsx');
moveItem('components\\Footer.tsx', 'components\\Footer.tsx');
moveItem('components\\AIWritingAssistant.tsx', 'components\\AIWritingAssistant.tsx');

// 9. Test pages
const testPages = ['test-advance-directives', 'test-advance-directives-2', 'test-advance-directives-3', 'test-advance-directives-4'];
testPages.forEach(page => {
  moveItem(`app\\${page}`, `app\\${page}`);
});

// 10. AdvancedEditor directory (keeping only needed files)
moveItem('components\\AdvancedEditor', 'components\\AdvancedEditor');

// 11. SimpleAdvanceDirectives
moveItem('components\\SimpleAdvanceDirectives.tsx', 'components\\SimpleAdvanceDirectives.tsx');

console.log('\n=== Done! ===');
console.log('Check backup_before_cleanup_20251013_143500/ for moved files.');

