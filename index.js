const express= require('express');
const cors=require('cors');
const app=express();
require('dotenv').config()
const port=process.env.PORT || 5000;
app.use(cors())
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjcpuut.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try {
        const users = client.db("todolist").collection("users");
        const task = client.db("todolist").collection("task");
      
        app.get('/', async (req,res)=>{
          res.send("hello world")
        })

      
        app.post('/addTask', async (req, res) => {
          const newTask = req.body;
          console.log(newTask)
          const result = await task.insertOne(newTask);
          res.send(result);
        });
        app.get('/mytasks/:email',async(req,res)=>{
          const {email}=req.params;
           console.log(email)
          const query={email:email}
          const cursor=task.find(query);
          const result=await cursor.toArray();
          if(result){
            res.send(result)
          }
        })
        
        app.delete('/task/:id', async(req,res)=>{
          const id=req.params.id;
          const filter={_id:ObjectId(id)}
          const result=await task.deleteOne(filter);
          res.send(result)
        })
        app.put('/EditTask/:id', async (req, res) => {
          console.log('hellow from edit')
          const id = req.params.id;
          
          const filter = { _id: ObjectId(id) }
          const updateTask = req.body;
          const options = { upsert: true };
          const updatedDoc = {
              $set: {
                  name:updateTask.name,
                  description:updateTask.description,
                  status: updateTask.status,
                  picture:updateTask.picture,
                  email:updateTask.email
              }
          }
          const result = await task.updateOne(filter, updatedDoc, options);
          res.send(result);
      });
        app.put('/task/:id', async (req, res) => {
          const id = req.params.id;
          
          const filter = { _id: ObjectId(id) }
          const options = { upsert: true };
          const updatedDoc = {
              $set: {
                  status: '0'
              }
          }
          const result = await task.updateOne(filter, updatedDoc, options);
          res.send(result);
      });
      app.put('/IncompleteTask/:id', async (req, res) => {
        const id = req.params.id;
        
        const filter = { _id: ObjectId(id) }
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
                status: '1'
            }
        }
        const result = await task.updateOne(filter, updatedDoc, options);
        res.send(result);
    });
      
    } catch (error) {
        
    }
  }
run().catch(err=> console.log(err))

app.listen(port, ()=>{
    console.log(`server is running on ${port}`)
})