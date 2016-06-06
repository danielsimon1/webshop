(function(window, document, undefined) {
'use strict';
angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'LocalStorageModule',
    'ngAnimate',
    'templates',
    'textAngular',
    // 'ngSanitize',
    'app.home',
    'app.addArticle',
    'app.topGames',
    'app.newGames',
    'app.gameDetail',
    'app.login',
    'app.genre',
    'app.cart',
    'app.checkout',
    'app.orders',
    'app.register',
    'app.passwordForget'
])
    .config(["$urlRouterProvider", "localStorageServiceProvider", function ($urlRouterProvider, localStorageServiceProvider) {
        $urlRouterProvider.otherwise('/home');
        localStorageServiceProvider.setPrefix('webshop');
    }])
    .run(["localStorageService", "articles", "$rootScope", "$log", function (localStorageService, articles, $rootScope, $log) {
        articles.getAllArticles()
            .then(function (response) {
                $rootScope.$emit('genresLoaded');
                localStorageService.set('articles', response);
            }, function (error) {
                var data = localStorageService.get('articles');
                if (data) {
                    toastr.warning('Artikel konnten nicht neu geladen werden. Daten sind möglicherweise veraltet.')
                } else {
                    toastr.error('Artikel konnten nicht geladen werden.');
                }
                $log.error(error);
            });
        localStorageService.set('fromCheckout', false);
    }])
    .controller('AppCtrl', ["$scope", "$rootScope", "$http", "localStorageService", "$state", "articles", "$log", function ($scope, $rootScope, $http, localStorageService, $state, articles, $log) {
        localStorageService.remove('checkout');
        $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams) {
                $scope.currentStateName = toState.name;
                $scope.currentStateParams = toParams.name;
            });

        $rootScope.$on('itemAddedToCart', function () {
            countCartItems();
        });

        $rootScope.$on('login', function () {
            getUserData();
        });
        
        $rootScope.$on('genresLoaded', function () {
             articles.getAllGenres()
                 .then(function (response) {
                     $scope.genres = response;
                 }, function (error) {
                     $log.error(error);
                 })
        });

        $scope.logout = function () {
            localStorageService.remove('user');
            localStorageService.remove('orders');
            localStorageService.remove('checkout');
            // update user data
            $rootScope.$emit('login');
            $rootScope.$emit('itemAddedToCart');
            toastr.success('Logout war erfolgreich.');
            $state.go('login');
        };

        var getUserData = function () {
            var user = localStorageService.get('user') || {};
            $scope.userName = user.userName || 'Benutzer';
            $scope.userRole = user.role;
        };
        getUserData();

        var countCartItems = function () {
            var cart = localStorageService.get('cart');
            $scope.quantity = 0;
            angular.forEach(cart, function (item) {
                $scope.quantity += item.quantity;
            });
        };
        countCartItems();
    }])
    .directive('imageonload', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('load', function() {
                    scope.isImage = true;
                    scope.$apply();
                });
                element.bind('error', function(){
                    scope.isImage = false;
                    scope.$apply();
                });
            }
        };
    });

angular.module('app.gameDetail', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('gameDetail', {
            url: '/gameDetail/:id',
            templateUrl: 'app/gameDetail/gameDetail.html',
            controller: 'GameDetailCtrl'
        });
    }])

    .controller('GameDetailCtrl', ["$scope", "$http", "$stateParams", "localStorageService", "$rootScope", "$uibModal", function ($scope, $http, $stateParams, localStorageService, $rootScope, $uibModal) {
        $scope.tab = {};
        $scope.tab.active = 'description';
        $scope.quantity = 1;

        var user = localStorageService.get('user') || {};
        var userName = user.userName;

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
                toastr.success('<img src="assets/img/giphy.gif" ng-show="inCart"/>');
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
            if (userName) {
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
                        author: userName
                    };
                    $scope.articles[id].reviews = $scope.actualGame.reviews;
                    localStorageService.set('articles', $scope.articles);
                    $scope.stars = calculateAverageStars($scope.actualGame.reviews);
                    toastr.success('Bewertung hinzugefügt!');
                }, function () {
                    console.log('Modal dismissed');
                });
            } else {
                toastr.warning('Bitte loggen Sie sich zuerst ein!');
            }
        };
    }]);

angular.module('app.addArticle', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('addArticle', {
            url: '/addArticle',
            templateUrl: 'app/addArticle/addArticle.html',
            controller: 'AddArticleCtrl'
        });
    }])

    .controller('AddArticleCtrl', ["$scope", "articles", "$log", function ($scope, articles, $log) {
        $scope.selected = {};
        $scope.selected.platform = {};
        $scope.selected.fsk = '0';
        $scope.isTouched = false;
        $scope.isPriceInvalid = false;
        $scope.isPriceTouched = false;
        $scope.isCustomGenre = false;
        $scope.genreButtonText = 'Neues Genre anlegen';

        articles.getAllGenres()
            .then(function (response) {
                $scope.genres = response;
            }, function (error) {
                $log.error(error);
            });

        function validatePrice(input) {
            return /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/.test(input);
        }

        $scope.changeInputStyle = function () {
            $scope.isCustomGenre ? $scope.isCustomGenre = false : $scope.isCustomGenre = true;
            $scope.genreButtonText == 'Neues Genre anlegen' ? $scope.genreButtonText = 'Vorhandenes Genre auswählen' : $scope.genreButtonText = 'Neues Genre anlegen';
        };

        $scope.priceValidation = function () {
            $scope.isPriceTouched = true;
            !validatePrice($scope.price) ? $scope.isPriceInvalid = true : $scope.isPriceInvalid = false;
        };

        $scope.addArticle = function () {
            $scope.isTouched = true;
            $scope.isPriceTouched = true;
            $scope.isPriceInvalid = false;
            if ($scope.title && ((!selected.genre && !isCustomGenre) || (isCustomGenre && !customGenre)) && $scope.price && ($scope.selected.platform.wiiu ||
                $scope.selected.platform.windows || $scope.selected.platform.ps || $scope.selected.platform.xbox ||
                $scope.selected.platform.osx) && $scope.release && $scope.language && $scope.minRam &&
                $scope.minProcessor && $scope.description) {
                if (!validatePrice($scope.price)) {
                    toastr.warning('Ungültiger Preis!');
                    $scope.isPriceInvalid = true;
                } else {
                    toastr.success('Top');
                }
            } else {
                toastr.warning('Fehlende Informationen!');
            }
        }
    }]);

angular.module('app.cart', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('cart', {
            url: '/cart',
            templateUrl: 'app/cart/cart.html',
            controller: 'CartCtrl'
        });
    }])

    .controller('CartCtrl', ["localStorageService", "$scope", "$rootScope", function (localStorageService, $scope, $rootScope) {
        // cart only
        var cart = localStorageService.get('cart');
        // articles only
        var articles = localStorageService.get('articles');
        // cart and articles merged
        $scope.cart = {};

        $scope.updateTotalPrice = function () {
            $scope.totalPrice = 0;
            angular.forEach($scope.cart, function (item) {
                $scope.totalPrice += item.quantity * item.price;
            });
        };

        // merge cart and articles
        angular.forEach(articles, function (article) {
            angular.forEach(cart, function (item) {
                if (item.itemId == article.id) {
                    var newObject = article;
                    newObject.quantity = item.quantity;
                    console.log(newObject);
                    $scope.cart[item.itemId] = newObject;
                }
            });
        });
        $scope.updateTotalPrice();

        $scope.quantityChange = function (id) {
            cart[id].quantity = parseInt($scope.cart[id].quantity);
            $scope.updateTotalPrice();
            localStorageService.set('cart', cart);
            $rootScope.$emit('itemAddedToCart');
        };

        $scope.remove = function (id) {
            delete $scope.cart[id];
            delete cart[id];
            $scope.updateTotalPrice();
            localStorageService.set('cart', cart);
            $rootScope.$emit('itemAddedToCart');
        }
    }]);

angular.module('app.genre', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('genre', {
            url: '/genre/:name',
            templateUrl: 'app/genre/genre.html',
            controller: 'GenreCtrl'
        });
    }])

    .controller('GenreCtrl', ["$stateParams", "localStorageService", "$scope", function ($stateParams, localStorageService, $scope) {
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
    }]);

angular.module('app.home', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'app/home/home.html',
            controller: 'HomeCtrl'
        });
    }])

    .controller('HomeCtrl', function () {

    });

angular.module('app.orders', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('orders', {
            url: '/orders',
            templateUrl: 'app/orders/orders.html',
            controller: 'OrdersCtrl'
        });
    }])

    .controller('OrdersCtrl', ["$scope", "$http", "localStorageService", function ($scope, $http, localStorageService) {
        var date = new Date();
        console.log(date);
        $http.get('../assets/json/orders.json')
            .then(function (response) {
                localStorageService.set('orders', response.data);
                $scope.orders = response.data;
                console.log($scope.orders);
            }, function (error) {
                var data = localStorageService.get('orders');
                if (data) {
                    toastr.warning('Bestellungen konnten nicht geladen werden! Daten sind möglicherweise veraltet.');
                    $scope.orders = data;
                } else {
                    toastr.error('Bestellungen konnten nicht geladen werden! Bitte verbinden Sie sich mit dem Internet.');
                }
                console.log(error);
            });
    }]);

angular.module('app.newGames', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('newGames', {
            url: '/newGames',
            templateUrl: 'app/newGames/newGames.html',
            controller: 'NewGamesCtrl'
        });
    }])

    .controller('NewGamesCtrl', function () {

    });

angular.module('app.login', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'app/login/login.html',
            controller: 'LoginCtrl'
        });
    }])

    .controller('LoginCtrl', ["$scope", "$state", "localStorageService", "$rootScope", "$http", "$log", function ($scope, $state, localStorageService, $rootScope, $http, $log) {
        $scope.isFormTouched = false;
        var user = localStorageService.get('user') || {};
        var toCheckout = localStorageService.get('fromCheckout');
        if (user.userName) {
            toastr.info('Sie sind bereits eingeloogt als "' + user.userName + '"!');
            $state.go('home');
        }
        $scope.data = {};
        $scope.data.password = '';
        $scope.data.userName = '';

        //Trigger Login when enter pressed
        $("#username").keydown(function (event) {
            if (event.keyCode == 13) {
                $("#submit").click();
            }
        });
        $("#password").keydown(function (event) {
            if (event.keyCode == 13) {
                $("#submit").click();
            }
        });

        $scope.login = function () {
            $scope.isFormTouched = true;
            if (!$scope.data.userName || !$scope.data.password) {
                toastr.warning('<img src="assets/img/Epic_Mass_Facepalm.gif"/>');
                toastr.warning('You had one Job!');
            } else {
                $http.get('http://localhost:8080/rest/user/' + $scope.data.userName)
                    .then(function (response) {
                        if (response.data.password === $scope.data.password) {
                            toastr.success('Login war erfolgreich.');
                            var role = response.Rolle;
                            var user = {
                                userName: $scope.data.userName,
                                role: role
                            };
                            localStorageService.set('user', user);
                            $rootScope.$emit('login');
                            localStorageService.remove('checkout');
                            if (toCheckout) {
                                $state.go('checkout');
                            } else {
                                $state.go('home');
                            }
                        } else {
                            toastr.warning('Benutzername und Passwort stimmen nicht überein!');
                        }
                    }, function (error) {
                        $log.error(error);
                        toastr.error('Fehler bei der Verbindung! Status ' + error.status);
                    });
            }
        }
    }]);

angular.module('app')
    .factory('articles', ["$q", "$http", "localStorageService", function ($q, $http, localStorageService) {
        var service = {};

        service.getAllArticles = function () {
            var q = $q.defer();
            $http.get('assets/json/articles.json')
                .then(function (response) {
                    //Mapping
                    var mapped = _mapArticles(response.data);
                    localStorageService.set('articles', mapped);
                    q.resolve(mapped);
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

        var _mapArticles = function (articles) {
            var mappedItems = {};
            var genres = [];

            angular.forEach(articles, function (item) {
                // Genres
                var isNewGenre = true;
                angular.forEach(genres, function (genre) {
                    if (item.genre == genre) {
                        isNewGenre = false;
                    }
                });
                if (isNewGenre) {
                    genres.push(item.genre);
                }

                var mappedItem = {
                    id: item.id,
                    name: item.name,
                    genre: item.genre,
                    price: item.price,
                    fsk: item.fsk,
                    platforms: item.platforms,
                    release: item.release,
                    language: item.language,
                    minRam: item.minRam,
                    minProcessor: item.minProcessor,
                    image: item.image,
                    description: item.description,
                    reviews: _mapReviews(item.reviews)
                };
                mappedItems[mappedItem.id] = mappedItem;
            });
            localStorageService.set('genres', genres);
            return mappedItems;
        };
        var _mapReviews = function (reviews) {
            var mappedItems = {};
            angular.forEach(reviews, function (item) {
                var mappedItem = {
                    id: item.id,
                    stars: item.stars,
                    author: item.author,
                    title: item.title,
                    message: item.message
                };
                mappedItems[mappedItem.id] = mappedItem;
            });
            return mappedItems;
        };
        return service;
    }]);

angular.module('app.topGames', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('topGames', {
            url: '/topGames',
            templateUrl: 'app/topGames/topGames.html',
            controller: 'TopGamesCtrl'
        });
    }])

    .controller('TopGamesCtrl', function () {

    });

angular.module('app.gameDetail')
    .controller('RatingCtrl', ["$scope", "$uibModalInstance", "stars", "title", "message", function ($scope, $uibModalInstance, stars, title, message) {
        
        $scope.stars = stars;
        $scope.message = message;
        $scope.title = title;

        $scope.checkValid = function () {
            $scope.message && $scope.title ? $scope.isValid = true : $scope.isValid = false;
        };
        $scope.checkValid();

        $scope.submit = function () {
            var result = {
                title: $scope.title,
                message: $scope.message,
                stars: $scope.stars
            };
            $uibModalInstance.close(result);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);

angular.module('app.checkout', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('checkout', {
            url: '/checkout',
            templateUrl: 'app/cart/checkout/checkout.html',
            controller: 'CheckoutCtrl'
        });
    }])

    .controller('CheckoutCtrl', ["$scope", "localStorageService", "$state", function ($scope, localStorageService, $state) {
        var user = localStorageService.get('user') || {};
        if (!user.userName) {
            localStorageService.set('fromCheckout', true);
            toastr.info('Bitte melden Sie sich an.');
            $state.go('login');
        }
        var cart = localStorageService.get('cart') || {};
        var articles = localStorageService.get('articles') || {};
        $scope.cart = {};

        $scope.updateTotalPrice = function () {
            $scope.totalPrice = 0;
            angular.forEach($scope.cart, function (item) {
                $scope.totalPrice += item.quantity * item.price;
            });
        };

        angular.forEach(articles, function (article) {
            angular.forEach(cart, function (item) {
                if (item.itemId == article.id) {
                    var newObject = article;
                    newObject.quantity = item.quantity;
                    $scope.cart[item.itemId] = newObject;
                }
            });
        });
        $scope.updateTotalPrice();

    }]);

angular.module('app.passwordForget', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('passwordForget', {
            url: '/passwordForget',
            templateUrl: 'app/login/passwordForget/passwordForget.html',
            controller: 'PasswordForgetCtrl'
        });
    }])

    .controller('PasswordForgetCtrl', ["$scope", function ($scope) {
        $scope.data = {};
        $scope.data.email = '';
        $scope.submit = function () {
            if (!$scope.email) {
                toastr.warning('Ungültige Email-Adresse!');
            } else {
                toastr.success('Gültige Eingabe.');
            }
        }
    }]);

angular.module('app.register', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('register', {
            url: '/register',
            templateUrl: 'app/login/register/register.html',
            controller: 'RegisterCtrl'
        });
    }])

    .controller('RegisterCtrl', ["$scope", "$http", "$log", function ($scope, $http, $log) {
        $scope.data = {};
        $scope.data.userName = '';
        $scope.data.email = '';
        $scope.data.password = '';
        $scope.data.passwordConfirm = '';

        $scope.register = function () {
            if (!$scope.data.userName || !$scope.data.password || !$scope.data.passwordConfirm) {
                toastr.warning('Alle Felder müssen ausgefüllt werden!', 'Fehlende Informationen!')
            } else if (!$scope.data.email) {
                toastr.warning('Die Email-Adresse ist ungültig!', 'Fehlerhafte Informationen!')
            } else if ($scope.data.password != $scope.data.passwordConfirm) {
                toastr.warning('Die Passwörter stimmen nicht überein.', 'Fehlerhafte Informationen!')
            } else {
                var user = {
                    id: '0000',
                    username: $scope.data.userName,
                    password: $scope.data.password,
                    email: $scope.data.email,
                    role: 'user'
                };
                // $http.post('http://localhost:8080/rest/user/' + JSON.stringify(user)+'');
            }
        }
    }]);

})(window, document);
