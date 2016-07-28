(function(window, document, undefined) {
'use strict';
angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'LocalStorageModule',
    'ngAnimate',
    'templates',
    'textAngular',
    'angular-md5',
    'angular-loading-bar',
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
    'app.register'
])
    .config(["$urlRouterProvider", "localStorageServiceProvider", "cfpLoadingBarProvider", function ($urlRouterProvider, localStorageServiceProvider, cfpLoadingBarProvider) {
        $urlRouterProvider.otherwise('/home');
        localStorageServiceProvider.setPrefix('webshop');
        cfpLoadingBarProvider.includeSpinner = false;
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
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
    // controller for the navbar
    .controller('AppCtrl', ["$scope", "$rootScope", "$http", "localStorageService", "$state", "articles", function ($scope, $rootScope, $http, localStorageService, $state, articles) {
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

        // load genres initially and when articles are loaded
        $scope.genres = localStorageService.get("genres");
        $rootScope.$on("articles-loaded", function () {
            $scope.genres = localStorageService.get("genres");
        });

        $rootScope.logout = function () {
            localStorageService.remove('user');
            localStorageService.remove('orders');
            localStorageService.remove('checkout');
            // update user data
            $rootScope.$emit('login');
            $rootScope.$emit('itemAddedToCart');
            toastr.success('Logout war erfolgreich.');
            $state.go('login');
        };

        // get user data, display user name in navbar, show more options in navbar if the user is an admin
        var getUserData = function () {
            var user = localStorageService.get('user') || {};
            $scope.userName = user.userName || 'Benutzer';
            $scope.userRole = user.role;
        };
        getUserData();

        // count the total items in the cart
        var countCartItems = function () {
            var cart = localStorageService.get('cart');
            $scope.quantity = 0;
            var articles = localStorageService.get('articles') || {};
            angular.forEach(cart, function (item) {
                if (articles[item.itemId]) {
                    $scope.quantity += item.quantity;
                } else {
                    // remove items from cart which have no valid article ID
                    delete cart[item.itemId];
                }
            });
            localStorageService.set('cart', cart);
        };
        countCartItems();
    }])
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
    });

angular.module('app.cart', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('cart', {
            url: '/cart',
            templateUrl: 'app/cart/cart.html',
            controller: 'CartCtrl'
        });
    }])

    .controller('CartCtrl', ["localStorageService", "$scope", "$rootScope", function (localStorageService, $scope, $rootScope) {
        $scope.cart = localStorageService.get('cart');
        $scope.articles = localStorageService.get('articles');
        $scope.isInvalid = false;

        $scope.updateTotalPrice = function () {
            $scope.totalPrice = 0;
            angular.forEach($scope.cart, function (item) {
                $scope.totalPrice += item.quantity * $scope.articles[item.itemId].price;
            });
        };
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
                $scope.cart[id].quantity = newQuantity;
                $scope.updateTotalPrice();
                localStorageService.set('cart', $scope.cart);
                $rootScope.$emit('itemAddedToCart');
            }
        };

        $scope.remove = function (id) {
            delete $scope.cart[id];
            $scope.updateTotalPrice();
            localStorageService.set('cart', $scope.cart);
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
        $scope.searchInput = "";
        $scope.isAllGenres = false;

        // get genre from URL parameters
        $scope.genre = $stateParams.name;

        // all articles
        var articles = localStorageService.get('articles');

        // only articles with matching genre
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
                    // if user wrote a review before, pre-filling the input fields
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
            url : '/addArticle',
            templateUrl : 'app/addArticle/addArticle.html',
            controller : 'AddArticleCtrl'
        });
    }])

    .controller('AddArticleCtrl', ["$scope", "articles", "$log", "$state", "localStorageService", "user", "$rootScope", function ($scope, articles, $log, $state, localStorageService, user, $rootScope) {
        var currentUser = localStorageService.get("user") || {};
        if (angular.equals({}, currentUser)) {
            toastr.info("Sie müssen sich einloggen, um diese Seite zu sehen");
            $state.go("login");
        } else {
            user.authenticate(currentUser.userName, currentUser.password)
                .then(function (response) {
                    localStorageService.set("user", response);
                    currentUser = response;
                    if (currentUser.role != "admin") {
                        toastr.info("Diese Seite ist geschützt!");
                        $state.go("home");
                    }
                }, function () {
                    toastr.error("Fehler bei der Authentifizierung");
                    toastr.warning("Sie werden nun automatisch ausgeloggt");
                    $rootScope.logout();
                });
        }
        $scope.selected = {};
        $scope.selected.platform = {};
        $scope.selected.fsk = '0';
        $scope.isTouched = false;
        $scope.isPriceInvalid = false;
        $scope.isPriceTouched = false;
        $scope.isCustomGenre = false;
        $scope.genreButtonText = 'Neues Genre anlegen';
        $scope.isLoading = false;

        // function that returns all selected checkboxes
        function checkPlatforms() {
            var selected = [];
            angular.forEach($scope.selected.platform, function (bool, key) {
                if (bool) {
                    selected.push(key);
                }
            });
            return selected;
        }

        $scope.genres = localStorageService.get("genres") || [];
        articles.getAllArticles()
            .then(function () {
                $scope.genres = localStorageService.get("genres") || [];
            }, function (error) {
                toastr.error(error);
            });

        function validatePrice(input) {
            return /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/.test(input);
        }

        // toggle between selecting existing genres and typing in a new genre
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
            $scope.titleRegex = /^.{4,60}$/;
            $scope.genreRegex = /^.{4,20}$/;
            $scope.languageRegex = /^.{4,15}$/;
            $scope.descriptionRegex = /^.{1,8000}$/;

            if ($scope.title && (($scope.selected.genre && !$scope.isCustomGenre) || ($scope.customGenre && $scope.isCustomGenre && genreRegex.test($scope.customGenre)))
                && $scope.price && $scope.descriptionRegex.test($scope.description) && ($scope.selected.platform.wiiu ||
                $scope.selected.platform.windows || $scope.selected.platform.ps || $scope.selected.platform.xbox ||
                $scope.selected.platform.osx) && $scope.release && $scope.language && $scope.minRam && $scope.languageRegex.test($scope.language) &&
                $scope.minProcessor && $scope.description && $scope.image && $scope.titleRegex.test($scope.title)) {
                if (!validatePrice($scope.price)) {
                    toastr.warning('Ungültiger Preis!');
                    $scope.isPriceInvalid = true;
                } else if (!$scope.isInt($scope.minRam)) {
                    toastr.warning('Der Arbeitsspeicher muss mit einer natürlichen Zahl angegeben werden!');
                } else if (!$scope.isFloat($scope.minProcessor) && !$scope.isInt($scope.minProcessor)) {
                    toastr.warning('Der Prozessor muss mit einer Zahl angegeben werden! Für Nachkommastellen den Punkt verwenden!');
                } else {
                    $scope.isLoading = true;
                    var date = new Date($scope.release).getTime();
                    var data = {
                        id : 2,
                        name : $scope.title,
                        genre : $scope.isCustomGenre ? $scope.customGenre : $scope.selected.genre,
                        price : $scope.price,
                        fsk : $scope.selected.fsk,
                        platforms : checkPlatforms(),
                        release : date.toString(),
                        language : $scope.language,
                        minRam : $scope.minRam,
                        minProcessor : $scope.minProcessor,
                        description : $scope.description,
                        image : $scope.image
                    };
                    articles.addArticle(data)
                        .then(function (response) {
                            $scope.isLoading = false;
                            toastr.success(response);
                            $state.go("home");
                        }, function (error) {
                            $scope.isLoading = false;
                            if (!error) {
                                toastr.error("Ein unbekannter Fehler ist aufgetreten!");
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

angular.module('app.login', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('login', {
            url : '/login',
            templateUrl : 'app/login/login.html',
            controller : 'LoginCtrl'
        });
    }])

    .controller('LoginCtrl', ["$scope", "$state", "localStorageService", "$rootScope", "$http", "user", function ($scope, $state, localStorageService, $rootScope, $http, user) {
        $scope.isFormTouched = false;
        $scope.isLoading = false;

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
        $("#form").keydown(function (event) {
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
                $scope.isLoading = true;
                var data = {
                    userName : $scope.data.userName,
                    password : $scope.data.password
                };
                user.login(data)
                    .then(function (response) {
                        $scope.isLoading = false;
                        toastr.success('Login war erfolgreich.');
                        var user = {
                            userName : $scope.data.userName,
                            role : response.role,
                            id : parseInt(response.id),
                            // md5 encrypted
                            password : response.password
                        };
                        localStorageService.set('user', user);
                        $rootScope.$emit('login');
                        localStorageService.remove('fromCheckout');
                        if (toCheckout) {
                            $state.go('checkout');
                        } else {
                            $state.go('home');
                        }
                    }, function (error) {
                        $scope.isLoading = false;
                        if (error) {
                            toastr.error(error);
                        } else {
                            toastr.error("Fehler bei der Verbindung zum Server!");
                        }
                    });
            }
        }
    }]);

angular.module('app.newGames', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('newGames', {
            url: '/newGames',
            templateUrl: 'app/newGames/newGames.html',
            controller: 'NewGamesCtrl'
        });
    }])

    .controller('NewGamesCtrl', ["$scope", "articles", "localStorageService", function ($scope, articles, localStorageService) {
        $scope.newGameIds = localStorageService.get("new-games") || [];
        $scope.articles = localStorageService.get("articles") || {};
        articles.getAllArticles()
            .then(function () {
                $scope.newGameIds = localStorageService.get("new-games");
                $scope.articles = localStorageService.get("articles");
            }, function (error) {
                toastr.error(error);
            });
    }]);

angular.module('app.orders', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('orders', {
            url: '/orders',
            templateUrl: 'app/orders/orders.html',
            controller: 'OrdersCtrl'
        });
    }])

    .controller('OrdersCtrl', ["$scope", "$http", "localStorageService", "$state", "orders", "user", "$rootScope", function ($scope, $http, localStorageService, $state, orders, user, $rootScope) {
        var currentUser = localStorageService.get("user") || {};
        $scope.articles = localStorageService.get("articles") || {};
        if (angular.equals({}, currentUser)) {
            toastr.info("Sie müssen sich einloggen, um diese Seite zu sehen");
            $state.go("login");
        } else {
            user.authenticate(currentUser.userName, currentUser.password)
                .then(function (response) {
                    localStorageService.set("user", response);
                    currentUser = response;
                    orders.getOrders(currentUser.id)
                        .then(function (response) {
                            $scope.orders = response;
                        }, function (error) {
                            if (error) {
                                toastr.error(error);
                            } else {
                                toastr.error("Ein unbekannter Fehler ist aufgetreten!");
                            }
                        });
                }, function () {
                    toastr.error("Fehler bei der Authentifizierung");
                    toastr.warning("Sie werden nun automatisch ausgeloggt");
                    $rootScope.logout();
                });
        }
    }]);

angular.module('app')
    .factory('articles', ["$q", "$http", "localStorageService", "$rootScope", "$log", "$filter", function ($q, $http, localStorageService, $rootScope, $log, $filter) {
        var service = {};

        service.getAllArticles = function () {
            var q = $q.defer();
            $http.get('http://localhost:8080/rest/article/get/all')
                .then(function (response) {
                    if (typeof response.data == 'string') {
                        $log.error('loading articles failed: ', response.data);
                        q.reject(response.data);
                    } else {
                        var mapped = _mapArticles(response.data);
                        localStorageService.set('articles', mapped);
                        $rootScope.$emit("articles-loaded");
                        $log.info("articles loaded");
                        service.getNewGames(mapped);
                        q.resolve(mapped);
                    }
                }, function (error) {
                    $log.error('loading articles failed: ', error);
                    q.reject(error.statusText);
                });
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
                        $log.error("error adding article: ", response.data);
                        q.reject(response.data);
                    } else if (response.data == "Artikel konnte nicht hinzugefügt werden") {
                        $log.error("error adding article: ", response.data);
                        q.reject(response.data);
                    } else {
                        $log.info("adding article was successful");
                        service.getAllArticles();
                        q.resolve(response.data);
                    }
                }, function (error) {
                    $log.error("error adding article: ", error);
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
                        $log.error("error adding review: ", response.data);
                        q.reject(response.data);
                    } else {
                        $log.info("adding review was successful");
                        service.getAllArticles();
                        q.resolve(response.data);
                    }
                }, function (error) {
                    $log.error("error adding review: ", error);
                    q.reject(error.statusText);
                });
            return q.promise;
        };

        service.getTopGames = function () {
            var q = $q.defer();
            $http.get("http://localhost:8080/rest/article/get/top")
                .then(function (response) {
                    if (typeof response.data == 'string') {
                        $log.error("error getting top games: ", response.data);
                        q.reject(response.data);
                    } else {
                        var top = [];
                        angular.forEach(response.data, function (item) {
                            top.push(parseInt(item.ID));
                            localStorageService.set("top-games", top);
                        });
                        $log.info("top games loaded");
                        q.resolve(top);
                    }
                }, function (error) {
                    $log.error("error getting top games: ", error);
                    q.reject(error.statusText);
                });
            return q.promise;
        };

        service.getNewGames = function (articles) {
            var articlesArray = [];
            angular.forEach(articles, function (item) {
                item.release = parseInt(item.release);
                articlesArray.push(item);
            });
            // sort articles by release date
            var sorted = $filter('orderBy')(articlesArray, 'release', true);

            // only take the top 5 elements
            var sliced = sorted.slice(0, 5);
            var newGamesIds = [];

            // only save the id's to prevent redundant data
            angular.forEach(sliced, function (item) {
                newGamesIds.push(item.id);
            });
            localStorageService.set("new-games", newGamesIds);
        };


        var _mapArticles = function (articles) {
            var mappedItems = {};
            var genres = [];

            angular.forEach(articles, function (item) {
                // check if current genre is a new genre
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

        // remove spaces
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

/*
 angular-md5 - v0.1.8
 2015-11-17
 */

/* commonjs package manager support (eg componentjs) */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = "angular-md5";
}
(function (angular) {
    angular.module("angular-md5", ["gdi2290.md5"]);
    angular.module("ngMd5", ["gdi2290.md5"]);
    angular.module("gdi2290.md5", ["gdi2290.gravatar-filter", "gdi2290.md5-service", "gdi2290.md5-filter"]);
angular.module("gdi2290.gravatar-filter", []).filter("gravatar", ["md5", function (md5) {
        var cache = {};
        return function (text, defaultText) {
            if (!cache[text]) {
                defaultText = defaultText ? md5.createHash(defaultText.toString().toLowerCase()) : "";
                cache[text] = text ? md5.createHash(text.toString().toLowerCase()) : defaultText;
            }
            return cache[text];
        };
    }]);
angular.module("gdi2290.md5-filter", []).filter("md5", ["md5", function (md5) {
        return function (text) {
            return text ? md5.createHash(text.toString().toLowerCase()) : text;
        };
    }]);
angular.module("gdi2290.md5-service", []).factory("md5", [function () {
        var md5 = {
            createHash : function (str) {
                if (null === str) {
                    return null;
                }
                var xl;
                var rotateLeft = function (lValue, iShiftBits) {
                    return lValue << iShiftBits | lValue >>> 32 - iShiftBits;
                };
                var addUnsigned = function (lX, lY) {
                    var lX4, lY4, lX8, lY8, lResult;
                    lX8 = lX & 2147483648;
                    lY8 = lY & 2147483648;
                    lX4 = lX & 1073741824;
                    lY4 = lY & 1073741824;
                    lResult = (lX & 1073741823) + (lY & 1073741823);
                    if (lX4 & lY4) {
                        return lResult ^ 2147483648 ^ lX8 ^ lY8;
                    }
                    if (lX4 | lY4) {
                        if (lResult & 1073741824) {
                            return lResult ^ 3221225472 ^ lX8 ^ lY8;
                        } else {
                            return lResult ^ 1073741824 ^ lX8 ^ lY8;
                        }
                    } else {
                        return lResult ^ lX8 ^ lY8;
                    }
                };
                var _F = function (x, y, z) {
                    return x & y | ~x & z;
                };
                var _G = function (x, y, z) {
                    return x & z | y & ~z;
                };
                var _H = function (x, y, z) {
                    return x ^ y ^ z;
                };
                var _I = function (x, y, z) {
                    return y ^ (x | ~z);
                };
                var _FF = function (a, b, c, d, x, s, ac) {
                    a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
                    return addUnsigned(rotateLeft(a, s), b);
                };
                var _GG = function (a, b, c, d, x, s, ac) {
                    a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
                    return addUnsigned(rotateLeft(a, s), b);
                };
                var _HH = function (a, b, c, d, x, s, ac) {
                    a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
                    return addUnsigned(rotateLeft(a, s), b);
                };
                var _II = function (a, b, c, d, x, s, ac) {
                    a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
                    return addUnsigned(rotateLeft(a, s), b);
                };
                var convertToWordArray = function (str) {
                    var lWordCount;
                    var lMessageLength = str.length;
                    var lNumberOfWords_temp1 = lMessageLength + 8;
                    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - lNumberOfWords_temp1 % 64) / 64;
                    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                    var lWordArray = new Array(lNumberOfWords - 1);
                    var lBytePosition = 0;
                    var lByteCount = 0;
                    while (lByteCount < lMessageLength) {
                        lWordCount = (lByteCount - lByteCount % 4) / 4;
                        lBytePosition = lByteCount % 4 * 8;
                        lWordArray[lWordCount] = lWordArray[lWordCount] | str.charCodeAt(lByteCount) << lBytePosition;
                        lByteCount++;
                    }
                    lWordCount = (lByteCount - lByteCount % 4) / 4;
                    lBytePosition = lByteCount % 4 * 8;
                    lWordArray[lWordCount] = lWordArray[lWordCount] | 128 << lBytePosition;
                    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                    return lWordArray;
                };
                var wordToHex = function (lValue) {
                    var wordToHexValue = "", wordToHexValue_temp = "", lByte, lCount;
                    for (lCount = 0; lCount <= 3; lCount++) {
                        lByte = lValue >>> lCount * 8 & 255;
                        wordToHexValue_temp = "0" + lByte.toString(16);
                        wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
                    }
                    return wordToHexValue;
                };
                var x = [], k, AA, BB, CC, DD, a, b, c, d, S11 = 7, S12 = 12, S13 = 17, S14 = 22, S21 = 5, S22 = 9, S23 = 14, S24 = 20, S31 = 4, S32 = 11, S33 = 16, S34 = 23, S41 = 6, S42 = 10, S43 = 15, S44 = 21;
                x = convertToWordArray(str);
                a = 1732584193;
                b = 4023233417;
                c = 2562383102;
                d = 271733878;
                xl = x.length;
                for (k = 0; k < xl; k += 16) {
                    AA = a;
                    BB = b;
                    CC = c;
                    DD = d;
                    a = _FF(a, b, c, d, x[k + 0], S11, 3614090360);
                    d = _FF(d, a, b, c, x[k + 1], S12, 3905402710);
                    c = _FF(c, d, a, b, x[k + 2], S13, 606105819);
                    b = _FF(b, c, d, a, x[k + 3], S14, 3250441966);
                    a = _FF(a, b, c, d, x[k + 4], S11, 4118548399);
                    d = _FF(d, a, b, c, x[k + 5], S12, 1200080426);
                    c = _FF(c, d, a, b, x[k + 6], S13, 2821735955);
                    b = _FF(b, c, d, a, x[k + 7], S14, 4249261313);
                    a = _FF(a, b, c, d, x[k + 8], S11, 1770035416);
                    d = _FF(d, a, b, c, x[k + 9], S12, 2336552879);
                    c = _FF(c, d, a, b, x[k + 10], S13, 4294925233);
                    b = _FF(b, c, d, a, x[k + 11], S14, 2304563134);
                    a = _FF(a, b, c, d, x[k + 12], S11, 1804603682);
                    d = _FF(d, a, b, c, x[k + 13], S12, 4254626195);
                    c = _FF(c, d, a, b, x[k + 14], S13, 2792965006);
                    b = _FF(b, c, d, a, x[k + 15], S14, 1236535329);
                    a = _GG(a, b, c, d, x[k + 1], S21, 4129170786);
                    d = _GG(d, a, b, c, x[k + 6], S22, 3225465664);
                    c = _GG(c, d, a, b, x[k + 11], S23, 643717713);
                    b = _GG(b, c, d, a, x[k + 0], S24, 3921069994);
                    a = _GG(a, b, c, d, x[k + 5], S21, 3593408605);
                    d = _GG(d, a, b, c, x[k + 10], S22, 38016083);
                    c = _GG(c, d, a, b, x[k + 15], S23, 3634488961);
                    b = _GG(b, c, d, a, x[k + 4], S24, 3889429448);
                    a = _GG(a, b, c, d, x[k + 9], S21, 568446438);
                    d = _GG(d, a, b, c, x[k + 14], S22, 3275163606);
                    c = _GG(c, d, a, b, x[k + 3], S23, 4107603335);
                    b = _GG(b, c, d, a, x[k + 8], S24, 1163531501);
                    a = _GG(a, b, c, d, x[k + 13], S21, 2850285829);
                    d = _GG(d, a, b, c, x[k + 2], S22, 4243563512);
                    c = _GG(c, d, a, b, x[k + 7], S23, 1735328473);
                    b = _GG(b, c, d, a, x[k + 12], S24, 2368359562);
                    a = _HH(a, b, c, d, x[k + 5], S31, 4294588738);
                    d = _HH(d, a, b, c, x[k + 8], S32, 2272392833);
                    c = _HH(c, d, a, b, x[k + 11], S33, 1839030562);
                    b = _HH(b, c, d, a, x[k + 14], S34, 4259657740);
                    a = _HH(a, b, c, d, x[k + 1], S31, 2763975236);
                    d = _HH(d, a, b, c, x[k + 4], S32, 1272893353);
                    c = _HH(c, d, a, b, x[k + 7], S33, 4139469664);
                    b = _HH(b, c, d, a, x[k + 10], S34, 3200236656);
                    a = _HH(a, b, c, d, x[k + 13], S31, 681279174);
                    d = _HH(d, a, b, c, x[k + 0], S32, 3936430074);
                    c = _HH(c, d, a, b, x[k + 3], S33, 3572445317);
                    b = _HH(b, c, d, a, x[k + 6], S34, 76029189);
                    a = _HH(a, b, c, d, x[k + 9], S31, 3654602809);
                    d = _HH(d, a, b, c, x[k + 12], S32, 3873151461);
                    c = _HH(c, d, a, b, x[k + 15], S33, 530742520);
                    b = _HH(b, c, d, a, x[k + 2], S34, 3299628645);
                    a = _II(a, b, c, d, x[k + 0], S41, 4096336452);
                    d = _II(d, a, b, c, x[k + 7], S42, 1126891415);
                    c = _II(c, d, a, b, x[k + 14], S43, 2878612391);
                    b = _II(b, c, d, a, x[k + 5], S44, 4237533241);
                    a = _II(a, b, c, d, x[k + 12], S41, 1700485571);
                    d = _II(d, a, b, c, x[k + 3], S42, 2399980690);
                    c = _II(c, d, a, b, x[k + 10], S43, 4293915773);
                    b = _II(b, c, d, a, x[k + 1], S44, 2240044497);
                    a = _II(a, b, c, d, x[k + 8], S41, 1873313359);
                    d = _II(d, a, b, c, x[k + 15], S42, 4264355552);
                    c = _II(c, d, a, b, x[k + 6], S43, 2734768916);
                    b = _II(b, c, d, a, x[k + 13], S44, 1309151649);
                    a = _II(a, b, c, d, x[k + 4], S41, 4149444226);
                    d = _II(d, a, b, c, x[k + 11], S42, 3174756917);
                    c = _II(c, d, a, b, x[k + 2], S43, 718787259);
                    b = _II(b, c, d, a, x[k + 9], S44, 3951481745);
                    a = addUnsigned(a, AA);
                    b = addUnsigned(b, BB);
                    c = addUnsigned(c, CC);
                    d = addUnsigned(d, DD);
                }
                var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
                return temp.toLowerCase();
            }
        };
        return md5;
    }]);
})(angular);

angular.module('app')
    .factory('orders', ["$q", "$http", "localStorageService", "$log", function ($q, $http, localStorageService, $log) {
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
            $http.post("http://localhost:8080/rest/order/add", data)
                .then(function(response) {
                    if (response.data == "Bestellung konnte nicht hinzugefügt werden") {
                        $log.error("error adding order");
                        q.reject(response.data);
                    } else {
                        $log.info("order added");
                        q.resolve(response.data);
                    }
                }, function (error) {
                    $log.error("error adding order: ", error);
                    q.reject(error.statusText);
                });
            return q.promise;
        };

        service.getOrders = function (id) {
            var q = $q.defer();
            $http.get("http://localhost:8080/rest/order/get/" + id)
                .then(function (response) {
                    if(response.data == "Bestellungen konnten nicht geladen werden") {
                        $log.error("error loading orders");
                        q.reject(response.data);
                    } else {
                        var orders = _mapOrders(response.data);
                        $log.info("orders loaded");
                        q.resolve(orders);
                    }
                }, function (error) {
                    $log.error("error loading orders: ", error);
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
    .factory('user', ["$q", "$http", "md5", "$log", function ($q, $http, md5, $log) {
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
                        $log.error("error adding user: ", response.data);
                        q.reject(response.data);
                    } else {
                        $log.info("user added");
                        q.resolve(response.data);
                    }
                }, function (error) {
                    $log.error("error adding user: ", error);
                    q.reject(error.statusText);
                });
            return q.promise;
        };

        service.login = function (input) {
            var q = $q.defer();
            $http.get('http://localhost:8080/rest/user/get/' + input.userName)
                .then(function (response) {
                    if (response.data == "User konnten nicht geladen werden") {
                        $log.error("login failed - backend or database problem");
                        q.reject(response.data);
                    } else if (response.data.Benutzername == "null") {
                        $log.warn("login failed - username not correct");
                        q.reject("Benutzer existiert nicht!")
                    } else if (response.data.Passwort === input.password) {
                        $log.info("user logged in");
                        // encrypt password with md5 to save it to localstorage later
                        q.resolve({role : response.data.Rolle, id : response.data.ID, password : md5.createHash(response.data.Passwort)});
                    } else {
                        $log.warn("login failed - password is wrong");
                        q.reject("Passwort falsch!");
                    }
                }, function (error) {
                    $log.error("login failed: ", error);
                    q.reject(error.statusText);
                });

            return q.promise;
        };

        service.getAllUsers = function () {
            var q = $q.defer();

            $http.get("http://localhost:8080/rest/users/get")
                .then(function (response) {
                    if (typeof response.data == 'string') {
                        $log.error("error getting all users: ", response.data);
                        q.reject(response.data);
                    } else {
                        $log.info("users loaded");
                        var users = _mapUsers(response.data);
                        q.resolve(users);
                    }
                }, function (error) {
                    $log.error("error getting all users: ", error);
                    q.reject(error);
                });

            return q.promise;
        };


        // send username and get id and role
        // localstorage values can be edited by user
        // prevents that users can access admin sites by changing the role in the localstorage

        service.authenticate = function (userName, md5Password) {
            var q = $q.defer();
            $http.get('http://localhost:8080/rest/user/get/' + userName)
                .then(function (response) {
                    if (response.data == "User konnten nicht geladen werden") {
                        $log.error("authentication failed - backend or database problem");
                        q.reject(response.data);
                    } else if (response.data.Benutzername == "null") {
                        $log.warn("authentication failed - user does not exist");
                        q.reject("Benutzer existiert nicht!");
                    // check if encrypted password from localstorage matches with the password from backend
                    } else if (md5.createHash(response.data.Passwort) === md5Password){
                        $log.info("authentication was successful");
                        q.resolve({role : response.data.Rolle, id : parseInt(response.data.ID), userName : userName, password: md5Password});
                    } else {
                        $log.warn("authentication failed - password wrong");
                        q.reject("Authentifizierung fehlgeschlagen");
                    }
                }, function (error) {
                    $log.warn("authentication failed: ", error);
                    q.reject(error.statusText);
                });

            return q.promise;
        };

        service.deleteUser = function (userName) {
            var q = $q.defer();

            $http.get("http://localhost:8080/rest/user/delete/" + userName)
                .then(function (response) {
                    if (response.data == "User existiert nicht" || response.data == "Hat nicht funktioniert") {
                        $log.error("error deleting user: ", response.data);
                        q.reject(response.data);
                    } else {
                        $log.info("user deleted");
                        q.resolve(response.data);
                    }
                }, function (error) {
                    $log.error("error deleting user: ", error);
                    if (error.statusText){
                        q.reject(error.statusText);
                    } else {
                        q.reject();
                    }
                });

            return q.promise;
        };

        function _mapUsers(input) {
            var mapped = [];

            angular.forEach(input, function (user) {
                var mappedItem = {};
                mappedItem = {
                    id : parseInt(user.ID),
                    userName : user.Benutzername,
                    email : user.Email,
                    role : user.Rolle
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
    }]);

angular.module('app.userAdministration', [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('userAdministration', {
            url : '/userAdministration',
            templateUrl : 'app/userAdministration/userAdministration.html',
            controller : 'UserAdministrationCtrl'
        });
    }])

    .controller('UserAdministrationCtrl', ["$scope", "user", "localStorageService", "$state", "$rootScope", function ($scope, user, localStorageService, $state, $rootScope) {
        var currentUser = localStorageService.get("user") || {};
        if (angular.equals({}, currentUser)) {
            toastr.info("Sie müssen sich einloggen, um diese Seite zu sehen");
            $state.go("login");
        } else {
            user.authenticate(currentUser.userName, currentUser.password)
                .then(function (response) {
                    localStorageService.set("user", response);
                    currentUser = response;
                    if (currentUser.role != "admin") {
                        toastr.info("Diese Seite ist geschützt!");
                        $state.go("home");
                    } else {
                        loadUsers();
                    }
                }, function () {
                    toastr.error("Fehler bei der Authentifizierung");
                    toastr.warning("Sie werden nun automatisch ausgeloggt");
                    $rootScope.logout();
                });
        }

        function loadUsers() {
            user.getAllUsers()
                .then(function (response) {
                    $scope.users = response;
                }, function (error) {
                    if (error) {
                        toastr.error(error);
                    } else {
                        toastr.error("Ein unbekannter Fehler ist aufgetreten!");
                    }
                });
        }

        $scope.deleteUser = function (userName) {
            var confirm = window.confirm("Wollen Sie den Benutzer " + userName + " wirklich löschen?");
            if (confirm) {
                user.deleteUser(userName)
                    .then(function (response) {
                        toastr.success(response);
                        loadUsers();
                    }, function (error) {
                        toastr.error(error);
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
        $scope.isLoading = false;

        var user = localStorageService.get('user') || {};
        if (!user.userName) {
            // if user wants to order something but isn't logged in, he will be directed to the checkout after login
            localStorageService.set('fromCheckout', true);
            toastr.info('Bitte melden Sie sich an.');
            $state.go('login');
        }
        $scope.cart = localStorageService.get('cart') || {};

        // if nothing in cart, no checkout
        if (angular.equals({}, $scope.cart)) {
            $state.go("home");
        }

        $scope.articles = localStorageService.get('articles') || {};

        $scope.updateTotalPrice = function () {
            $scope.totalPrice = 0;
            angular.forEach($scope.cart, function (item) {
                $scope.totalPrice += item.quantity * $scope.articles[item.itemId].price;
            });
        };

        $scope.addOrder = function () {
            $scope.isLoading = true;
            var cart = localStorageService.get("cart");
            var data = {
                userId : user.id,
                date : new Date().getTime(),
                totalPrice : $scope.totalPrice,
                items : cart
            };
            orders.addOrder(data)
                .then(function (response) {
                    $scope.isLoading = false;
                    toastr.success(response);
                    localStorageService.remove("cart");
                    $state.go("orders");
                }, function (error) {
                    $scope.isLoading = false;
                    if (!error) {
                        toastr.error("Ein unbekannter Fehler ist aufgetreten!");
                    } else {
                        toastr.error(error);
                    }
                });
        };
        $scope.updateTotalPrice();

    }]);

angular.module('app.gameDetail')
    .controller('RatingCtrl', ["$scope", "$uibModalInstance", "stars", "title", "message", function ($scope, $uibModalInstance, stars, title, message) {
        
        $scope.stars = stars;
        $scope.message = message;
        $scope.title = title;
        title ? $scope.isNewReview = false: $scope.isNewReview = true;

        $scope.isTitleTouched = false;
        $scope.isMessageTouched = false;
        $scope.titleRegex = /^.{4,100}$/;
        $scope.messageRegex = /^.{4,1000}$/;

        // check if inputs are empty
        $scope.checkValid = function () {
            $scope.message && $scope.title && $scope.titleRegex.test($scope.title) && $scope.messageRegex.test($scope.message) ? $scope.isValid = true : $scope.isValid = false;
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
        $scope.isLoading = false;

        // regex
        $scope.pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        $scope.userRegex = /^[a-zA-Z0-9äöüÄÖÜ._-]{4,20}$/;
        $scope.passwordRegex = /^[a-zA-Z0-9äöüÄÖÜ._-]{6,20}$/;

        //Trigger Login when enter pressed
        $("#form").keydown(function (event) {
            if (event.keyCode == 13) {
                $("#submit").click();
            }
        });

        $scope.register = function () {
            $scope.isTouched = true;
            if (!$scope.data.userName || !$scope.data.password || !$scope.data.passwordConfirm) {
                toastr.warning('Alle Felder müssen ausgefüllt werden!', 'Fehlende Informationen!');
            } else if (!$scope.userRegex.test($scope.data.userName)) {
                toastr.warning("Der Benutzername darf nur bestimmte Sonderzeichen enthalten und muss zwischen 4 und 20 Zeichen lang sein!")
            } else if (!$scope.data.email || !$scope.pattern.test($scope.data.email) || $scope.data.email > 60) {
                toastr.warning('Die Email-Adresse ist ungültig!', 'Fehlerhafte Informationen!');
            } else if ($scope.data.password != $scope.data.passwordConfirm) {
                toastr.warning('Die Passwörter stimmen nicht überein.', 'Fehlerhafte Informationen!');
            } else if (!$scope.passwordRegex.test($scope.data.password)) {
                toastr.warning('Passwort zu kurz!');
            } else {
                $scope.isLoading = true;
                var data = {
                    userName: $scope.data.userName,
                    password: $scope.data.password,
                    email: $scope.data.email,
                    role: 'user'
                };
                user.addUser(data)
                    .then(function() {
                        $scope.isLoading = false;
                        toastr.success("Der Benutzer wurde erfolgreich angelegt!");
                        $state.go('login');
                        toastr.info("Bitte loggen Sie sich mit den neuen Daten an.");
                    }, function (error) {
                        $scope.isLoading = false;
                        if (error) {
                            toastr.error(error);
                        } else {
                            toastr.error("Fehler bei der Verbindung zum Server!");
                        }
                    });
            }
        }
    }]);

})(window, document);
