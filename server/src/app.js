const express = require('express')
const cors = require('cors')
const UserRoutes = require('./routes/v1/users')
const SetsRoutes = require('./routes/v1/sets')
const ExercisesRoutes = require('./routes/v1/exercises')

const { serverPort } = require('./config')

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send({ msg: `Server is running` })
})

app.use('/v1/users', UserRoutes)
app.use('/v1/sets', SetsRoutes)
app.use('/v1/exercises', ExercisesRoutes)

app.all('*', (req, res) => {
  res.status(404).send('Page not found...')
})

app.listen(serverPort, () =>
  console.log(`Server is running on port ${serverPort}...`)
)
