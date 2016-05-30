angular.module('app')
    .factory('articles', function ($q, $http, localStorageService) {
        var service = {};
        service.getAllArticles = function () {
            var q = $q.defer();
            $http.get('assets/json/articles.json')
                .then(function (response) {
                    //Mapping
                    var mapped = _mapArticles(response.data);
                    localStorageService.set('articles', mapped);
                    q.resolve(mapped);
                }, function (error) {
                    q.reject(error);
                });
            return q.promise;
        };
        var _mapArticles = function (articles) {
            var mappedItems = {};
            angular.forEach(articles, function (item) {
                var mappedItem = {
                    id: item.id,
                    name: item.name,
                    genre: item.genre,
                    price: item.price,
                    fsk: item.fsk,
                    platforms: item.platforms,
                    release: item.release,
                    language: item.language,
                    minRam: item.minRam,
                    minProcessor: item.minProcessor,
                    image: item.image,
                    description: item.description,
                    reviews: _mapReviews(item.reviews)
                };
                mappedItems[mappedItem.id] = mappedItem;
            });
            return mappedItems;
        };
        var _mapReviews = function (reviews) {
            var mappedItems = {};
            angular.forEach(reviews, function (item) {
                var mappedItem = {
                    id: item.id,
                    stars: item.stars,
                    author: item.author,
                    title: item.title,
                    message: item.message
                };
                mappedItems[mappedItem.id] = mappedItem;
            });
            return mappedItems;
        };
        return service;
    });