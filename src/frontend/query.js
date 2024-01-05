const backendUrl = '/api'

async function query(path, request) {
  const res = await fetch(`${backendUrl}/${path}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request),
  })
  return res.json()
}

export default query
