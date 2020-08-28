const express = require('express')
const router = new express.Router()
const task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async(req, res) => {
    const newda = new task({...req.body, owner: req.user._id })
    try {
        await newda.save()
        res.status(201).send(newda)
    } catch (error) {
        res.status(400).send(error)
    }

})

router.get('/tasks', auth, async(req, res) => {
    const match = {}
    const sort = {}


    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0].trim()] = parts[1].trim() === 'desc' ? -1 : 1
    }

    try {
        // const tasks = await task.find({ owner: req.user._id })
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }

})

router.get('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const tasks = await task.findOne({ _id, owner: req.user._id })
        if (!tasks) {
            return res.status(404).send('No user was found')
        }
        res.send(tasks)
    } catch (error) {
        res.status(500).send('an Error occured')
    }

})

router.patch('/tasks/:id', auth, async(req, res) => {
    const id = req.params.id
    const body = req.body
    const updates = Object.keys(body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperator = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperator) {
        return res.status(500).send('invalid updates')
    }
    try {
        const Updatedtsak = await task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!Updatedtsak) {
            return res.status(404).send('User Not found')
        }
        updates.forEach(element => Updatedtsak[element] = req.body[element])
        await Updatedtsak.save()
        res.send(Updatedtsak)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', auth, async(req, res) => {
    try {
        const delTask = await task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!delTask) {
            res.status(404).send('No Tasks found')
        }
        await delTask.remove()
        res.send(delTask)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router