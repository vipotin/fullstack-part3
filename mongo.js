// Test (3.12)

const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack20:${password}@cluster0-7czby.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })
  
const Person = mongoose.model('Person', personSchema)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

// Add new person if name and number information are given
if (process.argv.length === 5) {
      
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })
      
      person.save().then(response => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
      })
}

// Show phonebook data
if (process.argv.length === 3) {
    console.log('phonebook: ')
    Person.find({}).then(result => {
        result.forEach(person => console.log(`${person.name} ${person.number}`))
        mongoose.connection.close()
    })
}