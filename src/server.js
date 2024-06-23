import Fastify from 'fastify'
import router from './router.js'
import fastifyHelmet from '@fastify/helmet'
import fastifyStatic from '@fastify/static'
import { fileURLToPath } from 'url'
import path from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const server = Fastify({
  logger: true,
  bodyLimit: 10 * 1024 * 1024 // 10 MB
})

server.register(fastifyStatic, {
  root: path.join(__dirname, './public'),
  prefix: '/' // optional: default '/'
})

server.get('/', (request, reply) => {
  reply.header(
    'Content-Security-Policy',
    "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';"
  )

  reply.sendFile('index.html')
})

server.register(fastifyHelmet)
server.register(router)

export default server
