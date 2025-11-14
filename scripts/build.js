/* eslint-disable no-console */
import { execSync } from 'node:child_process'
import { existsSync, renameSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

// Define paths
const distDir = join(process.cwd(), 'dist')
const dtsMtsPath = join(distDir, 'index.d.mts')
const dtsTsPath = join(distDir, 'index.d.ts')

try {
  console.log('🚀 Starting build...')

  // Run tsdown build command
  execSync('tsdown', {
    stdio: 'inherit'
  })

  // Rename index.d.mts → index.d.ts
  if (existsSync(dtsMtsPath)) {
    renameSync(dtsMtsPath, dtsTsPath)
    console.log('🔁 Renamed index.d.mts → index.d.ts')
  } else {
    console.log('ℹ️  dist/index.d.mts not found')
  }

  console.log('🎉 Build process completed')
} catch (error) {
  console.error('❌ Build failed:', error)
  process.exit(1)
}
