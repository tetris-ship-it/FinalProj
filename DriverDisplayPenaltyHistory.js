

import {MongoClient} from 'mongodb';
import express from 'express';
import bodyParser from 'body-parser';
const app = express();

app.use(bodyParser.json());

app.listen(5500);

  async function main(){
    const url = "mongodb+srv://beldan:ilovelaraLOL20@cluster0.zatwth5.mongodb.net/Penalty Info?retryWrites=true&w=majority";

     const client =  new MongoClient(url);


     try{
        client.connect();
        app.get('/displayHistory', (req,res)=>{
            displayPenalties(client, req, res); 
            
        async function displayPenalties(client, req, res){
            const cursor= await client.db("Pen").collection("Penalty Info").find({ 
            licenseID:{ $eq:req.body.licenseId },//gather from collection based on equality with this field's value
        }).sort({ date:-1 });//put the result into descending order based on the date field from the db.


    const results = [];//array creation to add complaints onto
    let counter = 0;//for counting penalty values

    await cursor.forEach((myDoc) => {
    results.push(myDoc);//pushing each document into the array for later displaying it. 
    switch(myDoc.degreeOfPenalty){//to count the penalty points based on the degree of penalty
        case 1:
            counter+=0;
            break;
        case 2:
            counter+=1;
            break;
        case 3:
            counter+=2;
            break;
        case 4:
            counter+=3;
            break;
        case 5:
            counter+=4;
            break;
        case 6:
            counter+=5;
            break;
        default:
            break;
    }  
    });
    
    res.json({
        counter:counter,
        penalties:results
    });

}   
        });
      
     }catch(err){
        console.log(err);
     }


     
}

main().catch(console.error);

