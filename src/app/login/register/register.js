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
    });