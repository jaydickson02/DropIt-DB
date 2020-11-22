import { connectToDatabase } from "../../util/mongodb";
import Cors from 'cors'
import initMiddleware from '../../lib/init_middleware'

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
    console.log(req.body);
    let dbEntry = {
      type: req.body.type, 
      serialNumber: req.body.serialNumber,
      currentUser: {name: req.body.currentUser},
      condition: req.body.deviceCondition
    };

    const { db } = await connectToDatabase();

    await db.collection("Devices").insertOne(dbEntry, (err, res) => {
      if (err) throw err;
      console.log("1 document inserted");
    });

    res.status(200).send('Device Registered');
  } else {
    res.send('No request found');
  }
 
};