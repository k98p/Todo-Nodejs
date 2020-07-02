const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const env = require('dotenv').config()

var cors = require('cors')
var jwt = require('jsonwebtoken')

var fs = require('fs')
var _ = require('lodash')
var engines = require('consolidate')
var bodyParser = require('body-parser');

app.use(express.json())
app.set('views', './views')
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors());

const User = require('./db').User
const Todo = require('./db').Todo

function isAuthenticated(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        let token = req.headers.authorization.split(" ")[1];
        let privateKey = process.env.ACCESS_TOKEN;
        // console.log(token);
        // Here we validate that the JSON Web Token is valid and has been
        // created using the same private pass phrase
        jwt.verify(token, privateKey, (err, user) => {

            // if there has been an error...
            if (err) {
                // shut them out!
                res.status(500).json({ error: "Not Authorized" });
                // throw new Error("Not Authorized");
            }
            // if the JWT is valid, allow them to hit
            // the intended endpoint
            req.user = user;
            next();
        });
    } else {
        // No authorization header exists on the incoming
        // request, return not authorized and throw a new error
        res.status(500).json({ error: "Not Authorized" });
        // throw new Error("Not Authorized");
    }
}

//=========================USER=======================

app.get('/data/users', (req,res)=>{
    try{
		User.find({},(error, data)=>{
			res.json(data);
		})
	}
	catch(e){
		res.sendStatus(404);
	}
})

app.post('/data/users/signup', (req,res)=>{
    const userId = req.body.userId
    User.findOne({userId: userId}, async (error, user)=>{
        //console.log(todos);
        if (user===null){
            const salt = await bcrypt.genSalt()
            const hashedpassword = await bcrypt.hash(req.body.password,salt)
            //console.log(salt)
            //console.log(hashedpassword)
            const data = {
                userId: req.body.userId,
                password: hashedpassword
            }
            console.log(data)
            User.create(data, (error , new_user)=>{
                res.send(new_user)
            })        
        }
        else{
            res.send("User exists!")
        }
    })    
})

app.post('/data/users/login', (req,res)=>{
    const userId = req.body.userId
    User.findOne({userId: userId}, (error,user)=>{
        //console.log(user)
        if(user!==null){
            bcrypt.compare(req.body.password, user.password, (err,result)=>{
                
                if (result){
                    const privateKey = process.env.ACCESS_TOKEN;
                    const token = jwt.sign({ userId : userId }, privateKey);
                    res.json({token: token});
                }
                else{
                    res.json({token: null})
                }
            })
            // if (bcrypt.compare(req.body.password, user.password) || user.password===req.body.password){
                
            // }
            // else{
                   
            // }
        }
        else{
            res.sendStatus(403);
        }
    })
})

//========================================================

//=======================TODO=============================

app.get('/data/todos/:id', (req,res)=>{
    const id = req.params.id
    try{
		Todo.find({_id: id},(error, todos)=>{
			res.json(todos);
		})
	}
	catch(e){
		res.sendStatus(404);
	}
})

app.get('/data/todos/', isAuthenticated, (req,res)=>{
    var uid = req.user.userId
    //console.log(uid)
	try{
        Todo.find({userId: uid},(error, todo)=>{
            res.json(todo);
        })
	}
	catch(e){
		res.sendStatus(404);
	}
})

app.post('/data/todos/', isAuthenticated, (req,res)=>{		
    let data = {
            "userId": req.user.userId,
            "title": req.body.title,
            "completed": false
    };
    console.log(data)
    Todo.create(data , (error , new_todo) => {
        console.log(new_todo);
        res.json(new_todo);
    })
})

app.put('/data/todos/:id', isAuthenticated, (req,res)=>{		
    const id = req.params.id
    Todo.findOne({_id: id}, (err, todo)=>{
        // todo.completed = (todo.completed===true?false:true)
        todo.completed = req.body.completed
        Todo.findOneAndUpdate({_id: id}, todo, ()=>{
            res.json(todo)
        })
    })
    //Why findOneAndUpdate is inside findOne?
})

//=========================================================

//=========================REDIRECTS=======================

app.get('/', (res,req)=>{
    fs.readFile('./index.html', (err,html)=>{})
})

//=========================================================

var server = app.listen(3000, function () {
    console.log('Server running at http://localhost:' + server.address().port)
})