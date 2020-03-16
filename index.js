// 3.6 Phonebook
const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
    },
    {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
    },
    {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
    },
    {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
    }
]

app.get('/info', (req, res) => {
    const sum = persons.length
    res.write(`<p>Phonebook has info for ${sum} people </p>`)
    res.write(`<p>${new Date().toString()}</p>`)
    res.end()
  })

app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    person ? res.json(person) : res.status(404).end()    
})

app.post('/api/persons', (req, res) => {
  const min = 0
  const max = 10000

  const body = req.body
  const id = Math.floor(Math.random() * max)

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

  const person = {
    name: body.name,
    number: body.number,
    id: id
  }
  persons.concat(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons=persons.filter(person => person.id !== id)
    res.status(204).end()
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)