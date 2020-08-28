const mongoose = require('mongoose')
const validator = require('validator')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../db/mongoose')
const Task = require('../models/task')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw Error('Seriously you cannot be alive!')
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error('Please provide a valid Email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        min: [6, 'The lenght of the password must be more than 6'],
        validate(value) {
            if (value.includes('password')) {
                throw Error('Your password should not contain the word "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
})

userSchema.methods.jsontokens = async function() {
    const user = this
    const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('No User with the Given Email')
    }
    const isMatch = await bycrypt.compare(password, user.password).then((e) => e).catch((e) => e)

    if (!isMatch) {
        throw new Error('wrong password please')
    }

    return user
}

userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bycrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('remove', async function(next) {
    const user = this
    task = await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User