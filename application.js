var fs = require('fs');
var cron = require('cron');
var path = require('path');
var async = require('async');
var moment = require('moment');
var express = require('express');
var expressHbs = require('express3-handlebars');
var fileRoutes = require('./routes/file.js');

var cleaner = new cron.CronJob(
    '* */30 * * * *',
    function() {
        fs.readdir(process.cwd() + path.sep + "public", function(err, files)
        {
            async.each(files, function(file) {
                var basename = path.basename(file, path.extname(file));
                var parts = basename.split('-');
                if (parts.length > 0)
                {
                    var uploaded = moment.unix(parts[parts.length-1]);

                    if (uploaded.add('d', 1).isBefore(moment()))
                    {
                        fs.unlink(process.cwd() + path.sep + "public" + path.sep + file);
                    }
                }
            });
        });
    },
    null,
    false
);

var app = express();

app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');

app.use('/public', express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/static'));

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.render('500');
});

app.get('/', fileRoutes.uploadFileForm);
app.post('/upload', fileRoutes.uploadFile);
app.get('/view/:id', fileRoutes.viewFile);
app.get('/*', function(req, res) { res.render('404'); });

app.listen(9600);

cleaner.start();



