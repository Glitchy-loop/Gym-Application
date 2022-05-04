const baseUrl = 'http://localhost:8080/v1'
const token = localStorage.getItem('token')
const logOut = document.getElementById('logout')
const form = document.forms.addExercise
const addNewExerciseBtn = document.getElementById('addNewExerciseBtn')

let exercisesArray = []

// Get all exercises from database
const getExercises = async () => {
  const res = await fetch(`${baseUrl}/exercises/`, {
    headers: {
      authorization: `Bearer ${token}`
    }
  })
  const data = await res.json()
  console.log(data)
  if (data.length > 0) {
    displayExercises(data)

    const allExercisesDivs = document.querySelectorAll('.exercise')

    allExercisesDivs.forEach(div => {
      div.addEventListener('click', e => {
        const exerciseTitle = e.target.parentElement.children[0].textContent.trim()

        getExerciseByTitle(exerciseTitle)
      })
    })
  } else {
    alert(data.err || 'Server issue')
  }
}

// Get exercise by title
const getExerciseByTitle = async exerciseTitle => {
  const res = await fetch(`${baseUrl}/exercises/title/${exerciseTitle}`, {
    headers: {
      authorization: `Bearer ${token}`
    }
  })
  const data = await res.json()
  // console.log(data)
  if (data.length > 0) {
    localStorage.setItem('exercise', data[0].title)
    location.replace('sets.html')
  } else {
    alert(data.err || 'Server issue')
  }
}

getExercises()

// Display all exercises
const displayExercises = data => {
  const exercisesDiv = document.querySelector('.exercises')

  data.forEach(exercise => {
    const exerciseDiv = document.createElement('div')
    exerciseDiv.className = 'exercise'

    const img = document.createElement('img')
    img.src = exercise.img

    const title = document.createElement('div')
    title.className = 'exercise-title'
    title.textContent = exercise.title

    exerciseDiv.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(${exercise.img})`

    exerciseDiv.append(title)

    exercisesDiv.append(exerciseDiv)
  })
}

// Add new exercise Form
form.addEventListener('submit', e => {
  e.preventDefault()
  const title = e.target.elements.title.value.trim()
  const img = e.target.elements.img.value.trim()
  const description = e.target.elements.description.value.trim()

  addNewExercise({ title, img, description })
})

// Add new exercise to the database
const addNewExercise = async exerciseData => {
  const res = await fetch(`${baseUrl}/exercises/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify(exerciseData)
  })
  const data = await res.json()
  // console.log(data)
  if (data.msg === 'Exercise added succesfully.') {
    getExercises()
    form.classList.add('hide')
  } else {
    alert(data.err)
  }
}

// Toggle addExercise form
addNewExerciseBtn.addEventListener('click', () => {
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
