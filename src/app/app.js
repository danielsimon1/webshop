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
    .config(function ($urlRouterProvider, localStorageServiceProvider) {
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
    .controller('AppCtrl', function ($scope, $rootScope, $http, localStorageService, $state, articles, $log) {
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
    })
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


