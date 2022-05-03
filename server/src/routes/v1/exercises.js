const express = require('express')
const mysql = require('mysql2/promise')

const { mysqlConfig } = require('../../config')
const isLoggedIn = require('../../middleware/auth')

const router = express.Router()

// Get all exercises
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const connection = await mysql.createConnection(mysqlConfig)
    const [data] = await connection.execute(`SELECT * FROM exercises`)

    connection.end()

    return res.status(200).send(data)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ msg: 'Server issue.' })
  }
})

// Get exercise by title
router.get('/title/:title', isLoggedIn, async (req, res) => {
  try {
    const connection = await mysql.createConnection(mysqlConfig)
    const [data] = await connection.execute(`
    SELECT * 
    FROM exercises
    WHERE title = ${mysql.escape(req.params.title)}
    LIMIT 1
    `)

    connection.end()

    return res.status(200).send(data)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ msg: 'Server issue.' })
  }
})

module.exports = router
