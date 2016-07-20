angular.module('app')
    .factory('articles', function ($q, $http, localStorageService, $log) {
        var service = {};

        service.getAllArticles = function () {
            var q = $q.defer();
            $http.get('http://localhost:8080/rest/article/get/all')
                .then(function (response) {
                    console.log(response.data);
                    if (typeof response.data == 'string') {
                        q.reject(response.data);
                    } else {
                        //Mapping
                        var mapped = _mapArticles(response.data);
                        localStorageService.set('articles', mapped);
                        q.resolve(mapped);
                    }
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
                ID : input.id.toString(),
                Name : input.name,
                Genre : input.genre,
                Preis : input.price,
                FSK : input.fsk,
                Plattformen : input.platforms,
                Release : input.release,
                Sprache : input.language,
                minRam : parseInt(input.minRam),
                minProcessor : parseFloat(input.minProcessor),
                Beschreibung : input.description,
                image : input.image,
                Rezensionen : []
            };
            console.log(data);
            $http.post('http://localhost:8080/rest/article/add', data)
                .then(function (response) {
                    if (response.data == "Artikel existiert bereits") {
                        q.reject(response.data);
                    } else if (response.data == "Artikel konnte nicht hinzugefügt werden") {
                        q.reject(response.data);
                    } else {
                        q.resolve(response.data);
                    }
                }, function (error) {
                    q.reject(error.statusText);
                });
            return q.promise;
        };

        service.addReview = function (input) {
            var q = $q.defer();
            var date = new Date().getTime();
            var data = {
                ID : '0',
                idArticle : input.articleId.toString(),
                stars : input.stars.toString(),
                Autor : input.author,
                Titel : input.title,
                Text : input.message,
                Datum : date.toString()
            };
            console.log(data);
            $http.post('http://localhost:8080/rest/review/add', data)
                .then(function (response) {
                    console.log(response);
                    if (response.data == 'Rezension konnte nicht hinzugefügt werden') {
                        q.reject(response.data);
                    } else {
                        q.resolve(response.data);
                    }
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
                    if (item.Genre == genre) {
                        isNewGenre = false;
                    }
                });

                var mappedItem = {
                    id : parseInt(item.ID),
                    name : item.Name,
                    genre : item.Genre,
                    price : parseFloat(item.Preis),
                    fsk : parseInt(item.FSK),
                    platforms : trimPlatforms(item.Plattformen),
                    release : item.Release,
                    language : item.Sprache,
                    minRam : item.minRam,
                    minProcessor : item.minProcessor,
                    image : item.image,
                    description : item.Beschreibung,
                    reviews : _mapReviews(item.Rezensionen)
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
            var mappedItems = [];
            angular.forEach(reviews, function (item) {
                var mappedItem = {
                    id : parseInt(item.ID),
                    stars : parseInt(item.stars),
                    author : item.Autor,
                    title : item.Titel,
                    message : item.Text,
                    date : parseInt(item.Datum)
                };
                console.log(mappedItem.date);
                mappedItems.push(mappedItem);
            });
            return mappedItems || [];
        };
        return service;
    });