const express = require('express')
const router = new express.Router()
const user = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { findById } = require('../models/user')
const { sendEmail, sendCancelEmail } = require('../emails/mailgun')


router.post('/users', async(req, res) => {

    const newda = new user(req.body)
    try {
        await newda.save()
        sendEmail(newda.email, newda.name)
        const token = await newda.jsontokens()
        res.status(201).send({ newda, token })
    } catch (error) {
        res.send(error)
    }
    // newda.save().then((result) => res.send(result)).catch((e) => {
    //     res.status(400)
    //     res.send(e)
    // })

})

router.post('/users/login', async(req, res) => {
    try {
        const users = await user.findByCredentials(req.body.email, req.body.password)
        const token = await users.jsontokens()
        res.send({ users, token })
    } catch (e) {
        console.log('Eroor: ', e)
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async(req, res) => {
    try {
        console.log('excuting')
        req.user.tokens = req.user.tokens.filter((token) => { return token.token !== req.token })

        await req.user.save()
        res.send('Log Out successful')
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send
    }
})

router.get('/users/me', auth, async(req, res) => {

    res.send(req.user)
})

// router.get('/users/:id', async(req, res) => {
//     const id = req.params.id
//     try {
//         const users = await user.findById(id)
//         if (!users) {
//             return res.status(404).send('user not found')
//         }
//         res.send(users)

//     } catch (error) {
//         res.status(500).send(error)
//     }

// })

router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperator = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperator) {
        return res.status(400).send("Error invalid updates")
    }

    try {
        // const users = await user.findById(req.params.id)
        // if (!users) {
        //     return res.status(404).send()
        // }
        updates.forEach(element => req.user[element] = req.body[element])
        await req.user.save()
            // const users = await user.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
        console.log(e)
    }
})
router.delete('/users/me', auth, async(req, res) => {
    try {
        await req.user.remove()
        sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('File must be file must be an image'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        req.user.avatar = buffer
        await req.user.save()
        res.send('upload successful')
    } catch (error) {
        res.send(error)
    }

}, (err, req, res, next) => {
    res.send({ error: err.message })
})

router.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async(req, res) => {

    try {
        const users = await user.findById(req.params.id)
        if (!users || !users.avatar) {
            throw new Error()
        }

        res.set('content-Type', 'image/png'),
            res.send(users.avatar)
    } catch (error) {
        res.send(error)
    }

})

module.exports = router