const fs = require('fs');
const _ = require('underscore');


 
// Get content from file
 var artworks_01 = fs.readFileSync("artworks_01.txt");
 var artworks_02 = fs.readFileSync("artworks_02.txt");
 var artworks_03 = fs.readFileSync("artworks_03.txt");
 var jsonArtworks = JSON.parse(artworks_01).concat(JSON.parse(artworks_02)).concat(JSON.parse(artworks_03));
 
var ArtworksSet = _.uniq(jsonArtworks, function(p){ return p.id; });
var ArtworksSetFiltered = _.filter(ArtworksSet,function(obj) {
     return !!obj.date && !!obj.medium;
});

function idYearNameMedium(artwork){
	return {
			year: parseInt(artwork.date.replace(/^[^\d]*(\d{4})([^0-9].*$)?/g, '$1')),
			//medium_pref: artwork.medium.substr(0, 10) + "..",
			medium: artwork.medium,
			title: artwork.title,
			id: artwork.id
	}
}

var almostFinalArr = _.sortBy(_.map(ArtworksSetFiltered, idYearNameMedium), function(o){return o.year});
var finalArr = _.filter(almostFinalArr,function(obj) {
     return !!obj.year;
});

fs.writeFile("./ArtworksMediums.txt", JSON.stringify(finalArr), function(err) {
	if (err) {
		return console.log(err);
	}
	console.log("The file was saved!");
});