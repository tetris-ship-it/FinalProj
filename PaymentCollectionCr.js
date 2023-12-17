import stripePackage from 'stripe';
import express from 'express';
import {MongoClient} from 'mongodb';
import { ObjectId } from 'mongodb';




const stripe = stripePackage('sk_test_51NDl1UIn4nXaJtakvdWHfd8ZHhlLGCgXreiN7Tecs4sz4ke92aatg2YwpMnTksXyF3NipJS1bPrWL7n1Eh1vMn1w00w7uzbZoh');

class StripeClient {
  chargeCreditCard(token, propertyValue) {
    let amount;
    switch (propertyValue) {
      case 1:
        amount = 100; 
        break;
      case 2:
        amount = 150; 
        break;
      case 3:
        amount = 200; 
        break;
      case 4:
        amount = 250; 
        break;
      case 5:
        amount = 300;
        break;
      case 6:
        amount = 350; 
        break;
      default:
        throw new Error('Invalid degree value');
    }
    return stripe.charges.create({
      amount,
      currency: 'usd',//we didn't find birr in the set of values that currency can be set to
      source: token
    });
  }
}

const app = express();
app.use(express.json());

app.post('/api/payment/charge', async (req, res) => {
  const token = req.get('token');
  const license = req.body.licenseId;

  const url="mongodb+srv://beldan:ilovelaraLOL20@cluster0.zatwth5.mongodb.net/Penalty Info?retryWrites=true&w=majority";

  const client=new MongoClient(url);

  try{
    await client.connect();


    const data = await client.db('Pen').collection('Penalty Info').findOne({$and:[{'licenseID' : license},{'status' : false}]})
    const typeChanged = new ObjectId(data._id)
    const stripeClient = new StripeClient();
    const charge = await stripeClient.chargeCreditCard(token, data.degreeOfPenalty);
    await client.db('Pen').collection('Payment').insertOne({
        charge:charge,
        Penalty_id:typeChanged
    });
    await client.db('Pen').collection('Penalty Info').updateOne({_id:typeChanged},{$set:{status:true}});
    res.json(charge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
