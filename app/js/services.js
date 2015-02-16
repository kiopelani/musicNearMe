'use strict';

var services = angular.module('musicNearMe.services', []);

services.factory('markers', function(){
  var o = {
    markers: []
  };

  o.map;

  o.makeMap = function(lat, lng){
    var latLng = new google.maps.LatLng(lat,lng);
    var mapOptions = {center: latLng, zoom: 3}
    o.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  };

  o.makeInfoWindowContent = function(concert){
    var content = "";
    content += '<h3>'+concert.title+'</h3>';
    content += '<h4>Location: '+concert.venue.name+' in '+concert.formatted_location+'</h3>';
    content += '<p>Date: '+concert.formatted_datetime+'</p>';
    if(concert.ticket_url) {
      content += '<a href="'+concert.ticket_url+'" target="_blank">Buy Tickets</a>';
    }
    else {
      content += '<p>Ticket Status: '+concert.ticket_status+'</p>';
    }
    return content;
  };

  o.makeMarker = function(lat, lng, info){
    var latLng = new google.maps.LatLng(lat,lng);
    var marker = new google.maps.Marker({position: latLng, title: "upcoming concert"});
    var infowindow = new google.maps.InfoWindow({content: info});

    marker.setMap(o.map);
    google.maps.event.addListener(marker, 'click', function(){
      infowindow.open(o.map,marker);
    });
  };

  return o;
});