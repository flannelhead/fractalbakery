(function() {

angular.module('fractalBakery').factory('fractalRenderer', ['$q',
    function($q) {
    var workers = [];

    return {
        render: function(imageData, config, width, height, exposure) {
            return $q(function(resolve, reject) {
                var workerFile = PRODUCTION ? 'renderworker.min.js' :
                    'worker/renderworker.js';
                var worker = new Worker(workerFile);
                worker.postMessage({
                    config: config,
                    width: width,
                    height: height,
                    exposure: exposure,
                    imageData: imageData
                });
                worker.onmessage = function(event) {
                    resolve(event.data);
                };
                workers.push(worker);
            });
        },

        cancelAll: function() {
            workers.forEach(function(worker) { worker.terminate(); });
            workers = [];
        }
    };
}]);
})();

