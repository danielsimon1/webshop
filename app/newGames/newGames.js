'use strict';

angular.module('app.newGames', [])

    .config(function ($stateProvider) {
        $stateProvider.state('newGames', {
            url: '/newGames',
            templateUrl: 'newGames/newGames.html',
            controller: 'NewGamesCtrl'
        });
    })

    .controller('NewGamesCtrl', function () {

    });