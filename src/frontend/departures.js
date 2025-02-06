import query from './query'
import site from './site'

import departuresTemplate from './departures.hbs?raw'

import './departures.css'

const renderTemplate = Handlebars.compile(departuresTemplate)

Handlebars.registerHelper('time', function (t) {
  const d = new Date(t)
  return d.getHours() + ':' + d.getMinutes().toString().padStart(2, '0')
})

Handlebars.registerHelper('until', function (t) {
  const res = Math.floor((new Date(t) - new Date())/1000/60)
  return res <= 0 ? 'now' : (res + ' min.')
})

async function getDepartures(site) {
  return query('departures', site.stops
    .map(s => s.transports.map(t =>
      ({stop: s.id, type: t.type, route: t.route})
    ))
    .flat()
  )
}

function renderDepartures(departures) {
  const data = departures.map(d => {
    const stop = site.stops.find(s => s.id === d.stop)
    const transport = stop.transports.find(t => t.type === d.type && t.route === d.route)
    return {
      stop: stop.name,
      route: d.route,
      direction: transport.direction,
      expected: d.expected,
    }
  })

  const container = document.getElementById('departures-container')
  container.innerHTML = renderTemplate(data)
}

async function updateDepartures() {
  const departures = await getDepartures(site)
  renderDepartures(departures)
  setTimeout(() => updateDepartures(), 15000)
}

updateDepartures()
