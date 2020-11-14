// Import Dependencies
const url = require('url')
const MongoClient = require('mongodb').MongoClient

const add = () => {
// Create cached connection variable
let cachedDb = null

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
async function connectToDatabase(uri) {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri, { useNewUrlParser: true })

  // Select the database through the connection,
  // using the database path of the connection string
  const db = await client.db(url.parse(uri).pathname.substr(1))

  // Cache the database connection and return the connection
  cachedDb = db
  return db
}

// The main, exported, function of the endpoint,
// dealing with the request and subsequent response
primary = async (req, res) => {
    // Get a database connection, cached or otherwise,
    // using the connection string environment variable as the argument
    const db = await connectToDatabase(process.env.MONGODB_URI)
  
    // Select the "users" collection from the database
    const collection = await db.collection('Devices')

    var myobj = { name: "Company Inc", address: "Highway 37" };
  
    // Select the users collection from the database
    const devices = await collection.insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
  
    // Respond with a JSON string of all users in the collection
    res.status(200).json({ devices })
  }

  primary()

}

export default add;

