'use strict';

angular.module('app.orders', [])

    .config(function ($stateProvider) {
        $stateProvider.state('orders', {
            url: '/orders',
            templateUrl: 'app/orders/orders.html',
            controller: 'OrdersCtrl'
        });
    })

    .controller('OrdersCtrl', function ($scope, $http, localStorageService) {
        var date = new Date();
        console.log(date);
        $http.get('../assets/json/orders.json')
            .then(function (response) {
                localStorageService.set('orders', response.data);
                $scope.orders = response.data;
                console.log($scope.orders);
            }, function (error) {
                var data = localStorageService.get('orders');
                if (data) {
                    toastr.warning('Bestellungen konnten nicht geladen werden! Daten sind möglicherweise veraltet.');
                    $scope.orders = data;
                } else {
                    toastr.error('Bestellungen konnten nicht geladen werden! Bitte verbinden Sie sich mit dem Internet.');
                }
                console.log(error);
            });
    });