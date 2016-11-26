var map;
var markers = [];
var activeMarkers = [];
var largeInfowindow;
var bounds;
var menuIcon = $('#menu-icon');
var optionsBox = $('.options-box');
var navBar = $('#nav');

var container = $('.container');


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: locations[3].location.lat,
            lng: locations[3].location.lng
        },
        zoom: 16,
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


        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            lat: lat,
            lng: lng,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            if(activeMarkers.length==0){
                this.setAnimation(google.maps.Animation.BOUNCE);
                activeMarkers.push(this);
            } else if(activeMarkers[0].title==this.title){

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

        /*Adding bounce for markers*/
        // marker.addListener('click', function() {
            
        //  });
        
        
        // Push the marker to our array of markers.
        markers.push(marker);
        bounds.extend(markers[i].position);
    }
    //navigate the center point of the map when window resized.(Reactive)
    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });
}

function populateInfoWindow(marker, infowindow) {
    bounds.extend(marker.position);
    if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;

        infowindow.addListener('closeclick', function() {
            // infowindow.marker = null;
            if(activeMarkers.length>0){
                activeMarkers[0].setAnimation(null);
            }
            activeMarkers = [];
        }); //end of previous example omitted infowindow.open(map, marker);

        //determine streetView Service 
        var streetViewService = new google.maps.StreetViewService();
        //determine radius
        var radius = 50;

        /*we are trying to put panorama(street view) to the info inwindow!*/
        function getStreetView(data, status) {
            var streetAddress = '';
            var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + marker.lat + ',' + marker.lng + '&sensor=true';

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
                    //If status is not OK (ERR Handling)
                    infowindow.setContent('<h3 class="streetView">' + marker.title + '</h3><div class="streetView">' + streetAddress + '</div><div class="streetView">' + 'No Street View Found' + '</div>');
                }
            }).fail(function(){
                infowindow.setContent('<h3 class="streetView">Sorry, we couldn\'t find your address</h3>');
            });
        }
        //getPenoramaByLocation
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }

    //toggle menu icon
    menuIcon.on('click', function() {
        container.toggleClass('open');
    });
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
