angular.module('app.checkout', [])

    .config(function ($stateProvider) {
        $stateProvider.state('checkout', {
            url : '/checkout',
            templateUrl : 'app/cart/checkout/checkout.html',
            controller : 'CheckoutCtrl'
        });
    })

    .controller('CheckoutCtrl', function ($scope, localStorageService, $state, orders) {
        var user = localStorageService.get('user') || {};
        if (!user.userName) {
            // if user wants to order something but isn't logged in, he will be directed to the checkout after login
            localStorageService.set('fromCheckout', true);
            toastr.info('Bitte melden Sie sich an.');
            $state.go('login');
        }
        $scope.cart = localStorageService.get('cart') || {};

        // if nothing in cart, no checkout
        if (angular.equals({}, $scope.cart)) {
            $state.go("home");
        }

        $scope.articles = localStorageService.get('articles') || {};

        $scope.updateTotalPrice = function () {
            $scope.totalPrice = 0;
            angular.forEach($scope.cart, function (item) {
                $scope.totalPrice += item.quantity * $scope.articles[item.itemId].price;
            });
        };

        $scope.addOrder = function () {
            var cart = localStorageService.get("cart");
            var data = {
                userId : user.id,
                date : new Date().getTime(),
                totalPrice : $scope.totalPrice,
                items : cart
            };
            orders.addOrder(data)
                .then(function (response) {
                    toastr.success(response);
                    localStorageService.remove("cart");
                    $state.go("orders");
                }, function (error) {
                    if (!error) {
                        toastr.error("Ein unbekannter Fehler ist aufgetreten!");
                    } else {
                        toastr.error(error);
                    }
                });
        };
        $scope.updateTotalPrice();

    });