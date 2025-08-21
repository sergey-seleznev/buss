import {Map, View} from 'ol'
import {Tile as TileLayer} from 'ol/layer'
import {XYZ} from 'ol/source'
import {useGeographic} from 'ol/proj'

import './map.css'
import onSite from '../position/position'

useGeographic();

const map = new Map({
  target: document.getElementById('map'),
  layers: [
    new TileLayer({
      source: new XYZ({
        url: `https://tile.thunderforest.com/transport/{z}/{x}/{y}@2x.png?apikey=${import.meta.env.VITE_THUNDERFOREST_API_KEY}`,
        tilePixelRatio: 2,
      }),
    }),
  ],
  controls: []
})

onSite(site => {
  map.setView(new View({
    center: site.center,
    zoom: site.zoom,
  }))
})

export default map
