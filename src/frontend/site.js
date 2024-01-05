import config from './config'

document.addEventListener('onPosition', (e) => {
  const me = e.detail
  const sorted = config.sites.sort((s1, s2) =>
    approxDistance(me, s1.center) - approxDistance(me, s2.center)
  )

  document.dispatchEvent(new CustomEvent("onSite", { detail: sorted[0] }))
})

function approxDistance(from, to) {
  return Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2))
}

// TODO drop
const site = config.sites[0] // TODO find/filter by current location
export default site
