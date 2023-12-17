import { MongoClient } from 'mongodb';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.listen(7400);

const url = "mongodb+srv://beldan:ilovelaraLOL20@cluster0.zatwth5.mongodb.net/Traffic Info?retryWrites=true&w=majority";

const client = new MongoClient(url);

client.connect().then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error(err);
});

app.post('/Trafficlogin', async (req, res) => {
  var fName = req.body.firstName;
  var lName = req.body.lastName;
  var td = req.body.trafficId;

  try {
    const user = await client.db('Pen').collection('Traffic Info').findOne({ $and: [{ firstName: fName }, { lastName: lName }] });
    const stationedAt = user.stationedAt;
    const Nationality = user.Nationality;
    const Sex = user.Sex;
    const Tel = user.Tel;
    if (user == null) {
      res.json({
        message: "no user found with the specified credentials"
      })
    } else {
      const hashedLicenseId = await bcrypt.hash(user.trafficID, 10);
      bcrypt.compare(td, hashedLicenseId, function (err, result) {
        if (err) {
          res.json({
            error: err
          })
        }
        if (result) {
          const tokendata = {
              tid:td,
              fname:fName,
              lname:lName,
              stationedAt:stationedAt,
              Nationality:Nationality,
              Sex:Sex,
              Tel:Tel
          }
          let token = jwt.sign(tokendata, 'verySecretValue', { expiresIn: "1h" })
          res.json({
            message: 'Login Successful!',
            token
          })


        } else {
          res.json({
            message: 'Traffic ID does not match!'
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
