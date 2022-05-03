const baseUrl = 'http://localhost:8080/v1'
const token = localStorage.getItem('token')

// Get all exercises from database
const getExercises = async () => {
  const res = await fetch(`${baseUrl}/exercises/`, {
    headers: {
      authorization: `Bearer ${token}`
    }
  })
  const data = await res.json()
  console.log(data)
  displayExercises(data)

  const allExercisesDivs = document.querySelectorAll('.exercise')

  allExercisesDivs.forEach(div => {
    div.addEventListener('click', e => {
      const exerciseTitle = e.target.parentElement.children[0].textContent.trim()

      getExerciseByTitle(exerciseTitle)
    })
  })
}

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
    localStorage.setItem('exercise', data[0].title)
    location.replace('sets.html')
  }
}

getExercises()

// Display all exercises
const displayExercises = data => {
  const exercisesDiv = document.querySelector('.exercises')
  exercisesDiv.innerHTML = ''

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

    exercisesDiv.append(exerciseDiv)
  })
}
