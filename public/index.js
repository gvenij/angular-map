// Init app
var app = angular.module('mapApp', []);

// Main controller
app.controller('appCtrl', function(
	$scope,
	reqFactory,
	mapFactory,
	estatesFactory,
	markersFactory
) {
	$scope.currentFileNum = 0;

	// Form elements listenters
	$scope.priceChange = function() {
		$scope.filterEstates($scope.price, 'price');
	};

	$scope.roomsChange = function() {
		$scope.filterEstates($scope.rooms, 'totalNumberOfRooms');
	};

	$scope.addressChange = function() {
		$scope.filterEstates($scope.address, 'address1', true);
	};

	// Map initialization
	$scope.map = mapFactory.initializeMap('map');

	// Multifiltered objects
	$scope.filteredObjects = [];

	// Object for multiselect options
	$scope.filteredParams = {};

	// Filtering function
	$scope.filterEstates = function(filterVal, filterPar, textParameter) {
		var filtered;
		if (filterVal === '' && $scope.filteredParams[filterPar]) {
			filtered = estatesFactory.getEstates();
		} else {
			// Get matching objects from factory
			filtered = estatesFactory.getEstates().filter(function(el) {
				if (textParameter && el[filterPar].indexOf($scope.address) !== -1) {
					return el;
				} else if (+el[filterPar] === +filterVal) {
					return el;
				}
			});
		}

		// Creating map object for different options
		$scope.filteredParams[filterPar] = filtered;

		// Concatenation map object
		$scope.filteredObjects = Object.keys($scope.filteredParams).reduce(function(
			res,
			v
		) {
			return res.concat($scope.filteredParams[v]);
		},
		[]);

		// Find objects for unique multiple parameters
		var parametersLength = Object.keys($scope.filteredParams).length;
		if (parametersLength > 1) {
			var flags = {};
			var temp = $scope.filteredObjects.filter(function(el) {
				flags[el.latLon.lat] = Number.isInteger(flags[el.latLon.lat])
					? (flags[el.latLon.lat] += 1)
					: 1;
				if (flags[el.latLon.lat] === parametersLength) {
					return true;
				}
				return false;
			});
			$scope.filteredObjects = temp;
		}

		// Show filtered markers
		mapFactory.clearMarkers(null, markersFactory.markers);
		mapFactory.drawMarkers($scope.filteredObjects, $scope.map);
	};

	// Render data listener
	$scope.mapRenderObjects = function(num, map) {
		map = $scope.map;
		if (num !== $scope.currentFileNum) {
			$scope.filteredObjects = [];
			$scope.filteredParams = {};
			$scope.price = '';
			$scope.address = '';
			$scope.rooms = '';

			reqFactory
				.getData('http://localhost:8080/data/data' + num + '.json')
				.then(function(data) {
					// Resetting the markers
					mapFactory.clearMarkers(null, markersFactory.markers);
					markersFactory.markers = [];
					// Set new objects
					estatesFactory.setEstates(data);
					$scope.estates = estatesFactory.getEstates();
					// Changing the current source number
					$scope.currentFileNum = num;
					// Returning the updated objects
					return estatesFactory.getEstates();
				})
				.then(function(data) {
					mapFactory.drawMarkers(data, map);
				})
				.catch(function(error) {
					console.log('error - ', error);
				});
		}
	};

	$scope.mapRenderObjects(1, map);
});
