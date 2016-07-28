angular.module('app.topGames', [])

    .config(function ($stateProvider) {
        $stateProvider.state('topGames', {
            url: '/topGames',
            templateUrl: 'app/topGames/topGames.html',
            controller: 'TopGamesCtrl'
        });
    })

    .controller('TopGamesCtrl', function ($scope, articles, localStorageService) {
        $scope.topGames = localStorageService.get("top-games") || [];
        $scope.articles = localStorageService.get("articles");
        articles.getTopGames()
            .then(function () {
                $scope.topGames = localStorageService.get("top-games") || [];
            }, function (error) {
                toastr.error(error);
            });
        articles.getAllArticles();
    });