const mongoose = require('mongoose')
const validator = require('validator')
mongoose.connect(process.env.MONGO_DB_URL, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })




// const me = User({
//     name: 'ikeda',
//     age: 25,
//     email: 'ikea@hotmail.com',
//     password: 'erant456'
// })

// me.save().then(() => console.log(me)).catch((error) => console.log(error))

// const task = mongoose.model('tasks', {
//     description: {
//         type: String,
//         trim: true,
//         required: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// task({
//     description: 'sleep for us                        ',

// }).save().then((result) => console.log(result)).catch((error) => console.log(error))