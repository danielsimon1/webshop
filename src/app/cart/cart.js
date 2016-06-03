angular.module('app.cart', [])

    .config(function ($stateProvider) {
        $stateProvider.state('cart', {
            url: '/cart',
            templateUrl: 'app/cart/cart.html',
            controller: 'CartCtrl'
        });
    })

    .controller('CartCtrl', function (localStorageService, $scope, $rootScope) {
        // cart only
        var cart = localStorageService.get('cart');
        // articles only
        var articles = localStorageService.get('articles');
        // cart and articles merged
        $scope.cart = {};

        $scope.updateTotalPrice = function () {
            $scope.totalPrice = 0;
            angular.forEach($scope.cart, function (item) {
                $scope.totalPrice += item.quantity * item.price;
            });
        };

        // merge cart and articles
        angular.forEach(articles, function (article) {
            angular.forEach(cart, function (item) {
                if (item.itemId == article.id) {
                    var newObject = article;
                    newObject.quantity = item.quantity;
                    console.log(newObject);
                    $scope.cart[item.itemId] = newObject;
                }
            });
        });
        $scope.updateTotalPrice();

        $scope.quantityChange = function (id) {
            cart[id].quantity = parseInt($scope.cart[id].quantity);
            $scope.updateTotalPrice();
            localStorageService.set('cart', cart);
            $rootScope.$emit('itemAddedToCart');
        };

        $scope.remove = function (id) {
            delete $scope.cart[id];
            delete cart[id];
            $scope.updateTotalPrice();
            localStorageService.set('cart', cart);
            $rootScope.$emit('itemAddedToCart');
        }
    });