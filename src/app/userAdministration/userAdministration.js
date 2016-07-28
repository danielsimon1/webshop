angular.module('app.userAdministration', [])

    .config(function ($stateProvider) {
        $stateProvider.state('userAdministration', {
            url : '/userAdministration',
            templateUrl : 'app/userAdministration/userAdministration.html',
            controller : 'UserAdministrationCtrl'
        });
    })

    .controller('UserAdministrationCtrl', function ($scope, user, localStorageService, $state, $rootScope) {
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
    });