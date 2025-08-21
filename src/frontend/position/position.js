import {Feature} from 'ol';
import {Point} from 'ol/geom'
import {Vector as VectorLayer} from 'ol/layer'
import {Vector as VectorSource} from 'ol/source'
import {Circle as CircleStyle, Fill, Style} from 'ol/style'

import config from '../config/config'
import map from '../map/map'

let feature
let site

function createLayer() {
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
}

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

function updateSite(me) {
  const nearest = config.sites.sort((s1, s2) =>
    approxDistance(me, s1.center) - approxDistance(me, s2.center)
  )[0]
  if (site !== nearest) {
    document.dispatchEvent(new CustomEvent("onSite", {detail: site = nearest}))
  }
}

function approxDistance(from, to) {
  return Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2))
}

async function updatePosition() {
  try {
    const pos = await getPosition()
    console.log('geolocation:', pos)
    updateSite(pos)
    renderPosition(pos)
    setTimeout(() => updatePosition(), 15000)
  } catch (e) {
    console.log(`can't render position: ${e}`)
  }
}

updatePosition()

function onSite(handler) {
  document.addEventListener("onSite", evt => handler(evt.detail))
}

onSite(() => {
  createLayer()
})

export default onSite
