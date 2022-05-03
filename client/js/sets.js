const baseUrl = 'http://localhost:8080/v1'
const token = localStorage.getItem('token')

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
  })
}
