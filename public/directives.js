// Directive for price filter
app.directive('priceFilter', function() {
	return {
		template:
			'<div class="form-group"><label for="price">Choose price</label><select id="price" class="form-control" ng-change="priceChange($event)" ng-model="price"> <option val=""></option>' +
			' <option ng-repeat="estate in estates | unique : \'price\' " val="{{estate.price}}">{{estate.price}}</option>' +
			'</select></div>'
	};
});

// Directive for rooms number filter
app.directive('roomsFilter', function() {
	return {
		template:
			'<div class="form-group"><label for="rooms">Choose number of rooms</label><select id="rooms" class="form-control" ng-change="roomsChange()" ng-model="rooms"> <option val=""></option><option ng-repeat="estate in estates | unique : \'totalNumberOfRooms\'" val="{{estate.totalNumberOfRooms}}">{{estate.totalNumberOfRooms}}</option>' +
			'</select></div>'
	};
});

// Directive for object address filter
app.directive('addressFilter', function() {
	return {
		template:
			'<div class="form-group"><label for="address">Type address</label><input id="address" class="form-control" ng-change="addressChange()" ng-model="address"></div>'
	};
});
