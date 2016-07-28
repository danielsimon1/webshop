angular.module('app.topGames', [])

    .config(function ($stateProvider) {
        $stateProvider.state('topGames', {
            url: '/topGames',
            templateUrl: 'app/topGames/topGames.html',
            controller: 'TopGamesCtrl'
        });
    })

    .controller('TopGamesCtrl', function ($scope, articles, localStorageService) {
        $scope.topGameIds = localStorageService.get("top-games") || [];
        $scope.articles = localStorageService.get("articles") || {};
        articles.getTopGames()
            .then(function () {
                $scope.topGameIds = localStorageService.get("top-games")
            }, function (error) {
                toastr.error(error);
            });
        articles.getAllArticles()
            .then(function () {
                $scope.articles = localStorageService.get("articles");
            }, function (error) {
                toastr.error(error);
            });
    });