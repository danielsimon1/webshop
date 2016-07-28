angular.module('app.genre', [])

    .config(function ($stateProvider) {
        $stateProvider.state('genre', {
            url: '/genre/:name',
            templateUrl: 'app/genre/genre.html',
            controller: 'GenreCtrl'
        });
    })

    .controller('GenreCtrl', function ($stateParams, localStorageService, $scope) {
        $scope.searchInput = "";
        $scope.isAllGenres = false;

        // get genre from URL parameters
        $scope.genre = $stateParams.name;

        // all articles
        var articles = localStorageService.get('articles');

        // only articles with matching genre
        $scope.articles = {};

        $scope.isArticles = false;
        if ($scope.genre != 'Alle Spiele') {
            angular.forEach(articles, function (item) {
                if (item.genre == $scope.genre) {
                    $scope.isArticles = true;
                    $scope.articles[item.id] = item;
                }
            });
        } else {
            $scope.isArticles = true;
            $scope.isAllGenres = true;
            $scope.articles = articles;
        }
    });