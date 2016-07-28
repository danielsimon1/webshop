angular.module('app')
    .factory('orders', function ($q, $http, localStorageService, $log) {
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
            $http.post("http://localhost:8080/rest/order/add", data)
                .then(function(response) {
                    if (response.data == "Bestellung konnte nicht hinzugefügt werden") {
                        $log.error("error adding order");
                        q.reject(response.data);
                    } else {
                        $log.info("order added");
                        q.resolve(response.data);
                    }
                }, function (error) {
                    $log.error("error adding order: ", error);
                    q.reject(error.statusText);
                });
            return q.promise;
        };

        service.getOrders = function (id) {
            var q = $q.defer();
            $http.get("http://localhost:8080/rest/order/get/" + id)
                .then(function (response) {
                    if(response.data == "Bestellungen konnten nicht geladen werden") {
                        $log.error("error loading orders");
                        q.reject(response.data);
                    } else {
                        var orders = _mapOrders(response.data);
                        $log.info("orders loaded");
                        q.resolve(orders);
                    }
                }, function (error) {
                    $log.error("error loading orders: ", error);
                    q.reject(error.statusText);
                });

            return q.promise;
        };

        function _mapOrders(input) {
            var mapped = [];
            angular.forEach(input, function (order) {
                var mappedOrder = {};
                mappedOrder = {
                    id: parseInt(order.ID),
                    userId: parseInt(order.idUser),
                    date: parseInt(order.Datum),
                    totalPrice: parseFloat(order.Preis),
                    articles: _mapArticles(order.Bestellungsartikel)
                };
                mapped.push(mappedOrder);
            });
            return mapped;
        }

        function _mapArticles(input) {
            var mapped = [];
            angular.forEach(input, function (item) {
                var mappedItem = {};
                mappedItem = {
                    id: parseInt(item.idArticle),
                    quantity: parseInt(item.Anzahl),
                    price: parseFloat(item.Preis),
                    name: item.Name
                };
                mapped.push(mappedItem);
            });
            return mapped;
        }

        function mapCartItems(input) {
            var articles = localStorageService.get("articles") || {};
            var mapped = [];
            angular.forEach(input, function (item) {
                var mappedItem = {};
                if (articles[item.itemId]) {
                    mappedItem = {
                        idArticle : item.itemId.toString(),
                        Name: articles[item.itemId].name,
                        Anzahl : item.quantity.toString(),
                        idOrder : '0',
                        Preis : articles[item.itemId].price.toString()
                    };
                    mapped.push(mappedItem);
                }
            });
            return mapped;
        }

        return service;
    });