import {Map, View} from 'ol'
import {Tile as TileLayer} from 'ol/layer'
import {XYZ} from 'ol/source'
import {useGeographic} from 'ol/proj'

import './map.css'
import site from './site'

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
  view: new View({
    center: site.center,
    zoom: site.zoom,
  }),
  controls: []
})

export default map
