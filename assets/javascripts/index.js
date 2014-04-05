var map; 
var geocoder; 
var lat1;
var lon1; 
var lat2; 
var lon2;

function CalcDistanceBetween(lat1, lon1, lat2, lon2) {
    //Radius of the earth in:  1.609344 miles,  6371 km  | var R = (6371 / 1.609344);
    var R = 3958.7558657440545; // Radius of earth in Miles 
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}

function toRad(Value) {
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}

function getPlaces(results, status){
	console.log("get results of search query")
	if (status == google.maps.places.PlacesServiceStatus.OK) 
		console.log("here in callback");
	else 
		console.log('no results found');
}

function initialize() {
		var gl = navigator.geolocation;
		if (gl){
			geocoder = new google.maps.Geocoder();
			  gl.getCurrentPosition(function (position) {
			  		var mapOptions = {
    					zoom: 5,
    					center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
  					};
  					//console.log('in the call backkkk')
  				 	map = new google.maps.Map(document.getElementById('map-canvas'),
    				mapOptions);
			  }, noGeo);
		}else 
			noGeo();
}

function noGeo (positionError){
		geocoder = new google.maps.Geocoder();
		var mapOptions = {
    		zoom: 3,
    		center: new google.maps.LatLng(position.cords.latitude, position.cords.longitude)
  		};
  		map = new google.maps.Map(document.getElementById('map-canvas'),
    	mapOptions);
}

function loadScript() {
  		var script = document.createElement('script');
 	 	script.type = 'text/javascript';
  		script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&' +
      	'callback=initialize';
  		document.body.appendChild(script);
}

function autocompletehelper (request, response,DOMparam) {
	//console.log("event happppppeenin")

	$.ajax({
		type: 'GET',
		url: "/ajax",
		data: {q : $("#"+DOMparam).val(), fmt: "JSON"},
		contentType: 'application/json',
		datatype: "json",
		success: function (data){
            //console.log(JSON.parse(data));
            data = JSON.parse(data);
            //console.log(data);
			var airports = data;
			response($.map(airports, function(item) {
                return {
                    label: item.name,
                    value: item.name + "," + item.location
                };
            }));
		}

	});
}

function geoCoderCallback (results, status){
	 if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
      lat1 = results[0].geometry.location.k; //lat
      lon1 = results[0].geometry.location.A; //long
      console.log($('#field2').val());
      //make 
      geocoder.geocode({'address': $('#field2').val()}, 
      		function(results, status) {
      			if (status == google.maps.GeocoderStatus.OK){
      				map.setCenter(results[0].geometry.location);
      				var marker = new google.maps.Marker({
          				map: map,
          				position: results[0].geometry.location
      				});
      				lat2 = results[0].geometry.location.k; //lat
      				lon2 = results[0].geometry.location.A; //long
      				var answer = CalcDistanceBetween(lat1, lon1, lat2, lon2);
      				$('#answer').text('The Nautical distance is ' + answer + ' miles');
      			}else
      				alert('cannot find your coords');
      		});
    } else {
      alert('Cannot find coords for this airport ' + status);
    }
}
$(document).ready(function() {
	$("#field1").autocomplete({
		source: function(a,b,c){ autocompletehelper(a,b,"field1")},
		minLength: 2
	});
	$("#field2").autocomplete({
		source: function(a,b){ autocompletehelper(a,b,"field2")},
		minLength: 2
	});
	$("#field1, #field2").on('keyup', function(e){
			if (e.keyCode === 13 && $.trim($('#field1')).length != 1 
				&& $.trim($('#field2')).length != 1 && map == null){
				//situation where we need to initailze map
				console.log('both fields are full')
				loadScript();
				//now use places api to get addresses of these places
				service = new google.maps.places.PlacesService(map);

			}else if (e.keyCode === 13 && $.trim($('#field1')).length != 1 
					  && $.trim($('#field2')).length != 1 && map != null){
					//map is already loaded
					console.log("map loaded, gettingp places");
					//console.log($('#field1').val());
					var text1 = $('#field1').val();
					console.log(text1);
					geocoder.geocode({'address': text1}, geoCoderCallback);
			}
	});
});
