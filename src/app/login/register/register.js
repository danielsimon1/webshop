angular.module('app.register', [])

    .config(function ($stateProvider) {
        $stateProvider.state('register', {
            url: '/register',
            templateUrl: 'app/login/register/register.html',
            controller: 'RegisterCtrl'
        });
    })

    .controller('RegisterCtrl', function ($scope, user, $state) {
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
            } else if (!$scope.data.email || !pattern.test($scope.data.email)) {
                toastr.warning('Die Email-Adresse ist ungültig!', 'Fehlerhafte Informationen!');
            } else if ($scope.data.password != $scope.data.passwordConfirm) {
                toastr.warning('Die Passwörter stimmen nicht überein.', 'Fehlerhafte Informationen!');
            } else if ($scope.userName.length < 4) {
                toastr.warning('Benutzername zu kurz!');
            } else if ($scope.password < 6) {
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
                        toastr.error(error);
                    });
            }
        }
    });