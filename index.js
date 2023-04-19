const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion, ObjectId} = require("mongodb");

//user: dbuser2
//password: kJqbTIKFYQl7DEHe

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Successfully server is running!');
})

// app.get('/users', (req, res) => {
    
// })

app.listen(port, () => {
    console.log(`server is running on port:${port}`);
})

const uri =
  "mongodb+srv://dbuser2:kJqbTIKFYQl7DEHe@cluster0.tyz6hju.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        const userCollection = client.db('nodemongo').collection('users');
        app.get('/users', async(req, res) =>{
            const query = {};
            const cursor = userCollection.find(query);
            const users =await cursor.toArray()
            res.send(users);
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id:new ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.send(user);
        })

        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(user);
            console.log(user);
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id)};
            const user = req.body;
            console.log(user);
            const option = { upsert: true };
            const updateUser = {
                $set: {
                    name: user.name,
                    email: user.email,
                }
            }
            const result= await userCollection.updateOne(filter,updateUser,option)
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:new ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })
    }
    finally {
    }
}

run().catch(err => {
    console.log(err);
})

