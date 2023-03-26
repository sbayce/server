const express = require('express');
const cors = require('cors');
const fs = require('fs');
var bodyParser = require('body-parser')
const env = require('dotenv');
env.config();
var app = express()
const AWS = require('aws-sdk');
const multer = require('multer');

const region = "us-west-2"
const accessKeyId = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());

const uploadFolder = './uploads';

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey,
  })

// const storage = multer.memoryStorage();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
const upload = multer({storage: storage});

app.post('/upload', upload.single('file'), async (req,res) =>{
    console.log(req.body);
    console.log(req.file.filename);
    const fileContent = fs.readFileSync(req.file.path);

    const params = {
        Bucket: 'ass5-dataset-bucket/dummies',
        Key: req.file.filename,
        Body: fileContent
    };
    s3.putObject(params).promise();
})
app.delete('/delete', cors(), (req,res)=>{
    fname = req.body.fname;
    console.log(fname);
    const params = {
        Bucket: 'ass5-dataset-bucket/dummies',
        Key: fname,
    };
    s3.deleteObject(params).promise();
})

app.get('/', (req,res)=>{
    res.send("alo");
})
app.listen(4000, ()=>{
    console.log("running on port 4000");
})
