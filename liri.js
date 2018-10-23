require("dotenv").config();
var fs = require("fs");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var request = require("request");
var moment = require("moment");

var operation = String(process.argv[2]);
var operation2 = process.argv[3];
function liriApp() {
	switch (operation) {
		case "concert-this":
			concertThis();
			break;
		case "spotify-this-song":
			spotifySong();
			break;
		case "movie-this":
			movieThis();
			break;
		case "do-what-it-says":
			doWhatItSays();
			break;
		default:
			console.log("That is not an option, try again");
			break;
	}
}

function concertThis() {
	var artist = operation2;
	request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var result = JSON.parse(body);
			for (var i = 0; i < result.length; i++) {
				console.log("=======================");
                console.log('Venue: ' + result[i].venue.name);
                console.log('\nLocation: ' + result[i].venue.city + ", " + result[i].venue.country);
				console.log('\nDate: ' + moment(result[i].datetime).format('MM/DD/YY'));
				console.log("=======================");
            }
		}
	})
}

function spotifySong() {
	songName = operation2;
	if (songName !== "") {
		spotify.search({type: 'track', query: songName, limit: 1}, function (err, data) {
			if (err) {
				return console.log("Error occurred: " + err)
			}
			console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name);
			console.log("Song Name: " + data.tracks.items[0].name);
			console.log("Preview Link: " + data.tracks.items[0].preview_url);
			console.log("Album: " + data.tracks.items[0].album.name);
		});
	} else if (songName === "") {
		spotify.search({type: 'track', query: "The Sign Ace of Base", limit: 1}, function (err, data) {
			if (err) {
				return console.log("Error occurred: " + err)
			}
			console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name);
			console.log("Song Name: " + data.tracks.items[0].name);
			console.log("Preview Link: " + data.tracks.items[0].preview_url);
			console.log("Album: " + data.tracks.items[0].album.name);
		});
	}
}

function movieThis() {
	var movieName = operation2;
	if (movieName === "") {
		request("http://www.omdbapi.com/?t=mr.nobody&y=&plot=short&apikey=trilogy", function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("Title: " + JSON.parse(body).Title);
                console.log("Year: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Languages: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
            }
        })
	} else {
		request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("Title: " + JSON.parse(body).Title);
                console.log("Year: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Languages: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
            }
        })
	}
}

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function (error, data) {
		if (error) {
			return console.log(error);
		}
		var output = data.split(",");
		operation = output[0];
		operation2 = output[1];
		liriApp();
	})
}

liriApp();