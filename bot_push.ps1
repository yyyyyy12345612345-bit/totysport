# ====================================================================
#   ⚽🤖 بوت الرفع الذكي إلى GITHUB — TOTY SPORT UPLOADER BOT 🤖⚽
# ====================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$RepoOwner = "yyyyyy12345612345-bit"
$RepoName  = "totysport"
$RepoUrl   = "https://github.com/$RepoOwner/$RepoName.git"

function Show-Header {
    Clear-Host
    Write-Host ""
    Write-Host "====================================================================" -ForegroundColor Yellow
    Write-Host "      ⚽🤖  بوت الرفع التلقائي إلى GITHUB — TOTY SPORT  🤖⚽" -ForegroundColor Green
    Write-Host "====================================================================" -ForegroundColor Yellow
    Write-Host "  📦 المستودع المستهدف: " -NoNewline -ForegroundColor Cyan
    Write-Host "$RepoUrl" -ForegroundColor White
    Write-Host "  🌿 الفرع الحالي:       " -NoNewline -ForegroundColor Cyan
    Write-Host "main" -ForegroundColor White
    Write-Host "====================================================================" -ForegroundColor DarkGray
    Write-Host ""
}

function Get-StoredGitHubAccounts {
    $accounts = @()
    try {
        $cmdkeyOut = & "C:\Windows\System32\cmdkey.exe" /list 2>$null
        foreach ($line in $cmdkeyOut) {
            if ($line -match "target=git:https://([^@]+)@github\.com") {
                $user = $matches[1]
                if ($user -and $accounts -notcontains $user) {
                    $accounts += $user
                }
            }
        }
    } catch {}
    return $accounts
}

function Ensure-GitCommit {
    Write-Host "🔍 فحص حالة الملفات..." -ForegroundColor Cyan
    git add .
    $status = git status --porcelain
    if ($status) {
        Write-Host "📝 تم العثور على تعديلات جديدة، جاري إنشاء Commit..." -ForegroundColor Yellow
        git commit -m "feat: update Toty Sport platform with latest features and documentation"
    } else {
        Write-Host "✅ كافة الملفات جاهزة ومحفوظة (No pending changes)." -ForegroundColor Green
    }
    git branch -M main 2>$null
}

function Push-WithToken {
    Show-Header
    Write-Host "🔑 [طريقة الـ Personal Access Token - الأضمن والأسرع 100%]" -ForegroundColor Yellow
    Write-Host "────────────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
    Write-Host "إذا كان لديك Token من GitHub (يبدأ بـ ghp_ أو github_pat_):" -ForegroundColor White
    Write-Host "ألصق التوكن هنا واضغط Enter (أو اضغط Enter فارغ للرجوع للقائمة):" -ForegroundColor Gray
    Write-Host ""
    
    $token = Read-Host "👉 التوكن الخاص بك (GitHub Token)"
    if ([string]::IsNullOrWhiteSpace($token)) {
        Write-Host "تم الإلغاء." -ForegroundColor Yellow
        Start-Sleep -Seconds 1
        return
    }
    
    $token = $token.Trim()
    
    Ensure-GitCommit
    
    Write-Host ""
    Write-Host "🚀 جاري الرفع إلى المستودع عبر التوكن..." -ForegroundColor Cyan
    $pushUrl = "https://${token}@github.com/$RepoOwner/$RepoName.git"
    
    git push $pushUrl main --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉🎉 تم الرفع بنجاح 100%! تم تحديث المستودع بالكامل! 🎉🎉" -ForegroundColor Green
        [Console]::Beep(800, 300)
        Write-Host "🔗 الرابط على GitHub: " -NoNewline -ForegroundColor White
        Write-Host "$RepoUrl" -ForegroundColor Cyan
        
        $open = Read-Host "هل تريد فتح المستودع في المتصفح الآن؟ (y/n)"
        if ($open -eq 'y' -or $open -eq 'Y' -or $open -eq '') {
            Start-Process "https://github.com/$RepoOwner/$RepoName"
        }
    } else {
        Write-Host ""
        Write-Host "❌ فشل الرفع. تأكد من أن التوكن سليم ولديه صلاحية 'repo' أو صلاحيات الكتابة." -ForegroundColor Red
    }
    Write-Host ""
    Read-Host "اضغط Enter للعودة للقائمة..."
}

function Push-WithAccount {
    param([string]$Username)
    Show-Header
    Write-Host "👤 جاري الرفع باستخدام الحساب: $Username" -ForegroundColor Yellow
    Write-Host "────────────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
    
    Ensure-GitCommit
    
    git config user.name "$Username"
    $targetRemote = "https://${Username}@github.com/$RepoOwner/$RepoName.git"
    git remote set-url origin $targetRemote
    
    Write-Host ""
    Write-Host "🚀 جاري رفع المشروع إلى GitHub..." -ForegroundColor Cyan
    git push -u origin main --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉🎉 تم الرفع بنجاح 100%! تم تحديث المستودع بالكامل! 🎉🎉" -ForegroundColor Green
        [Console]::Beep(800, 300)
        Write-Host "🔗 الرابط على GitHub: " -NoNewline -ForegroundColor White
        Write-Host "$RepoUrl" -ForegroundColor Cyan
        
        $open = Read-Host "هل تريد فتح المستودع في المتصفح الآن؟ (y/n)"
        if ($open -eq 'y' -or $open -eq 'Y' -or $open -eq '') {
            Start-Process "https://github.com/$RepoOwner/$RepoName"
        }
    } else {
        Write-Host ""
        Write-Host "⚠️ لم يكتمل الرفع تلقائياً. ربما تحتاج لإعادة المصادقة لهذا الحساب." -ForegroundColor Yellow
        Write-Host "جرب الخيار رقم [2] (الرفع عبر التوكن Token) فهو مضمون ومباشر دائماً!" -ForegroundColor Cyan
    }
    Write-Host ""
    Read-Host "اضغط Enter للعودة للقائمة..."
}

function Push-WithBrowserLogin {
    Show-Header
    Write-Host "🌐 [تسجيل الدخول التفاعلي عبر المتصفح]" -ForegroundColor Yellow
    Write-Host "────────────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
    Write-Host "سيقوم المتصفح بفتح نافذة GitHub لتسجيل الدخول واختيار حسابك..." -ForegroundColor White
    
    Ensure-GitCommit
    
    # Reset remote to standard https
    git remote set-url origin $RepoUrl
    
    Write-Host ""
    Write-Host "🚀 جاري تشغيل المصادقة والرفع..." -ForegroundColor Cyan
    git push -u origin main --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉🎉 تم الرفع بنجاح 100%! 🎉🎉" -ForegroundColor Green
        [Console]::Beep(800, 300)
    } else {
        Write-Host ""
        Write-Host "⚠️ انتهت محاولة المصادقة." -ForegroundColor Yellow
    }
    Write-Host ""
    Read-Host "اضغط Enter للعودة للقائمة..."
}

function Show-ChooseAccountMenu {
    $accounts = Get-StoredGitHubAccounts
    Show-Header
    Write-Host "👥 الحسابات المسجلة والمكتشفة على جهازك:" -ForegroundColor Yellow
    Write-Host "────────────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
    
    if ($accounts.Count -eq 0) {
        Write-Host "لم يتم العثور على حسابات محفوظة. يمكنك استخدام خيار التوكن أو المتصفح." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
        return
    }
    
    for ($i = 0; $i -lt $accounts.Count; $i++) {
        $acc = $accounts[$i]
        $tag = ""
        if ($acc -eq $RepoOwner) { $tag = " 🌟 [المطابق لاسم المستودع]" }
        Write-Host "  [$($i+1)] $acc$tag" -ForegroundColor White
    }
    Write-Host "  [0] إدخال اسم مستخدم آخر يدوياً" -ForegroundColor Cyan
    Write-Host "  [b] رجوع للقائمة الرئيسية" -ForegroundColor DarkGray
    Write-Host ""
    
    $choice = Read-Host "👉 اختر رقم الحساب"
    if ($choice -eq 'b' -or $choice -eq 'B') { return }
    
    if ($choice -eq '0') {
        $manualUser = Read-Host "أدخل اسم المستخدم على GitHub"
        if ($manualUser) {
            Push-WithAccount -Username $manualUser.Trim()
        }
        return
    }
    
    $idx = [int]$choice - 1
    if ($idx -ge 0 -and $idx -lt $accounts.Count) {
        Push-WithAccount -Username $accounts[$idx]
    } else {
        Write-Host "اختيار غير صحيح." -ForegroundColor Red
        Start-Sleep -Seconds 1
    }
}

# ════════════════════════════════════════════════════════════════════
# الحلقة الرئيسية للبوت (Main Loop)
# ════════════════════════════════════════════════════════════════════
while ($true) {
    Show-Header
    $stored = Get-StoredGitHubAccounts
    $detectedText = if ($stored.Count -gt 0) { $stored -join ", " } else { "غير محدد" }
    
    Write-Host "  الحسابات المكتشفة على جهازك: " -NoNewline -ForegroundColor Gray
    Write-Host "$detectedText" -ForegroundColor Yellow
    Write-Host "────────────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  [1] 🌟 الرفع المباشر بحساب المستودع: $RepoOwner" -ForegroundColor Green
    Write-Host "  [2] 🔑 الرفع باستخدام Personal Access Token (الأسرع والأضمن 100%)" -ForegroundColor Yellow
    Write-Host "  [3] 👥 اختيار حساب آخر من الحسابات المسجلة على جهازك" -ForegroundColor Cyan
    Write-Host "  [4] 🌐 تسجيل الدخول واختيار الحساب عبر المتصفح (Browser Sign-in)" -ForegroundColor White
    Write-Host "  [5] ⚡ فحص حالة ملفات المستودع (Git Status)" -ForegroundColor Gray
    Write-Host "  [6] ❌ خروج من البوت (Exit)" -ForegroundColor Red
    Write-Host ""
    
    $opt = Read-Host "👉 أدخل رقم اختيارك [1-6]"
    
    switch ($opt.Trim()) {
        "1" { Push-WithAccount -Username $RepoOwner }
        "2" { Push-WithToken }
        "3" { Show-ChooseAccountMenu }
        "4" { Push-WithBrowserLogin }
        "5" {
            Show-Header
            git status
            Write-Host ""
            Read-Host "اضغط Enter للعودة..."
        }
        "6" {
            Write-Host "مع السلامة! 👋" -ForegroundColor Green
            Start-Sleep -Milliseconds 500
            exit
        }
        default {
            Write-Host "اختيار غير صالح، يرجى اختيار رقم من 1 إلى 6." -ForegroundColor Red
            Start-Sleep -Seconds 1
        }
    }
}
