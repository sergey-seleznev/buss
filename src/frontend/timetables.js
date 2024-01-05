import {Overlay} from 'ol';

import config from './config'
import site from './site'
import query from './query'
import map from './map'

import timetableTemplate from './timetable.hbs?raw'

import './timetables.css'

const stops = site.stops.reduce((res, stop) => {
  res[stop.id] = stop
  return res
}, {})

const renderTemplate = Handlebars.compile(timetableTemplate)

const timetables = {}

function createTimetables() {
  site.stops.forEach(stop => {
    const div = timetables[stop.id] = document.createElement('div')
    div.id = `timetable-${stop.id}`
    div.className = "timetable"
    map.addOverlay(new Overlay({
      element: div,
      position: stop.timetable.position,
      positioning: stop.timetable.positioning,
      offset: stop.timetable.offset,
    }))
  })
}

async function getDepartures(site) {
  return query('departures', site.stops
    .map(s => s.transports.map(t =>
      ({stop: s.id, type: t.type, route: t.route})
    ))
    .flat()
  )
}

function renderTimetables(departures) {
  const data = departures.reduce((res, d) => {
    (res[d.stop] = res[d.stop] ?? []).push({
      time: d.expected,
      minutes: minutesTo(d.expected),
      route: d.route.replace('A', 'ᵃ'),
      color: config.colors[d.route] + '66'
    })
    return res;
  }, {})
  Object.entries(data).forEach(([stop, departures]) => {
    const columns = chunk(departures, stops[stop].timetable.height)
    timetables[stop].innerHTML = renderTemplate(columns)
  })
}

function chunk(array, size) {
  if (!size) {
    return [array]
  }
  const res = []
  while (array.length > 0) {
    res.push(array.splice(0, size))
  }
  return res
}

function minutesTo(date) {
  const res = Math.floor((new Date(date) - new Date())/1000/60)
  return res <= 0 ? 0 : res
}

async function updateTimetables() {
  const departures = await getDepartures(site)
  renderTimetables(departures)
  setTimeout(() => updateTimetables(), 15000)
}

createTimetables()
updateTimetables()
