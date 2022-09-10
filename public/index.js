(async () => {
  async function getTransport() {
    let json = localStorage.getItem('transport')
    if (!json) {
      json = await queryTransport()
      localStorage.setItem('transport', json)
    }
    return JSON.parse(json)
  }

  async function queryTransport() {
    const response = await fetch('./transport.json')
    return await response.text()
  }

  async function getPosition() {
    return new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }), reject)
    )
  }

  function approxDistance(from, to) {
    return Math.sqrt(Math.pow(from.lat - to.lat, 2) + Math.pow(from.lon - to.lon, 2))
  }

  function isClose(from, to, maxDegreeDistance) {
    return (
      Math.abs(from.lat - to.lat) < maxDegreeDistance.lat &&
      Math.abs(from.lon - to.lon) < maxDegreeDistance.lon
    )
  }

  function compareDistance(from, to1, to2) {
    return approxDistance(from, to1) - approxDistance(from, to2)
  }

  function parseDate(number) {
    const d = new Date()
    d.setHours(0, 0, number)
    return d
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => { console.log('Service Worker Registered') })
  }

  const [transport, position] = await Promise.all([getTransport(), getPosition()])

  function degreeDistance(from, meters) {
    const lat = 180 / Math.PI * meters / 6378137
    const lon = lat / Math.cos(Math.PI / 180 * from.lat)
    return { lat, lon }
  }
  
  const maxDistance = 600 / 2

  const maxDegreeDistance = degreeDistance(position, maxDistance)

  const stops = transport.stops
    .filter(s => isClose(position, s, maxDegreeDistance))
    .sort(compareDistance.bind(this, position))
    .slice(0, 15) // single request stops limit

  const getStopName = Object.assign({}, ...stops.map(s => ({[s.siriId]: s.name})))
  const allStopNames = [...new Set(Object.values(getStopName))]

  const stopBuses = Object.assign({}, ...allStopNames.map(n => ({[n]: []})))

  const url = 'https://transport.tallinn.ee/siri-stop-departures.php?stopid=' + stops.map(s => s.siriId).join(',')
  const resp = await fetch(url)
  const text = await resp.text()
  
  for (const sm of text.matchAll(/stop,(\d+)\n(.+?)(?=(stop|$))/gs)) {
    const stopSiriId = +sm[1]
    for (const bm of sm[2].matchAll(/\w+,([\d\w]+),(\d+),(\d+),(.+?)(?=,),\d+,Z?/gs)) {
      // stops.find(s => s.siriId === stopSiriId)
      stopBuses[getStopName[stopSiriId]].push(({
        number: bm[1],
        stopSiriId: stopSiriId, 
        direction: bm[4],
        expected: parseDate(+bm[2]),
        scheduled: parseDate(+bm[3]),
      }))
    }
  }

  function compareBuses(bus1, bus2) {
    return bus1.expected - bus2.expected
  }

  Object.keys(stopBuses).forEach(name => {
    stopBuses[name].sort(compareBuses)
  })
  
  const data = Object.entries(stopBuses)
    .map(([name, buses]) => ({
      name: name,
      buses: buses,
      limit: 5,
    }))
  
  const template = document.getElementById('template').innerHTML
  const renderTemplate = Handlebars.compile(template)
  const time = Intl.DateTimeFormat('et', { hour: 'numeric', minute: '2-digit' })  

  Handlebars.registerHelper('slice', (array, limit) =>
    Array.isArray(array) ? array.slice(0, limit) : []
  )

  render(data)

  function splitNumber(number) {
    const match = number.match(/(\d+)(.+)?/)
    return {
      digits: match?.[1] ?? number,
      letters: match?.[2] ?? ''
    }
  }
  
  function render(stops) {
    const now = new Date()

    const data = stops
      .filter(stop => stop.buses.length > 0)
      .map(stop => ({
        name: stop.name,
        buses: stop.buses
          .map(bus => ({
            ...bus,
            wait: Math.floor((bus.expected - now) / 60_000),
            delay: Math.floor((bus.expected - bus.scheduled) / 60_000),
            time: time.format(bus.expected),
          }))
          .map(bus => ({
            ...bus,
            number: splitNumber(bus.number),
            wait: bus.wait > 0 ? `${bus.wait} min.` : 'now ',
            delay: bus.delay > 0 ? `+${bus.delay}` : bus.delay < 0 ? bus.delay : null,
          })),
        limit: stop.limit,
        more: stop.buses.length > stop.limit,
      }))
  
    document.getElementById('content').innerHTML = renderTemplate(data)
  }

  window.showMore = (index) => {
    data[index].limit += 5
    render(data)
  }

  document.addEventListener('visibilitychange', () => {
    console.log(`state`, document.visibilityState)
    if (document.visibilityState === 'visible') {
      // TODO start refreshing
      location.reload()
    } else {
      // TODO stop refreshing
    }
  })

})()
