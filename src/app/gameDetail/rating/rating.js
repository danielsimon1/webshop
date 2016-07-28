angular.module('app.gameDetail')
    .controller('RatingCtrl', function ($scope, $uibModalInstance, stars, title, message) {
        
        $scope.stars = stars;
        $scope.message = message;
        $scope.title = title;
        title ? $scope.isNewReview = false: $scope.isNewReview = true;

        $scope.isTitleTouched = false;
        $scope.isMessageTouched = false;
        $scope.titleRegex = /^.{4,100}$/;
        $scope.messageRegex = /^.{4,1000}$/;

        // check if inputs are empty
        $scope.checkValid = function () {
            $scope.message && $scope.title && $scope.titleRegex.test($scope.title) && $scope.messageRegex.test($scope.message) ? $scope.isValid = true : $scope.isValid = false;
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