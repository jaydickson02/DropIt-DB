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
    
    let dbEntry = {
      name: req.body.name, 
      id: req.body.studentNumber,
      date: req.body.date,
      chromebook: req.body.device
    };

    const { db } = await connectToDatabase();

    await db.collection("Users").insertOne(dbEntry, (err, res) => {
      if (err) throw err;
      console.log("1 document inserted");
    });

    res.status(200).send('Device Registered');
  } else {
    res.send('No request found');
  }
 
};