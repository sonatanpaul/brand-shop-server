const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.psrck7a.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productCollection = client.db('prodcutDB').collection('product');

    app.post('/product', async(req, res) => {
        const newProduct = req.body;
        console.log(newProduct);
        const result = await productCollection.insertOne(newProduct);
        res.send(result);
    })

    app.get('/product', async(req, res) => {
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })


    

    app.get('/product/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await productCollection.findOne(query)
        res.send(result)
    })

    //update product 

    app.put('/product/:id',async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true}
      const updatedProduct = req.body
      const product = {
        $set: {
            name:updatedProduct.name,
            brandName:updatedProduct.brandName,
            categoryName:updatedProduct.categoryName,
            price: updatedProduct.price,
            imageURL:updatedProduct.imageURL,
            description:updatedProduct.description,
            rating:updatedProduct.rating
            
        }
      }
      const result = await productCollection.updateOne(filter,product, options )
      res.send(result)

    })



    // delete product
    app.delete('/product/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await productCollection.deleteOne(query);
        res.send(result);
    })








    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








// midleware
app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Barnd Shop Server is Running!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})