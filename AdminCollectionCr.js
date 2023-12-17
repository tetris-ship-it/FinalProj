
import { MongoClient } from 'mongodb';



async function main() {
  const url = "mongodb+srv://beldan:ilovelaraLOL20@cluster0.zatwth5.mongodb.net/Admin?retryWrites=true&w=majority";
  const client = new MongoClient(url);

  try {
    await client.connect();
    await createListing(client, {
      firstName: "Abdu",
      lastName: "Bishal",
      email: "abdish@gmail.com",
      password: "porkylittle",
    });

  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

main().catch(console.error);


async function createListing(client, newListing) {
  const result = await client.db('Pen').collection('Admin').insertOne(newListing);
  console.log(`new listing created with the following id: ${result.insertId}`);
}


