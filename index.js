const express = require('express');
require("dotenv").config();
const jwt = require("jsonwebtoken")
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middleware 

app.use(cors())
app.use(express.json())

// function createToken(user) {
//   const token = jwt.sign(
//     {
//       email: user.email,
//     },
//     "secret",
//     { expiresIn: "7d" }
//   );
//   return token;
// }

function verifyToken(req, res, next) {
  const authorization = req.headers.authorization
  if(!authorization){
    return res.status(401).send({error:true, message:"unathorization access"})
  }
  const token = authorization.split(' ')[1]
  jwt.verify(token,process.env.JWT_ACCESS_TOKEN,(error,decoded)=>{
    if(error){
      return res.status(401).send({error:true, message:"unathorization access"})
    }
req.decoded = decoded
next()
  })
}



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
    
     client.connect();

    const userCollection = client.db('userDatabase').collection('userCollection')
    const productionCollection = client.db("productDb").collection('product-collection')

// jwt

app.post("/jwt", (req,res)=>{
  const user = req.body
  const token = jwt.sign(user,process.env.JWT_ACCESS_TOKEN,{expiresIn:'5d'})
  
  res.send({token})
})


    // userCollection

    // app.put('/user/:email', async(req,res)=>{
        
    //     const users = req.body;
    // const email = req.params.email
    // console.log(email)
    // const query = {email:email}
    // const options = { upsert: true }
    // const updateDoc={
    //     $set:users
    // }
    //     const result = await userCollection.updateOne(query,updateDoc,options) 
    //     res.send(result)
    // })

    app.post("/user/:email", async(req,res)=>{
      const user = req.body;
      const isExist = await userCollection.findOne({email: user?.email})
      if(isExist){
        return res.send({
          statu: "success",
          message: "Login success",
          
        })
      }
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    app.get('/user', async(req,res)=>{
        const result = await userCollection.find().toArray()
        res.send(result)
    })


    app.get('/user/:id', async(req,res)=>{
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

    app.post('/product',verifyToken ,async(req,res)=>{
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


    app.delete('/product/:id',verifyToken, async(req,res)=>{
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
// 'c1b7378cffd15bb1e32ec03ca25e5a3ef734d60f5bcc45b4c2aa1044220acac1f890bd6163cd42cb7659a3d78d4603eca9f8e33a218c6aec36d367017f8c720a'