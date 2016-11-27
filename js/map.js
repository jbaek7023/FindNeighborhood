var map;
var markers = [];
var activeMarkers = [];
var largeInfowindow;
var bounds;
var menuIcon = $('#menu-icon');
var optionsBox = $('.options-box');
var navBar = $('#nav');

var client_id = 'JCUSOXOIXJDLKNNQWOKGSQZSBCVZEK1J1RMHGUEF1WQ0KW5U';
var client_secret = 'WMQHRCD22RR0TFRWOY10CRHD4JCQRU3D4MZPQJ1WN4PRU3JS';
var optionsBox = $('aside');
var navBar = $('nav');
var container = $('.container');

function initMap() {
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: locations[6].location.lat,
            lng: locations[6].location.lng
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
            icon: defaultIcon
        });
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            if (activeMarkers.length === 0) {
                this.setAnimation(google.maps.Animation.BOUNCE);
                activeMarkers.push(this);
            } else if (activeMarkers[0].title == this.title) {

            } else {
                activeMarkers[0].setAnimation(null);
                activeMarkers = [];
                this.setAnimation(google.maps.Animation.BOUNCE);
                activeMarkers.push(this);
            }
            populateInfoWindow(this, largeInfowindow);
        });

        /*Setting Markers' Icon*/
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        bounds.extend(markers[i].position);
    }
    //toggle menu icon
    menuIcon.on('click', function() {
        container.toggleClass('open');
    });
}


function handleError() {
    $('#map').text('Sorry, couldn\'t load Google API');
}

function populateInfoWindow(marker, infowindow) {
    bounds.extend(marker.position);
    if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;

        infowindow.addListener('closeclick', function() {
            // infowindow.marker = null;
            if (activeMarkers.length > 0) {
                activeMarkers[0].setAnimation(null);
            }
            activeMarkers = [];
        }); //end of previous example omitted infowindow.open(map, marker);

        //determine streetView Service 
        var streetViewService = new google.maps.StreetViewService();
        //determine radius
        var radius = 50;

        var streetAddress = "";
        var cityAddress = "";
        var phoneNumber = "";

        //put panorama(street view) to the info inwindow!
        var getStreetView = function (data, status) {
            var self = data;
            var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + marker.lat + ',' + marker.lng + '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=20160118' + '&query=' + marker.title;
            //getting JSON data from four square (Third Party API)
            $.getJSON(foursquareURL, function(data) {
                var results = data.response.venues[0];

                streetAddress = results.location.formattedAddress[0];
                cityAddress = results.location.formattedAddress[1];
                phoneNumber = results.contact.formattedPhone;
                if (typeof phoneNumber === 'undefined') {
                    phoneNumber = "";
                } else if (typeof streetAddress === 'undefined') {
                    streetAddress = "";
                } else if (typeof cityAddress === 'undefined') {
                    cityAddress = "";
                }

                var infowindowContent = "";
                /*Adding Panorama*/
                if (status == google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = self.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(
                        nearStreetViewLocation, marker.position);

                    //define info window content
                    infowindowContent = '<div class="streetView"><h3>' + marker.title + '</h3>' +
                        '<div>' + streetAddress + '</div><div>' + cityAddress + '</div><div>' + phoneNumber + '</div></div>' + '<div id="pano"></div>';

                    //set info window content
                    infowindow.setContent(infowindowContent);
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
                    //If status is not OK (ERR Handling)
                    infowindowContent = '<div class="streetView"><h3>' + marker.title + '</h3>' +
                        '<div>' + streetAddress + '</div><div>' + cityAddress + '</div><div>' + phoneNumber + '</div>' + '<div> No Street View Found</div></div>';

                    infowindow.setContent(infowindowContent);
                }
            }).fail(function(jqxhr, textStatus, error) { //error handling
                infowindowContent = '<div class="streetView"><h3>' + marker.title + '</h3>' +
                    '<div> Sorry, no information available</div></div>';
                infowindow.setContent(infowindowContent);
            });
        };
        //getPenoramaByLocation
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }

    window.onresize = function() {
        map.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
    };
}

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(30, 40),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(30, 44));
    return markerImage;
}