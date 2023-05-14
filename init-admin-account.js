// import { MongoClient } from 'mongodb';
const mongodb = require('mongodb');
require('dotenv').config();
const MongoClient = mongodb.MongoClient;

const uri = process.env.DB_LINK;

const client = new MongoClient(uri);

async function run() {
    try {
        const database = client.db(process.env.DB_NAME);
        const users = database.collection('users');
        // create a document to insert
        const adminAccount = {
            email: 'admin_example@gmail.com',
            password: '$2b$10$By1YGl7jU8SaEkHYurJg/.rbXrubj8XUQrCpBD9RuZfmOT3wApAYi',
            fullname: 'admin',
            avatar_link: null,
            role: 'user',
            status: 'activated',
            createdAt: new Date('2023-04-23T10:13:48.735+00:00'),
            updatedAt: new Date('2023-04-23T10:13:48.735+00:00'),
            username: 'admin12345678',
            imageCoverLink: null
        };
        const result = await users.insertOne(adminAccount);

        console.log(`Init admin account success: ${result.insertedId}`);
    } finally {
        await client.close();
    }
}
run().catch(console.dir);
