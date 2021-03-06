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

  const { db } = await connectToDatabase();

  const devices = await db
    .collection("Devices")
    .find({})
    //.sort({ metacritic: -1 })
    .limit(20)
    .toArray();

  res.json(devices);
};