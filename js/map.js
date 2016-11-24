var map;
var markers=[];
function initMap() {

	var locations = [
		{title: 'My Home', location: {lat: 37.47217, lng: 126.8686}},
		{title: 'Filex Gym', location: {lat: 37.47574, lng: 126.8684}},
		{title: 'Cheolsan Subway Station', location: {lat: 37.47590, lng: 126.8681}},
		{title: 'Sung-Gae Medical Center', location: {lat: 37.47351, lng: 126.8718}},
		{title: 'Delicious Waffle and pencake truck', location: {lat: 37.47393, lng: 126.8713}},
		{title: 'Ha-An Library', location: {lat: 37.46828, lng: 126.8744}},
		{title: 'Cheolsan Library', location: {lat: 37.47715, lng: 126.8725}},
		{title: 'Cheolsan Big-Bridge', location: {lat: 37.47482, lng: 126.8772}}
	];

	map = new google.maps.Map(document.getElementById('map'), {
	center: {lat: locations[0].location.lat, lng: locations[0].location.lng},
	zoom: 17,
	//styles: styles,
	mapTypeControl: false /*mapTypeControl is to enable user to set road, satellite mode and so on*/
	});

	for (var i = 0; i < locations.length; i++) {
		// Get the position from the location array.
		var position = locations[i].location;
		var title = locations[i].title;
		// Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
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
	}
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