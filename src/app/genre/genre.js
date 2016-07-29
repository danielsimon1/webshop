angular.module('app.genre', [])

    .config(function ($stateProvider) {
        $stateProvider.state('genre', {
            url : '/genre/:name',
            templateUrl : 'app/genre/genre.html',
            controller : 'GenreCtrl'
        });
    })

    .controller('GenreCtrl', function ($stateParams, localStorageService, $scope) {
        $scope.searchInput = "";
        $scope.isAllGenres = false;

        // get genre from URL parameters
        $scope.genre = $stateParams.name;

        // all articles
        var articles = localStorageService.get('articles');

        // only articles with matching genre
        $scope.articles = [];

        $scope.isArticles = false;
        // convert from objects to array to be able to order
        angular.forEach(articles, function (item) {
            if (item.genre == $scope.genre) {
                $scope.isArticles = true;
                $scope.articles.push(item);
            } else if ($scope.genre == 'Alle Spiele') {
                $scope.articles.push(item);
                $scope.isArticles = true;
                $scope.isAllGenres = true;
            }
        });

        // set order values
        $scope.relevance = {
            name: "relevance",
            value: "id",
            reverse: false
        };
        $scope.priceDesc = {
            name: "priceDesc",
            value: "price",
            reverse: true
        };
        $scope.priceAsc = {
            name: "priceAsc",
            value: "price",
            reverse: false
        };
        $scope.newest = {
            name: "newest",
            value: "release",
            reverse: true
        };

        // set initial order type
        var preselected = localStorageService.get("order-option") || "relevance";
        $scope.orderType = $scope[preselected];

        // write option to localstorage
        // when user re-enters the site, preselected option is re-loaded
        $scope.optionChange = function () {
            localStorageService.set("order-option", $scope.orderType.name);
        }
    });