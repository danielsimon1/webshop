angular.module('app.userAdministration', [])

    .config(function ($stateProvider) {
        $stateProvider.state('userAdministration', {
            url: '/userAdministration',
            templateUrl: 'app/userAdministration/userAdministration.html',
            controller: 'UserAdministrationCtrl'
        });
    })

    .controller('UserAdministrationCtrl', function () {

    });