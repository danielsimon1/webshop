angular.module('app.genre', [])

    .config(function ($stateProvider) {
        $stateProvider.state('genre', {
            url: '/genre/:name',
            templateUrl: 'app/genre/genre.html',
            controller: 'GenreCtrl'
        });
    })

    .controller('GenreCtrl', function ($stateParams, localStorageService, $scope) {
        // TODO: order objects by id
        $scope.genre = $stateParams.name;
        var articles = localStorageService.get('articles');
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
            $scope.articles = articles;
        }
    });