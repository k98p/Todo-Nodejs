const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')

app.use(express.json())

const users = []

app.get('/data/users', (req,res)=>{
    res.json(users)
})

app.post('/data/users', async (req,res)=>{
    try{
        const salt = await bcrypt.genSalt()
        const hashedpassword = await bcrypt.hash(req.body.password,salt)
        console.log(salt)
        console.log(hashedpassword)
        const user = {
            name: req.body.name,
            password: hashedpassword
        }
        users.push(user)
        res.status(200).send()
    }
    catch{
        res.status(500).send()
    }
})

app.post('/data/users/login', async (req,res)=>{
    console.log(req.body)
    const user = users.find((user)=>{
        return user.name === req.body.name
    })
    console.log(user)
    if (user===null){
        return res.status(400).send()
    }
    try{
        if ( /*await*/ bcrypt.compare(user.password, req.body.password)){
            res.send('Success')
        }
        else{
            res.send('Failure')
        }
    }
    catch{
        res.status(500).send()
    }
})

app.listen(3000)