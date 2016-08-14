var crud = require('./crud.js');
var modal = require('./modal.js');
var $ = require("jquery");
var fontawesome = require('fontawesome-markers');

var map;
var infoWindow;
var infoWindows = [];

//initialize and populate the map
$(document).ready(function() {
  var mapOptions = {
    "center": {
      "lat": 40.7828647,
      "lng": -73.9653551
    }
    , "clickableIcons": true
    , "disableDoubleClickZoom": false
    , "draggable": true
    , "fullscreenControl": true
    , "keyboardShortcuts": true
    , "mapMaker": false
    , "mapTypeControl": true
    , "mapTypeControlOptions": {
      "text": "Default (depends on viewport size etc.)"
      , "style": 0
    }
    , "mapTypeId": "roadmap"
    , "rotateControl": true
    , "scaleControl": true
    , "scrollwheel": true
    , "streetViewControl": true
    , "styles": [{
      "featureType": "landscape.man_made"
      , "elementType": "geometry"
      , "stylers": [{
        "color": "#f7f1df"
      }]
    }, {
      "featureType": "landscape.natural"
      , "elementType": "geometry"
      , "stylers": [{
        "color": "#d0e3b4"
      }]
    }, {
      "featureType": "landscape.natural.terrain"
      , "elementType": "geometry"
      , "stylers": [{
        "visibility": "on"
      }]
    }, {
      "featureType": "poi"
      , "elementType": "labels"
      , "stylers": [{
        "visibility": "on"
      }]
    }, {
      "featureType": "poi.business"
      , "elementType": "all"
      , "stylers": [{
        "visibility": "on"
      }]
    }, {
      "featureType": "poi.medical"
      , "elementType": "geometry"
      , "stylers": [{
        "color": "#fbd3da"
      }]
    }, {
      "featureType": "poi.park"
      , "elementType": "geometry"
      , "stylers": [{
        "color": "#bde6ab"
      }]
    }, {
      "featureType": "road"
      , "elementType": "geometry.stroke"
      , "stylers": [{
        "visibility": "on"
      }]
    }, {
      "featureType": "road"
      , "elementType": "labels"
      , "stylers": [{
        "visibility": "on"
      }]
    }, {
      "featureType": "road.highway"
      , "elementType": "geometry.fill"
      , "stylers": [{
        "color": "#ffe15f"
      }]
    }, {
      "featureType": "road.highway"
      , "elementType": "geometry.stroke"
      , "stylers": [{
        "color": "#efd151"
      }]
    }, {
      "featureType": "road.arterial"
      , "elementType": "geometry.fill"
      , "stylers": [{
        "color": "#ffffff"
      }]
    }, {
      "featureType": "road.local"
      , "elementType": "geometry.fill"
      , "stylers": [{
        "color": "black"
      }]
    }, {
      "featureType": "transit.station.airport"
      , "elementType": "geometry.fill"
      , "stylers": [{
        "color": "#cfb2db"
      }]
    }, {
      "featureType": "water"
      , "elementType": "geometry"
      , "stylers": [{
        "color": "#a2daf2"
      }]
    }]
    , "zoom": 14
    , "zoomControl": true
  };
  var mapElement = document.getElementById('map');
  map = new google.maps.Map(mapElement, mapOptions);

  google.maps.event.addDomListener(window, "resize", function () {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center);
  });

  //close infowindows when the map is clicked
  google.maps.event.addListener(map, "click", function(event) {
    closeInfoWindows();
  });

  //add markers to both the map and the sidebar
  crud.getMarkers();
  crud.getLocations();

  addSearchBox();

  var btn = document.getElementById("mod_btn");
  btn.addEventListener("click", function(){
    crud.addMarker();
  });
});

//returns the custom map icon for each type of location
function custom_icons(type){
  var path, fillColor;

  if (type === "key_location") {
    path = fontawesome.KEY;
    fillColor = 'blue';
  }
  else if (type === "restaurant") {
    path = fontawesome.CUTLERY;
    fillColor = 'purple';
  }
  else if (type === "coffee") {
    path = fontawesome.COFFEE;
    fillColor = 'saddlebrown';
  }
  else if (type === "landmark") {
    path = fontawesome.BUILDING;
    fillColor = 'darkblue';
  }
  else if (type === "nightlife") {
    path = fontawesome.GLASS;
    fillColor = 'forestgreen';
  }

  var icon = {
    path: path,
    scale: 0.35,
    strokeWeight: 0.6,
    strokeColor: 'black',
    strokeOpacity: 1,
    fillColor: fillColor,
    fillOpacity: 1,
  }

  return icon;
}

//places markers on the map
function placeMarkers(info_markers) {
  $.each(info_markers, function (key, data) {
    data = data.fields;
    var lat_lng = new google.maps.LatLng(data.lat, data.lng);

    var marker = new google.maps.Marker({
      map: map,
      position: lat_lng,
      icon: custom_icons(data.type),
      address: data.address,
      title: data.title,
      labelClass: "mark"
    });

    var details;
    if (data.link) {
      details = "<strong>" + data.title + "</strong> <br>" + " <br>" +  data.address + "<br>" + " <br> <a href="+data.link+" target='_blank'>Website</a>";
    } else {
      details = "<strong>" + data.title + "</strong> <br>" + " <br>" +  data.address;
    }

    infowindow = new google.maps.InfoWindow()
    bindInfoWindow(marker, map, infowindow, details);
  });
}

//closes all other infowindows when a new one is placed
function closeInfoWindows() {
  for (i = 0; i < infoWindows.length; i++) {
      infoWindows[i].close();
      infoWindows.splice(i, 1);
  }
}

//binds an info window to each placed marker
function bindInfoWindow(marker, map, infowindow, strDescription){
  google.maps.event.addListener(marker, 'click', function() {
    closeInfoWindows();
    infowindow.setContent(strDescription);
    infoWindows.push(infowindow);
    infowindow.open(map, marker);
  });
}

//adds a search box to the field
function addSearchBox() {
  var input = document.getElementById('search-box');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });
  var markers = [];
  searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon
        , size: new google.maps.Size(71, 71)
        , origin: new google.maps.Point(0, 0)
        , anchor: new google.maps.Point(17, 34)
        , scaledSize: new google.maps.Size(25, 25)
      };
      markers.push(new google.maps.Marker({
        map: map
        , icon: icon
        , title: place.name
        , position: place.geometry.location
      }));
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      }
      else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

module.exports.placeMarkers = placeMarkers;

