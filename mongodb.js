const { MongoClient, ObjectID } = require('mongodb')

const mongoUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log(error)
    }
    const db = client.db(databaseName)
        // db.collection('Users').insertOne({
        //     name: "ikeda",
        //     age: 25
        // })

    // db.collection('tasks').insertMany([{
    //         description: 'master Nodejs',
    //         completed: false
    //     },
    //     {
    //         description: 'Design flyer',
    //         completed: false,

    //     },
    //     {
    //         description: 'sleep',
    //         completed: true
    //     }

    // ], (error, result) => {
    //     if (error) {
    //         return console.log(error)
    //     }
    //     console.log(result.ops)
    // })


    // db.collection('tasks').findOne({ _id: ObjectID("5f292093e8d5ab427cb2f3a0") }, (error, user) => {
    //     if (error) {
    //         return console.log(error)
    //     }
    //     console.log(user)
    // })

    // db.collection('tasks').find({ completed: false }).toArray((error, results) => {
    //     if (error) {
    //         return console.log(error)
    //     }
    //     console.log(results)
    // })

    // db.collection('tasks').updateMany({ completed: false }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    db.collection('tasks')
        .deleteOne({ description: "sleep" })
        .then((result) => console.log(result))
        .catch((error) => console.log(error))
})