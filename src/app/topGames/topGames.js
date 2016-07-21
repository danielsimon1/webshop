angular.module('app.topGames', [])

    .config(function ($stateProvider) {
        $stateProvider.state('topGames', {
            url: '/topGames',
            templateUrl: 'app/topGames/topGames.html',
            controller: 'TopGamesCtrl'
        });
    })

    .controller('TopGamesCtrl', function (articles) {
        articles.getTopGames()
            .then(function (response) {
                console.log(response);
            });
    });