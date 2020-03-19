// 3.8 Phonebook backend
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const loggerFormat = ':method :url :status :res[content-length] - :response-time ms :data'
app.use(express.json())
app.use(morgan(loggerFormat))
app.use(cors())
app.use(express.static('build'))

morgan.token('data', function(req, res) {
  if (req.method === "POST") return JSON.stringify(req.body)
  return ""
})

const Person = require('./models/person')
const PORT = process.env.PORT

// let persons = [
//     {
//     "name": "Arto Hellas",
//     "number": "040-123456",
//     "id": 1
//     },
//     {
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523",
//     "id": 2
//     },
//     {
//     "name": "Dan Abramov",
//     "number": "12-43-234345",
//     "id": 3
//     },
//     {
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122",
//     "id": 4
//     }
// ]

app.get('/info', (req, res) => {
    Person.countDocuments({}).then(sum => {
      res.write(`<p>Phonebook has info for ${sum} people </p>`)
      res.write(`<p>${new Date().toString()}</p>`)
      res.end()
    })
  })

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })  
  })

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
    .then(person => {
      person ? res.json(person.toJSON()) : res.status(404).end()
    })
    .catch(error => res.status(400).send({error: 'malformatted id'}))
})

app.post('/api/persons', (req, res) => {

  const body = req.body

  // const min = 0
  // const max = 10000
  //const id = Math.floor(Math.random() * max)

  if (!body.name) {
    return res.status(400).json({ 
      error: 'name is missing' 
    })
  }

  if (!body.number) {
    return res.status(400).json({ 
      error: 'number is missing' 
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => res.json(savedPerson.toJSON()))
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    Person.findByIdAndRemove(req.params.id)
    .then (result => res.status(204).end())
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, {new: true})
  .then(updatedNote => res.json(updatedNote.toJSON()))
  .catch(error => next(error))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})