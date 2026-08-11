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
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/10/01.webp"; Out = "jamila\gallery-6.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2025/02/Plaza01-00125-scaled.webp"; Out = "jamila\gallery-7.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2025/02/Outdoor-Gym-scaled.webp"; Out = "jamila\gallery-8.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2025/02/Lagoon-scaled.webp"; Out = "jamila\gallery-9.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/09/9967d643-cea1-4cd0-944e-ef08614abc2a.webp"; Out = "jura\gallery-7.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/09/a68844a9-9126-468b-b4bf-00fc87b12889.webp"; Out = "jura\gallery-8.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/09/a70553d5-8e81-4d53-ab20-6f584ccf6002.webp"; Out = "jura\gallery-9.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/09/c84d0290-5fcb-4edc-abcf-80a2d66dcf56-1.webp"; Out = "jura\gallery-10.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/09/cfc7dbf3-735a-47a2-87e3-f2c1ee3ad4fe.webp"; Out = "jura\gallery-11.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/09/eafc757b-d8c7-4ed1-8a26-27846df5fe56.webp"; Out = "jura\gallery-12.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/09/eb58272b-4d0d-4198-b882-393288df3e85.webp"; Out = "jura\gallery-13.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/09/ee30e637-9137-456c-9ee2-7d02f8577915.webp"; Out = "jura\gallery-14.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/12/jura-final-movies-3-scaled-4.webp"; Out = "jura\gallery-15.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/12/jura-final-movies-6-scaled-4.webp"; Out = "jura\gallery-16.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/12/jura-final-movies-7-scaled-4.webp"; Out = "jura\gallery-17.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/12/jura-final-movies-10-scaled-4.webp"; Out = "jura\gallery-18.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2025/01/S-Cam04-scaled.webp"; Out = "jura\gallery-19.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2025/01/S-Cam05-scaled.webp"; Out = "jura\gallery-20.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2025/01/S-Cam07-scaled.webp"; Out = "jura\gallery-21.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/11/jura-logo.png"; Out = "..\brand\jura\logo-mark.png" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/11/jura-logo.png"; Out = "..\brand\jura\logo-on-dark.png" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/10/Asset-3.webp"; Out = "..\brand\jamila\logo-mark.webp" },
  @{ Url = "https://njdegypt.com/wp-content/uploads/2024/10/Asset-3.webp"; Out = "..\brand\jamila\logo-on-dark.webp" }
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
