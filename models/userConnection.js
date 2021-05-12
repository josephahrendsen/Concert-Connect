const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create userConnection schema
const userConnectionSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: false
    },
    connection: {
        type: Schema.Types.ObjectId, ref: 'Connection',
        required: true
    }, 
    rsvp: {
        type: String,
        required: true
    }
})

// Create model based on schema (call it singlar of collection name)
const UserConnection = mongoose.model('UserConnection', userConnectionSchema, 'userConnections'); 

module.exports = UserConnection;