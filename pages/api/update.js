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

    for(var key in req.body){
        if(req.body[key] && key != 'idSerialNumber'){
            updatedValues[key] = req.body[key]
        }
    }

    //This is super bad, please fix later. Was temp for testing. See newField.js in DropIt App.
    for(var key in updatedValues){
        if(key == 'students'){
            updatedValues[key] = [{name: updatedValues[key], date: '10/10/2010', id:'123'}];
        }
    }

    console.log(updatedValues);
    console.log('idNum ' + req.body.idSerialNumber);

    const { db } = await connectToDatabase();

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