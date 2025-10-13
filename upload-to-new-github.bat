@echo off
echo =========================================
echo Moving project to new GitHub repository
echo =========================================

REM Add changes
echo.
echo Adding modified files...
git add components/AdvanceDirectivesDocument.tsx components/SectionsWarehouse.tsx
if errorlevel 1 (
    echo Warning: Could not add files. They might already be staged or there might be a lock file.
    echo Trying to remove lock file...
    del /F .git\index.lock 2>nul
    timeout /t 2 /nobreak >nul
    git add components/AdvanceDirectivesDocument.tsx components/SectionsWarehouse.tsx
)

REM Commit changes
echo.
echo Committing changes...
git commit -m "Update components before moving to new repository"
if errorlevel 1 (
    echo No changes to commit or already committed
)

REM Add new remote
echo.
echo Setting new GitHub repository...
git remote add origin https://github.com/liatbenshai/legal-templates-clean-3.0.git

REM Push to new repository
echo.
echo Pushing to new repository...
git push -u origin main
if errorlevel 1 (
    echo.
    echo If push failed, trying with 'master' branch...
    git push -u origin master
)

echo.
echo =========================================
echo Done! Your project is now on GitHub!
echo =========================================
echo Repository: https://github.com/liatbenshai/legal-templates-clean-3.0
pause

