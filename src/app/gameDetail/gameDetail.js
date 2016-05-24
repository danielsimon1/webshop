angular.module('app.gameDetail', [])

    .config(function ($stateProvider) {
        $stateProvider.state('gameDetail', {
            url: '/gameDetail/:id',
            templateUrl: 'app/gameDetail/gameDetail.html',
            controller: 'GameDetailCtrl'
        });
    })

    .controller('GameDetailCtrl', function ($scope, $http, $stateParams, localStorageService, $rootScope, $uibModal) {
        $scope.tab = {};
        $scope.tab.active = 'description';
        $scope.quantity = 1;

        var user = localStorageService.get('user').userName;

        var calculateAverageStars = function (data) {
            var count = 0;
            var stars = 0;
            angular.forEach(data, function (item) {
                count++;
                stars += item.stars;
            });
            return stars / count;
        };

        $scope.changeTab = function (type) {
            $scope.tab.active = type;
        };

        var id = $stateParams.id;
        $scope.articles = localStorageService.get('articles');
        $scope.actualGame = $scope.articles[id];

        $scope.stars = calculateAverageStars($scope.actualGame.reviews);
        document.getElementById("description").innerHTML = $scope.actualGame.description;

        $scope.toCart = function () {
            if ($scope.quantity >= 1) {
                var cart = localStorageService.get('cart') || {};
                if (cart[$scope.actualGame.id] && cart[$scope.actualGame.id].quantity) {
                    cart[$scope.actualGame.id].quantity = parseInt(cart[$scope.actualGame.id].quantity) + parseInt($scope.quantity)
                } else {
                    cart[$scope.actualGame.id] = {
                        itemId: $scope.actualGame.id,
                        quantity: parseInt($scope.quantity)
                    };
                }
                localStorageService.set('cart', cart);
                $rootScope.$emit('itemAddedToCart');
                toastr.success('Artikel erfolgreich ' + $scope.quantity + 'x in den Warenkorb gelegt!');
                $scope.quantity = 1;
            } else {
                toastr.warning('Bitte geben Sie eine gültige Zahl ein!')
            }
        };

        $scope.starsActivator = {};
        $scope.numbers = [1, 2, 3, 4, 5];
        for (var i = 0; i <= 4; i++) {
            $scope.starsActivator[$scope.numbers[i]] = false;
        }

        $scope.starHover = function (number) {
            while (number > 0) {
                $scope.starsActivator[number] = true;
                number--;
            }
        };

        $scope.leave = function () {
            for (var i = 0; i <= 4; i++) {
                $scope.starsActivator[$scope.numbers[i]] = false;
            }
        };

        $scope.rate = function (stars) {
            //TODO: eigene Bewertung abfangen
            var newReviewId = 1;
            do {
                newReviewId++;
            } while ($scope.actualGame.reviews[newReviewId]);
            var title = '';
            var message = '';
            angular.forEach($scope.actualGame.reviews, function (review) {
                if (review.author == user) {
                    title = review.title;
                    message = review.message;
                    newReviewId = review.id;
                }
            });
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/gameDetail/rating/rating.html',
                controller: 'RatingCtrl',
                resolve: {
                    stars: function () {
                        return stars;
                    },
                    title: function () {
                        return title;
                    },
                    message: function () {
                        return message;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                $scope.actualGame.reviews[newReviewId] = {
                    id: newReviewId,
                    stars: result.stars,
                    title: result.title,
                    message: result.message,
                    author: user
                };
                $scope.articles[id].reviews = $scope.actualGame.reviews;
                localStorageService.set('articles', $scope.articles);
                $scope.stars = calculateAverageStars($scope.actualGame.reviews);
                toastr.success('Bewertung hinzugefügt!');
            }, function () {
                console.log('Modal dismissed');
            });
        };
    });