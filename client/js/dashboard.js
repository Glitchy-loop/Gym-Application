const baseUrl = 'http://localhost:8080/v1'
const token = localStorage.getItem('token')
const table = document.querySelector('tbody')

// Get all sets
const getData = async () => {
  const res = await fetch(`${baseUrl}/sets`, {
    headers: {
      authorization: `Bearer ${token}`
    }
  })
  const data = await res.json()
  console.log(data)

  displaySets(data)
}

getData()

// Display all sets on the page
const displaySets = async data => {
  table.innerHTML = ''

  data.forEach(set => {
    const tr = table.insertRow()
    const td = tr.insertCell()
    td.textContent = set.date.replace('T', ' ').replace('.000Z', '')

    const td1 = tr.insertCell()
    td1.textContent = set.exercise_title

    const td2 = tr.insertCell()
    td2.textContent = set.reps

    const td3 = tr.insertCell()
    td3.textContent = set.duration
  })
}
