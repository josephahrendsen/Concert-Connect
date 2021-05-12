const mongoose = require('mongoose');
const dbPath = 'mongodb://localhost/ConcertConnect';
const Connection = require('../models/connection');

// Connect to db
mongoose.connect(dbPath, {useNewUrlParser:true, useUnifiedTopology: true})
    .then(function(result){
        console.log('mongoDB connected');
    })
    .catch(function(error){
        console.log('Error : ' + error);
    }) 

class ConcertDB {
    concerts = Connection.find(function (err, data) {
        if (err) return console.error(err);
        return data;
    });      

    // Function to retrieve all concerts
    getConcerts() {
        return this.concerts;
    }

    // Function to retrieve specific concert
    getConcert(concertName) {
        for(var i = 0; i < this.concerts.   length; i++) {
            if(this.concerts[i].band == concertName) {
                return this.concerts[i];
            }
        }
    }

    // Function to retrieve concert from ID
    getConcertFromID(concertID) {
        var concerts = this.concerts;
        // Wrapped function in promise
        return new Promise(function(resolve, reject) {
            concerts.then(function(data) {
                for(var i = 0; i < data.length; i++) {
                    if(data[i].id == concertID) {
                        resolve(data[i]);
                    }
                }    
            })
        });
    }

    // Function used to route to band detail page. Will return band name lowercase and without spaces. Return specified band object.
    getBandNoSpaces(band) {
        // Copy global promise fetching all db records to use below
        var concerts = this.concerts;

        // Wrapped function in promise
        return new Promise(function(resolve, reject) {
            concerts.then(function(data) {
                for(var i = 0; i < data.length; i++) {
                    var bandMatch = data[i].band.replace(/\s+/g, '').toLowerCase()
                    if(band == bandMatch) {
                        resolve(data[i]);
                    }
                }
            });     
        });
    }

    // Hardcoded list of acceptable genres
    getGenres() {
        return ['Rock', 'Indie', 'Pop', 'Country', 'Jazz', 'Rap'];
    }

    // Function used to help order by genre
    getBands(genre) {
        var bands = [];
        genre = genre[0].toUpperCase() + genre.slice(1);

        // wrapped function in promise
        return new Promise(function(resolve, reject) {
            Connection.find({genre: genre}, function (err, data) {
                if (err) return console.error(err);
            })
            .then(function(data) {
                if(genre == 'Rock') {
                    for(var i = 0; i < data.length; i++) {
                        if(data[i].id[0] == 'A') {
                            bands.push(data[i]);
                        }
                    }
                    //console.log(bands);
                    resolve(bands);
                } else if(genre == 'Pop') {
                    for(var i = 0; i < data.length; i++) {
                        if(data[i].id[0] == 'B') {
                            bands.push(data[i]);
                        }
                    }
                    resolve(bands);
                } else if(genre == 'Indie') {
                    for(var i = 0; i < data.length; i++) {
                        if(data[i].id[0] == 'C') {
                            bands.push(data[i]);
                        }
                    }
                    resolve(bands);
                } else if(genre == 'Country') {
                    for(var i = 0; i < data.length; i++) {
                        if(data[i].id[0] == 'D') {
                            bands.push(data[i]);
                        }
                    }
                    resolve(bands);
                } else if(genre == 'Jazz') {
                    for(var i = 0; i < data.length; i++) {
                        if(data[i].id[0] == 'E') {
                            bands.push(data[i]);
                        }
                    }
                    resolve(bands);
                } else if(genre == 'Rap') {
                    for(var i = 0; i < data.length; i++) {
                        if(data[i].id[0] == 'F') {
                            bands.push(data[i]);
                        }
                    }
                    resolve(bands);
                } else {
                    return 404;
                }     
            })
            .catch(function(error){
                console.log('Error : ' + error);
            });  
        }); 
    }

    async createNewConnection(currentUser, band, genre, details, location, date, time) {
        try {
            // In a perfect system, I would do ID's a little bit differenly, but for demonstration this work fine.
            var id = 0;
            switch(genre) {
                case "Rock":
                    id = "A4";
                    break;
                case "Pop":
                    id = "B4";
                    break;
                case "Indie":
                    id = "C4";
                    break;
                case "Country":
                    id = "D4";
                    break;
                case "Jazz":
                    id = "E4";
                    break;
                case "Rap":
                    id = "F4";
            }
            var userID = currentUser._id;
            var connection = new Connection({
                id: id,
                userID: userID,
                band: band, 
                genre: genre, 
                details: details, 
                location: location, 
                date: date, 
                time: time
            });
            await connection.save(function(err) {
                if(err) console.log(err);
            })
        } catch(err) {
            console.log(err);
            return err;
        }
        return connection;
    }
}

module.exports = ConcertDB;