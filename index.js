const express = require('express');
require("dotenv").config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = 5000

// middleware 

app.use(cors())
app.use(express.json())





const uri = "mongodb+srv://rimamnt46:dAnVfM762VHVeM0n@cluster0.o2vujms.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    const userCollection = client.db('userDatabase').collection('userCollection')
    const productionCollection = client.db("productDb").collection('product-collection')

    // userCollection

    app.put('/user/:email', async(req,res)=>{
        // const user = req.body;
        // const isExist = await userCollection.findOne({email: user?.email})

        // if(isExist?._id){
        //     res.send("login success")
        // }

        const users = req.body;
    const email = req.params.email
    const query = {email:email}
    const options = { upsert: true }
    const updateDoc={
        $set:users
    }
        const result = await userCollection.updateOne(query,updateDoc,options) 
        res.send(result)
    })

    app.get('/user',async(req,res)=>{
        const result = await userCollection.find().toArray()
        res.send(result)
    })


    app.get('/user/:id',async(req,res)=>{
        const id = req.params.id;
        const filterId = {_id : new ObjectId(id)}
        const result = await userCollection.findOne(filterId)
        res.send(result)
    })


    app.patch('/user/:id',async(req,res)=>{
        const id = req.params.id;
        
        const body = req.body
        const filterId = {_id : new ObjectId(id)}
const updateDoc ={
    $set: body
}

        const result = await userCollection.updateOne(filterId,updateDoc)
        res.send(result)
    })

    // product route

    app.post('/product',async(req,res)=>{
      const product = req.body;
      const result = await productionCollection.insertOne(product)
      res.send(result)
    })

    app.get('/product', async(req,res)=>{

      const result = await productionCollection.find().toArray()
      res.send(result)

    })

    app.get('/product/:id', async(req,res)=>{
      const id = req.params.id;
      const filterId = {_id : new ObjectId(id)}
      const result = await productionCollection.findOne(filterId)
      res.send(result)
    })

    app.patch('/product/:id', async(req,res)=>{
      const product = req.body;
      const id = req.params.id;
      const filteredId = { _id : new ObjectId(id)}
      const updateDoc = {
        $set: product
      }

      const result = await productionCollection.updateOne(filteredId,updateDoc)
      res.send(result)
    })


    app.delete('/product/:id', async(req,res)=>{
      const id = req.params.id;
      const filteredId = {_id : new ObjectId(id)}
      const result = await productionCollection.deleteOne(filteredId)
      res.send(result)
    })
    
   
    console.log("mongodb database is connecting");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
    res.send("data is running")
})


app.listen(port,()=>{
    console.log(`port is running on : ${port}`)
})

// rimamnt46
// dAnVfM762VHVeM0n