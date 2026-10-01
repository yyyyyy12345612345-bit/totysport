Add-Type -AssemblyName System.Drawing
$srcPath = Resolve-Path "public/images/hero_culture.png"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$dst = New-Object System.Drawing.Bitmap($src.Width, $src.Height)
$g = [System.Drawing.Graphics]::FromImage($dst)
$g.DrawImage($src, 0, 0, $src.Width, $src.Height)

$darkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 12, 14, 18))

# Fill left area up to X=346, then feather to X=375
$pt1 = New-Object System.Drawing.Point(330, 0)
$pt2 = New-Object System.Drawing.Point(375, 0)
$gradBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($pt1, $pt2, [System.Drawing.Color]::FromArgb(255, 12, 14, 18), [System.Drawing.Color]::FromArgb(0, 12, 14, 18))

$g.FillRectangle($darkBrush, 0, 0, 335, 565)
$g.FillRectangle($gradBrush, 330, 0, 50, 565)

# Top header fade
$ptTop1 = New-Object System.Drawing.Point(0, 50)
$ptTop2 = New-Object System.Drawing.Point(0, 95)
$gradTopBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($ptTop1, $ptTop2, [System.Drawing.Color]::FromArgb(255, 10, 11, 14), [System.Drawing.Color]::FromArgb(0, 10, 11, 14))
$g.FillRectangle($darkBrush, 0, 0, $src.Width, 55)
$g.FillRectangle($gradTopBrush, 0, 50, $src.Width, 45)

$outPath = Join-Path (Get-Location) "public/images/hero_culture_clean.png"
$dst.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$dst.Dispose()
$src.Dispose()
Write-Output "Clean hero culture image saved to $outPath"
