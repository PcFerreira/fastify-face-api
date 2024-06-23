import 'dotenv/config'
import server from './server.js'

const start = async () => {
  try {
    server.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()
