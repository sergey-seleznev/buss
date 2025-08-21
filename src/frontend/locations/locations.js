import {Feature} from 'ol'
import {Point} from 'ol/geom'
import {Vector as VectorLayer} from 'ol/layer'
import {Vector as VectorSource} from 'ol/source'
import {Icon, Style} from 'ol/style'

import arrowIcon from './arrow.svg'

import config from '../config/config'
import query from '../query'
import map from '../map/map'
import onSite from '../position/position'

const source = new VectorSource({ features: [] })
const features = {}

map.addLayer(new VectorLayer({
  source: source,
  style: (feature) => new Style({
    image: new Icon({
      src: arrowIcon,
      scale: 0.04,
      color: config.colors[feature.values_.route] ?? 'black',
      rotation: feature.values_.rotation,
    }),
  }),
}))

async function getLocations(site) {
  return query('locations', site.stops
    .map(s => s.transports.map(t => ({ type: t.type, route: t.route }))).flat() // select all transports
    .filter((t, i, a) => i === a.findIndex((_t) => (_t.type === t.type && t.route === _t.route))) // deduplicate
  )
}

function renderLocations(locations) {
  locations.forEach(l => {
    let feature = features[l.id]
    if (!feature) {
      feature = new Feature({type: 'marker', route: l.route})
      source.addFeature(features[l.id] = feature)
    }

    feature.setGeometry(new Point(l.loc))
    feature.setProperties({ rotation: l.head * Math.PI / 180 })
  })
}

async function updateLocations(site) {
  const locations = await getLocations(site)
  renderLocations(locations)
  setTimeout(() => updateLocations(), 3000)
}

onSite(site => {
  updateLocations(site)
})
