# 🚀 Apply All Deployment Fixes - Run This Script

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   VERCEL DEPLOYMENT FIX SCRIPT" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Generate package-lock.json
Write-Host "Step 1: Generating package-lock.json..." -ForegroundColor Yellow
Write-Host "This will take 1-2 minutes..." -ForegroundColor Gray
npm install

if (Test-Path package-lock.json) {
    Write-Host "✅ package-lock.json generated successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to generate package-lock.json" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Remove dist from Git
Write-Host "Step 2: Removing dist/ from Git tracking..." -ForegroundColor Yellow
git rm -r --cached dist 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ dist/ removed from Git" -ForegroundColor Green
} else {
    Write-Host "ℹ️  dist/ not tracked by Git (already clean)" -ForegroundColor Blue
}

Write-Host ""

# Step 3: Verify build works
Write-Host "Step 3: Verifying build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 4: Show git status
Write-Host "Step 4: Git status..." -ForegroundColor Yellow
git status --short

Write-Host ""

# Step 5: Ready to commit
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   ALL FIXES APPLIED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review changes above" -ForegroundColor White
Write-Host "2. Run: git add ." -ForegroundColor White
Write-Host "3. Run: git commit -m 'Fix deployment: Add package-lock.json, remove dist'" -ForegroundColor White
Write-Host "4. Run: git push origin main" -ForegroundColor White
Write-Host ""
Write-Host "Vercel will automatically deploy after push ✅" -ForegroundColor Green
