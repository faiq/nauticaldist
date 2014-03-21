var path = require('path');
exports.index = function(req, res){
        res.sendfile(path.resolve(__dirname + '/../views/index.html'));
};
exports.post =  function(req, res) {
        var r = req.body;
        exports.r = r;
}; 
