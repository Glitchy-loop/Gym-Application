const baseUrl = 'http://localhost:8080/v1'
const token = localStorage.getItem('token')
const form = document.forms.addSet
const logOut = document.getElementById('logout')
const addNewSetBtn = document.getElementById('addNewSetBtn')

let exercise_title

// Get exercise by title
const getExerciseByTitle = async exerciseTitle => {
  const res = await fetch(`${baseUrl}/exercises/title/${exerciseTitle}`, {
    headers: {
      authorization: `Bearer ${token}`
    }
  })
  const data = await res.json()
  console.log(data)
  if (data.length > 0) {
    displayExercise(data)
  }
}

getExerciseByTitle(localStorage.getItem('exercise'))

// Display all exercises
const displayExercise = data => {
  const container = document.querySelector('.container')

  data.forEach(exercise => {
    const exerciseDiv = document.createElement('div')
    exerciseDiv.className = 'exercise-set'

    const image = document.createElement('img')
    image.src = exercise.img

    const title = document.createElement('div')
    title.className = 'exercise-set-title'
    title.textContent = exercise.title

    const description = document.createElement('div')
    description.className = 'exercise-set-description'
    description.textContent = exercise.description

    exerciseDiv.append(image, title, description)

    container.append(exerciseDiv)

    exercise_title = exercise.title
  })
  console.log(exercise_title)
}

// Collect set data in form
form.addEventListener('submit', e => {
  e.preventDefault()
  const weight = e.target.elements.weight.value.trim()
  const reps = e.target.elements.reps.value.trim()
  const duration = e.target.elements.duration.value.trim()

  postSet({ weight, reps, duration, exercise_title })
})

// Post set
const postSet = async setData => {
  const res = await fetch(`${baseUrl}/sets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify(setData)
  })
  const data = await res.json()
  // console.log(data)

  if (!token) {
    console.log(token)
    location.replace('login.html')
  }

  if (data.err) {
    return alert(data.err)
  }

  if (data.msg === `Successfully added a set`) {
    return location.replace('dashboard.html')
  }
}

// Toggle addSet form visibility
addNewSetBtn.addEventListener('click', () => {
  form.classList.toggle('hide')
})

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
