if (typeof PRODUCTION === 'undefined') PRODUCTION = false;
(function() {

var fb = angular.module('fractalBakery', []);
fb.controller('MainCtrl', ['$scope', function($scope) {
    $scope.fractalParams = {
        eps: 1e-10,
        maxIter: 25,

        reMin: -2,
        reMax: 2,
        imMin: 2,
        imMax: -2,

        roots: [
            { root: { Re: -1, Im: 0 }, hue: 0 },
            { root: { Re:  0, Im: 1 }, hue: 0.167 },
            { root: { Re:  0, Im: 0 }, hue: 0.333 },
            { root: { Re:  1, Im: 0 }, hue: 0.667 }
        ]
    };
    var fp = $scope.fractalParams;

    $scope.width = 650;
    $scope.height = 650;
    $scope.tolExponent = 10;

    $scope.updateTolerance = function() {
        fp.eps = Math.pow(10, -1 * $scope.tolExponent);
    };

    $scope.reToX = function(Re) {
        return $scope.width / (fp.reMax - fp.reMin) * (Re - fp.reMin);
    };

    $scope.imToY = function(Im) {
        return $scope.height / (fp.imMax - fp.imMin) * (Im - fp.imMin);
    };

    $scope.xToRe = function(x) {
        return (fp.reMax - fp.reMin) / $scope.width * x + fp.reMin;
    };

    $scope.yToIm = function(y) {
        return (fp.imMax - fp.imMin) / $scope.height * y + fp.imMin;
    };

    $scope.mouseMove = function($event) {
        if ($scope.dragRoot) {
            var svg = jQuery($event.currentTarget),
                offset = svg.offset(), win = jQuery(window);

            var mouseX = $event.clientX - offset.left +
                win.scrollLeft(),
                mouseY = $event.clientY - offset.top +
                win.scrollTop();

            $scope.dragRoot.root.Re = $scope.xToRe(mouseX);
            $scope.dragRoot.root.Im = $scope.yToIm(mouseY);
        }
    };
}]);

})();

