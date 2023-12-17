
import { MongoClient } from 'mongodb';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.listen(4300);

const url = "mongodb+srv://beldan:ilovelaraLOL20@cluster0.zatwth5.mongodb.net/Admin?retryWrites=true&w=majority";

const client = new MongoClient(url);

client.connect().then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error(err);
});

app.post('/adminLogin', async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;


  try {
    const user = await client.db('Pen').collection('Admin').findOne({  email: email  });
    const fName = user.firstName;
    const lName = user.lastName;
    if (user == null) {
      res.json({
        message: "Email not valid"
      })
    } else {
      const hashedpass = await bcrypt.hash(user.password, 10);
      bcrypt.compare(password, hashedpass, function (err, result) {
        if (err) {
          res.json({
            error: err
          })
        }
        if (result) {
          const tokenData = {
            lid:password,//lid is a variable that holds the value of pass after it is compared with hashed password
            fName:fName,
            lName:lName
          };
          let token = jwt.sign(tokenData, 'verySecretValue', { expiresIn: "1h" })
          res.json({
            message: 'Login Successful!',

            token
          })


        } else {
          res.json({
            message: 'Password not correct!'
          })
        }
      })
    }
  } catch (err) {
    res.json({
      error: err.message
    });
  }
})
app.post('/changePassword', async(req, res)=>{
  var email = req.body.email;
  var oldPassword= req.body.oldpassword;
  var newPassword=req.body.newpassword;
  try{
    const user = await client.db('Pen').collection('Admin').findOne({  email: email  });
    const hashedoldpass = await bcrypt.hash(user.password, 10);
    bcrypt.compare(oldPassword, hashedoldpass, (err,result)=>{
      if(err) throw err;

      if(result){
        updateThedoc(client, email, newPassword);


        
        res.json({
          "message":"Password updated successfully"
        })
        

      }else{
        res.status(401).send('Incorrect password');
      }
    });
  }
  catch(err){
    console.log(err);
  }
})

async function updateThedoc(client, email, newpass){
  await client.db('Pen').collection('Admin').updateOne({email:email},{$set:{password:newpass}});
}