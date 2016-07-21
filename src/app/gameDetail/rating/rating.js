angular.module('app.gameDetail')
    .controller('RatingCtrl', function ($scope, $uibModalInstance, stars, title, message) {
        
        $scope.stars = stars;
        $scope.message = message;
        $scope.title = title;
        title ? $scope.isNewReview = false: $scope.isNewReview = true;

        $scope.checkValid = function () {
            $scope.message && $scope.title ? $scope.isValid = true : $scope.isValid = false;
        };
        $scope.checkValid();

        $scope.submit = function () {
            var result = {
                title: $scope.title,
                message: $scope.message,
                stars: $scope.stars
            };
            $uibModalInstance.close(result);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    });