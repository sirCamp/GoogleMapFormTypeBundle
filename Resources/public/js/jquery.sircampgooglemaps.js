(function( $ ) {

	function GoogleMapType(settings, map_el) {

		var settings = $.extend( {
			  'search_input_el'    : null,
			  'search_action_el'   : null,
			  'search_error_el'    : null,
			  'current_position_el': null,
			  'default_lat'        : '1',
			  'default_lng'        : '-1',
			  'default_zoom'       : 5,
			  'lat_field'          : null,
			  'lng_field'          : null,
			  'street_field'       : null,
			  'city_field'         : null,
			  'postcode_field'     : null,
			  'error_alert'		   : null,
			  'error_span'		   : null,
			  'callback'           : function (location, gmap) {},
			  'error_callback'     : function(status) {
			  	$this.settings.search_error_el.text(status);
			  },
			}, settings);

		this.settings = settings;

		this.map_el = map_el;

		this.geocoder = new google.maps.Geocoder();

	}

	GoogleMapType.prototype = {
		initMap : function(center) {

			var center = new google.maps.LatLng(this.settings.default_lat, this.settings.default_lng);

			var mapOptions = {
				zoom: this.settings.default_zoom,
				center: center,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
			var $this = this;
			
			this.map =  new google.maps.Map(this.map_el[0], mapOptions);

			this.addMarker(center);

			google.maps.event.addListener(this.marker, "dragend", function(event) {

				var point = $this.marker.getPosition();
				$this.map.panTo(point);
				$this.updateLocation(point);
			});

			google.maps.event.addListener(this.map, 'click', function(event) {
				console.log(event);
				$this.insertMarker(event.latLng);
			});

			this.settings.search_action_el.click($.proxy(this.searchAddress, $this));
			
			this.settings.current_position_el.click($.proxy(this.currentPosition, $this));
		},

		getAddressFromCoordinate : function(coords){
			var $this = this;
			$this.geocoder.geocode({ latLng: coords },function(responses) {

					var obj = {
						street: responses[0].address_components[0].long_name,
						city: responses[6].address_components[0].long_name,
						postcode: responses[4].address_components[0].long_name
					}

					for(var i = 0; i< responses.length; i++){

						for(var k = 0; k < responses[i].types.length; k++){

							if(responses[i].types[k] == 'postal_code'){
								obj.postcode = responses[i].address_components[0].long_name;
							}

							if(responses[i].types[k] == 'postal_town'){
								obj.city = responses[i].address_components[0].long_name
							}

							if(responses[i].types[k] == 'route'){
								obj.street = responses[i].address_components[0].long_name
							}
						}
					}

					
					$this.settings.street_field.val(obj.street);
					$this.settings.city_field.val(obj.city);
					$this.settings.postcode_field.val(obj.postcode);
					
				})
		},

		searchAddress : function (e){
			e.preventDefault();


			/*function codeAddress() {
			    var address = document.getElementById("delivery_street").value 
			            + document.getElementById("delivery_postcode").value
			            + document.getElementById("delivery_city").value;
			    geocoder.geocode({'address': address}, function (results, status) {
			        if (status == google.maps.GeocoderStatus.OK) {
			            var mapContext = $("#deliverypicker").locationpicker('map');
			            mapContext.map.setCenter(results[0].geometry.location);
			            mapContext.marker.setPosition(results[0].geometry.location);
			        } else {
			            alert("Geocode was not successful for the following reason: " + status);
			        }
			    });
			}*/

			var $this = this;
			var address =  $this.settings.postcode_field.val()+" "+$this.settings.street_field.val()+" "+$this.settings.city_field.val();
			$this.settings.error_alert.hide();
			$this.settings.error_span.html('');
			this.geocoder.geocode( { 'address': address}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					$this.map.setCenter(results[0].geometry.location);
					$this.map.setZoom(16);
					$this.insertMarker(results[0].geometry.location);
				} else {
					$this.settings.error_alert.show();
				  	$this.settings.error_span.html(status);
				}
			});
		},

		currentPosition : function(e){
			e.preventDefault();
			var $this = this;
			$this.settings.error_alert.hide();
			$this.settings.error_span.html('');
			if ( navigator.geolocation ) {
				navigator.geolocation.getCurrentPosition ( 
					function(position) {
						var clientPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
						$this.insertMarker(clientPosition);
						$this.map.setCenter(clientPosition);
						$this.map.setZoom(16);
					}, 
					function(error) {
						//$this.settings.error_callback(error);
						$this.settings.error_alert.show();
				  		$this.settings.error_span.html(error);
					}
				);      
			} else {
				$this.settings.search_error_el.text('Your broswer does not support geolocation');
			}
			
		},

		updateLocation : function (location){
			console.log(location);
			this.settings.lat_field.val(location.lat());
			this.settings.lng_field.val(location.lng());
			this.settings.callback(location, this);
			console.log(location);
			$this.settings.error_alert.hide();
			$this.settings.error_span.html('');
		},

		addMarker : function(center) {
			if(this.marker){
				this.marker.setMap(this.map);
				this.marker.setPosition(center);
			}else{
				this.marker = new google.maps.Marker({
					map: this.map,
					position: center,
					draggable: true
				});
			}
		},

		insertMarker : function (position) {
			this.removeMarker();

			this.addMarker(position);

			this.updateLocation(position);

		},
		removeMarker : function () {
			if(this.marker != undefined){
				this.marker.setMap(null);
			}
		}

	}

	$.fn.sircampGoogleMapType = function(settings) {

		settings = $.extend({}, $.fn.sircampGoogleMapType.defaultSettings, settings || {});

		return this.each(function() {
			var map_el = $(this);

			map_el.data('map', new GoogleMapType( settings, map_el ));

			map_el.data('map').initMap();

		});

	};
	
	$.fn.sircampGoogleMapType.defaultSettings = {
			  'search_input_el'    : null,
			  'search_action_el'   : null,
			  'search_error_el'    : null,
			  'current_position_el': null,
			  'default_lat'        : '1',
			  'default_lng'        : '-1',
			  'default_zoom'       : 5,
			  'lat_field'          : null,
			  'lng_field'          : null,
			  'street_field'       : null,
			  'city_field'         : null,
			  'postcode_field'     : null,
			  'error_alert'		   : null,
			  'error_span'		   : null,
			  'callback'           : function (location, gmap) {},
			  'error_callback'     : function(status) {
			  	$this.settings.search_error_el.text(status);
			  }
			}

})( jQuery );
