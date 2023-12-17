import {MongoClient} from 'mongodb';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.listen(5200);
async function main(){

    const url="mongodb+srv://beldan:ilovelaraLOL20@cluster0.zatwth5.mongodb.net/Driver Info?retryWrites=true&w=majority";
    
    const client= new MongoClient(url);

    try{
        await client.connect();
        app.get('/searchById', (req,res)=>{
             displayDriver(client, req, res);
        });

    }
    catch(err){
        console.log(err);
    }
}
 

main().catch(console.error);

async function displayDriver(client, req, res){

 try{
 const variable = req.body.licenseId;
 const cursor = await client.db('Pen').collection('Driver Info').aggregate([
    {
      $lookup: {
        from: 'Penalty Info',
        let: { licenseID: variable },
        pipeline: [//this specifies an array of stages to be applied to the penalty info collection
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$licenseID', '$$licenseID'] }//if the licenseID property in the penalty info table/collection matches the one retrieved from the request
                 
                ]
              }
            }
          }
        ],
        as: 'SearchResults'
      }
    },
    {
      $match: {//this specifies filtering for the driver info based on the variable "variable"
          licenseID: variable
      }
    },

  ]);

    await cursor.forEach((myDoc) => {
          res.send(myDoc);
     });
    }
    catch(err){
      res.json("license ID not found")
    }
};

