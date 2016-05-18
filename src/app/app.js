'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
    'ui.router',
    'LocalStorageModule',
    'ngAnimate',
    'templates',
    'app.home',
    'app.topGames',
    'app.newGames',
    'app.gameDetail',
    'app.login',
    'app.genre',
    'app.cart',
    'app.checkout',
    'app.orders',
    'app.register',
    'app.passwordForget'
])
    .config(function ($urlRouterProvider, localStorageServiceProvider) {
        $urlRouterProvider.otherwise('/home');
        localStorageServiceProvider.setPrefix('webshop');
    })
    .run(function ($http, localStorageService, articles) {
        articles.getAllArticles()
            .then(function (response) {
                console.log(response);
            }, function (error) {
                console.log(error);
            });
        // $http.get('../assets/json/articles.json')
        //     .then(function (response) {
        //         localStorageService.set('articles', response.data);
        //     }, function (error) {
        //         var data = localStorageService.get('articles');
        //         if (data) {
        //            toastr.warning('Artikel konnten nicht neu geladen werden. Daten sind möglicherweise veraltet.')
        //         } else {
        //             toastr.error('Artikel konnten nicht geladen werden.');
        //         }
        //         console.log(error);
        //     });
    })
    .controller('AppCtrl', function ($scope, $rootScope, $http, localStorageService, $state) {
        localStorageService.remove('checkout');
        $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams) {
                $scope.currentStateName = toState.name;
                $scope.currentStateParams = toParams.name;
            });

        $rootScope.$on('itemAddedToCart', function () {
            countCartItems();
        });

        $rootScope.$on('login', function () {
            getUserData();
        });

        $scope.logout = function () {
            localStorageService.remove('user');
            localStorageService.remove('orders');
            localStorageService.remove('checkout');
            // update user data
            $rootScope.$emit('login');
            $rootScope.$emit('itemAddedToCart');
            toastr.success('Logout war erfolgreich.');
            $state.go('login');
        };

        var getUserData = function () {
            var user = localStorageService.get('user') || {};
            $scope.userName = user.userName || 'Benutzer';
            $scope.userRole = user.role;
        };
        getUserData();

        $http.get('../assets/json/genres.json')
            .then(function (response) {
                $scope.genres = response.data;
                console.log($scope.genres);
            }, function (error) {
                console.log(error);
            });

        var countCartItems = function () {
            var cart = localStorageService.get('cart');
            $scope.quantity = 0;
            angular.forEach(cart, function (item) {
                $scope.quantity += item.quantity;
            });
        };
        countCartItems();
    });
