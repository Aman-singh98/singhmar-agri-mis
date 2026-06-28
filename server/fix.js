import mongoose from 'mongoose';

await mongoose.connect('mongodb://verma:verma@ac-akftxnv-shard-00-00.yhijnv8.mongodb.net:27017,ac-akftxnv-shard-00-01.yhijnv8.mongodb.net:27017,ac-akftxnv-shard-00-02.yhijnv8.mongodb.net:27017/?ssl=true&replicaSet=atlas-wzkc93-shard-0&authSource=admin&appName=Cluster0');

console.log("Connected!");

const result = await mongoose.connection.collection('mainrecords').updateMany(
  {},
  { $set: { uploadDate: "2026-06-21" } }
);

console.log("Updated:", result.modifiedCount, "records ✅");
await mongoose.disconnect();
process.exit(0);