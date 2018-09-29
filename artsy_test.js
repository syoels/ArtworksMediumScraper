//obtained using curl -v -X POST "https://api.artsy.net/api/tokens/xapp_token?client_id=20ab26a8ee05b71621be&client_secret=d2a18da2837518d834c1ceb1be202ec3"
var fs = require('fs');

var forced_offset = 10000;
var iterations_limit = 50;
var iteration = 0;
var artworks = [];
var resp = {
    "type": "xapp_token",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsImV4cCI6MTUzNDA5NzcyNywiaWF0IjoxNTMzNDkyOTI3LCJhdWQiOiI1YjY3M2ViZjIyMDg4ZDAwMjZlM2QzNTAiLCJpc3MiOiJHcmF2aXR5IiwianRpIjoiNWI2NzNlYmYwN2YyZDUwMzQwZTA2ZThhIn0.1HVkbqJHIIQabXHLd5dECVeKYeWGev83q2wjRYbe-1I",
    "expires_at": "2018-08-12T18:15:27+00:00",
    "_links": {}
}

var traverson = require('traverson'),
    JsonHalAdapter = require('traverson-hal'),
    xappToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsImV4cCI6MTUzNDA5NzcyNywiaWF0IjoxNTMzNDkyOTI3LCJhdWQiOiI1YjY3M2ViZjIyMDg4ZDAwMjZlM2QzNTAiLCJpc3MiOiJHcmF2aXR5IiwianRpIjoiNWI2NzNlYmYwN2YyZDUwMzQwZTA2ZThhIn0.1HVkbqJHIIQabXHLd5dECVeKYeWGev83q2wjRYbe-1I";

traverson.registerMediaType(JsonHalAdapter.mediaType, JsonHalAdapter);
api = traverson.from('https://api.artsy.net/api').jsonHal();

function getNext(worksCount) {
    api.newRequest()
        .follow('artworks')
        .withRequestOptions({
            headers: {
                'X-Xapp-Token': xappToken,
                'Accept': 'application/vnd.artsy-v2+json'
            }
        })
        .withTemplateParameters({
            size: worksCount,
            offset: forced_offset + (iteration * worksCount)
        })
        .getResource(function(error, resp) {
			if(!error){
            artworks = artworks.concat(resp._embedded.artworks);
            iteration = iteration + 1;
            if (iteration <= iterations_limit) {
                getNext(worksCount);
            } else {

                fs.writeFile("./artworks.txt", JSON.stringify(artworks), function(err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The file was saved!");
                });
            }
			}
			else {
				
				    fs.writeFile("./artworks.txt", JSON.stringify(artworks), function(err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The file was saved after error in iteration " + iteration);
                });
				
			}
        });
}

getNext(300);