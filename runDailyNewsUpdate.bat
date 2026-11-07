@echo off
setlocal enabledelayedexpansion

set "ROOT_DIR=d:\BuzzNews"
set "LOG_DIR=%ROOT_DIR%\logs"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

set "LOG_FILE=%LOG_DIR%\daily_news_update_%date:~-4,4%%date:~-7,2%%date:~-10,2%.log"

echo ============================================================ >> "%LOG_FILE%" 2>&1
echo 🚀 ZESTFEEDX DAILY NEWS AUTO-UPDATE: %date% %time% >> "%LOG_FILE%" 2>&1
echo ============================================================ >> "%LOG_FILE%" 2>&1

echo [0/4] Syncing latest updates from GitHub... >> "%LOG_FILE%" 2>&1
cd /d "%ROOT_DIR%"
call git pull origin main >> "%LOG_FILE%" 2>&1

echo [1/4] Scraping fresh news from ANI and Google News wires... >> "%LOG_FILE%" 2>&1
cd /d "%ROOT_DIR%"
call python scripts/auto_scrape_and_publish.py >> "%LOG_FILE%" 2>&1
if %errorlevel% neq 0 (
    echo ❌ Scraping failed with error code %errorlevel% >> "%LOG_FILE%" 2>&1
    exit /b %errorlevel%
)

echo [2/4] Building static Next.js export and sitemaps... >> "%LOG_FILE%" 2>&1
cd /d "%ROOT_DIR%\frontend"
call npm run build >> "%LOG_FILE%" 2>&1
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed with error code %errorlevel% >> "%LOG_FILE%" 2>&1
    exit /b %errorlevel%
)

echo [2.5/4] Copying .htaccess to output... >> "%LOG_FILE%" 2>&1
copy /y "%ROOT_DIR%\frontend\public\.htaccess" "%ROOT_DIR%\frontend\out\.htaccess" >> "%LOG_FILE%" 2>&1

echo [3/4] Deploying to Hostinger via MCP... >> "%LOG_FILE%" 2>&1
cd /d "%ROOT_DIR%"
call node scripts/deploy_hostinger_mcp.js >> "%LOG_FILE%" 2>&1

echo [4/4] Syncing local changes to GitHub (if remote configured)... >> "%LOG_FILE%" 2>&1
cd /d "%ROOT_DIR%"
call git add frontend/src/data/seedArticles.ts frontend/public/ >> "%LOG_FILE%" 2>&1
call git commit -m "Auto-update latest news dispatches [skip ci]" >> "%LOG_FILE%" 2>&1
call git push origin main >> "%LOG_FILE%" 2>&1

echo ============================================================ >> "%LOG_FILE%" 2>&1
echo ✅ DAILY NEWS UPDATE COMPLETED SUCCESSFULLY: %date% %time% >> "%LOG_FILE%" 2>&1
echo ============================================================ >> "%LOG_FILE%" 2>&1

exit /b 0

