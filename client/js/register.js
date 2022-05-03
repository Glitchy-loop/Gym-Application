const baseUrl = 'http://localhost:8080/v1'
const form = document.forms.register

form.addEventListener('submit', e => {
  e.preventDefault()

  const name = e.target.elements.name.value.trim()
  const email = e.target.elements.email.value.trim()
  const password = e.target.elements.password.value

  registerUser({ name, email, password })
})

const registerUser = async userData => {
  const res = await fetch(`${baseUrl}/users/register`, {
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
  location.replace('login.html')
}
