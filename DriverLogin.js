
import { MongoClient } from 'mongodb';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.listen(5600);

const url = "mongodb+srv://beldan:ilovelaraLOL20@cluster0.zatwth5.mongodb.net/Driver Info?retryWrites=true&w=majority";

const client = new MongoClient(url);

client.connect().then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error(err);
});

app.post('/driverLogin', async (req, res) => {
  var fname = req.body.firstName;
  var lName = req.body.lastName;
  var ld = req.body.licenseId;

  try {
    const user = await client.db('Pen').collection('Driver Info').findOne({ $and: [{ firstName: fname }, { lastName: lName }] });
    const DOB = user.DOB;
    const Nationality = user.Nationality;//copy the fields of the found user to these variables
    const Sex = user.Sex;
    const BloodType = user.Blood_Type;
    const Tel = user.Tel;
    const IssueDate = user.Issue_Date;
    const ExpiryDate = user.Expiry_Date;
    const grade = user.grade;
    if (user == null) {
      res.json({
        message: "no user found with the specified credentials"
      })
    } else {
      const hashedLicenseId = await bcrypt.hash(user.licenseID, 10);
      bcrypt.compare(ld, hashedLicenseId, function (err, result) {
        if (err) {//if there is another type of error not related to whether the comparison results in true or not
          res.json({
            error: err
          })
        }
        if (result) {//if the comparison is successful
          const tokendata = {
            lid: ld,
            fname: fname,
            lName: lName,
            DOB: DOB,
            Nationality: Nationality,
            Sex: Sex,
            BloodType:BloodType,
            Tel: Tel,
            IssueDate: IssueDate,
            ExpiryDate: ExpiryDate,
            grade: grade
          };
          let token = jwt.sign(tokendata, 'verySecretValue', { expiresIn: "1h" })
          res.json({
            message: 'Login Successful!',
            token
          })


        } else {//if comparison isn't successful
          res.json({
            message: 'License ID does not match!'
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
