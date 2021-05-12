const Connection = require("../models/connection");
const UserConnection = require("../models/userConnection")
const User = require('../models/user');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create userConnection schema
const userProfileSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: false
    },
    user: {
        type: Object,
        required: true
    }, 
    userConnections: {
        type: Array,
        required: true
    }
})

// Create model based on schema (call it singlar of collection name)
const UserProfile = mongoose.model('UserProfile', userProfileSchema, "userProfiles"); 

module.exports = UserProfile;