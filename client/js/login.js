const baseUrl = 'http://localhost:8080/v1'
const form = document.forms.login

form.addEventListener('submit', e => {
  e.preventDefault()

  const email = e.target.elements.email.value.trim()
  const password = e.target.elements.password.value

  loginUser({ email, password })
})

const loginUser = async userData => {
  const res = await fetch(`${baseUrl}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  const data = await res.json()

  if (data.err) {
    return alert(data.err)
  }

  if (!data.token) {
    return alert(`Something went wrong, try again.`)
  }

  localStorage.setItem('token', data.token)
  location.replace('dashboard.html')
}
