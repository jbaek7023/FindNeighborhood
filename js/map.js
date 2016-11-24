var map;
var markers = [];
var largeInfowindow;
var bounds;

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
            //icon: defaultIcon,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
        bounds.extend(markers[i].position);
    }
}

function populateInfoWindow(marker, infowindow) {
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
        	var streetAddress='';
	    	var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+marker.lat+','+marker.lng+'&sensor=true';
	    	//getting JSON data fomr url
	    	$.getJSON(url, function(jsonData) {
	    		if(jsonData.results.length>0) {
	    			streetAddress = jsonData.results[0].formatted_address;
	    			console.log("2"+streetAddress);
	    		}		
	    		console.log("3"+streetAddress);


	    		/*Adding Panorama*/
	    		if (status == google.maps.StreetViewStatus.OK) {
	            	
	                var nearStreetViewLocation = data.location.latLng;
	                var heading = google.maps.geometry.spherical.computeHeading(
	                    nearStreetViewLocation, marker.position);
	                console.log("1.5"+streetAddress);
	                infowindow.setContent('<div class="streetView">' + marker.title + '</div><div class="streetView">'+streetAddress+'</div><div id="pano"></div>');
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
	                infowindow.setContent('<div class="streetView">' + marker.title + '</div>'+'<div class="streetView">'+'No Street View Found'+'</div>');
	            }
			})	
        }
        //getPenoramaByLocation
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}