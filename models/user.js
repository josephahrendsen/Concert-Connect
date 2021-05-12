const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create connection schema
const userSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    fname: {
        type: String,
        required: true        
    },
    lname: {
        type: String,
        required: true        
    },
    email: {
        type: String,
        required: true        
    }
});

// Create model based on schema (call it singlar of collection name)
const User = mongoose.model('User', userSchema, 'users'); 

module.exports = User;

/*
class User {
    constructor(id, fname, lname, email) {
        this.id = id;
        this.fname = fname;
        this.lname = lname;
        this.email = email
    }

    getID() {
        return this.id;
    }

    setID(id) {
        this.id = id;
    }

    getFname() {
        return this.fname;
    }

    setFname(fname) {
        this.fname = fname
    }

    getLname() {
        return this.lname;
    }

    setLname(lname) {
        this.lname = lname;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }
}

module.exports = User;
*/