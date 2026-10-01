Add-Type -AssemblyName System.Drawing
$srcPath = Resolve-Path "public/images/footer_bg.jpg"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$dst = New-Object System.Drawing.Bitmap($src.Width, $src.Height)
$g = [System.Drawing.Graphics]::FromImage($dst)
$g.DrawImage($src, 0, 0, $src.Width, $src.Height)

$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 8, 9, 12))

# Top-Left text area (Y=155 to 440, X=0 to 400)
$pt1 = New-Object System.Drawing.Point(340, 0)
$pt2 = New-Object System.Drawing.Point(420, 0)
$linGrBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($pt1, $pt2, [System.Drawing.Color]::FromArgb(255, 8, 9, 12), [System.Drawing.Color]::FromArgb(0, 8, 9, 12))
$g.FillRectangle($bgBrush, 0, 155, 350, 285)
$g.FillRectangle($linGrBrush, 340, 155, 80, 285)

# Middle links area (Y=440 to 860, X=0 to 480)
$pt3 = New-Object System.Drawing.Point(410, 0)
$pt4 = New-Object System.Drawing.Point(495, 0)
$linGrBrush2 = New-Object System.Drawing.Drawing2D.LinearGradientBrush($pt3, $pt4, [System.Drawing.Color]::FromArgb(255, 7, 8, 10), [System.Drawing.Color]::FromArgb(0, 7, 8, 10))
$g.FillRectangle($bgBrush, 0, 440, 420, 420)
$g.FillRectangle($linGrBrush2, 410, 440, 85, 420)

# Bottom badges & copyright area (Y=860 to 1024, X=0 to 520)
$pt5 = New-Object System.Drawing.Point(420, 0)
$pt6 = New-Object System.Drawing.Point(510, 0)
$linGrBrush3 = New-Object System.Drawing.Drawing2D.LinearGradientBrush($pt5, $pt6, [System.Drawing.Color]::FromArgb(255, 6, 7, 9), [System.Drawing.Color]::FromArgb(0, 6, 7, 9))
$g.FillRectangle($bgBrush, 0, 860, 430, 164)
$g.FillRectangle($linGrBrush3, 420, 860, 90, 164)

# Keep the bottom-right red speed stripes intact (at X > 550, Y > 900)

$outPath = Join-Path (Get-Location) "public/images/footer_clean_bg.jpg"
$dst.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose()
$dst.Dispose()
$src.Dispose()
Write-Output "Clean background saved to $outPath"
