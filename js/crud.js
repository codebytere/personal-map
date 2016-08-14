var main = require('./main.js');
var modalJS = require('./modal.js');
var airtable = require('airtable');

/******* GETTERS *******/

API_KEY = 'keyK7dq5zUfQPWqlO';
BASE_KEY = 'app2K7DEbfK3K8itR';
BASE_NAME = 'map-test';

var base = new airtable({
  apiKey: API_KEY
}).base(BASE_KEY);

//gets locations and places them appropriately in the sidebar
var getLocations = function() {
  clearSidebarLocations();

  base(BASE_NAME).select({
    view: "Main View"
  }).eachPage(function page(records, fetchNextPage) {
    records.forEach(function(record) {
      var output_id = record.fields.type + "_locs";

      var html = '<button id="' + record.id + '" class="edit_modal_button">' + record.fields.title + '</button><br><button class="delete_modal_button ' + record.id + '"><i class="fa fa-trash-o fa-2x"></i></button>';

      var container = document.createElement('div');
      container.className = "loc_entry";
      container.innerHTML = html;

      var output = document.getElementById(output_id);
      output.appendChild(container);

      var delete_button =  document.getElementsByClassName('' + record.id)[0];
      delete_button.onclick = function () {
        deleteMarker(record.id)
      };

      var edit_button = document.getElementById(record.id);
      edit_button.onclick = function () {
        editMarker(record)
      };
    });

    fetchNextPage();

  }, function done(error) {
    if (error) {
      console.log(error);
    }
  });
}

//gets markers from Airtable base and places them on the map
var getMarkers = function (){
  base(BASE_NAME).select({
    view: "Main View"
  }).eachPage(function page(records, fetchNextPage) {
    main.placeMarkers(records);
    fetchNextPage();

  }, function done(error) {
    if (error) {
      console.log(error);
    }
  });
}

/******* SETTERS *******/

//adds a marker through the modal
var addMarker = function () {

  var form_middle = "<form class='loc_form'> \
    <input type='text' name='title' class='new_loc_input' placeholder='Title'> <br>\
    <input type='text' name='address' class='new_loc_input' placeholder='Address'> <br>\
    <input type='text' name='link' class='new_loc_input' placeholder='Link'> <br>\
    <select name='type' class='new_loc_select'> \
      <option value='key_location'>Key Location</option> \
      <option value='coffee'>Coffee</option> \
      <option value='restaurant'>Restaurant</option> \
      <option value='nightlife'>Nightlife</option> \
      <option value='landmark'>Landmark</option> \
    </select> \
    </form>";

  modalJS.modal.show({
    top: 'Add Location',
    middle: form_middle,
    confirm: {
      text: 'Add',
      click: function () {
        marker = $('form').serializeArray().reduce(function(obj, item) {
          obj[item.name] = item.value;
          return obj;
        }, {});
        placeMarker(marker);
      }
    }
  });
};

//displays modal to edit a marker's values
var editMarker = function(record) {

  var link = function(link_val) {
    if (link_val == null)
      return "placeholder='Enter a link'";
    else
      return "value='" + record.fields.link + "'";
  }

  var form_middle = "<form class='loc_form'> \
    <input type='text' name='title' class='new_loc_input' value='" + record.fields.title + "'> <br>\
    <input type='text' name='address' class='new_loc_input' value='" + record.fields.address + "'> <br>\
    <input type='text' name='link' class='new_loc_input'" + link(record.fields.link) + "> <br>\
    <select name='type' class='new_loc_select'> \
      <option value='key_location'>Key Location</option> \
      <option value='coffee'>Coffee</option> \
      <option value='restaurant'>Restaurant</option> \
      <option value='nightlife'>Nightlife</option> \
      <option value='landmark'>Landmark</option> \
    </select> \
    </form>";

  modalJS.modal.show({
    top: 'Edit Location',
    middle: form_middle,
    confirm: {
      text: 'Save',
      click: function () {
        marker = $('form').serializeArray().reduce(function (obj, item) {
          obj[item.name] = item.value;
          return obj;
        }, {});
        updateMarker(record, marker);
      }
    }
  });
};

//performs call to update marker info in the db
var updateMarker = function(record, fields) {

  fields.lat = record.fields.lat;
  fields.lng = record.fields.lng;

  base(BASE_NAME).replace(record.id, fields, function(err, record) {
    if (err) {
      console.log(err); return;
    }
    console.log("successfully updated record");
    getLocations();
    getMarkers();
  });
}

//removes a marker from the database
var deleteMarker = function(id) {
  base(BASE_NAME).destroy(id, function(err, deletedRecord) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('successfully deleted record');
    getLocations();
    getMarkers();
  });
}

//places a new marker on the map with given and calculated data
var placeMarker = function(record) {

  //uses geocoder to get the latitude and longitude
  function encodeAddress() {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address' : record.address}, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        setData(results[0].geometry.location);
      } else {
        alert("Google Maps had some trouble finding" + address + status);
      }
    });
   }
  encodeAddress();

  //sets the field information and executes POST request to the airtable api
  function setData(lat_lng){
    var new_record = {
      title: record.title,
      address: record.address,
      lat: JSON.stringify(lat_lng.lat()),
      lng: JSON.stringify(lat_lng.lng()),
      link: record.link,
      type: record.type
    };

    base(BASE_NAME).create(new_record, function(err, record) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("successfully created new record");
      getMarkers();
      getLocations();
    });
  }
};

/******** HELPERS ********/

//clears the sidebar of locations when a new one is added
var clearSidebarLocations = function(){
  var loc_types = ['key_location_locs','coffee_locs','restaurant_locs', 'nightlife_locs','landmark_locs'];

  loc_types.forEach(function (loc_type) {
    document.getElementById(loc_type).innerHTML = "";
  });
}

module.exports = {
  getLocations: getLocations,
  getMarkers: getMarkers,
  addMarker: addMarker,
  editMarker: editMarker,
  placeMarker: placeMarker,
};


