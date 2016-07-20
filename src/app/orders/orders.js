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
        if (typeof user.id != "number") {
            toastr.warning("Dieser Bereich ist geschützt. Bitte loggen Sie sich ein!");
            $state.go("home");
        } else {
            orders.getOrders(user.id)
                .then(function (response) {
                    localStorageService.set("orders", response);
                    $scope.orders = response;
                }, function (error) {
                    toastr.error(error);
                })
        }
        // $http.get('../assets/json/orders.json')
        //     .then(function (response) {
        //         localStorageService.set('orders', response.data);
        //         $scope.orders = response.data;
        //         console.log($scope.orders);
        //     }, function (error) {
        //         var data = localStorageService.get('orders');
        //         if (data) {
        //             toastr.warning('Bestellungen konnten nicht geladen werden! Daten sind möglicherweise veraltet.');
        //             $scope.orders = data;
        //         } else {
        //             toastr.error('Bestellungen konnten nicht geladen werden! Bitte verbinden Sie sich mit dem Internet.');
        //         }
        //         console.log(error);
        //     });
    });