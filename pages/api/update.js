import { connectToDatabase } from "../../util/mongodb";
import Cors from 'cors';
import initMiddleware from '../../lib/init_middleware';

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: false,
    // Only allow requests with GET, POST and OPTIONS
    
  })
)

export default async (req, res) => {

  await cors(req, res);

  if (req.method === 'POST') {

    
    let updatedValues = {};

    //Filters values that need extra formatting before being updated in the db. Future proofs adding various values down the line.
    for(var key in req.body){
        if(req.body[key] && key != 'idSerialNumber' && key != 'student'){
            updatedValues[key] = req.body[key]
        }
    }

    const { db } = await connectToDatabase();

    //Handles student update, ensures previous students are not removed, i'm sure there is a way to do this without re-adding every student. Fix later.
    if(req.body.student){
        let students;

        let device = await db.collection("Devices").find({serialNumber: req.body.idSerialNumber}).toArray();
        students = device[0]['students'];
                
        if(students){
            students.push({name: req.body.student, date: '10/10/2010', id:'123'})
        } else {
            students = [];
            students.push({name: req.body.student, date: '10/10/2010', id:'123'})
        }

    }

    console.log(students)
    

    await db.collection("Devices").updateOne(
        { serialNumber: req.body.idSerialNumber },
        {
            $set: updatedValues,
            $currentDate: { lastModified: true }
        }
     )

    res.status(200).send('Entry Updated');
  } else {
    res.send('No request found');
  }
 
};