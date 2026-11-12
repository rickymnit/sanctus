import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createReadStream, existsSync } from 'node:fs'
import path from 'node:path'

// In development, run the Vercel functions in /api inside the Vite server and
// serve locally uploaded images from .data/uploads, so the admin panel works
// without the Vercel CLI. In production Vercel runs /api itself.
function localApi() {
  const TYPES = { webp: 'image/webp', jpg: 'image/jpeg', png: 'image/png', avif: 'image/avif' }
  return {
    name: 'sanctus-local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost')

        if (url.pathname.startsWith('/uploads/')) {
          const file = path.resolve('.data', '.' + path.posix.normalize(url.pathname))
          if (!file.startsWith(path.resolve('.data', 'uploads')) || !existsSync(file)) return next()
          res.setHeader('Content-Type', TYPES[path.extname(file).slice(1)] || 'application/octet-stream')
          return createReadStream(file).pipe(res)
        }

        const m = url.pathname.match(/^\/api\/([a-z-]+)\/?$/)
        if (!m) return next()
        const file = path.resolve('api', `${m[1]}.js`)
        if (!existsSync(file)) return next()
        try {
          const mod = await server.ssrLoadModule(file)
          await mod.default(req, res)
        } catch (err) {
          console.error(err)
          if (!res.headersSent) res.statusCode = 500
          res.end(JSON.stringify({ error: 'Dev API error: ' + err.message }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Expose ADMIN_* / SESSION_SECRET / BLOB_* from .env.local to the dev API.
  const env = loadEnv(mode, process.cwd(), '')
  for (const k of ['ADMIN_USERNAME', 'ADMIN_PASSWORD', 'SESSION_SECRET', 'BLOB_READ_WRITE_TOKEN']) {
    if (env[k] && !process.env[k]) process.env[k] = env[k]
  }
  return {
    plugins: [react(), localApi()],
    build: {
      rollupOptions: {
        output: {
          // Keep the admin panel out of the public site's main bundle.
          manualChunks: (id) => (id.includes('/src/admin/') ? 'admin' : undefined),
        },
      },
    },
  }
})
