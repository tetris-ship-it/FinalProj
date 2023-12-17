import {MongoClient} from 'mongodb';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ObjectId } from 'mongodb';

const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = 5300;




async function main(){
    const url = 'mongodb+srv://beldan:ilovelaraLOL20@cluster0.zatwth5.mongodb.net/Complaints?retryWrites=true&w=majority';
   
    
    const client = new MongoClient(url);
    

    try{
        await client.connect();
       
        app.get('/viewComplaints', (req,res)=>{
            
            getComplaintDocuments(client, req, res); 
        

    })
    app.put('/changeCompStatus', (req,res)=>{
      const boil = req.body.boil;//boolean variable from body mapped to boolean variable called boil
      const _id = req.body.Id;
      const ObjectID = new ObjectId(_id);
      if(boil){
         client.db('Pen').collection('Complaints').updateOne({_id:ObjectID},{$set:{seenStatus:true}});
         res.send("Complaint Status changed");
      }
 })
 app.delete('/deleteComp', (req,res)=>{
     const boil =req.body.boil;//boolean variable from body mapped to boolean variable called boil
     const _id = req.body.Id;
     const ObjectID = new ObjectId(_id);
     if(boil){
         client.db('Pen').collection('Complaints').deleteOne({_id:ObjectID})
         res.send("Complaint Deleted");
     }
 })

        
   
}
    catch(err){
        console.log(err);
    }
};

main().catch(console.error);


    async function getComplaintDocuments(client, req, res) {
           try{
          const penaltyIds = await client.db('Pen').collection('Complaints').distinct('pen_id', { pen_id: { $exists: true } });

           
            
            const matching_cp_Documents = await client.db('Pen').collection('Complaints').aggregate([
              {
                $match: {//filtering the complaints collection
                  pen_id: { $in: penaltyIds },
                  complaint_Message: { $exists: true }
                }
              },
              {
                $lookup: {//performing a join operation with the penalty info collection
                  from: 'Penalty Info',
                  localField: 'pen_id',
                  foreignField: '_id',
                  as: 'PenaltyComp'
                }
              }
            ]);
            const results = [];
            await matching_cp_Documents.forEach((myDoc) => {
              results.push(myDoc);     
            });

            res.status(200).send(results);
          } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
          } 
        }
  
    
 app.listen(port, () => console.log(`Server is running on port ${port}`))     




