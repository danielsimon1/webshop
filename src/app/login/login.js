angular.module('app.login', [])

    .config(function ($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'app/login/login.html',
            controller: 'LoginCtrl'
        });
    })

    .controller('LoginCtrl', function ($scope, $state, localStorageService, $rootScope, $http, user) {
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
                                id: parseInt(response.id),
                                // md5 encrypted
                                password: response.password
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
                        if (error) {
                            toastr.error(error);
                        } else {
                            toastr.error("Fehler bei der Verbindung zum Server!");
                        }
                    });
            }
        }
    });