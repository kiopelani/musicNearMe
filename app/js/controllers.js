'use strict';

var controllers = angular.module('musicNearMe.controllers', []);

controllers.controller('MainCtrl', function($scope, $location){

});

controllers.controller('ConcertsCtrl', function($scope, $http, $location, markers){
  $scope.error;
  $scope.concerts = [];
  $scope.concertView = "";
  $scope.showMap = false;

  $scope.reload = function(){
    $scope.concertView = '';
    $scope.concerts = [];
    $scope.error = "";
    $scope.showMap = false;
    $location.path('/info');
  };

  $scope.toggleView = function(){
    if($scope.concertView === 'main'){
      $location.path('list');
      $scope.concertView = 'list';
    }
    else {
      $location.path('main');
      $scope.concertView = 'main';
    }
  };

  $scope.findConcerts = function(){
    if(!$scope.artist || $scope.artist === ""){return;}

    $scope.concerts = [];
    $scope.error = "";
    $scope.currArtist = "";
    $scope.concertView = "";
    var requestUrl = 'http://api.bandsintown.com/artists/' + $scope.artist + '/events.json?api_version=2.0&app_id=music_map&callback=JSON_CALLBACK'

    $http.jsonp(requestUrl)
    .then(function(response){
        var data = response.data;
        $scope.displayConcerts(data);
        $scope.artist = "";
    });
  };

  $scope.displayConcerts = function(data){
    if(data.length < 1){
      $scope.error = $scope.artist + " has no upcoming concerts at this time.";
      $scope.showMap = false;
      $scope.artistImage = '';
      $scope.concertView = '';
      $location.path('/');
    }
    else {
      var firstConcert = data[0];
      $scope.currArtist = firstConcert.artists[0].name;
      $scope.artistImage = firstConcert.artists[0].image_url;
      markers.makeMap(firstConcert.venue.latitude, firstConcert.venue.longitude);
      $scope.showMap = true;
      $scope.addConcerts(data);
      $scope.concertView = 'main';
      $location.path('main');
    }
  };

  $scope.addConcerts = function(data){
    for(var i=0; i < data.length; i++){
      var concert = data[i];
      $scope.addConcertToMap(concert);
      $scope.addConcertToList(concert);
    }
  };

  $scope.addConcertToMap = function(concert){
    var content = markers.makeInfoWindowContent(concert);
    markers.makeMarker(concert.venue.latitude, concert.venue.longitude, content);
  };

  $scope.addConcertToList = function(concert){
    $scope.concerts.push({
        title: concert.title,
        venue: concert.venue.name,
        city: concert.formatted_location,
        date: concert.formatted_datetime,
        ticketStatus: concert.ticket_status,
        ticketUrl: concert.ticket_url
      });
  };

});

