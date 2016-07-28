angular.module('app.userAdministration', [])

    .config(function ($stateProvider) {
        $stateProvider.state('userAdministration', {
            url : '/userAdministration',
            templateUrl : 'app/userAdministration/userAdministration.html',
            controller : 'UserAdministrationCtrl'
        });
    })

    .controller('UserAdministrationCtrl', function ($scope, user) {
        function loadUsers() {
            user.getAllUsers()
                .then(function (response) {
                    $scope.users = response;
                }, function (error) {
                    if (error) {
                        toastr.error(error);
                    } else {
                        toastr.error("Verbindung zum Server fehlgeschlagen!");
                    }
                });
        }

        loadUsers();

        $scope.deleteUser = function (userName) {
            user.deleteUser(userName)
                .then(function (response) {
                    toastr.success(response);
                    loadUsers();
                }, function (error) {
                    toastr.error(error);
                });
        }
    });