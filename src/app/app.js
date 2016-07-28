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
    .config(function ($urlRouterProvider, localStorageServiceProvider, cfpLoadingBarProvider) {
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
    })
    .run(function (localStorageService, articles, $rootScope, $log) {
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
    })
    // controller for the navbar
    .controller('AppCtrl', function ($scope, $rootScope, $http, localStorageService, $state, articles) {
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
    });


