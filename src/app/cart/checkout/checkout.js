angular.module('app.checkout', [])

    .config(function ($stateProvider) {
        $stateProvider.state('checkout', {
            url: '/checkout',
            templateUrl: 'app/cart/checkout/checkout.html',
            controller: 'CheckoutCtrl'
        });
    })

    .controller('CheckoutCtrl', function ($scope, localStorageService, $state, orders) {
        var user = localStorageService.get('user') || {};
        if (!user.userName) {
            localStorageService.set('fromCheckout', true);
            toastr.info('Bitte melden Sie sich an.');
            $state.go('login');
        }
        var cart = localStorageService.get('cart') || {};
        var articles = localStorageService.get('articles') || {};
        $scope.cart = {};

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
                    $scope.cart[item.itemId] = newObject;
                }
            });
        });

        $scope.addOrder = function () {
            var cart = localStorageService.get("cart");
            var data = {
                userId: user.id,
                date: new Date().getTime(),
                totalPrice: $scope.totalPrice,
                items: cart
            };
            orders.addOrder(data);
        };
        $scope.updateTotalPrice();

    });