'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
    'ui.router',
    'app.view1',
    'app.view2',
    'app.login',
    'app.register'
])
    .config(function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/view1');
    })
    .controller('AppCtrl', function ($scope, $rootScope) {
        $rootScope.$on('$stateChangeSuccess',
            function(event, toState){
                $scope.currentStateName = toState.name;
            })
    });
