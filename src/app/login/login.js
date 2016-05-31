angular.module('app.login', [])

    .config(function ($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'app/login/login.html',
            controller: 'LoginCtrl'
        });
    })

    .controller('LoginCtrl', function ($scope, $state, localStorageService, $rootScope) {
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
                toastr.success('Einloggen war erfolgreich.');
                var role;
                $scope.data.userName == 'daniel' ? role = 'admin' : role = 'user';
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
            }
        }
    });