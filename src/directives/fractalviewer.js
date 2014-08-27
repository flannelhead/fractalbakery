(function() {

angular.module('fractalBakery').directive('fractalViewer', ['fractalRenderer',
    function(fractalRenderer) {
    return {
        templateUrl: 'views/fractalviewer.html',
        restrict: 'E',
        scope: {
            params: '=params'
        },
        link: function(scope, element, attrs) {
            var division = 3, previewSize = 150;
            element.addClass('fractalviewer');

            scope.$watch('params', render, true);
            scope.$watchGroup([ 'params.reMax', 'params.reMin', 'params.imMax',
                'params.imMin' ], updateSize);
            scope.$watch(function() { return element.width(); },
                updateSize);
            scope.$watch(function() { return element.height(); },
                updateSize);

            var params = scope.params,
                previewCanvas = element.find('.previewcanvas'),
                previewCtx = previewCanvas[0].getContext('2d'),
                fractalCanvas = element.find('.fractalcanvas'),
                fractalCtx = fractalCanvas[0].getContext('2d'),
                width, height, previewWidth, previewHeight, blockWidth,
                blockHeight, lastBlockWidth, lastBlockHeight, reScale, imScale;

            function render() {
                if (width === 0 || height === 0) return;
                fractalRenderer.cancelAll();
                fractalCtx.clearRect(0, 0, width, height);
                var imageData = previewCtx.createImageData(previewWidth,
                    previewHeight);
                // Render the preview image
                fractalRenderer.render(imageData, params, previewWidth,
                    previewHeight)
                    .then(function(data) {
                    renderFullImage(data.exposure);
                    previewCtx.putImageData(data.imageData, 0, 0);
                });
            }

            function renderBlock(x, y, w, h, exposure) {
                var reMin = params.reMin + reScale * x,
                    imMin = params.imMin + imScale * y;
                var config = {
                    reMin: reMin,
                    imMin: imMin,
                    reMax: reMin + reScale * w,
                    imMax: imMin + imScale * h,

                    eps: params.eps,
                    maxIter: params.maxIter,

                    roots: params.roots
                };

                var imageData = fractalCtx.createImageData(w, h);
                fractalRenderer.render(imageData, config, w, h, exposure)
                    .then(function(data) {
                    fractalCtx.putImageData(data.imageData, x, y);
                });
            }

            function renderRow(y, h, exposure) {
                for (var j = 0; j < division - 1; j++) {
                    renderBlock(j * blockWidth, y, blockWidth, h, exposure);
                }
                renderBlock(j * blockWidth, y, lastBlockWidth, h, exposure);
            }

            function renderFullImage(exposure) {
                // Render the full resolution image in blocks
                for (var i = 0; i < division - 1; i++) {
                    renderRow(i * blockHeight, blockHeight, exposure);
                }
                renderRow(i * blockHeight, lastBlockHeight, exposure);
            }

            function updateSize() {
                // Update all the dimensions and render.
                width = element.width();
                height = element.height();
                if (width > height) {
                    previewWidth = previewSize;
                    previewHeight = Math.floor(height / width * previewSize);
                } else {
                    previewHeight = previewSize;
                    previewWidth = Math.floor(width / height * previewSize);
                }
                blockWidth = Math.floor(width / division);
                blockHeight = Math.floor(height / division);
                lastBlockWidth = width - (division - 1) * blockWidth;
                lastBlockHeight = height - (division - 1) * blockHeight;
                reScale = (scope.params.reMax - scope.params.reMin) /
                    (width - 1);
                imScale = (scope.params.imMax - scope.params.imMin) /
                    (height - 1);
                previewCanvas.attr('width', previewWidth);
                previewCanvas.attr('height', previewHeight);
                fractalCanvas.attr('width', width);
                fractalCanvas.attr('height', height);
                render();
            }
            updateSize();
        }
    };
}]);

})();

