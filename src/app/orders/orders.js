angular.module('app.orders', [])

    .config(function ($stateProvider) {
        $stateProvider.state('orders', {
            url: '/orders',
            templateUrl: 'app/orders/orders.html',
            controller: 'OrdersCtrl'
        });
    })

    .controller('OrdersCtrl', function ($scope, $http, localStorageService, $state, orders) {
        var user = localStorageService.get("user");
        $scope.articles = localStorageService.get("articles");
        if (typeof user.id != "number") {
            toastr.warning("Dieser Bereich ist geschützt. Bitte loggen Sie sich ein!");
            $state.go("home");
        } else {
            orders.getOrders(user.id)
                .then(function (response) {
                    localStorageService.set("orders", response);
                    $scope.orders = response;
                }, function (error) {
                    if (error) {
                        toastr.error(error);
                    } else {
                        toastr.error("Fehler bei der Verbindung zum Server!");
                    }
                });
        }
    });