var locations = [{
    title: 'Antico Pizza Napoletana',
    location: {
        lat: 33.783621,
        lng: -84.404552
    }
}, {
    title: 'Vortex Bar & Grill',
    location: {
        lat: 33.776527,
        lng: -84.388646
    }
}, {
    title: 'Chick-fil-A',
    location: {
        lat: 33.7738306,
        lng: -84.3999051
    }
}, {
    title: 'West Egg Cafe',
    location: {
        lat: 33.7729774,
        lng: -84.405898
    }
}, {
    title: 'Pizza Hut',
    location: {
        lat: 33.7815867,
        lng: -84.4047339
    }
}, {
    title: 'Papa John\'s Pizza',
    location: {
        lat: 33.7804760,
        lng: -84.4051981
    }
}, {
    title: 'Waffle House',
    location: {
        lat: 33.7755879,
        lng: -84.389796
    }
}];

//This is Location constructor
var Location = function(data) {
    this.title = data.title;
    this.location = data.location;
};

var willBeDisabledLoc = [];

// This is ViewModel
var ViewModel = function() {
    var self = this;

    self.locationList = ko.observableArray([]);

    locations.forEach(function(location) {
        self.locationList.push(new Location(location));
    });

    //Sort Locations in arphabetical order
    self.locationList.sort(function(left, right) {
        return left.title == right.title ? 0 : (left.title < right.title ? -1 : 1);
    });

    //Open info window when titles are selected
    self.openInfoWindow = function(text) {
        //find a marker matching title from markers array
        markers.forEach(function(marker) {
            //If marker's title and selected title are equal
            if ((marker.title) === (text.title)) {
                //click trigger!
                google.maps.event.trigger(marker, 'click');
            }
        });
    };

    //Define user's input as observable
    self.userInput = ko.observable('');
    //Filter elements if form is submitted
    self.filterLocations = function(userInput) {
        //remove all elements 
        self.locationList.removeAll();

        locations.forEach(function(loc) {
            //If loc.title has substring of user's input, push to location list. compare two values without case-sensitivity
            if (loc.title.toLowerCase().indexOf(self.userInput().toLowerCase()) >= 0) {
                self.locationList.push(loc);
            }
        });

        //Delete Every Markers
        markers.forEach(function(marker) {
            marker.setVisible(false);
        });

        //Place markers
        self.locationList().forEach(function(loc) {
            markers.forEach(function(marker) {
                if (marker.title === loc.title) {
                    marker.setVisible(true);
                    bounds.extend(marker.position);
                }
            });
        });

        //sort after filtering
        self.locationList.sort(function(left, right) {
            return left.title == right.title ? 0 : (left.title < right.title ? -1 : 1);
        });
    };
};

ko.applyBindings(new ViewModel());