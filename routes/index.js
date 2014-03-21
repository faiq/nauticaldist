var path = require('path');
module.exports.index = function(req, res){
        res.sendfile(path.resolve(__dirname + '/../views/index.html'));
};
module.exports.post =  function(req, res) {
        var r = req.body;
        exports.r = r;
}; 
