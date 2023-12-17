import {MongoClient} from 'mongodb';
import express from 'express';
import bodyParser from 'body-parser';
import { ObjectId } from 'mongodb';
const app = express();

app.use(bodyParser.json());

app.listen(5400);


async function main(){

    const url="mongodb+srv://beldan:ilovelaraLOL20@cluster0.zatwth5.mongodb.net/Complaints?retryWrites=true&w=majority";

    const client=new MongoClient(url);

    try{
        await client.connect();
        app.post('/complaintsAdd', async(req,res)=>{
            const complaint = req.body;
            var changeIdType = new ObjectId(complaint.pen_id);
            complaint.pen_id = changeIdType;
            const existingComplaint = await findComplaint(client, complaint.pen_id);//to check if there is an existing complaint on the penalty based on the penalty id
            if (existingComplaint!=null) {
                const now = new Date();
                const diffInMs = now.getTime() - existingComplaint.complaintDate.getTime();//get difference in milliseconds between current complaint time and previous complaint on same penalty.
                const hoursPassed = diffInMs / (60*60*1000);//changing difference from milliseconds to hours.
                if (hoursPassed < 24) {//if hours passed between current complaint to be added and the previous complaint on the same penalty is less than 24 hours
                    return res.status(400).json({ error: 'You can only submit one complaint per day' });
                    }
                    
                else{
                        await client.db('Pen').collection('Complaints').deleteOne({pen_id:complaint.pen_id})
                    }
                }
            addComplaint(client, complaint);
            res.status(200).json({message:'complaint added to DB'});
                });
        
    
    }
    catch(err){
        console.log(err);
    }
}
main().catch(console.error);
async function findComplaint(client, pen_id){
    const result=await client.db('Pen').collection('Complaints').findOne({ pen_id: pen_id});
    return result;
}
async function addComplaint(client, newComplaint){
    const result=await client.db('Pen').collection('Complaints').insertOne(newComplaint);

    
    addSeenProperty(client);
    addDatetoComplaint(client);
    console.log(`new complaint added with the following id: ${result.insertId}`);
};
async function addSeenProperty(client){
    await client.db('Pen').collection('Complaints').updateMany({seenStatus:{$exists:false}},{$set:{seenStatus:false}});
}
async function addDatetoComplaint(client){
    const Cdate = new Date();
    await client.db('Pen').collection('Complaints').updateMany({complaintDate:{$exists:false}},{$set:{complaintDate:Cdate}});
}