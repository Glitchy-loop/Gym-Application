const express = require('express')
const Joi = require('joi')
const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')

const { mysqlConfig, jwtSecret } = require('../../config')
const validation = require('../../middleware/validation')

const router = express.Router()

const registrationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required(),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required(),
  password: Joi.string().required()
})

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required(),
  password: Joi.string().required()
})

// Register user

router.post('/register', validation(registrationSchema), async (req, res) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10)

    const connection = await mysql.createConnection(mysqlConfig)
    const [data] = await connection.execute(`
      INSERT INTO users (name, email, password)
      VALUES (${mysql.escape(req.body.name)}, ${mysql.escape(
      req.body.email
    )}, '${hash}')
    `)
    await connection.end()

    if (!data.insertId || data.affectedRows !== 1) {
      console.log(data)
      return res.status(500).send({ err: 'Server issue...' })
    }

    return res.send({
      msg: 'Successfully created account',
      accountId: data.insertId
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: 'Server issue...' })
  }
})

// Login user

router.post('/login', validation(loginSchema), async (req, res) => {
  try {
    const connection = await mysql.createConnection(mysqlConfig)
    const [data] = await connection.execute(`
    SELECT id, email, password
    FROM users
    WHERE email = ${mysql.escape(req.body.email)}
    LIMIT 1
    `)
    await connection.end()

    if (data.length === 0) {
      return res.status(400).send({ msg: 'User not found.' })
    }

    if (!bcrypt.compareSync(req.body.password, data[0].password)) {
      return res.status(400).send({ msg: 'Incorrect password.' })
    }

    const token = jsonwebtoken.sign({ accountId: data[0].id }, jwtSecret)

    res.status(200).send({ msg: 'User successfully logged in', token })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: 'Server issue...' })
  }
})

module.exports = router
