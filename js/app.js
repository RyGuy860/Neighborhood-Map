//Array of major attractions to populate the Google Map
  var locations = [
      {name:'World of Coca Cola',
      address: '121 Baker St NW, Atlanta, GA 30313',
      lat: '33.7628',
      lng:'-84.3928'},

      {name:'Turner Field',
      address: '755 Hank Aaron Dr SE, Atlanta, GA 30315',
      lat: '33.7353',
      lng: '-84.3894'},

      {name:'Centennial Olympic Park',
      address:'265 Park Ave W NW, Atlanta, GA 30313',
      lat: '33.7600',
      lng: '-84.3932'},

      {name:'Georgia Aquarium',
      address: '357 Luckie St NW, Atlanta, GA 30313',
      lat: '33.7622',
      lng: '-84.395'},

      {name:'Martin Luther King Jr. National Historic Site',
      address:'450 Auburn Ave NE, Atlanta, GA 30312',
      lat: '33.7550',
      lng: '-84.3722'},

      {name:'Underground Atlanta',
      address:'50 Central Ave SW #007, Atlanta, GA 30303',
      lat: '33.7527',
      lng: '-84.3901'},

      {name:'Zoo Atlanta',
      address:'800 Cherokee Ave SE, Atlanta, GA 30315',
      lat:'33.7325',
      lng:'-84.3697'},

      {name:'Georgia Dome',
      address:' 1 Georgia Dome Dr, Atlanta, GA 30313',
      lat:'33.7575',
      lng:'-84.4008'},

      {name:'CNN Center',
      address:'190 Marietta St, Atlanta, GA 30303',
      lat:'33.7579',
      lng:'-84.3948'},

      {name:'The Fox Theatre',
      address:'660 Peachtree St NE, Atlanta, GA 30308',
      lat:'33.7725',
      lng:'-84.3856'}
    ];

//Seting up google Maps API
var map;
var coord = [];
var infowindow = new google.maps.InfoWindow({});
function intializeMap() {

    var mapCanvas = document.getElementById('map');
    var mapOptions = {
      center: new google.maps.LatLng(33.7550, -84.3900), //center point on map
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map =new google.maps.Map(mapCanvas, mapOptions);

    var coord;
    var content;
//Loops through all attractions within Locations Array, placeing a Google Maps marker on attractions Lat and Lng
    for(var i = 0; i < locations.length; i++) {
      coord = new google.maps.LatLng(locations[i].lat, locations[i].lng);
      locations[i].marker = new google.maps.Marker({
          position: coord,
          map: map,
          title: locations[i].name
//Enables the click function to each googles maps marker
      });
      locations[i].marker.addListener('click', (function(attraction){
        return function() {
          openInfo(attraction);
        };
      })(locations[i]));
    }
}
intializeMap();
//Creates the content to be displayed within the infoWindow above the map marker
function createContent(attraction) {
  var content = '<h4>' + attraction.name + ':' + " " + attraction.address +'</h4>'
    "<div>" +attraction.location+ "</div>"
    "<div class='coord'> Latitude: " + attraction.lat + "</div>" +
    "<div class='coord'> Longitude: " + attraction.lng + "</div>" +
    "<div class='Bar's'> Nearby Bar's (distance < 1000)</div>";
    return content;
}
//Intergration of foursquare API to find bars within a radius of 800 based off of the the Lat and Lng of attractions
//Sets the bounce animation to each map marker when clicked
function openInfo(attraction) {
  attraction.marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function(){ attraction.marker.setAnimation(null); }, 1500); //Time marker animates
  var url = "https://api.foursquare.com/v2/venues/search?client_id=HRRN1RSNSF2DQUS2GH3CIHRIE2HOXM0XCZB2QQX3M55JKH4K&client_secret=AKNFOHZZQUVKNAPO4OM4CR5BJQHGDHQ42YARUJ1FUXTPN2L4&v=20130815"+
    "&ll="+attraction.lat+","+attraction.lng+
    "&query=bar" +
    "&limit=5"+
    "&radius=800";
  var html = "";
//Sets up content in infowindow if 1. there are no Bars near attration 2. if there is an error pulling the information from foursquare's api
  jQuery.getJSON(url, function (data) {
        for (var i=0; i < data.response.venues.length; i++) {
          html += "<div> <a href='https://it.foursquare.com/v/"+data.response.venues[i].id+"'>"+data.response.venues[i].name+"</a></div>"
        }
        if(html == "") html = "There are no Bar's near this attraction"
        infowindow.setContent(createContent(attraction) + html);
    infowindow.open(map, attraction.marker);
    })
    .error(function(err){
        console.log("Problem with foursquare: " + err);
        html = "<div>We're sorry, loading Bar's has failed</div>";
        infowindow.setContent(createContent(attraction) + html);
    infowindow.open(map, attraction.marker);
    });
}
//ViewModel to set up #sidebar and #place-list elements
  var ViewModel = function() {
  var make = this;
  var storeAttraction;

  make.filter = ko.observable("");
  make.attractionVisible = ko.computed( function() {
    storeAttraction = [];
//Setting up attraction search bar filter to connect with Google Maps markers
    locations.forEach(function(attraction) {
      if (attraction.name.toLowerCase().indexOf(make.filter().toLowerCase()) > -1) {
        storeAttraction.push(attraction);
        attraction.marker.setMap(map);
      }else{
        attraction.marker.setMap(null);
      }
    });
    return storeAttraction;
  });

// Select happens when an attraction is clicked
  make.select = function(parent) {
    openInfo(parent);
  }
};

ko.applyBindings (new ViewModel);

