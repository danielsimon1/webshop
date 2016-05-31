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
    .config(function ($urlRouterProvider, localStorageServiceProvider) {
        $urlRouterProvider.otherwise('/home');
        localStorageServiceProvider.setPrefix('webshop');
    })
    .run(function (localStorageService, articles, $rootScope, $log) {
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
    });
