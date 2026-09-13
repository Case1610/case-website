import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

/**
 * 開発サーバでも `/api/*` が応えるようにする。
 *
 * 本番ではここは Worker が R2 から返している（層2）。`vite dev` には Worker が
 * 無いので、開発中だけ同じ道を通す。
 *
 * 1. `dev-data/` に同じ名前のファイルがあればそれを返す（手元で中身を変えて試せる）
 * 2. 無ければ本番の Worker へ取りに行く（層2 は公開されているので、そのまま読める）
 *
 * 手元にコピーを常備しない形にしてあるのは、契約（schema.json）の写しを
 * こちら側に置きたくないため。写しを置いた瞬間、それが古くなる番が始まる。
 */
const DEV_DATA_DIR = 'dev-data'
const UPSTREAM = 'https://showcase.1610-case.workers.dev'

const layer2Dev = (): Plugin => ({
  name: 'layer2-dev',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = req.url?.split('?')[0]
      if (!url?.startsWith('/api/')) return next()

      const name = path.basename(url)
      const local = path.join(DEV_DATA_DIR, name)

      if (fs.existsSync(local)) {
        res.setHeader('content-type', 'application/json')
        res.end(fs.readFileSync(local))
        return
      }

      try {
        const upstream = await fetch(`${UPSTREAM}${url}`)
        res.statusCode = upstream.status
        res.setHeader('content-type', upstream.headers.get('content-type') ?? 'application/json')
        res.end(Buffer.from(await upstream.arrayBuffer()))
      } catch (error) {
        // 失敗を静かに握らない。開発中に「なぜか空」が一番わからない
        res.statusCode = 503
        res.setHeader('content-type', 'application/json')
        res.end(JSON.stringify({
          error: `${url} を用意できませんでした。${DEV_DATA_DIR}/${name} を置くか、ネットワークを確認してください。`,
          detail: error instanceof Error ? error.message : String(error),
        }))
      }
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), layer2Dev()],
})
