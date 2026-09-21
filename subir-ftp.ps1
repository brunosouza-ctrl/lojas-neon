# =========================================================
# LOJAS NEON  |  envia a pasta publicar/ para a hospedagem por FTP
#
# Nao precisa instalar nada: usa o proprio Windows.
# A senha e digitada na hora e nao fica gravada em lugar nenhum.
#
# Como usar, dentro da pasta do projeto:
#
#   powershell -ExecutionPolicy Bypass -File subir-ftp.ps1
#
# Ele pergunta servidor, usuario e senha, cria as pastas que faltarem
# e envia os arquivos um a um, mostrando o progresso.
# =========================================================

param(
  [string]$Servidor = "",
  [string]$Usuario = "",
  [string]$PastaRemota = "web",
  [string]$Apenas = "",
  [switch]$Listar
)

$ErrorActionPreference = "Stop"
$local = Join-Path $PSScriptRoot "publicar"

if (-not (Test-Path $local)) {
  Write-Host "A pasta publicar/ nao existe. Rode antes: python publicar.py" -ForegroundColor Red
  exit 1
}

if (-not $Servidor) { $Servidor = Read-Host "Servidor de FTP (exemplo: ftp.lojasneon.com.br)" }
if (-not $Usuario)  { $Usuario  = Read-Host "Usuario de FTP" }
$senhaSegura = Read-Host "Senha do FTP" -AsSecureString
$senha = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($senhaSegura))

$Servidor = $Servidor -replace '^ftp://', '' -replace '/$', ''
$base = "ftp://$Servidor/" + ($PastaRemota.Trim('/'))
$cred = New-Object System.Net.NetworkCredential($Usuario, $senha)

# A hospedagem corta a conexao quando chegam muitas seguidas, e o envio
# morre com "530 Nao conectado". Por isso a conexao e reaproveitada
# (KeepAlive) e cada arquivo tem tres tentativas, esperando mais a cada vez.
function Enviar-Uma-Vez($origem, $destino) {
  $req = [System.Net.FtpWebRequest]::Create($destino)
  $req.Credentials = $cred
  $req.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
  $req.UseBinary = $true
  $req.UsePassive = $true
  $req.KeepAlive = $true
  $req.Timeout = 60000
  $req.ServicePoint.ConnectionLimit = 2
  $bytes = [System.IO.File]::ReadAllBytes($origem)
  $req.ContentLength = $bytes.Length
  $fluxo = $req.GetRequestStream()
  $fluxo.Write($bytes, 0, $bytes.Length)
  $fluxo.Close()
  $resp = $req.GetResponse()
  $resp.Close()
}

function Enviar-Arquivo($origem, $destino) {
  $esperas = @(2, 6, 15)
  for ($tentativa = 0; $tentativa -lt 4; $tentativa++) {
    try {
      Enviar-Uma-Vez $origem $destino
      return
    } catch {
      if ($tentativa -eq 3) { throw }
      Start-Sleep -Seconds $esperas[$tentativa]
    }
  }
}

function Criar-Pasta($destino) {
  try {
    $req = [System.Net.FtpWebRequest]::Create($destino)
    $req.Credentials = $cred
    $req.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
    $req.KeepAlive = $false
    $resp = $req.GetResponse()
    $resp.Close()
  } catch {
    # pasta ja existe: seguir em frente
  }
}

# -Listar so mostra o que existe no servidor, sem enviar nada
if ($Listar) {
  foreach ($alvo in @("ftp://$Servidor/", "$base/")) {
    Write-Host ""
    Write-Host "Conteudo de $alvo" -ForegroundColor Cyan
    try {
      $req = [System.Net.FtpWebRequest]::Create($alvo)
      $req.Credentials = $cred
      $req.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectoryDetails
      $req.KeepAlive = $false
      $resp = $req.GetResponse()
      $leitor = New-Object System.IO.StreamReader($resp.GetResponseStream())
      Write-Host $leitor.ReadToEnd()
      $leitor.Close(); $resp.Close()
    } catch {
      Write-Host "  nao consegui listar: $($_.Exception.Message)" -ForegroundColor Yellow
    }
  }
  exit 0
}

# confere o login antes de comecar
try {
  $teste = [System.Net.FtpWebRequest]::Create("$base/")
  $teste.Credentials = $cred
  $teste.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
  $teste.Timeout = 30000
  $respTeste = $teste.GetResponse()
  $respTeste.Close()
} catch {
  Write-Host "Nao consegui entrar no FTP: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host "Confira usuario, senha e a pasta $PastaRemota." -ForegroundColor Yellow
  exit 1
}

$arquivos = Get-ChildItem -Path $local -Recurse -File
$pastas = Get-ChildItem -Path $local -Recurse -Directory

# -Apenas envia so o que casar com o texto, util para corrigir um arquivo so
if ($Apenas) {
  $arquivos = $arquivos | Where-Object { $_.Name -like $Apenas -or $_.FullName -like $Apenas }
  $pastas = @()
  if (-not $arquivos) { Write-Host "Nada casou com $Apenas" -ForegroundColor Yellow; exit 1 }
}

Write-Host ""
Write-Host "Enviando $($arquivos.Count) arquivos para $base" -ForegroundColor Cyan

foreach ($p in $pastas) {
  $relativo = $p.FullName.Substring($local.Length + 1).Replace('\', '/')
  Criar-Pasta "$base/$relativo"
}

$i = 0
$erros = @()
foreach ($a in $arquivos) {
  $i++
  $relativo = $a.FullName.Substring($local.Length + 1).Replace('\', '/')
  Write-Progress -Activity "Enviando para a hospedagem" -Status $relativo -PercentComplete (100 * $i / $arquivos.Count)
  try {
    Enviar-Arquivo $a.FullName "$base/$relativo"
  } catch {
    $erros += "$relativo : $($_.Exception.Message)"
  }
  if ($i % 25 -eq 0) { Start-Sleep -Milliseconds 800 }
}
Write-Progress -Activity "Enviando para a hospedagem" -Completed

if ($erros.Count -eq 0) {
  Write-Host "Pronto. $($arquivos.Count) arquivos no ar." -ForegroundColor Green
} else {
  Write-Host "Terminou com $($erros.Count) falhas:" -ForegroundColor Yellow
  $erros | ForEach-Object { Write-Host "  $_" }
}
