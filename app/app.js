'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
    'ui.router',
    'LocalStorageModule',
    'angular-carousel',
    'app.home',
    'app.topGames',
    'app.newGames',
    'app.gameDetail',
    'app.login',
    'app.genre',
    'app.orders',
    'app.register',
    'app.passwordForget'
])
    .config(function ($urlRouterProvider, localStorageServiceProvider) {
        $urlRouterProvider.otherwise('/home');
        localStorageServiceProvider.setPrefix('webshop');
    })
    .run(function ($http, localStorageService) {
        $http.get('../assets/json/articles.json')
            .then(function (response) {
                localStorageService.set('articles', response.data);
            }, function (error) {
                var data = localStorageService.get('articles');
                if (data) {
                   toastr.warning('Artikel konnten nicht neu geladen werden. Daten sind möglicherweise veraltet.')
                } else {
                    toastr.error('Artikel konnten nicht geladen werden.');
                }
                console.log(error);
            });
    })
    .controller('AppCtrl', function ($scope, $rootScope, $http) {
        $rootScope.$on('$stateChangeSuccess',
            function(event, toState){
                $scope.currentStateName = toState.name;
            });
        $http.get('../assets/json/genres.json')
            .then(function (response) {
                $scope.genres = response.data;
                console.log($scope.genres);
            }, function (error) {
                console.log(error);
            });
    });
