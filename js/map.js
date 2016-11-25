var map;
var markers = [];
var largeInfowindow;
var bounds;
var menuIcon = $('#menu-icon');
var optionsBox = $('aside');
var navBar = $('nav');
var container = $('.container');

function initMap() {
    //menu-icon animation
    menuIcon.on('click', function() {
        container.toggleClass("open");
    });

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: locations[0].location.lat,
            lng: locations[0].location.lng
        },
        zoom: 15,
        mapTypeControl: false
    });

    largeInfowindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();
    
    var defaultIcon = makeMarkerIcon('E45641');
    var highlightedIcon = makeMarkerIcon('F1A94E');

    /*Putting Markers*/
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        var lat = locations[i].location.lat;
        var lng = locations[i].location.lng;
        var id = locations[i].id;

        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            lat: lat,
            lng: lng,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            yid: id
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            toggleBounce(this);
            populateInfoWindow(this, largeInfowindow);
        });
        
        /*Setting Markers' Icon*/
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });    
        bounds.extend(markers[i].position);
    }
}

function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function populateInfoWindow(marker, infowindow) {
    bounds.extend(marker.position);
    if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;

        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        }); //end of previous example omitted infowindow.open(map, marker);

        //determine streetView Service 
        var streetViewService = new google.maps.StreetViewService();
        //determine radius
        var radius = 50;

        /*we are trying to put panorama(street view) to the info inwindow!*/
        function getStreetView(data, status) {
            var streetAddress = '';
            var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + marker.lat + ',' + marker.lng + '&sensor=true';

            var yelpURL = 'https://api.yelp.com/v2/business/'+marker.yid;
            var rating =0;

            /*get jSON data from yelp url*/
            $.getJSON(yelpURL, function(jsonData) {
                if(jsonData.results.length>0){
                    rating = jsonData.rating;
                }
                alert(rating);
            });    

            //getting JSON data fomr url
            $.getJSON(url, function(jsonData) {
                if (jsonData.results.length > 0) {
                    streetAddress = jsonData.results[0].formatted_address;
                }
                /*Adding Panorama*/
                if (status == google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(
                        nearStreetViewLocation, marker.position);
                    infowindow.setContent('<h3 class="streetView">' + marker.title + '</h3><div class="streetView">' + streetAddress + '</div><div id="pano"></div>');
                    /*panoramaOptions take nearStreetViewLocation and heading*/
                    var panoramaOptions = {
                        position: nearStreetViewLocation,
                        pov: {
                            heading: heading,
                            pitch: 30
                        }
                    };
                    //define panorama by panorama Options
                    var panorama = new google.maps.StreetViewPanorama(
                        document.getElementById('pano'), panoramaOptions);

                } else {
                    //If status is not OK (Error Handling)
                    infowindow.setContent('<h3 class="streetView">' + marker.title + '</h3><div class="streetView">' + streetAddress + '</div><div class="streetView">' + 'No Street View Found' + '</div>');
                }
            }).fail(function(){
                //handle error if coordinates couldn't find the address from JSON
                infowindow.setContent('<h3 class="streetView">Sorry, we couldn\'t find your address</h3>');
            });
        }
        //getPenoramaByLocation
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
    window.onresize = function() {
        map.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
    }
}

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(30, 40),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(30,44));
    return markerImage;
}

function googleMapError() {
    alert("Something went wrong with Google API");
}
