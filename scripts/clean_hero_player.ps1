Add-Type -AssemblyName System.Drawing
$srcPath = Resolve-Path "public/images/hero_culture.png"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$dst = New-Object System.Drawing.Bitmap($src.Width, $src.Height)
$g = [System.Drawing.Graphics]::FromImage($dst)
$g.DrawImage($src, 0, 0, $src.Width, $src.Height)

$darkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 12, 14, 18))

# Fill left area up to X=350, then feather to X=380
$pt1 = New-Object System.Drawing.Point(340, 0)
$pt2 = New-Object System.Drawing.Point(380, 0)
$gradBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($pt1, $pt2, [System.Drawing.Color]::FromArgb(255, 12, 14, 18), [System.Drawing.Color]::FromArgb(0, 12, 14, 18))

$g.FillRectangle($darkBrush, 0, 0, 345, 565)
$g.FillRectangle($gradBrush, 340, 0, 40, 565)

# Top header fade
$g.FillRectangle($darkBrush, 0, 0, $src.Width, 55)

$outPath = Join-Path (Get-Location) "public/images/hero_player_clean.png"
$dst.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$dst.Dispose()
$src.Dispose()
Write-Output "Clean hero player image saved to $outPath"
