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
    'app.userAdministration',
    'app.register',
    'app.passwordForget'
])
    .config(["$urlRouterProvider", "localStorageServiceProvider", function ($urlRouterProvider, localStorageServiceProvider) {
        $urlRouterProvider.otherwise('/home');
        localStorageServiceProvider.setPrefix('webshop');
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": true,
            "progressBar": false,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    }])
    .run(["localStorageService", "articles", "$rootScope", "$log", function (localStorageService, articles, $rootScope, $log) {
        articles.getAllArticles()
            .then(function (response) {
                $rootScope.$emit('genresLoaded');
                localStorageService.set('articles', response);
            }, function (error) {
                var data = localStorageService.get('articles');
                if (data) {
                    toastr.error('Artikel konnten nicht neu geladen werden. Daten wurden aus dem Cache geladen.')
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
        $scope.genres = localStorageService.get("genres");

        $rootScope.$on('genresLoaded', function () {
            articles.getAllGenres()
                .then(function (response) {
                    $scope.genres = response;
                }, function (error) {
                    $log.error(error);
                })
        });

        $rootScope.$on("articles-loaded", function () {
            $scope.genres = localStorageService.get("genres");
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
            var articles = localStorageService.get('articles') || {};
            angular.forEach(cart, function (item) {
                if (articles[item.itemId]) {
                    $scope.quantity += item.quantity;
                } else {
                    delete cart[item.itemId];
                }
            });
            localStorageService.set('cart', cart);
        };
        countCartItems();
    }])
    .directive('imageonload', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('load', function () {
                    scope.isImage = true;
                    scope.$apply();
                });
                element.bind('error', function () {
                    scope.isImage = false;
                    scope.$apply();
                });
            }
        };
    })
    .filter('objectFilter', function () {
        return function (items, search) {
            var result = [];
            search = search ? search.toLowerCase() : '';
            angular.forEach(items, function (value, key) {
                if (value.name.toLowerCase().indexOf(search) !== -1) {
                    result.push(value);
                }
            });
            return result;

        }
    })
    .filter('orderObjectBy', function() {
        return function(items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function(item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            if(reverse) filtered.reverse();
            return filtered;
        };
    });

angular.module('app.addArticle', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('addArticle', {
            url : '/addArticle',
            templateUrl : 'app/addArticle/addArticle.html',
            controller : 'AddArticleCtrl'
        });
    }])

    .controller('AddArticleCtrl', ["$scope", "articles", "$log", "$state", function ($scope, articles, $log, $state) {
        $scope.selected = {};
        $scope.selected.platform = {};
        $scope.selected.fsk = '0';
        $scope.isTouched = false;
        $scope.isPriceInvalid = false;
        $scope.isPriceTouched = false;
        $scope.isCustomGenre = false;
        $scope.genreButtonText = 'Neues Genre anlegen';

        function checkPlatforms() {
            var selected = [];
            angular.forEach($scope.selected.platform, function (bool, key) {
                if (bool) {
                    selected.push(key);
                }
            });
            return selected;
        }


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

        $scope.imageToBase64 = function (input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    console.log('image successfully converted to Base64');
                    $scope.image = e.target.result;
                    $scope.$apply();
                };

                reader.readAsDataURL(input.files[0]);
            }
        };

        $scope.isInt = function (n) {
            n = parseInt(n);
            return Number(n) === n && n % 1 === 0;
        };

        $scope.isFloat = function (n) {
            n = parseFloat(n);
            return Number(n) === n && n % 1 !== 0;
        };

        $scope.addArticle = function () {
            $scope.isTouched = true;
            $scope.isPriceTouched = true;
            $scope.isPriceInvalid = false;
            if ($scope.title && (($scope.selected.genre && !$scope.isCustomGenre) || ($scope.customGenre && $scope.isCustomGenre))
                && $scope.price && ($scope.selected.platform.wiiu ||
                $scope.selected.platform.windows || $scope.selected.platform.ps || $scope.selected.platform.xbox ||
                $scope.selected.platform.osx) && $scope.release && $scope.language && $scope.minRam &&
                $scope.minProcessor && $scope.description && $scope.image) {
                if (!validatePrice($scope.price)) {
                    toastr.warning('Ungültiger Preis!');
                    $scope.isPriceInvalid = true;
                } else if (!$scope.isInt($scope.minRam)) {
                    toastr.warning('Der Arbeitsspeicher muss mit einer natürlichen Zahl angegeben werden!');
                } else if (!$scope.isFloat($scope.minProcessor) && !$scope.isInt($scope.minProcessor)) {
                    toastr.warning('Der Prozessor muss mit einer Zahl angegeben werden! Für Nachkommastellen den Punkt verwenden!');
                } else {
                    var date = new Date($scope.release).getTime();
                    var data = {
                        id : 2,
                        name : $scope.title,
                        genre : $scope.isCustomGenre ? $scope.customGenre : $scope.selected.genre,
                        price : $scope.price,
                        fsk : $scope.selected.fsk,
                        platforms : checkPlatforms(),
                        release : date,
                        language : $scope.language,
                        minRam : $scope.minRam,
                        minProcessor : $scope.minProcessor,
                        description : $scope.description,
                        image : $scope.image
                    };
                    console.log(data);
                    articles.addArticle(data)
                        .then(function (response) {
                            toastr.success(response);
                            $state.go("home");
                        }, function (error) {
                            if (!error) {
                                toastr.error("Fehler bei der Verbindung zum Server!");
                            } else {
                                toastr.error(error);
                            }
                        })
                }
            } else {
                toastr.warning('Fehlende Informationen!');
            }
        }
    }]);

angular.module('app.gameDetail', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('gameDetail', {
            url : '/gameDetail/:id',
            templateUrl : 'app/gameDetail/gameDetail.html',
            controller : 'GameDetailCtrl'
        });
    }])

    .controller('GameDetailCtrl', ["$scope", "$http", "$stateParams", "localStorageService", "$uibModal", "$state", "articles", "$rootScope", function ($scope, $http, $stateParams, localStorageService, $uibModal, $state, articles, $rootScope) {
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
        
        loadGame();

        function loadGame() {
            var id = $stateParams.id;
            $scope.articles = localStorageService.get('articles');
            $scope.actualGame = $scope.articles[id];
            if (!$scope.actualGame) {
                toastr.warning('Das Spiel mit der ID ' + id + ' existiert nicht!');
                $state.go('home');
            } else {
                document.getElementById('image').setAttribute('src', "" + $scope.actualGame.image);

                $scope.stars = calculateAverageStars($scope.actualGame.reviews);
                document.getElementById("description").innerHTML = $scope.actualGame.description;
                $scope.calcPrice();
            }
        }

        $rootScope.$on("articles-loaded", function () {
            loadGame();
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
                toastr.success('Artikel erfolgreich ' + $scope.quantity + 'x in den Warenkorb gelegt!');
                toastr.success('<img src="assets/img/giphy.gif" ng-show="inCart"/>');
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
                    if (review.author == user.userName) {
                        title = review.title;
                        message = review.message;
                        newReviewId = review.id;
                    }
                });
                var modalInstance = $uibModal.open({
                    animation : true,
                    templateUrl : 'app/gameDetail/rating/rating.html',
                    controller : 'RatingCtrl',
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

                modalInstance.result.then(function (result) {
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
                            if (error) {
                                toastr.error(error);
                            } else {
                                toastr.error("Fehler bei der Verbindung zum Server!");
                            }
                        });
                }, function () {
                    console.log('Modal dismissed');
                });
            } else {
                toastr.warning('Bitte loggen Sie sich zuerst ein!');
            }
        };
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
        $scope.searchInout = {};
        $scope.isAllGenres = false;
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
            $scope.isAllGenres = true;
            $scope.articles = articles;
        }
    }]);

angular.module('app.login', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'app/login/login.html',
            controller: 'LoginCtrl'
        });
    }])

    .controller('LoginCtrl', ["$scope", "$state", "localStorageService", "$rootScope", "$http", "user", function ($scope, $state, localStorageService, $rootScope, $http, user) {
        $scope.isFormTouched = false;
        var username = localStorageService.get('user') || {};
        var toCheckout = localStorageService.get('fromCheckout');
        if (username.userName) {
            toastr.info('Sie sind bereits eingeloogt als "' + username.userName + '"!');
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
                var data = {
                    userName: $scope.data.userName,
                    password: $scope.data.password
                };
                user.login(data)
                    .then(function (response) {
                            toastr.success('Login war erfolgreich.');
                            var user = {
                                userName: $scope.data.userName,
                                role: response.role,
                                id: parseInt(response.id)
                            };
                            localStorageService.set('user', user);
                            $rootScope.$emit('login');
                            localStorageService.remove('checkout');
                            if (toCheckout) {
                                $state.go('checkout');
                            } else {
                                $state.go('home');
                            }
                    }, function (error) {
                        if (error) {
                            toastr.error(error);
                        } else {
                            toastr.error("Fehler bei der Verbindung zum Server!");
                        }
                    });
            }
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

angular.module('app.orders', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('orders', {
            url: '/orders',
            templateUrl: 'app/orders/orders.html',
            controller: 'OrdersCtrl'
        });
    }])

    .controller('OrdersCtrl', ["$scope", "$http", "localStorageService", "$state", "orders", function ($scope, $http, localStorageService, $state, orders) {
        var user = localStorageService.get("user");
        $scope.articles = localStorageService.get("articles");
        if (typeof user.id != "number") {
            toastr.warning("Dieser Bereich ist geschützt. Bitte loggen Sie sich ein!");
            $state.go("home");
        } else {
            orders.getOrders(user.id)
                .then(function (response) {
                    localStorageService.set("orders", response);
                    $scope.orders = response;
                }, function (error) {
                    if (error) {
                        toastr.error(error);
                    } else {
                        toastr.error("Fehler bei der Verbindung zum Server!");
                    }
                });
        }
    }]);

angular.module('app')
    .factory('articles', ["$q", "$http", "localStorageService", "$rootScope", "$log", function ($q, $http, localStorageService, $rootScope, $log) {
        var service = {};

        service.getAllArticles = function () {
            var q = $q.defer();
            $http.get('http://localhost:8080/rest/article/get/all')
                .then(function (response) {
                    if (typeof response.data == 'string') {
                        q.reject(response.data);
                    } else {
                        console.log(response.data);
                        var mapped = _mapArticles(response.data);
                        localStorageService.set('articles', mapped);
                        $rootScope.$emit("articles-loaded");
                        $log.info("articles loaded");
                        q.resolve(mapped);
                    }
                }, function (error) {
                    $log.error('loading articles failed: ', error);
                    q.reject(error.statusText);
                });
            return q.promise;
        };

        service.getAllGenres = function () {
            var q = $q.defer();
            var genres = localStorageService.get('genres') || [];
            if (!genres) {
                service.getAllArticles()
                    .then(function () {
                        genres = localStorageService.get('genres') || [];
                        q.resolve(genres);
                    }, function (error) {
                        q.reject(error.statusText);
                    })
            } else {
                q.resolve(genres);
            }
            return q.promise;
        };

        service.addArticle = function (input) {
            var q = $q.defer();
            var data = {
                ID : input.id.toString(),
                Name : input.name,
                Genre : input.genre,
                Preis : input.price,
                FSK : input.fsk,
                Plattformen : input.platforms,
                Release : input.release,
                Sprache : input.language,
                minRam : parseInt(input.minRam),
                minProcessor : parseFloat(input.minProcessor),
                Beschreibung : input.description,
                image : input.image,
                Rezensionen : []
            };
            $http.post('http://localhost:8080/rest/article/add', data)
                .then(function (response) {
                    if (response.data == "Artikel existiert bereits") {
                        q.reject(response.data);
                    } else if (response.data == "Artikel konnte nicht hinzugefügt werden") {
                        q.reject(response.data);
                    } else {
                        service.getAllArticles();
                        q.resolve(response.data);
                    }
                }, function (error) {
                    q.reject(error.statusText);
                });
            return q.promise;
        };

        service.addReview = function (input) {
            var q = $q.defer();
            var date = new Date().getTime();
            var data = {
                ID : '0',
                idArticle : input.articleId.toString(),
                stars : input.stars.toString(),
                Autor : input.author,
                Titel : input.title,
                Text : input.message,
                Datum : date.toString()
            };
            $http.post('http://localhost:8080/rest/review/add', data)
                .then(function (response) {
                    if (response.data == 'Rezension konnte nicht hinzugefügt werden') {
                        q.reject(response.data);
                    } else {
                        service.getAllArticles();
                        q.resolve(response.data);
                    }
                }, function (error) {
                    $log.error("error adding review:", error);
                    q.reject(error.statusText);
                });
            return q.promise;
        };

        service.getTopGames = function () {
            var q = $q.defer();
            $http.get("http://localhost:8080/rest/article/get/top")
                .then(function (response) {
                    var top = [];
                    angular.forEach(response.data, function (item) {
                        top.push(parseInt(item.ID));
                        localStorageService.set("top-games", top);
                    });
                    q.resolve(top);
                }, function (error) {
                    if (error.statusText) {

                    }
                });
            return q.promise;
        };


        var _mapArticles = function (articles) {
            var mappedItems = {};
            var genres = [];

            angular.forEach(articles, function (item) {
                // Genres
                var isNewGenre = true;
                angular.forEach(genres, function (genre) {
                    if (item.Genre == genre) {
                        isNewGenre = false;
                    }
                });

                var mappedItem = {
                    id : parseInt(item.ID),
                    name : item.Name,
                    genre : item.Genre,
                    price : parseFloat(item.Preis),
                    fsk : parseInt(item.FSK),
                    platforms : trimPlatforms(item.Plattformen),
                    release : item.Release,
                    language : item.Sprache,
                    minRam : item.minRam,
                    minProcessor : item.minProcessor,
                    image : item.image,
                    description : item.Beschreibung,
                    reviews : _mapReviews(item.Rezensionen)
                };
                if (isNewGenre) {
                    genres.push(mappedItem.genre);
                }
                mappedItems[mappedItem.id] = mappedItem;
            });
            localStorageService.set('genres', genres);
            return mappedItems;
        };

        function trimPlatforms(input) {
            var trimmed = [];
            angular.forEach(input, function (item) {
                trimmed.push(item.trim());
            });
            return trimmed;
        }

        var _mapReviews = function (reviews) {
            var mappedItems = [];
            angular.forEach(reviews, function (item) {
                var mappedItem = {
                    id : parseInt(item.ID),
                    stars : parseInt(item.stars),
                    author : item.Autor,
                    title : item.Titel,
                    message : item.Text,
                    date : parseInt(item.Datum)
                };
                mappedItems.push(mappedItem);
            });
            return mappedItems || [];
        };
        return service;
    }]);

angular.module('app')
    .factory('orders', ["$q", "$http", "localStorageService", function ($q, $http, localStorageService) {
        var service = {};

        service.addOrder = function (input) {
            var q = $q.defer();
            var data = {
                ID: '0',
                idUser: input.userId.toString(),
                Datum: input.date.toString(),
                Preis: input.totalPrice.toString(),
                Bestellungsartikel: mapCartItems(input.items)
            };
            console.log(data);
            $http.post("http://localhost:8080/rest/order/add", data)
                .then(function(response) {
                    if (response.data == "Bestellung konnte nicht hinzugefügt werden") {
                        q.reject(response.data);
                    } else {
                        q.resolve(response.data);
                    }
                }, function (error) {
                    q.reject(error.statusText);
                });
            return q.promise;
        };

        service.getOrders = function (id) {
            var q = $q.defer();
            $http.get("http://localhost:8080/rest/order/get/" + id)
                .then(function (response) {
                    if(response.data == "Bestellungen konnten nicht geladen werden") {
                        q.reject(response.data);
                    } else {
                        var orders = _mapOrders(response.data);
                        q.resolve(orders);
                    }
                }, function (error) {
                    q.reject(error.statusText);
                });

            return q.promise;
        };

        function _mapOrders(input) {
            var mapped = [];
            angular.forEach(input, function (order) {
                var mappedOrder = {};
                mappedOrder = {
                    id: parseInt(order.ID),
                    userId: parseInt(order.idUser),
                    date: parseInt(order.Datum),
                    totalPrice: parseFloat(order.Preis),
                    articles: _mapArticles(order.Bestellungsartikel)
                };
                mapped.push(mappedOrder);
            });
            return mapped;
        }

        function _mapArticles(input) {
            var mapped = [];
            angular.forEach(input, function (item) {
                var mappedItem = {};
                mappedItem = {
                    id: parseInt(item.idArticle),
                    quantity: parseInt(item.Anzahl),
                    price: parseFloat(item.Preis),
                    name: item.Name
                };
                mapped.push(mappedItem);
            });
            return mapped;
        }

        function mapCartItems(input) {
            var articles = localStorageService.get("articles") || {};
            var mapped = [];
            angular.forEach(input, function (item) {
                var mappedItem = {};
                if (articles[item.itemId]) {
                    mappedItem = {
                        idArticle : item.itemId.toString(),
                        Name: articles[item.itemId].name,
                        Anzahl : item.quantity.toString(),
                        idOrder : '0',
                        Preis : articles[item.itemId].price.toString()
                    };
                    mapped.push(mappedItem);
                }
            });
            return mapped;
        }

        return service;
    }]);

angular.module('app')
    .factory('user', ["$q", "$http", "localStorageService", function ($q, $http, localStorageService) {
        var service = {};

        service.addUser = function (input) {
            var q = $q.defer();
            var data = {
                ID : '0',
                Benutzername : input.userName,
                Passwort : input.password,
                Email : input.email,
                Rolle : input.role
            };
            $http.post('http://localhost:8080/rest/user/add', data)
                .then(function (response) {
                    if (response.data == "User konnte nicht angelegt werden" || response.data == "User existiert bereits") {
                        q.reject(response.data);
                    } else {
                        q.resolve(response.data);
                    }
                }, function (error) {
                    q.reject(error.statusText);
                });
            return q.promise;
        };

        service.login = function (input) {
            var q = $q.defer();
            $http.get('http://localhost:8080/rest/user/get/' + input.userName)
                .then(function (response) {
                    console.log(response);
                    if (response.data == "User konnten nicht geladen werden") {
                        q.reject(response.data);
                    } else if (response.data.Benutzername == "null") {
                        q.reject("Benutzer existiert nicht!")
                    } else if (response.data.Passwort === input.password) {
                        q.resolve({role : response.data.Rolle, id : response.data.ID});
                    } else {
                        q.reject("Passwort falsch!");
                    }
                }, function (error) {
                    q.reject(error.statusText);
                });

            return q.promise;
        };

        service.getAllUsers = function () {
            var q = $q.defer();

            $http.get("http://localhost:8080/rest/users/get")
                .then(function (response) {
                    if (typeof response.data == 'string') {
                        q.reject(response.data);
                    } else {
                        var users = _mapUsers(response.data);
                        q.resolve(users);
                    }
                }, function (error) {
                    q.reject(error);
                });

            return q.promise;
        };
        
        service.deleteUser = function (userName) {
            var q = $q.defer();

            $http.get("http://localhost:8080/rest/user/delete/" + userName)
                .then(function (response) {
                    if (response.data == "User existiert nicht" || response.data == "Hat nicht funktioniert") {
                        q.reject(response.data);
                    } else {
                        q.resolve(response.data);
                    }
                }, function (error) {
                    q.reject(error);
                });

            return q.promise;
        };

        function _mapUsers(input) {
            var mapped = [];

            angular.forEach(input, function (user) {
                var mappedItem = {};
                mappedItem = {
                    id : parseInt(user.ID),
                    userName: user.Benutzername,
                    email: user.Email,
                    role: user.Rolle
                };
                mapped.push(mappedItem);
            });
            return mapped;
        }

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

    .controller('TopGamesCtrl', ["$scope", "articles", "localStorageService", function ($scope, articles, localStorageService) {
        $scope.topGames = localStorageService.get("top-games") || [];
        $scope.articles = localStorageService.get("articles");
        articles.getTopGames()
            .then(function () {
                $scope.topGames = localStorageService.get("top-games") || [];
            }, function (error) {
                toastr.error(error);
            });
        articles.getAllArticles();
    }]);

angular.module('app.userAdministration', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('userAdministration', {
            url : '/userAdministration',
            templateUrl : 'app/userAdministration/userAdministration.html',
            controller : 'UserAdministrationCtrl'
        });
    }])

    .controller('UserAdministrationCtrl', ["$scope", "user", function ($scope, user) {
        function loadUsers() {
            user.getAllUsers()
                .then(function (response) {
                    $scope.users = response;
                }, function (error) {
                    if (error) {
                        toastr.error(error);
                    } else {
                        toastr.error("Verbindung zum Server fehlgeschlagen!");
                    }
                });
        }

        loadUsers();

        $scope.deleteUser = function (userName) {
            user.deleteUser(userName)
                .then(function (response) {
                    toastr.success(response);
                    loadUsers();
                }, function (error) {
                    toastr.error(error);
                });
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
        $scope.articles = articles;
        // cart and articles merged
        $scope.cart = {};
        $scope.isInvalid = false;

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

        $scope.isInt = function (n) {
            n = parseInt(n);
            return Number(n) === n && n % 1 === 0;
        };

        $scope.quantityChange = function (id) {
            var newQuantity = parseInt($scope.cart[id].quantity);
            if (newQuantity < 1 || newQuantity > 20 || !$scope.isInt(newQuantity)) {
                $scope.isInvalid = true;
            } else {
                $scope.isInvalid = false;
                cart[id].quantity = newQuantity;
                $scope.updateTotalPrice();
                localStorageService.set('cart', cart);
                $rootScope.$emit('itemAddedToCart');
            }
        };

        $scope.remove = function (id) {
            delete $scope.cart[id];
            delete cart[id];
            $scope.updateTotalPrice();
            localStorageService.set('cart', cart);
            $rootScope.$emit('itemAddedToCart');
        }
    }]);

angular.module('app.gameDetail')
    .controller('RatingCtrl', ["$scope", "$uibModalInstance", "stars", "title", "message", function ($scope, $uibModalInstance, stars, title, message) {
        
        $scope.stars = stars;
        $scope.message = message;
        $scope.title = title;
        title ? $scope.isNewReview = false: $scope.isNewReview = true;

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

    .controller('RegisterCtrl', ["$scope", "user", "$state", function ($scope, user, $state) {
        $scope.data = {};
        $scope.data.userName = '';
        $scope.data.email = '';
        $scope.data.password = '';
        $scope.data.passwordConfirm = '';
        $scope.isTouched = false;
        $scope.pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        $scope.register = function () {
            $scope.isTouched = true;
            if (!$scope.data.userName || !$scope.data.password || !$scope.data.passwordConfirm) {
                toastr.warning('Alle Felder müssen ausgefüllt werden!', 'Fehlende Informationen!');
            } else if (!$scope.data.email || !$scope.pattern.test($scope.data.email)) {
                toastr.warning('Die Email-Adresse ist ungültig!', 'Fehlerhafte Informationen!');
            } else if ($scope.data.password != $scope.data.passwordConfirm) {
                toastr.warning('Die Passwörter stimmen nicht überein.', 'Fehlerhafte Informationen!');
            } else if ($scope.data.userName.length < 4) {
                toastr.warning('Benutzername zu kurz!');
            } else if ($scope.data.password.length < 6) {
                toastr.warning('Passwort zu kurz!');
            } else {
                var data = {
                    userName: $scope.data.userName,
                    password: $scope.data.password,
                    email: $scope.data.email,
                    role: 'user'
                };
                user.addUser(data)
                    .then(function() {
                        toastr.success("Der Benutzer wurde erfolgreich angelegt!");
                        $state.go('login');
                        toastr.info("Bitte loggen Sie sich mit den neuen Daten an.");
                    }, function (error) {
                        if (error) {
                            toastr.error(error);
                        } else {
                            toastr.error("Fehler bei der Verbindung zum Server!");
                        }
                    });
            }
        }
    }]);

angular.module('app.checkout', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('checkout', {
            url : '/checkout',
            templateUrl : 'app/cart/checkout/checkout.html',
            controller : 'CheckoutCtrl'
        });
    }])

    .controller('CheckoutCtrl', ["$scope", "localStorageService", "$state", "orders", function ($scope, localStorageService, $state, orders) {
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

        $scope.addOrder = function () {
            var cart = localStorageService.get("cart");
            var data = {
                userId : user.id,
                date : new Date().getTime(),
                totalPrice : $scope.totalPrice,
                items : cart
            };
            orders.addOrder(data)
                .then(function (response) {
                    toastr.success(response);
                    localStorageService.remove("cart");
                    $state.go("orders");
                }, function (error) {
                    if (!error) {
                        toastr.error("Fehler bei der Verbindung zum Server!");
                    } else {
                        toastr.error(error);
                    }
                });
        };
        $scope.updateTotalPrice();

    }]);

})(window, document);
