angular.module('app.gameDetail', [])

    .config(function ($stateProvider) {
        $stateProvider.state('gameDetail', {
            url : '/gameDetail/:id',
            templateUrl : 'app/gameDetail/gameDetail.html',
            controller : 'GameDetailCtrl'
        });
    })

    .controller('GameDetailCtrl', function ($scope, $http, $stateParams, localStorageService, $uibModal, $state, articles, $rootScope, $log) {
        $scope.tab = {};
        $scope.tab.active = 'description';

        $scope.quantity = 1;

        $scope.isValidQuantity = true;
        $scope.calcPrice = function () {
            var price = $scope.actualGame.price * $scope.quantity;
            if (isNaN(price) || $scope.quantity < 1 || $scope.quantity > 20) {
                //&#8209; : minus without line break
                $scope.price = "Bitte gültige Anzahl (1&#8209;20) angeben!";
                $scope.isValidQuantity = false;
            } else {
                $scope.price = Math.round(price * 100) / 100;
                $scope.isValidQuantity = true;
            }
        };

        // load game at initial start
        loadGame();

        function loadGame() {
            // get the id from the url parameters
            var id = $stateParams.id;
            $scope.articles = localStorageService.get('articles');
            $scope.actualGame = $scope.articles[id];
            if (!$scope.actualGame) {
                toastr.warning('Das Spiel mit der ID ' + id + ' existiert nicht!');
                $state.go('home');
            } else {
                $scope.stars = calculateAverageStars($scope.actualGame.reviews);
                document.getElementById("description").innerHTML = $scope.actualGame.description;
                $scope.calcPrice();
            }
        }

        $rootScope.$on("articles-loaded", function () {
            // not every time the event is fired, the game detail site is opened
            // only react to the event when the site is opened
            if ($state.current.name == "gameDetail") {
                loadGame();
            }
        });

        var user = localStorageService.get('user') || {};
        var userName = user.userName;

        function calculateAverageStars(data) {
            var count = 0;
            var stars = 0;
            angular.forEach(data, function (item) {
                count++;
                stars += item.stars;
            });
            $scope.reviewsCount = count;
            if (count === 0) {
                return 0;
            } else {
                return stars / count;
            }
        }

        $scope.changeTab = function (type) {
            $scope.tab.active = type;
        };

        $scope.toCart = function () {
            if ($scope.quantity >= 1) {
                var cart = localStorageService.get('cart') || {};
                // merge item quantity with cart quantity
                if (cart[$scope.actualGame.id] && cart[$scope.actualGame.id].quantity) {
                    cart[$scope.actualGame.id].quantity = parseInt(cart[$scope.actualGame.id].quantity) + parseInt($scope.quantity)
                } else {
                    cart[$scope.actualGame.id] = {
                        itemId : $scope.actualGame.id,
                        quantity : parseInt($scope.quantity)
                    };
                }
                localStorageService.set('cart', cart);
                $rootScope.$emit('itemAddedToCart');
                toastr.success('<img src="assets/img/giphy.gif" ng-show="inCart"/>');
                toastr.success('Artikel erfolgreich ' + $scope.quantity + 'x in den Warenkorb gelegt!');
            } else {
                toastr.warning('Bitte geben Sie eine gültige Zahl ein!')
            }
        };

        // logic for rating
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
            if (userName) {
                var newReviewId = 1;
                do {
                    newReviewId++;
                } while ($scope.actualGame.reviews[newReviewId]);
                var title = '';
                var message = '';
                angular.forEach($scope.actualGame.reviews, function (review) {
                    // if user wrote a preview before
                    if (review.author == user.userName) {
                        title = review.title;
                        message = review.message;
                        newReviewId = review.id;
                    }
                });
                // modal
                var modalInstance = $uibModal.open({
                    animation : true,
                    templateUrl : 'app/gameDetail/rating/rating.html',
                    controller : 'RatingCtrl',
                    // send data from previous review to modal controller
                    resolve : {
                        stars : function () {
                            return stars;
                        },
                        title : function () {
                            return title;
                        },
                        message : function () {
                            return message;
                        }
                    }
                });
                // code when modal is closed
                modalInstance.result.then(function (result) {
                    // modal has been closed because user wants to send a review
                    var data = {
                        id : 0,
                        stars : result.stars,
                        title : result.title,
                        message : result.message,
                        author : userName,
                        articleId : $scope.actualGame.id
                    };
                    articles.addReview(data)
                        .then(function () {
                            toastr.success('Bewertung hinzugefügt!');
                        }, function (error) {
                            toastr.error("Bewertung wurde nicht hinzugefügt!");
                            if (error) {
                                toastr.error(error);
                            } else {
                                toastr.error("Ein unbekannter Fehler ist aufgetreten!");
                            }
                        });
                }, function () {
                    // modal has been closed because user pressed the cancel button
                    $log.info('Modal dismissed');
                });
            } else {
                toastr.warning('Bitte loggen Sie sich zuerst ein!');
            }
        };
    });