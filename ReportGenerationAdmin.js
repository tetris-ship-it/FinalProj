import {MongoClient} from 'mongodb';
import express from 'express';
import bodyParser from 'body-parser';
import moment from 'moment';
const app = express();

app.use(bodyParser.json());

app.listen(5000);

async function main(){

    const url="mongodb+srv://beldan:ilovelaraLOL20@cluster0.zatwth5.mongodb.net/Penalty Info?retryWrites=true&w=majority";

    const client=new MongoClient(url);

    try{
        await client.connect();

        //app.use('/generateReport', (req, res, next) => {
           // const { startDate, endDate } = req.body;
            //if (!startDate || !endDate) {
                //return res.status(400).send({ message: 'start Date and end Date are required' });
            //}
            //next();
        //});

        app.post('/generateReport', (req,res) => {
            const { startDate, endDate } = req.body;
            if (!startDate || !endDate) {
                return res.status(400).send({ message: 'start Date and end Date are required' });
            }
           reportGeneration(client, req, res);
        })
    }
    catch(err){
        console.log(err);
    }
};

main().catch(console.error);



async function reportGeneration(client, req, res) {
    try {
        const start = moment(req.body.startDate, 'YYYY-MM-DD');
        const end = moment(req.body.endDate, 'YYYY-MM-DD');
        
        /*let current = moment(start);
        
        const penalties = [];

        while(current<=end){
            const penalty = await client
            .db("Pen")
            .collection("Penalty Info")
            .find({date : {$eq:current}}).toArray();
            penalties.push(...penalty);
            current.add(1, 'days');
        };*/
        
        let grade = 1;
        let allPenalties = [];
        let allPenaltiesByGrade = [];
        
        while (grade <= 6) {
          const penalties = await client
            .db('Pen')
            .collection('Penalty Info')
            .find({
              $and: [
                { date: { $gte: start.toDate() } },
                { date: { $lte: end.toDate() } },
                { degreeOfPenalty: { $eq: grade } },
              ],
            })
            .toArray();
        
          allPenalties = allPenalties.concat(penalties);
          allPenaltiesByGrade.push({
            grade: grade,
            count: penalties.length,
            penalties: penalties,
          });
        
          grade++;
        }
        
        const message = `Penalties found: ${allPenalties.length}`;
        const data = { message: message, penaltiesByGrade: allPenaltiesByGrade };
        res.json(data);
        
    
      
    
    } catch (err) {
      console.log(err);
      res.status(500).send("An error occurred while generating the report");
    }
  }
