const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Create connection schema
const connectionSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: false
    },
    band: {
        type: String,
        required: true        
    },
    genre: {
        type: String,
        required: true        
    },
    details: {
        type: String,
        required: true        
    },
    location: {
        type: String,
        required: true        
    },
    date: {
        type: String,
        required: true        
    },
    time: {
        type: String,
        required: true        
    }
});

// Create model based on schema (call it singlar of collection name)
const Connection = mongoose.model('Connection', connectionSchema, 'connections'); 

module.exports = Connection;

/*
class Concert {
    constructor(id, band, genre, details, location, date, time) {
        this.id = id;
        this.band = band;
        this.genre = genre;
        this.details = details;
        this.location = location;
        this.date = date;
        this.time = time;
    }

    // This is used to trim the spaces and make string lowercase for easier routing. 
    getEditedURL() {
        return this.getGenre().toLowerCase() + '/' + this.getBand().replace(/\s+/g, '').toLowerCase();
    }

    getImageURL() {
        return '/assets/images/band/' + this.band.replace(/\s+/g, '').toLowerCase() + '.jpg';
    }

    getID() {
        return this.id;
    }

    setID(id) {
        this.id = id;
    }

    getBand() {
        return this.band;
    }


    setBand(band) {
        this.band = band;
    }

    getGenre() {
        return this.genre;
    }

    setGenre(genre) {
        this.genre = genre;
    }

    getDetails() {
        return this.details;
    }

    setDetails(details) {
        this.details = details;
    }

    getLocation() {
        return this.location;
    }

    setLocation(location) {
        this.location = location;
    }

    getDate() {
        return this.date;
    }

    setDate(date) {
        this.date = date;
    }

    getTime() {
        return this.time;
    }

    setTime(time) {
        this.time = time;
    }
}


module.exports = Concert;
*/