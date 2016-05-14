'use strict';

angular.module('app.gameDetail', [])

    .config(function ($stateProvider) {
        $stateProvider.state('gameDetail', {
            url: '/gameDetail/:id',
            templateUrl: 'gameDetail/gameDetail.html',
            controller: 'GameDetailCtrl'
        });
    })

    .controller('GameDetailCtrl', function ($scope, $http, $stateParams) {
        $scope.tab = {};
        $scope.tab.active = 'description';
        $scope.changeTab = function (type) {
            $scope.tab.active = type;
        };
        var id = $stateParams.id;
        $http.get('../assets/json/articles.json')
            .then(function (response) {
                $scope.articles = response.data;
                angular.forEach($scope.articles, function (item) {
                    if (item.id == id) {
                        $scope.actualGame = item;
                    }
                });
                $scope.stars = calculateAverageStars($scope.actualGame.reviews);
                document.getElementById("description").innerHTML = $scope.actualGame.description
            }, function (error) {
                console.log(error);
            });
        var calculateAverageStars = function (data) {
            var count = 0;
            var stars = 0;
            angular.forEach(data, function (item) {
                count++;
                stars += item.stars;
            });
            return stars / count;
        };
    });