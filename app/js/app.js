'use strict';

// Declare app level module which depends on views, and components
angular.module('musicNearMe', [])

.controller('ConcertsCtrl', function($scope, $http){
  $scope.concerts;
  // $scope.artist = "Taylor%20Swift";
  // function that parses artist into appropriate format
  $scope.findConcerts = function(){
    if(!$scope.artist || $scope.artist === ""){return;}

    $http.jsonp('http://api.bandsintown.com/artists/'+$scope.artist+'/events.json?api_version=2.0&app_id=music_near_me&callback=JSON_CALLBACK').then(function(response){
      console.log(response.data);
    });
  };
});
