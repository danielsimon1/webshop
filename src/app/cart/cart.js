angular.module('app.cart', [])

    .config(function ($stateProvider) {
        $stateProvider.state('cart', {
            url: '/cart',
            templateUrl: 'app/cart/cart.html',
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

        $scope.remove = function (id) {
            var index = 0;
            angular.forEach(cart, function (item) {
                console.log(item);
                if (item.itemId == id) {
                    console.log(index);
                    $scope.cart.splice(index, 1);
                    cart.splice(index, 1);
                }
                index++;
            });
            $scope.quantityChange();
            $scope.updateTotalPrice();
            localStorageService.set('cart', cart);
            $rootScope.$emit('itemAddedToCart');
        }
    });