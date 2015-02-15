'use strict';

// Declare app level module which depends on views, and components
angular.module('musicNearMe', [])

.factory('markers', function(){

  var o = {
    markers: []
  };

  o.map;

  o.makeMap = function(lat, lng){
    var latLng = new google.maps.LatLng(lat,lng);
    var mapOptions = {
      center: latLng,
      zoom: 3
    };
    o.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  };

  o.makeInfoWindowContent = function(concert){
    var content = "";
    content += '<h3>'+ concert.title + '</h3>';
    content += '<h4>Location: '+ concert.venue.name + ' in ' + concert.formatted_location + '</h3>';
    content += '<p>Date: ' + concert.formatted_datetime + '</p>';
    if(concert.ticket_url) {
      content += '<a href="'+concert.ticket_url+'" target="_blank">Buy Tickets</a>';
    }
    else {
      content += '<p>Ticket Status: ' + concert.ticket_status + '</p>';
    }
    return content;
  };

  o.makeMarker = function(lat, lng, info){
    var latLng = new google.maps.LatLng(lat,lng);
    var marker = new google.maps.Marker({
      position: latLng,
      title: "upcoming concert"
    });

    var infowindow = new google.maps.InfoWindow({
          content: info
    });

    marker.setMap(o.map);

    google.maps.event.addListener(marker, 'click', function(){
          infowindow.open(o.map,marker);
    });

  };

  return o;

})

.controller('ConcertsCtrl', function($scope, $http, markers){
  $scope.error;
  $scope.concerts = [];

  $scope.findConcerts = function(){
    if(!$scope.artist || $scope.artist === ""){return;}

    $scope.concerts = [];
    $scope.error = "";
    $scope.currArtist = "";

    $http.jsonp('http://api.bandsintown.com/artists/'+$scope.artist+'/events.json?api_version=2.0&app_id=music_near_me&callback=JSON_CALLBACK').then(function(response){
      console.log(response.data);
      var data = response.data;
      if(data.length < 1){
        $scope.error = $scope.artist + " has no upcoming concerts at this time.";
        markers.makeMap();
        $scope.artistImage = "http://cdn.flaticon.com/png/256/42901.png";
      }
      else {
        $scope.currArtist = data[0].artists[0].name;
        $scope.artistImage = data[0].artists[0].thumb_url;
        markers.makeMap(data[0].venue.latitude, data[0].venue.longitude);
        for(var i=0; i < data.length; i++){
          var concert = data[i];
          var content = markers.makeInfoWindowContent(concert);
          markers.makeMarker(concert.venue.latitude, concert.venue.longitude, content);
          $scope.concerts.push({
            venue: concert.venue.name,
            city: concert.formatted_location,
            date: concert.formatted_datetime,
            ticketStatus: concert.ticket_status,
            ticketUrl: concert.ticket_url
          });
        }
      }
      $scope.artist = "";

    });
  };
});
