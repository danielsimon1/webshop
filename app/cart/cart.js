'use strict';

angular.module('app.cart', [])

    .config(function ($stateProvider) {
        $stateProvider.state('cart', {
            url: '/cart',
            templateUrl: 'cart/cart.html',
            controller: 'CartCtrl'
        });
    })

    .controller('CartCtrl', function (localStorageService, $scope, $rootScope) {
        var cart = localStorageService.get('cart');
        var articles = localStorageService.get('articles');
        $scope.cart = [];

        $scope.updateTotalPrice = function () {
            $scope.totalPrice = 0;
            angular.forEach($scope.cart, function (item) {
                $scope.totalPrice += item.quantity * item.price;
            });
        };

        angular.forEach(articles, function (article) {
            angular.forEach(cart, function (item) {
               if (item.itemId == article.id) {
                   var newObject = article;
                   newObject.quantity = item.quantity;
                   $scope.cart.push(newObject);
               } 
            });
        });
        $scope.updateTotalPrice();

        $scope.quantityChange = function () {
            angular.forEach($scope.cart, function (article) {
                angular.forEach(cart, function (item) {
                    if (item.itemId == article.id) {
                        item.quantity = parseInt(article.quantity);
                    }
                });
            });
            $scope.updateTotalPrice();
            localStorageService.set('cart', cart);
            $rootScope.$emit('itemAddedToCart');
        };
    });