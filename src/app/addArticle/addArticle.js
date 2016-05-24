angular.module('app.addArticle', [])

    .config(function ($stateProvider) {
        $stateProvider.state('addArticle', {
            url: '/addArticle',
            templateUrl: 'app/addArticle/addArticle.html',
            controller: 'AddArticleCtrl'
        });
    })

    .controller('AddArticleCtrl', function ($scope) {

    });