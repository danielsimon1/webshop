angular.module('app')
    .factory('articles', function ($q, $http, localStorageService) {
        var service = {};

        service.getAllArticles = function () {
            var q = $q.defer();
            $http.get('http://localhost:8080/rest/article/all')
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

        service.getAllGenres = function () {
            var q = $q.defer();
            var genres = localStorageService.get('genres') || [];
            if (!genres) {
                this.getAllArticles()
                    .then(function () {
                        genres = localStorageService.get('genres') || [];
                        q.resolve(genres);
                    }, function (error) {
                        q.reject(error);
                    })
            } else {
                q.resolve(genres);
            }
            return q.promise;
        };

        service.addArticle = function (input) {
            var q = $q.defer();
            var data = {
                ID: input.id.toString(),
                Name: input.name,
                Genre: input.genre,
                Preis: input.price,
                FSK: input.fsk,
                Plattformen: input.platforms,
                Release: input.release,
                Sprache: input.language,
                minRam: parseInt(input.minRam),
                minProcessor: parseFloat(input.minProcessor),
                Beschreibung: input.description,
                image: input.image,
                Rezensionen: []
            };
            console.log(data);
            $http.post('http://localhost:8080/rest/article', data)
                .then(function (response) {
                    console.log(response);
                    q.resolve(response);
                }, function (error) {
                    console.log(error);
                    q.reject(error);
                });
            return q.promise;
        };

        var _mapArticles = function (articles) {
            var mappedItems = {};
            var genres = [];

            angular.forEach(articles, function (item) {
                // Genres
                var isNewGenre = true;
                angular.forEach(genres, function (genre) {
                    if (item.genre == genre) {
                        isNewGenre = false;
                    }
                });

                var mappedItem = {
                    id: parseInt(item.ID),
                    name: item.Name,
                    genre: item.Genre,
                    price: parseFloat(item.Preis),
                    fsk: parseInt(item.FSK),
                    platforms: trimPlatforms(item.Plattformen),
                    release: item.Release,
                    language: item.Sprache,
                    minRam: item.minRam,
                    minProcessor: item.minProcessor,
                    image: item.image,
                    description: item.Beschreibung,
                    reviews: _mapReviews(item.Rezensionen)
                };
                if (isNewGenre) {
                    genres.push(mappedItem.genre);
                }
                mappedItems[mappedItem.id] = mappedItem;
                console.log(mappedItem);
            });
            localStorageService.set('genres', genres);
            return mappedItems;
        };

        function trimPlatforms(input) {
            var trimmed = [];
            angular.forEach(input, function (item) {
                trimmed.push(item.trim());
            });
            return trimmed;
        }

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