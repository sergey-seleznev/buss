// 1. Download stops.xml from
// 2. Use https://www.freeformatter.com/xml-to-json-converter.html to convert XML to JSON
// 3. Save the converted text as stops.json
// 4. Run the script

// TODO:
// - on server:
//   - load stops data from XML and TXT
//   - group close-by stops by name (ie. not more than ~1km from each other)
const stops0 = [
  {
    name: 'Kivinuka',
    pos: [ [27.3132, 59.21323], [27.3132, 59.21323] ],
    ids: [ 68, 69 ]
  },
]
// - on client:
//   - refactor to search stops by all the locations
//   - use the ids (=siriId-s) to query the data
//   - enhance the stop objects with buses, limits etc.

const fs = require('fs')
const { exit } = require('process')

function loadStopsTxt() {
  const text = fs.readFileSync('./stops.txt').toString().replace(/^\uFEFF/, '')
  const rows = text.split('\n')
  const headers = rows[0].split(';')
  return rows.slice(1)
    .map(row => row.split(';')
      .reduce((res, val, i) => {
          res[headers[i]] = val
          return res
        }, {}))
    .map((s, i, stops) => ({
      id: s.ID,
      siriId: +s.SiriID,
      name: s.Name ?? stops[i - 1].Name,
      lat: +s.Lat / 100000,
      lon: +s.Lng / 100000,
    }))
}

function loadStopsXml() {
  // TODO load stops.xml, currently it is converted to JSON manually
  const stops = JSON.parse(fs.readFileSync('./stops.json'))
  return stops.map(s => ({
    id: s.id,
    id0: +s.id0,
    name: s.name,
    lat: +s.lat,
    lon: +s.lon,
  }))
}


try {  
  const stopsTxt = loadStopsTxt()
  const stopsTxtById = stopsTxt.reduce((res, s) => {
    res[s.id] = s
    return res
  })

  console.log(stopsTxtById)

  const stopsXml = loadStopsXml()

  const stops = stopsXml.map(s => ({
    id: s.id,
    siriId: stopsTxtById[s.id]?.siriId ?? s.id0 ?? null,
    name: s.name,
    lat: s.lat,
    lon: s.lon,
  }))

  fs.writeFileSync('../transport.json', JSON.stringify({
    updated: new Date().toISOString(),
    stops: stops
  }))
} catch (err) {
  console.error(err)
  exit(1)
}
