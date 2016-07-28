angular.module('app.orders', [])

    .config(function ($stateProvider) {
        $stateProvider.state('orders', {
            url: '/orders',
            templateUrl: 'app/orders/orders.html',
            controller: 'OrdersCtrl'
        });
    })

    .controller('OrdersCtrl', function ($scope, $http, localStorageService, $state, orders, user, $rootScope) {
        var currentUser = localStorageService.get("user") || {};
        $scope.articles = localStorageService.get("articles") || {};
        if (angular.equals({}, currentUser)) {
            toastr.info("Sie müssen sich einloggen, um diese Seite zu sehen");
            $state.go("login");
        } else {
            user.authenticate(currentUser.userName, currentUser.password)
                .then(function (response) {
                    localStorageService.set("user", response);
                    currentUser = response;
                    orders.getOrders(currentUser.id)
                        .then(function (response) {
                            $scope.orders = response;
                        }, function (error) {
                            if (error) {
                                toastr.error(error);
                            } else {
                                toastr.error("Ein unbekannter Fehler ist aufgetreten!");
                            }
                        });
                }, function () {
                    toastr.error("Fehler bei der Authentifizierung");
                    toastr.warning("Sie werden nun automatisch ausgeloggt");
                    $rootScope.logout();
                });
        }
    });