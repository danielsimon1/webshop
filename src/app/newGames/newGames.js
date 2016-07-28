angular.module('app.newGames', [])

    .config(function ($stateProvider) {
        $stateProvider.state('newGames', {
            url: '/newGames',
            templateUrl: 'app/newGames/newGames.html',
            controller: 'NewGamesCtrl'
        });
    })

    .controller('NewGamesCtrl', function ($scope, articles, localStorageService) {
        $scope.newGameIds = localStorageService.get("new-games") || [];
        $scope.articles = localStorageService.get("articles") || {};
        articles.getAllArticles()
            .then(function () {
                $scope.newGameIds = localStorageService.get("new-games");
                $scope.articles = localStorageService.get("articles");
            }, function (error) {
                toastr.error(error);
            });
    });