var map;
var allMarkers=[];
var markers = [
  {title: 'half dome', position: {lat: 37.746036, lng: -119.53294}, id: 0},
  {title: 'yosemite falls', position: {lat: 37.749896, lng: -119.595933}, id: 1},
  {title: 'glacier point', position: {lat: 37.729041, lng: -119.574772}, id: 3},
  {title: 'sentinel dome', position: {lat: 37.722895, lng: -119.584669}, id: 4},
  {title: 'el capitan', position: {lat: 37.733263, lng: -119.637898}, id: 5},
  {title: 'clouds rest', position: {lat: 37.767328, lng: -119.489431}, id: 6}
];

//apply ko bindings for UI
var AppViewModel = function(){
    var self = this;
    this.visibleMarkers = ko.observableArray([]);

    markers.forEach(function(location){
        self.visibleMarkers.push({title: location.title, position: location.position});
    });

    //filterValue is the string to filter the visible markers with
    this.filterValue = ko.observable();

    //updates the visible markers based on the filter
    this.filterArray = function() {
        var str = self.filterValue().toLowerCase();
        this.visibleMarkers.removeAll();
        for (i=0; i<allMarkers.length; i++) {
            if (allMarkers[i].title.indexOf(str) != '-1'){
                self.visibleMarkers.push(
                    {
                    title: allMarkers[i].title,
                    position: allMarkers[i].position
                    });
                allMarkers[i].setMap(map);
            } else {
                allMarkers[i].setMap(null);
            }
        };
    }

    //clears filter to show all markers
    this.clearFilter = function() {
        this.visibleMarkers.removeAll();
        markers.forEach(function(location){
            self.visibleMarkers.push({title: location.title, position: location.position});
        });
        self.filterValue('');
        for (i=0; i<allMarkers.length; i++) {
            allMarkers[i].setMap(map);
        };
    };

    //toggles the marker animation when the associated list item is clicked
    this.toggleListBounce = function(s) {
        for (i=0; i<allMarkers.length; i++) {
            if (allMarkers[i].title === s.title) {
                toggleMarker(allMarkers[i]);
            }
        }
    }
}

//initialize the map with markers
function initMap() {
    var self = this;
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.743333, lng: -119.575833},
      zoom: 12
    });



     var largeInfowindow = new google.maps.InfoWindow();

    for (i=0; i< markers.length; i++){
        var markerInfo = (function(markers){
            var marker = new google.maps.Marker({
                title: markers.title,
                position: markers.position,
                id: markers.id,
                map: map,
            });
            marker.setAnimation(null);
            marker.addListener('click', function() {
                toggleMarker(marker);
            });

//Add weather to Infowindow using weather API

        var infoWindowContent = 'api.openweathermap.org/data/2.5/weather?lat=' + markers.position.lat + '&lon=' + markers.position.lng
         var infowindow = new google.maps.InfoWindow({
                content: infoWindowContent
                });
          marker.addListener('click', function() {
                infowindow.open(map,marker);
                });

            allMarkers.push(marker);
        })(markers[i]);
};

this.toggleMarker = function(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ marker.setAnimation(null); }, 2500);
//        weatherAPI(marker);
    };

  this.infoContent = function(content, marker) {
  var title = '<div class=infowindow id="infowindow"><div id=title><b>' + marker.title + '</b></div></div>';
  infowindow.setContent(title + content);
  infowindow.open(map, marker);
  }
};


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


//error message if google map api not displaying correctly
googleError = function googleError() {
      window.alert(
          'It looks like Google Maps faild to load. Please refresh the page and try again!'
      );
  };



//replace all function
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
}

//ko initiate function to apply ko bindings.
ko.applyBindings(new AppViewModel());
