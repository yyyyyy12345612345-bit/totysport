Add-Type -AssemblyName System.Drawing
$srcPath = Resolve-Path "public/images/footer_bg.jpg"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

# 1. Clean Hanging Jersey
$jW = 320
$jH = 460
$jX = $src.Width - $jW
$jY = 0

$jerseyBmp = New-Object System.Drawing.Bitmap($jW, $jH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($y = 0; $y -lt $jH; $y++) {
    for ($x = 0; $x -lt $jW; $x++) {
        $c = $src.GetPixel($jX + $x, $jY + $y)

        # Clear text area at the bottom (y > 360, x < 260)
        if ($y -gt 360 -and $x -lt 260) {
            $jerseyBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            continue
        }

        # Feather left edge
        $alpha = 1.0
        if ($x -lt 70) {
            $alpha = [Math]::Max(0.0, [Math]::Min(1.0, $x / 70.0))
        }

        # Feather bottom edge (for the post on right)
        if ($y -gt ($jH - 50)) {
            $alphaBottom = [Math]::Max(0.0, [Math]::Min(1.0, ($jH - $y) / 50.0))
            $alpha = [Math]::Min($alpha, $alphaBottom)
        }

        # Smooth transition into the cleared text zone
        if ($y -gt 340 -and $x -lt 260) {
            $alphaT = [Math]::Max(0.0, [Math]::Min(1.0, (360 - $y) / 20.0))
            $alpha = [Math]::Min($alpha, $alphaT)
        }

        $newA = [int](255 * $alpha)
        $jerseyBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($newA, $c.R, $c.G, $c.B))
    }
}
$outJersey = Join-Path (Get-Location) "public/images/footer_jersey.png"
$jerseyBmp.Save($outJersey, [System.Drawing.Imaging.ImageFormat]::Png)
$jerseyBmp.Dispose()

# 2. Clean Soccer Ball
$bW = 230
$bH = 220
$bX = $src.Width - $bW
$bY = 660

$ballBmp = New-Object System.Drawing.Bitmap($bW, $bH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($y = 0; $y -lt $bH; $y++) {
    for ($x = 0; $x -lt $bW; $x++) {
        $c = $src.GetPixel($bX + $x, $bY + $y)
        $alpha = 1.0

        # Feather left
        if ($x -lt 60) {
            $alpha = [Math]::Max(0.0, [Math]::Min(1.0, $x / 60.0))
        }
        # Feather top
        if ($y -lt 50) {
            $alphaTop = [Math]::Max(0.0, [Math]::Min(1.0, $y / 50.0))
            $alpha = [Math]::Min($alpha, $alphaTop)
        }
        # Feather bottom
        if ($y -gt ($bH - 35)) {
            $alphaBottom = [Math]::Max(0.0, [Math]::Min(1.0, ($bH - $y) / 35.0))
            $alpha = [Math]::Min($alpha, $alphaBottom)
        }

        $newA = [int](255 * $alpha)
        $ballBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($newA, $c.R, $c.G, $c.B))
    }
}
$outBall = Join-Path (Get-Location) "public/images/footer_ball.png"
$ballBmp.Save($outBall, [System.Drawing.Imaging.ImageFormat]::Png)
$ballBmp.Dispose()

$src.Dispose()
Write-Output "Extracted clean footer_jersey.png and footer_ball.png!"
