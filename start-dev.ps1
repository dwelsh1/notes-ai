# Start Development Environment Script for NotesAI
# This script starts the Next.js backend, Vite frontend, and Prisma Studio in separate PowerShell windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NotesAI Development Environment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if npm is installed
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "Error: npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Generate Prisma client if needed
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npm run prisma:generate

Write-Host ""
Write-Host "Starting development servers in separate windows..." -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor Cyan
Write-Host "  - Frontend (Vite):    http://localhost:5173/NotesAI/" -ForegroundColor White
Write-Host "  - Backend (Next.js):  http://localhost:4000/" -ForegroundColor White
Write-Host "  - Prisma Studio:      http://localhost:5555/" -ForegroundColor White
Write-Host ""

# Track the processes
$processes = @()
$scriptPath = Get-Location

try {
    # Start Next.js backend in a new window
    Write-Host "[1/3] Starting Next.js backend..." -ForegroundColor Yellow
    $cmd = "cd '$scriptPath'; Write-Host 'Next.js Backend (Port 4000)' -ForegroundColor Magenta; npm run dev"
    $backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd -PassThru
    $processes += $backendProcess
    
    Start-Sleep -Seconds 2
    
    # Start Vite frontend in a new window
    Write-Host "[2/3] Starting Vite frontend..." -ForegroundColor Yellow
    $cmd = "cd '$scriptPath'; Write-Host 'Vite Frontend (Port 5173)' -ForegroundColor Blue; npm run dev:vite"
    $frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd -PassThru
    $processes += $frontendProcess
    
    Start-Sleep -Seconds 2
    
    # Start Prisma Studio in a new window
    Write-Host "[3/3] Starting Prisma Studio..." -ForegroundColor Yellow
    $cmd = "cd '$scriptPath'; Write-Host 'Prisma Studio (Port 5555)' -ForegroundColor Green; npm run prisma:studio"
    $prismaProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd -PassThru
    $processes += $prismaProcess
    
    Write-Host ""
    Write-Host "All services started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Waiting for services to initialize..." -ForegroundColor Cyan
    Start-Sleep -Seconds 5
    
    Write-Host "Opening browser tabs..." -ForegroundColor Cyan
    
    # Open browser tabs
    try {
        Start-Process "http://localhost:5173/NotesAI/"
        Start-Sleep -Seconds 1
        Start-Process "http://localhost:4000/"
        Start-Sleep -Seconds 1
        Start-Process "http://localhost:5555/"
    } catch {
        Write-Host "Could not automatically open browser tabs." -ForegroundColor Yellow
        Write-Host "Please open manually:" -ForegroundColor Yellow
        Write-Host "  - http://localhost:5173/NotesAI/ (Frontend)" -ForegroundColor White
        Write-Host "  - http://localhost:4000/ (Backend)" -ForegroundColor White
        Write-Host "  - http://localhost:5555/ (Prisma Studio)" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "All services are running!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Development Environment:" -ForegroundColor Cyan
    Write-Host "  - Three PowerShell windows are open (one for each service)" -ForegroundColor White
    Write-Host "  - You can monitor each service in its own window" -ForegroundColor White
    Write-Host "  - Close this window or press any key to stop all services" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Ports in use:" -ForegroundColor Cyan
    Write-Host "  - 5173: Vite Frontend" -ForegroundColor Blue
    Write-Host "  - 4000: Next.js Backend API" -ForegroundColor Magenta
    Write-Host "  - 5555: Prisma Studio" -ForegroundColor Green
    Write-Host ""
    
    # Wait for user input
    Write-Host "Press any key to stop all services and exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    
} catch {
    Write-Host ""
    Write-Host "An error occurred: $_" -ForegroundColor Red
} finally {
    Write-Host ""
    Write-Host "Stopping all services..." -ForegroundColor Yellow
    
    # Stop all child processes
    $processes | ForEach-Object {
        if (!$_.HasExited) {
            $_.Kill()
            Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.Parent.Id -eq $_.Id } | Stop-Process -Force -ErrorAction SilentlyContinue
        }
    }
    
    # Clean up any remaining node processes from the services
    Write-Host "Cleaning up processes..." -ForegroundColor Yellow
    
    Write-Host ""
    Write-Host "All services stopped." -ForegroundColor Green
    Write-Host "Thanks for using NotesAI!" -ForegroundColor Cyan
}