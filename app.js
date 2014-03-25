var express = require('express'),
	http = require('http'),
	path = require('path'),
 	app = express(),
	request = require('request'),
	$ = require('jquery'); 

// all environments
app.set('port', process.env.PORT || 3000);
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static('assets'));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function (req, res){
    res.sendfile(__dirname + "/assets/views/index.html");
});
app.get('/ajax', function (req, res){
    console.log(req.query); //recieving json, so far so good
    var url = "http://airportcode.riobard.com/search?" + "q=" + req.query.q + "&fmt=json"
    console.log(url);
    request(url, function(err, resp, body){
    	if (!err){
			res.send(body);    		
    	}else{
  			console.log("error");
  		}

    });
}); 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
