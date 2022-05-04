const baseUrl = 'http://localhost:8080/v1'
const token = localStorage.getItem('token')
const form = document.forms.addSet
let exercise_title

// Get exercise
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
    exerciseDiv.className = 'exercise'

    const title = document.createElement('div')
    title.className = 'exercise-title'
    title.textContent = exercise.title

    const description = document.createElement('div')
    description.className = 'exercise-description'
    description.textContent = exercise.description

    exerciseDiv.append(title, description)

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

  if (data.err) {
    return alert(data.err)
  }

  if (data.msg === `Successfully added a set`) {
    return location.replace('dashboard.html')
  }
}
