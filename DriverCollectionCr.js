import {MongoClient} from 'mongodb';

async function main(){

    const url="mongodb+srv://beldan:ilovelaraLOL20@cluster0.zatwth5.mongodb.net/Driver info?retryWrites=true&w=majority";

    const client=new MongoClient(url);

    try{
        await client.connect();
        await createMultipleListings(client, [{
            firstName:"Nathnael",
            lastName:"Yehenew",
            licenseID:"456789",
            DOB:"5/9/2001",
            Nationality:"Ethiopian",
            Sex:"Male",
            Blood_Type:"O-",
            Tel:"0911607533",
            Issue_Date:"11/26/2019",
            Expiry_Date:"11/25/2025"
        },
        {
            firstName:"Mikias",
            lastName:"Daniel",
            licenseID:"458801",
            DOB:"9/28/2001",
            Nationality:"Ethiopian",
            Sex:"Male",
            Blood_Type:"O+",
            Tel:"0940294007",
            Issue_Date:"11/26/2020",
            Expiry_Date:"11/25/2026"
        },
        {
            firstName:"Zeamanuel",
            lastName:"Abi",
            licenseID:"498234",
            DOB:"11/07/2001",
            Nationality:"Ethiopian",
            Sex:"Male",
            Blood_Type:"O+",
            Tel:"0945512552",
            Issue_Date:"11/15/2021",
            Expiry_Date:"09/25/2027"
        },
        {
            firstName:"Abenezer",
            lastName:"Tigistu",
            licenseID:"567378",
            DOB:"08/19/2001",
            Nationality:"Ethiopian",
            Sex:"Male",
            Blood_Type:"A+",
            Tel:"0929143302",
            Issue_Date:"11/09/2021",
            Expiry_Date:"08/11/2027"
        },
        {
            firstName:"Henok",
            lastName:"Abebe",
            licenseID:"433745",
            DOB:"11/07/2001",
            Nationality:"Ethiopian",
            Sex:"Male",
            Blood_Type:"AB",
            Tel:"0956782302",
            Issue_Date:"11/12/2018",
            Expiry_Date:"02/25/2024"
        },
        {
            firstName:"Yohanna",
            lastName:"Endale",
            licenseID:"563221",
            DOB:"05/22/2001",
            Nationality:"Ethiopian",
            Sex:"Female",
            Blood_Type:"O+",
            Tel:"0934224533",
            Issue_Date:"12/28/2021",
            Expiry_Date:"03/10/2027"
        },
        {
            firstName:"Mariamawit",
            lastName:"Weldeseyoum",
            licenseID:"775871",
            DOB:"06/20/2000",
            Nationality:"Ethiopian",
            Sex:"Female",
            Blood_Type:"B-",
            Tel:"0919363750",
            Issue_Date:"12/28/2017",
            Expiry_Date:"11/10/2023"
        },
        {
            firstName:"Jonathan",
            lastName:"Endalk",
            licenseID:"984361",
            DOB:"05/20/2001",
            Nationality:"Ethiopian",
            Sex:"Male",
            Blood_Type:"A-",
            Tel:"0967224567",
            Issue_Date:"10/21/2022",
            Expiry_Date:"03/11/2028"
        },
        {
            firstName:"Yonathan",
            lastName:"Daniel",
            licenseID:"347821",
            DOB:"07/22/1995",
            Nationality:"Ethiopian",
            Sex:"Male",
            Blood_Type:"O+",
            Tel:"0934226533",
            Issue_Date:"12/28/2021",
            Expiry_Date:"03/10/2027"
        },
        {
            firstName:"Hosana",
            lastName:"Zeresenay",
            licenseID:"624921",
            DOB:"03/17/1960",
            Nationality:"Ethiopian",
            Sex:"Female",
            Blood_Type:"O+",
            Tel:"0934214533",
            Issue_Date:"12/02/1995",
            Expiry_Date:"03/10/2023"
        },
        {
            firstName:"Zalbo",
            lastName:"Wossen",
            licenseID:"892341",
            DOB:"09/23/1955",
            Nationality:"Portugese",
            Sex:"Male",
            Blood_Type:"A-",
            Tel:"0939161678",
            Issue_Date:"04/10/1997",
            Expiry_Date:"05/05/2025"
        }
        ])
        await updateAllDriversToHaveGrade(client);
    }
    catch(err){
        console.log(err);
    }
    finally{
        await client.close();
    }
}
main().catch(console.error);
async function createMultipleListings(client, newListings){
    const result = await client.db("Pen").collection("Driver Info").insertMany(newListings);

    console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
    console.log(result.insertedIds);       
};
async function updateAllDriversToHaveGrade(client) {
    const result = await client.db("Pen").collection("Driver Info")
                        .updateMany({ grade: { $exists: false } }, 
                                    { $set: { grade: "automatic" } });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
};

