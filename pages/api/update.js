import { connectToDatabase } from "../../util/mongodb";
import Cors from 'cors';
import initMiddleware from '../../lib/init_middleware';

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: '*',
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
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
          //Add student to device array
            students.push({name: req.body.student, date: '10/10/2010', id: req.body.id})
        } else {

          //If students entry dosen't exist create it and add the data
            students = [];
            students.push({name: req.body.student, date: '10/10/2010', id: req.body.id})
        }

        updatedValues['students'] = students;

    }

    console.log(updatedValues)
    

    await db.collection("Devices").updateOne(
        { serialNumber: req.body.idSerialNumber },
        {
            $set: updatedValues,
            $currentDate: { lastModified: true }
        }
     )

     const devices = await db
    .collection("Devices")
    .find({'serialNumber': req.body.idSerialNumber})
    //.sort({ metacritic: -1 })
    .limit(20)
    .toArray();


    res.status(200)
    .json(devices);

  } else {
    res.send('No request found');
  }
 
};