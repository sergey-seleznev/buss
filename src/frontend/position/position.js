import {Feature} from 'ol';
import {Point} from 'ol/geom'
import {Vector as VectorLayer} from 'ol/layer'
import {Vector as VectorSource} from 'ol/source'
import {Circle as CircleStyle, Fill, Style} from 'ol/style'

import map from '../map/map'

let feature

map.addLayer(new VectorLayer({
  source: new VectorSource({
    features: [
      feature = new Feature({
        type: 'marker',
        geometry: undefined,
      })
    ],
  }),
  style: new Style({
    image: new CircleStyle({
      radius: 30,
      fill: new Fill({color: '#00000016'}),
    }),
  })
}))

async function getPosition() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        resolve([pos.coords.longitude, pos.coords.latitude])
      }, (err) => reject(err.message ?? err))
    } else {
      reject('geolocation api not supported')
    }
  })
}

function renderPosition(location) {
  feature.setGeometry(new Point(location))
}

async function updatePosition() {
  try {
    const pos = await getPosition()
    console.log('geolocation:', pos)
    renderPosition(pos)
    setTimeout(() => updatePosition(), 15000)
  } catch (e) {
    console.log(`can't render position: ${e}`)
  }
}

updatePosition()
