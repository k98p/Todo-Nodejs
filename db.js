var uri = 'mongodb://localhost:27017/test'

var mongoose = require('mongoose')
mongoose.connect(uri)

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function (callback) {
  console.log('db connected')
})

var todoSchema = mongoose.Schema({
  id: Number,
  userId: Number,
  title: String,
  completed: Boolean
})

var userSchema = mongoose.Schema({
  userId: Number,
  password: String
})

//models are constructors compiled from schema definition
//each instance is called document
exports.Todo = mongoose.model('Todo', todoSchema)
exports.User = mongoose.model('User', userSchema)

//'Todo' gets converted to 'todos' and thus above model 'Todo' refers to todos collection
// rows = documents
// collections = tables
// To construct DB, type: 'mongoimport --db test --collection todos --drop --file update.json --jsonArray'