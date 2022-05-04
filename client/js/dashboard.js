const baseUrl = 'http://localhost:8080/v1'
const token = localStorage.getItem('token')
const table = document.querySelector('tbody')
const greetUserSpan = document.getElementById('greet')
const logOut = document.getElementById('logout')

// Get all sets
const getData = async () => {
  const res = await fetch(`${baseUrl}/sets`, {
    headers: {
      authorization: `Bearer ${token}`
    }
  })
  const data = await res.json()
  // console.log(data)

  if (data.length === 0) {
    h3.innerHTML = `You have no sets. <a href="/client/exercises.html"> Go excercise!</a>`
  }

  displaySets(data)
}

getData()

// Greet user
greetUserSpan.textContent = localStorage.getItem('accountName')

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

// Logout
logOut.addEventListener('click', () => {
  localStorage.removeItem('accountName')
  localStorage.removeItem('token')
  localStorage.removeItem('exercise')
  location.replace('login.html')
})

// If no token found
if (!token) {
  console.log(token)
  location.replace('login.html')
}
