'use strict';

angular.module('app.newGames', [])

    .config(function ($stateProvider) {
        $stateProvider.state('newGames', {
            url: '/newGames',
            templateUrl: 'app/newGames/newGames.html',
            controller: 'NewGamesCtrl'
        });
    })

    .controller('NewGamesCtrl', function () {

    });