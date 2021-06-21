const express = require('express')
const fileUpload = require('express-fileupload');
const {MongoClient} = require('mongodb')
const bodyParser= require('body-parser')
const cors = require('cors')
const path = require('path')
const app = express()

app.use(fileUpload());
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
const mongoUrl='mongodb+srv://omshakti:13580@Okm@imageupload.awr8q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const PORT = process.env.PORT  || 3159
let db

app .get('/',(req,res)=>{
    db.collection('images').find({}).toArray((err,result)=>{
        if(err) throw err
        res.send(result)
    })
})


app.post('/upload',(req,res)=>{
    let image=req.files.image
    let fileName=`image_upload_${Date.now()}${path.extname(image.name)}`
    let filepath=`${__dirname}/uploads/${fileName}`
    const data={
        _id:Math.floor(Math.random()*100000),
        title:req.body.title,
        description:req.body.description,
        imagefileName:fileName,
        imageUrl:`/uploads/${fileName}`,
        size:image.size
    }
    db.collection('images').insertOne(data)
    image.mv(filepath,(err)=>{
        if(err) throw err
        res.send("file saved")
    })
})

app.delete('/deleteimage/:id',(req,res)=>{
    let {id}=req.params
    db.collection('images').deleteOne({ _id:parseInt(id) }, (err) => {
        if (err) throw err
        res.send("document deleted")
    })
})

MongoClient.connect(mongoUrl,{useNewUrlParser:true,useUnifiedTopology:true},(err,conn)=>{
    if(err) throw err
    db=conn.db('uploadimage')
    console.log('connected to database...')
    app.listen(PORT,()=>{
        console.log('server is running....')
    })
})