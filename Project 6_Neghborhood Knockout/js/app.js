  var map;
  // Create a new blank array for all the listing markers.
  var markers = [];
  // Create placemarkers array to use in multiple functions to have control
  // over the number of places that show.
  var placeMarkers = [];

  function initMap() {
    // Create a styles array to use with the map.
    var styles = [{
      featureType: 'water',
      stylers: [{
        color: '#19a0d8'
      }]
    }, {
      featureType: 'administrative',
      elementType: 'labels.text.stroke',
      stylers: [{
          color: '#ffffff'
        },
        {
          weight: 6
        }
      ]
    }, {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [{
        color: '#e85113'
      }]
    }, {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{
          color: '#efe9e4'
        },
        {
          lightness: -40
        }
      ]
    }, {
      featureType: 'transit.station',
      stylers: [{
          weight: 9
        },
        {
          hue: '#e85113'
        }
      ]
    }, {
      featureType: 'road.highway',
      elementType: 'labels.icon',
      stylers: [{
        visibility: 'off'
      }]
    }, {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{
        lightness: 100
      }]
    }, {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{
        lightness: -100
      }]
    }, {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{
          visibility: 'on'
        },
        {
          color: '#f0e4d3'
        }
      ]
    }, {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [{
          color: '#efe9e4'
        },
        {
          lightness: -25
        }
      ]
    }];
    // Constructor creates a new map - only center and zoom are required.
map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 37.743333,
        lng: -119.575833
      },
      zoom: 12,
      styles: styles,
      mapTypeControl: false
    });

    // This autocomplete is for use in the search within time entry box.
    var timeAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById('search-within-time-text'));
    // This autocomplete is for use in the geocoder entry box.
    var zoomAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById('zoom-to-area-text'));
    // Bias the boundaries within the map for the zoom to area text.
    zoomAutocomplete.bindTo('bounds', map);
    // Normally we'd have these in a database instead.
    var largeInfowindow = new google.maps.InfoWindow();
    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');
    // The following group uses the location array to create an array of markers on initialize.

      for (var i = 0; i < locations.length; i++) {
      // Get the position from the location array.
      var position = locations[i].location;
      var title = locations[i].title;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: i
      });
      // Push the marker to our array of markers.
   markers.push(marker);
      // Create an onclick event to open the large infowindow at each marker.
/* jshint ignore:start */
   marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
/* jshint ignore:end */
  }
}

  document.getElementById('show-listings').addEventListener('click', showListings);
  document.getElementById('hide-listings').addEventListener('click', function() {
    hideMarkers(markers);
  });

  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;
      // In case the status is OK, which means the pano was found, compute the
      // position of the streetview image, then calculate the heading, then get a
      // panorama from that and set the options
      function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        } else {
          infowindow.setContent('<div>' + marker.title + '</div>' +
            '<div>No Street View Found</div>');
        }
      }
      // Use streetview service to get the closest streetview image within
      // 50 meters of the markers position
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);
    }
  // This function will loop through the markers array and display them all.
  function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }
  // This function will loop through the listings and hide them all.
  function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }
  // This function takes in a COLOR, and then creates a new marker
  // icon of that color. The icon will be 21 px wide by 34 high, have an origin
  // of 0, 0 and be anchored at 10, 34).
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34));
    return markerImage;
  }

  //make marker bounce if "clicked" on sidebar
  function toggleBounce0() {
    if (markers[0].getAnimation() !== null) {
      markers[0].setAnimation(null);
    } else {
      markers[0].setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  function toggleBounce1() {
    if (markers[1].getAnimation() !== null) {
      markers[1].setAnimation(null);
    } else {
      markers[1].setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  function toggleBounce2() {
    if (markers[2].getAnimation() !== null) {
      markers[2].setAnimation(null);
    } else {
      markers[2].setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  function toggleBounce3() {
    if (markers[3].getAnimation() !== null) {
      markers[3].setAnimation(null);
    } else {
      markers[3].setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  function toggleBounce4() {
    if (markers[4].getAnimation() !== null) {
      markers[4].setAnimation(null);
    } else {
      markers[4].setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  function toggleBounce5() {
    if (markers[5].getAnimation() !== null) {
      markers[5].setAnimation(null);
    } else {
      markers[5].setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  googleError = function googleError() {
        alert(
            'It looks like Google Maps faild to load. Please refresh the page and try again!'
        );
    };
