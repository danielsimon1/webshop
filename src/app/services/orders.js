angular.module('app')
    .factory('orders', function ($q, $http, localStorageService) {
        var service = {};

        service.addOrder = function (input) {
            var q = $q.defer();
            var data = {
                ID: '0',
                idUser: input.userId.toString(),
                Datum: input.date.toString(),
                Preis: input.totalPrice.toString(),
                Bestellungsartikel: mapCartItems(input.items)
            };
            console.log(data);
            $http.post("http://localhost:8080/rest/order/add", data)
                .then(function(response) {
                    console.log(response);
                }, function (error) {
                    console.log(error);
                    q.reject(error.statusText);
                });
            return q.promise;
        };

        function mapCartItems(input) {
            var articles = localStorageService.get("articles") || {};
            var mapped = [];
            angular.forEach(input, function (item) {
                var mappedItem = {};
                if (articles[item.itemId]) {
                    var price = parseInt(articles[item.itemId].price) * parseInt(item.quantity);
                    mappedItem = {
                        idArticle : item.itemId.toString(),
                        Anzahl : item.quantity.toString(),
                        ID : '0',
                        idOrder : '0',
                        Preis : price.toString()
                    };
                    mapped.push(mappedItem);
                }
            });
            return mapped;
        }
        
        //TODO server -> input: user ID; output: orders

        return service;
    });