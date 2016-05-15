'use strict';

angular.module('app.gameDetail', [])

    .config(function ($stateProvider) {
        $stateProvider.state('gameDetail', {
            url: '/gameDetail/:id',
            templateUrl: 'gameDetail/gameDetail.html',
            controller: 'GameDetailCtrl'
        });
    })

    .controller('GameDetailCtrl', function ($scope, $http, $stateParams, localStorageService, $rootScope) {
        $scope.tab = {};
        $scope.tab.active = 'description';
        $scope.quantity = 1;
        
        var calculateAverageStars = function (data) {
            var count = 0;
            var stars = 0;
            angular.forEach(data, function (item) {
                count++;
                stars += item.stars;
            });
            return stars / count;
        };
        
        $scope.changeTab = function (type) {
            $scope.tab.active = type;
        };
        
        var id = $stateParams.id;
        $scope.articles = localStorageService.get('articles');
        angular.forEach($scope.articles, function (item) {
            if (item.id == id) {
                $scope.actualGame = item;
            }
        });
        
        $scope.stars = calculateAverageStars($scope.actualGame.reviews);
        document.getElementById("description").innerHTML = $scope.actualGame.description;
        
        $scope.toCart = function () {
            if ($scope.quantity >= 1) {
                var cart = localStorageService.get('cart') || [];
                var isInCart = false;
                angular.forEach(cart, function (item) {
                    if (item.itemId == $scope.actualGame.id) {
                        item.quantity = parseInt(item.quantity) + parseInt($scope.quantity);
                        isInCart = true;
                    }
                });
                if (!isInCart) {
                    cart.push({
                        itemId: $scope.actualGame.id,
                        quantity: parseInt($scope.quantity)
                    });
                }
                localStorageService.set('cart', cart);
                $rootScope.$emit('itemAddedToCart');
                toastr.success('Artikel erfolgreich ' + $scope.quantity + 'x in den Warenkorb gelegt!');
                $scope.quantity = 1;
            } else {
                toastr.warning('Bitte geben Sie eine gültige Zahl ein!')
            }
        }
    });