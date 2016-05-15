'use strict';

angular.module('app.home', [])

    .config(function ($stateProvider) {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'home/home.html',
            controller: 'HomeCtrl'
        });
    })

    .controller('HomeCtrl', function () {

    });