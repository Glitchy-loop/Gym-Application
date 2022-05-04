const express = require('express')
const mysql = require('mysql2/promise')
const Joi = require('joi')

const isLoggedIn = require('../../middleware/auth')
const validation = require('../../middleware/validation')
const { mysqlConfig } = require('../../config')

const router = express.Router()

const setSchema = Joi.object({
  weight: Joi.number().required(),
  reps: Joi.number().required(),
  duration: Joi.string().required(),
  exercise_title: Joi.string().required()
})

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const connection = await mysql.createConnection(mysqlConfig)
    const [data] = await connection.execute(
      `SELECT * FROM sets WHERE user_id = ${req.user.accountId}`
    )
    await connection.end()

    return res.send(data)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ err: 'Server issue occurred. Please try again later.' })
  }
})

router.post('/', isLoggedIn, validation(setSchema), async (req, res) => {
  try {
    const connection = await mysql.createConnection(mysqlConfig)
    const [data] = await connection.execute(`
          INSERT INTO sets (user_id, exercise_title, weight, reps, duration)
          VALUES (${mysql.escape(req.user.accountId)}, ${mysql.escape(
      req.body.exercise_title
    )},
          ${mysql.escape(req.body.weight)}, ${mysql.escape(
      req.body.reps
    )}, ${mysql.escape(req.body.duration)}) 
      `)
    await connection.end()

    if (!data.insertId) {
      return res.status(500).send({ err: 'Please try again' })
    }
    return res.send({ msg: 'Successfully added a set' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ err: 'Server issue occurred. Please try again later.' })
  }
})

module.exports = router
