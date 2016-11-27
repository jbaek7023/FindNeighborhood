var locations = [{

    title: 'Antico Pizza Napoletana',
    location: {
        lat: 33.783621,
        lng: -84.404552
    },
    id: 'antico-pizza-atlanta'
}, {
    title: 'Vortex Bar & Grill',
    location: {
        lat: 33.776527,
        lng: -84.388646
    },
    id: 'the-vortex-bar-and-grill-midtown-atlanta'
}, {
    title: 'Chick-fil-A',
    location: {
        lat: 33.7738306,
        lng: -84.3999051
    },
    id: 'chick-fil-a-atlanta-64?osq=Chick-fil+a'
}, {
    title: 'West Egg Cafe',
    location: {
        lat: 33.7729774,
        lng: -84.405898
    },
    id: 'west-egg-café-atlanta-2'
}, {
    title: 'Pizza Hut',
    location: {
        lat: 33.7815867,
        lng: -84.4047339
    }, 
    id: 'pizza-hut-atlanta-88?osq=pizza+hut'
}, {
    title: 'Papa John\'s Pizza',
    location: {
        lat: 33.7804760,
        lng: -84.4051981
    },
    id: 'papa-johns-pizza-atlanta-15'
}, {
    title: 'Waffle House',
    location: {
        lat: 33.7755879,
        lng: -84.389796
    },
    id: 'waffle-house-atlanta-82?osq=Waffle+house'
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
                new google.maps.event.trigger(marker, 'click');
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

