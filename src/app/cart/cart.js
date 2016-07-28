angular.module('app.cart', [])

    .config(function ($stateProvider) {
        $stateProvider.state('cart', {
            url: '/cart',
            templateUrl: 'app/cart/cart.html',
            controller: 'CartCtrl'
        });
    })

    .controller('CartCtrl', function (localStorageService, $scope, $rootScope) {
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
    });