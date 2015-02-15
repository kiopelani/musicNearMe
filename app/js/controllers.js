
var controllers = angular.module('musicNearMe.controllers', []);

controllers.controller('MainCtrl', function($scope){});

controllers.controller('ConcertsCtrl', function($scope, $http, markers){
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
        $scope.artistImage = data[0].artists[0].image_url;
        markers.makeMap(data[0].venue.latitude, data[0].venue.longitude);
        $scope.addConcerts(data);
      }
      $scope.artist = "";

    });
  };

  $scope.addConcerts = function(data){
    for(var i=0; i < data.length; i++){
      var concert = data[i];
      var content = markers.makeInfoWindowContent(concert);
      markers.makeMarker(concert.venue.latitude, concert.venue.longitude, content);
      $scope.concerts.push({
        title: concert.title,
        venue: concert.venue.name,
        city: concert.formatted_location,
        date: concert.formatted_datetime,
        ticketStatus: concert.ticket_status,
        ticketUrl: concert.ticket_url
      });
    }
  };

});




// .controller('ConcertsCtrl', function($scope, $http, markers){
//   $scope.error;
//   $scope.concerts = [];

//   $scope.findConcerts = function(){
//     if(!$scope.artist || $scope.artist === ""){return;}

//     $scope.concerts = [];
//     $scope.error = "";
//     $scope.currArtist = "";

//     $http.jsonp('http://api.bandsintown.com/artists/'+$scope.artist+'/events.json?api_version=2.0&app_id=music_near_me&callback=JSON_CALLBACK').then(function(response){
//       console.log(response.data);
//       var data = response.data;
//       if(data.length < 1){
//         $scope.error = $scope.artist + " has no upcoming concerts at this time.";
//         markers.makeMap();
//         $scope.artistImage = "http://cdn.flaticon.com/png/256/42901.png";
//       }
//       else {
//         $scope.currArtist = data[0].artists[0].name;
//         $scope.artistImage = data[0].artists[0].image_url;
//         markers.makeMap(data[0].venue.latitude, data[0].venue.longitude);
//         for(var i=0; i < data.length; i++){
//           var concert = data[i];
//           var content = markers.makeInfoWindowContent(concert);
//           markers.makeMarker(concert.venue.latitude, concert.venue.longitude, content);
//           $scope.concerts.push({
//             title: concert.title,
//             venue: concert.venue.name,
//             city: concert.formatted_location,
//             date: concert.formatted_datetime,
//             ticketStatus: concert.ticket_status,
//             ticketUrl: concert.ticket_url
//           });
//         }
//       }
//       $scope.artist = "";

//     });
//   };
// })