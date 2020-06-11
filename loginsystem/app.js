const express = require('express')
const app = express() 
const bodyParser = require('body-parser')
const path = require('path')
const mongodb = require('mongodb')
var userid

const URL = "mongodb+srv://abhi:abhishek@data1-jxcwz.mongodb.net/data1?retryWrites=true&w=majority"
const port = process.env.PORT || 5000
app.use(express.static("public"));
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname + '/views/loginpage.html'))
})
app.get('/registerform',(req,res,next)=>{
    res.sendFile(path.join(__dirname + '/views/registrationpage.html'))
    
})
app.get('/edit',(req,res)=>{
    res.sendFile(path.join(__dirname + '/views/edit.html'))

})


mongodb.MongoClient.connect(URL,{useNewUrlParser: true,useUnifiedTopology: true},(e,client) => {
    if(e)return console.log('not connected')
    console.log('connected')

     const db = client.db('data1').collection('user')

    app.post('/register',(req,res) => {
        const data = req.body
        db.insertOne(req.body)
        res.render('homepage.ejs',{
            name: data.name,
            email: data.email,
            age  : data.age,
            sex  : data.sex,
            mobile :data.mobile,
            country:data.country
       })
    })
    
    app.post('/login',(req,res) => {
         db.findOne({username: req.body.username},(err,data)=>{
             if(data.password==req.body.password)
             {   
                 const value= data
                 userid = data.id
                 res.render('homepage.ejs',{
                     name:  value.name,
                     email: value.email,
                     age  : value.age,
                     sex  : value.sex,
                     mobile :value.mobile,
                     country:value.country
                })
             }
             else res.send("invalid credentials")
         })
    })
    app.post('/update',(req,res)=>{
        const value = req.body
        db.findOneAndReplace({id: userid},{
                     name:  value.name,
                     email: value.email,
                     username: value.username,
                     password:value.password,
                     age  : value.age,
                     sex  : value.sex,
                     mobile :value.mobile,
                     country:value.country
        }, function(err, result) {
            if (err) {
              res.send(err);
            } else {
                res.render('homepage.ejs',{
                    name:  value.name,
                    email: value.email,
                    age  : value.age,
                    sex  : value.sex,
                    mobile :value.mobile,
                    country:value.country
               })
            }
          })
})
})


app.listen(port)



