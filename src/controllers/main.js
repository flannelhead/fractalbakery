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
        imMax: -1,

        roots: [
            { root: { Re: -1, Im: 0 }, hue: 0 },
            { root: { Re:  0, Im: 1 }, hue: 0.167 },
            { root: { Re:  0, Im: 0 }, hue: 0.333 },
            { root: { Re:  1, Im: 0 }, hue: 0.667 }
        ]
    };
    var fp = $scope.fractalParams;

    $scope.width = 800;
    $scope.height = 600;
    $scope.tolExponent = 10;
    $scope.activeRoot = fp.roots[0];

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

    function mouseToComplex(mouse) {
        return {
            Re: $scope.xToRe(mouse.x),
            Im: $scope.yToIm(mouse.y)
        };
    }

    var fractalViewer = jQuery('#fractal fractal-viewer'), win = jQuery(window);
    function mouseCoords($event) {
        var offset = fractalViewer.offset();
        return {
            x: $event.clientX - offset.left + win.scrollLeft(),
            y: $event.clientY - offset.top + win.scrollTop()
        };
    }

    $scope.mouseMove = function($event) {
        if ($scope.dragRoot) {
            var mouse = mouseCoords($event);
            $scope.dragRoot.root.Re = $scope.xToRe(mouseX);
            $scope.dragRoot.root.Im = $scope.yToIm(mouseY);
        } else if ($scope.zooming) {
            updateZoomPath($event);
        }
    };

    function updateZoomPath($event) {
        var endPoint = mouseCoords($event);
        $scope.zoomPath = 'M' + ($scope.zoomBegin.x + 0.5) + ',' +
            ($scope.zoomBegin.y + 0.5) + ' H' + (endPoint.x + 0.5) + ' V' +
            (endPoint.y + 0.5) + ' H' + ($scope.zoomBegin.x + 0.5) + ' z';
    }

    $scope.rootColour = function(root) {
        return 'hsl(' + Math.round(root.hue * 360) + ',80%,60%)';
    };

    function randomQuantized(N) {
        return Math.floor(Math.random() * N) / N;
    }

    $scope.addNewRoot = function() {
        var newRoot = {
            root: {
                Re: fp.reMin + randomQuantized(100) * (fp.reMax - fp.reMin),
                Im: fp.imMin + randomQuantized(100) * (fp.imMax - fp.imMin)
            },

            hue: randomQuantized(100)
        };
        fp.roots.push(newRoot);
        $scope.activeRoot = newRoot;
    };

    $scope.removeActiveRoot = function() {
        if (fp.roots.length === 2) {
            alert('Must have at least one root.');
            return;
        }

        var index = fp.roots.indexOf($scope.activeRoot);
        fp.roots.splice(index, 1);
        $scope.activeRoot = fp.roots[0];
    };

    $scope.beginZooming = function($event) {
        if ($scope.zooming) return;

        $scope.zooming = true;

        var point = mouseCoords($event),
            complex = mouseToComplex(point);
        $scope.zoomBegin = {
            Re: complex.Re,
            Im: complex.Im,
            x: point.x,
            y: point.y
        };
    };

    $scope.zoomIn = function($event) {
        if (!$scope.zooming) return;

        $scope.zooming = false;
        $scope.zoomPath = '';

        var point = mouseToComplex(mouseCoords($event));

        fp.reMin = Math.min($scope.zoomBegin.Re, point.Re);
        fp.reMax = Math.max($scope.zoomBegin.Re, point.Re);
        fp.imMin = Math.max($scope.zoomBegin.Im, point.Im);
        fp.imMax = Math.min($scope.zoomBegin.Im, point.Im);
    };
}]);

})();

