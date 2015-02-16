'use strict';

var app = angular.module('musicNearMe', ['musicNearMe.controllers', 'musicNearMe.services', 'ngRoute']);

app.config(function ($routeProvider){
  $routeProvider
  .when("/info", {controller: "MainCtrl", templateUrl: "partials/info.html"})
  .when("/main", {controller: "MainCtrl", templateUrl: "partials/image.html"})
  .when("/list", {controller: "MainCtrl", templateUrl: "partials/concert_list.html"})
  .otherwise({redirectTo: '/info'});
});
