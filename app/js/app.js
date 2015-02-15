'use strict';

// Declare app level module which depends on views, and components
angular.module('musicNearMe', [])

.controller('ConcertsCtrl', function($scope, $http){
  $scope.concerts = [];
  $scope.error;
  // $scope.artist = "Taylor%20Swift";
  // function that parses artist into appropriate format
  $scope.findConcerts = function(){
    if(!$scope.artist || $scope.artist === ""){return;}

    $scope.concerts = [];
    $scope.error = "";

    $http.jsonp('http://api.bandsintown.com/artists/'+$scope.artist+'/events.json?api_version=2.0&app_id=music_near_me&callback=JSON_CALLBACK').then(function(response){
      console.log(response.data);
      var data = response.data;
      if(data.length < 1){
        $scope.error = $scope.artist + " has no upcoming concerts at this time.";
      }
      else {
        for(var i=0; i < data.length; i++){
          var concert = data[i];
          $scope.concerts.push({
            venue: concert.venue.name,
            city: concert.venue.city,
            date: concert.formatted_date,
            ticketStatus: concert.ticket_status,
            ticketUrl: concert.ticket_url
          });
        }
      }
      $scope.artist = "";

    });
  };
});
