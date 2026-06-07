$ErrorActionPreference = "Stop"
$root = Join-Path $PSScriptRoot "..\client\public\assets\projects"

$downloads = @(
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/11/website-image.webp"; Out = "jura\hero.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/12/3333.webp"; Out = "jura\galala.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2025/01/Top-View-01-scaled.webp"; Out = "jura\masterplan.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/12/juramap-new-scaled-1.webp"; Out = "jura\location.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/09/8c184dc9-21f2-4762-9f34-5fcfe1184ef9.webp"; Out = "jura\gallery-1.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/09/8fc48dc6-7cb7-4c4f-b4c9-fe940dc1c9f2.webp"; Out = "jura\gallery-2.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/09/13f665c7-30c9-4ba7-a02b-914cf7b349ad.webp"; Out = "jura\gallery-3.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/09/43aca6b7-01b2-4a19-8042-6cd0287ddb7c.webp"; Out = "jura\gallery-4.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/09/58aaf938-42b2-4118-8ad4-1d9f507f96e7.webp"; Out = "jura\gallery-5.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/09/833c4c6d-76db-4097-9bdb-2106059d4fcc.webp"; Out = "jura\gallery-6.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2025/02/Roof-Night-04-scaled.webp"; Out = "jamila\hero.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/10/MasterPlan.webp"; Out = "jamila\masterplan.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/10/Sec002-scaled-1.webp"; Out = "jamila\location.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/10/zone03.jpeg-scaled.webp"; Out = "jamila\gallery-1.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/10/00_CAM03-BUILDING-CLOSE-scaled.webp"; Out = "jamila\gallery-2.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/10/Zone01_02.jpeg-scaled.webp"; Out = "jamila\gallery-3.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/10/03.webp"; Out = "jamila\gallery-4.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2025/01/Interior-Restaurant-1-scaled.webp"; Out = "jamila\gallery-5.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/10/01.webp"; Out = "jamila\gallery-6.webp" }
)

foreach ($item in $downloads) {
  $dest = Join-Path $root $item.Out
  $dir = Split-Path $dest -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  Write-Host "Downloading $($item.Out) ..."
  curl.exe -fsSL -o $dest $item.Url
  if (-not (Test-Path $dest) -or (Get-Item $dest).Length -lt 1024) {
    throw "Download failed or file too small: $($item.Out)"
  }
}

Write-Host "Done. $($downloads.Count) files saved under $root"
