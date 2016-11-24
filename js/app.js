//handle list, filter, and any other information on the page that is subjecto change 

//Do not implement Creating Markers, tracking click events on markers, refreshing the map
/*This is all of location dats*/
var locations = [{
    title: 'My Home',
    location: {
        lat: 37.47217,
        lng: 126.8686
    }
}, {
    title: 'Filex Gym',
    location: {
        lat: 37.47574,
        lng: 126.8684
    }
}, {
    title: 'Cheolsan Subway Station',
    location: {
        lat: 37.47590,
        lng: 126.8681
    }
}, {
    title: 'Sung-Gae Medical Center',
    location: {
        lat: 37.47351,
        lng: 126.8718
    }
}, {
    title: 'Delicious Waffle and pencake truck',
    location: {
        lat: 37.47393,
        lng: 126.8713
    }
}, {
    title: 'Ha-An Library',
    location: {
        lat: 37.46828,
        lng: 126.8744
    }
}, {
    title: 'Cheolsan Library',
    location: {
        lat: 37.47715,
        lng: 126.8725
    }
}, {
    title: 'Cheolsan Big-Bridge',
    location: {
        lat: 37.47482,
        lng: 126.8772
    }
}];

/*This is Location constructor*/
var Location = function(data) {
	this.title = data.title;
	this.location = data.location;
}

/*This is ViewModel*/
var ViewModel = function(){
	var self = this;

	self.locationList = ko.observableArray([]);

    locations.forEach(function(location){
		self.locationList.push(new Location(location));
	});


	/*Sort Locations in arphabetical order*/
    self.locationList.sort(function(left, right) {
		return left.title == right.title ? 0 : (left.title<right.title ? -1 : 1)
	});


    /*make user's input observable*/
    self.userInput = ko.observable('');

    /*Filter elements if form is submitted*/
    self.filterLocations = function(userInput) {
        //remove every elements 
        self.locationList.removeAll();

        locations.forEach(function(loc){  
            /*If loc.title has substring of user's input,*/
            if(loc.title.indexOf(self.userInput())>=0) {
                /*push to location list*/
                self.locationList.push(loc);
            }
        });
        /*sort after filtering*/
        self.locationList.sort(function(left, right) {
            return left.title == right.title ? 0 : (left.title<right.title ? -1 : 1)
         });
	}
}

ko.applyBindings(new ViewModel());
