
const express = require('express');
const dotenv = require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const firebase  = require("./firebase");
let R = require("ramda");
var url = 'mongodb://localhost:27017/sandBBox';
let firestore = firebase.firestore();


const myFunc = async () => {
  let BATCH_NUMBER = 2;
  let client = await MongoClient.connect(url);
  let db = await client.db();
  //let countWithIntegrations = await db.collection('productvariants').find({integrations: {$exists: true}}).count();
  let productvariants
  let orders = await db.collection('productvariants').find({}, {limit: 300}).toArray();
  
  try {
    console.log(orders.length);
    const chunks = R.splitEvery(BATCH_NUMBER, orders);
    console.log(chunks.length)
    for (const chunk of chunks) {
      const batch = firestore.batch();
      chunk.forEach(order => {
        try {
          let docRef = firestore.collection(`ProductVariants`).doc(`${order._id}`);
          batch.set(docRef, order)
        }catch{
          console.log(error);
        }
      });
      await batch.commit();
      console.log('commited')
    }
  } catch (error) {
    console.log(error);
  }
  
};
myFunc();

const app = express();
const PORT = 6000;

const server = app.listen(
    PORT,
    console.log(`SERVER RUNNIN IN PORT ${PORT}`)
)
