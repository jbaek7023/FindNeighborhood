var locations = [{
    title: 'My Home',
    location: {
        lat: 37.47357,
        lng: 126.8686
    }
}, {
    title: 'Filex Gym',
    location: {
        lat: 37.47574,
        lng: 126.8694
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
    title: 'Waffle & Pencake',
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
        lat: 37.47442,
        lng: 126.8757
    }
}];

/*This is Location constructor*/
var Location = function(data) {
    this.title = data.title;
    this.location = data.location;
};

var willBeDisabledLoc = [];

/*This is ViewModel*/
var ViewModel = function() {
    var self = this;

    self.locationList = ko.observableArray([]);

    locations.forEach(function(location) {
        self.locationList.push(new Location(location));
    });


    /*Sort Locations in arphabetical order*/
    self.locationList.sort(function(left, right) {
        return left.title == right.title ? 0 : (left.title < right.title ? -1 : 1);
    });

    /*Open info window when titles are selected*/
    self.openInfoWindow = function(text) {
        //find a marker matching title from markers array
        markers.forEach(function(marker) {
            /*If marker's title and selected title are equal*/
            if ((marker.title) === (text.title)) {
                //populate the marker with largeInfoWindow
                populateInfoWindow(marker, largeInfowindow);
            }
        });
    };

    /*Define user's input as observable*/
    self.userInput = ko.observable('');
    /*Filter elements if form is submitted*/
    self.filterLocations = function(userInput) {
        //remove all elements 
        self.locationList.removeAll();

        locations.forEach(function(loc) {
            /*If loc.title has substring of user's input, push to location list. compare two values without case-sensitivity*/
            if (loc.title.toLowerCase().indexOf(self.userInput().toLowerCase()) >= 0) {
                self.locationList.push(loc);
            }
        });

        /*Delete Every Markers*/
        markers.forEach(function(marker) {
            marker.setMap(null);
        });

        /*Place markers*/
        self.locationList().forEach(function(loc) {
            markers.forEach(function(marker) {
                if (marker.title === loc.title) {
                    marker.setMap(map);
                    bounds.extend(marker.position);
                }
                map.fitBounds(bounds);
            });
        });

        /*sort after filtering*/
        self.locationList.sort(function(left, right) {
            return left.title == right.title ? 0 : (left.title < right.title ? -1 : 1);
        });
    };
};

ko.applyBindings(new ViewModel());
