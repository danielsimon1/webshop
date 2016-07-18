angular.module('app')
    .factory('orders', function ($q, $http) {
        var service = {};

        service.addOrder = function (input) {
            var q = $q.defer();
            var data = {
                ID: '0',
                idUser: input.userId,
                Datum: input.date,
                Preis: input.totalPrice,
                Bestellungsartikel: input.items
            };
            // TODO server
            return q.promise;
        };
        
        //TODO server -> input: user ID; output: orders

        return service;
    });