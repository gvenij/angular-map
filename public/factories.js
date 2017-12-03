// Estates factory
app.factory('estatesFactory', function() {
	var estates = [];

	return {
		getEstates: function() {
			return estates;
		},
		setEstates: function(data) {
			estates = data;
		}
	};
});

// Markers factory
app.factory('markersFactory', function() {
	return {
		markers: []
	};
});

// Factory for http requests
app.factory('reqFactory', function($http) {
	return {
		getData: function(url) {
			return $http.get(url).then(function(result) {
				return result.data;
			});
		}
	};
});

// Factory fom map manipulation
app.factory('mapFactory', function(markersFactory, estatesFactory) {
	var mapObj = {};
	(mapObj.initializeMap = function(mapSelector) {
		// Map options
		var options = {
			zoom: 12,
			center: {
				lat: 55.660058,
				lng: 12.521015
			}
		};
		// New map
		var map = new google.maps.Map(
			document.getElementById(mapSelector),
			options
		);

		return map;
	}),
		(mapObj.drawMarkers = function(data, map) {
			for (var i = 0; i < data.length; i++) {
				mapObj.addMarker(data[i], map);
			}
		}),
		// Add Marker Function
		(mapObj.addMarker = function(props, map) {
			var marker = new google.maps.Marker({
				position: {
					lat: props.latLon ? props.latLon.lat : props.position.lat(),
					lng: props.latLon ? props.latLon.lon : props.position.lng()
				},
				map: map
			});

			// Check content
			if (props.address1 && props.price && props.totalNumberOfRooms) {
				var infoWindow = new google.maps.InfoWindow({
					content:
						'<h4>' +
						props.address1 +
						'</h4>' +
						'<p>Price: ' +
						props.price +
						'</p>' +
						'<p>Rooms: ' +
						props.totalNumberOfRooms +
						'</p>'
				});

				marker.addListener('click', function() {
					infoWindow.open(map, marker);
				});
			} else {
				var filteredMarkerContent = {};
				// Get matched object content
				var objects = estatesFactory.getEstates();
				for (var j = 0; j < objects.length; j++) {
					if (props.position.lat() === objects[j].latLon.lat) {
						filteredMarkerContent.address1 = objects[j].address1;
						filteredMarkerContent.totalNumberOfRooms =
							objects[j].totalNumberOfRooms;
						filteredMarkerContent.price = objects[j].price;
					}
				}

				var infoWindow = new google.maps.InfoWindow({
					content:
						'<h4>' +
						filteredMarkerContent.address1 +
						'</h4>' +
						'<p>Price: ' +
						filteredMarkerContent.price +
						'</p>' +
						'<p>Rooms: ' +
						filteredMarkerContent.totalNumberOfRooms +
						'</p>'
				});

				marker.addListener('click', function() {
					infoWindow.open(map, marker);
				});
			}

			markersFactory.markers.push(marker);
		}),
		// Removes the markers from the map, but keeps them in the array.
		(mapObj.clearMarkers = function(map, markers) {
			for (var i = 0; i < markers.length; i++) {
				markers[i].setMap(map);
			}
		});

	return mapObj;
});
