var map;
var markers=[];
var largeInfowindow;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	center: {lat: locations[0].location.lat, lng: locations[0].location.lng},
	zoom: 17,
	mapTypeControl: false 
	});
	
	largeInfowindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();

	for (var i = 0; i < locations.length; i++) {
		// Get the position from the location array.
		var position = locations[i].location;
		var title = locations[i].title;
		// Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
			map: map,
			position: position,
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
	map.fitBounds(bounds);
}

function populateInfoWindow(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + '</div>');
		infowindow.open(map, marker);
		
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
		});
	}
}