'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
    'ui.router',
    'angular-carousel',
    'app.home',
    'app.topGames',
    'app.newGames',
    'app.gameDetail',
    'app.login',
    'app.register',
    'app.passwordForget'
])
    .config(function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
    })
    .controller('AppCtrl', function ($scope, $rootScope) {
        $rootScope.$on('$stateChangeSuccess',
            function(event, toState){
                $scope.currentStateName = toState.name;
            })
    });
