'use strict';

angular.module('app.topGames', [])

    .config(function ($stateProvider) {
        $stateProvider.state('topGames', {
            url: '/topGames',
            templateUrl: 'topGames/topGames.html',
            controller: 'TopGamesCtrl'
        });
    })

    .controller('TopGamesCtrl', function () {

    });