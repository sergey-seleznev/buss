import path, {dirname} from 'path'
import {fileURLToPath} from 'url'
import {spawn} from 'child_process'
import Fastify from 'fastify'
import fastifySensible from '@fastify/sensible'
import fastifyStatic from '@fastify/static'

process.env.TZ = 'Europe/Tallinn' // for parsing dates

const port = process.env.PORT ?? '8124'
const frontend_path = process.env.FRONTEND_PATH ?? './frontend/dist'

const fastify = Fastify()
await fastify.register(fastifySensible)
await fastify.register(fastifyStatic, {
  root: path.join(dirname(fileURLToPath(import.meta.url)), frontend_path)
})

fastify.post('/api/locations', async (req, reply) => {
  const text = await curl('https://transport.tallinn.ee/gps.txt?' + Date.now())
  reply.send(
    Array.from(text.matchAll(/(\d+),(.+),(\d+),(\d+),,(\d+),(\d+),.+/g))
      .map(m => ({
        id: +m[6],
        type: {1: 'troll', 2: 'bus', 3: 'tram'}[+m[1]],
        route: m[2],
        loc: [m[3] / 1000000, m[4] / 1000000],
        head: +m[5],
      }))
      .filter(l => req.body.some(t => t.type === l.type && t.route === l.route))
  )  
})

fastify.post('/api/departures', async (req, reply) => {
  const q = req.body

  const stopIds = [...new Set(q.map(i => i.stop))]
  const text = await curl('https://transport.tallinn.ee/siri-stop-departures.php?stopid=' + stopIds.join(','))

  const counts = {}

  reply.send(
    Array.from(text.matchAll(/stop,(\d+)\n(.+?)(?=(stop|$))/gs))
      .map(stop =>
        Array.from(stop[2].matchAll(/(\w+),([\d\w]+),(\d+),(\d+),(.+?)(?=,),\d+,Z?/gs))
          .map(departure => ({
            stop: +stop[1],
            type: departure[1],
            route: departure[2],
            expected: date(+departure[3]),
            scheduled: date(+departure[4]),
          }))
      )
      .flat()
      .filter(d => q.some(i => i.stop === d.stop && i.type === d.type && i.route === d.route))
      .sort((d1, d2) => d1.expected - d2.expected)
      .filter(d => {
        // do not return more than two upcoming departures
        const key = `${d.stop}-${d.type}-${d.route}`
        const count = counts[key] = (counts[key] ?? 0) + 1
        return count <= 2
      })
      .map(d => ({
        ...d,
        expected: formatDate(d.expected),
        scheduled: formatDate(d.scheduled),
      }))
  )
})

fastify.listen({port, host: '0.0.0.0'}, (err, address) => console.log(err ?? `Listening on ${address}`))

function date(hours) {
  const d = new Date()
  d.setHours(0, 0, hours)
  return d
}

function formatDate(d) {
  return d.toISOString().split('.')[0]+"Z" // trim milliseconds
}

function curl(url) {
  return new Promise((resolve, reject) => {
    const response = []
    const proc = spawn('curl', [url])
    proc.stdout.setEncoding('utf8')
    proc.stdout.on('data', data => response.push(data.toString()))
    proc.on('close', code => code === 0 ? resolve(response.join()) : reject(code))
  })
}
