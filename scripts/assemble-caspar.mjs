#!/usr/bin/env node
/**
 * Reorganise vue-cli dist/ into CasparCG deploy folders:
 *
 *   deploy/template-path/gfx/<name>.html  (+ shared js/css/img at template-path root)
 *   deploy/media-path/{loops,clips,wipes,assets}/
 *
 * Sofie blueprints reference templates as gfx/<name> (e.g. gfx/l3d).
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const vueDist = path.join(root, 'dist')
const deployRoot = path.join(root, 'deploy')
const templateRoot = path.join(deployRoot, 'template-path')
const mediaRoot = path.join(deployRoot, 'media-path')

const pages = [
  'headline',
  'l3d-headline',
  'l3d-mod',
  'l3d-tema',
  'l3d-syn',
  'l3d-sjv',
  'l3d-sport',
  'weather',
  'outro',
  'logo-bug'
]

function findPageHtml (page) {
  const nested = path.join(vueDist, page, 'index.html')
  if (fs.existsSync(nested)) return nested
  const flat = path.join(vueDist, `${page}.html`)
  if (fs.existsSync(flat)) return flat
  return null
}

function rmrf (dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

function copyDir (src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name)
    const d = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(s, d)
    } else {
      fs.copyFileSync(s, d)
    }
  }
}

function rewriteAssetPaths (html, assetPrefix = '../') {
  return html.replace(
    /(?<![\w-])(href|src)=(["']?)((?:\.\.\/)?(?:css|js|img|assets|icons)\/[^"' >]+|favicon\.ico)/gi,
    (match, attr, quote, url) => {
      if (url.startsWith('../')) return match
      return `${attr}=${quote}${assetPrefix}${url}`
    }
  )
}

function ensureMediaScaffold () {
  const dirs = ['loops', 'clips', 'wipes', 'assets']
  for (const dir of dirs) {
    const p = path.join(mediaRoot, dir)
    fs.mkdirSync(p, { recursive: true })
    const readme = path.join(p, 'README.md')
    if (!fs.existsSync(readme)) {
      fs.writeFileSync(readme, `# ${dir}\n\nPlace CasparCG media files here. See repo README.\n`)
    }
  }
}

function main () {
  if (!fs.existsSync(vueDist)) {
    console.error('dist/ not found — run yarn build:vue first')
    process.exit(1)
  }

  rmrf(deployRoot)
  fs.mkdirSync(templateRoot, { recursive: true })

  for (const dir of ['js', 'css', 'img', 'assets', 'icons']) {
    const src = path.join(vueDist, dir)
    if (fs.existsSync(src)) {
      copyDir(src, path.join(templateRoot, dir))
    }
  }

  const favicon = path.join(vueDist, 'favicon.ico')
  if (fs.existsSync(favicon)) {
    fs.copyFileSync(favicon, path.join(templateRoot, 'favicon.ico'))
  }

  for (const page of pages) {
    const srcHtml = findPageHtml(page)
    if (!srcHtml) {
      console.warn(`skip: ${page} HTML not in dist/`)
      continue
    }

    const gfxDir = path.join(templateRoot, 'gfx')
    fs.mkdirSync(gfxDir, { recursive: true })

    const html = fs.readFileSync(srcHtml, 'utf8')
    fs.writeFileSync(path.join(gfxDir, `${page}.html`), rewriteAssetPaths(html))
  }

  ensureMediaScaffold()

  console.log(`Caspar deploy written to ${deployRoot}`)
  console.log('  template-path → Caspar <template-path>')
  console.log('  media-path    → Caspar <media-path>')
}

main()
