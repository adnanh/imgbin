var fs = require('fs');
var uuid = require('node-uuid');
var formidable = require('formidable');
var path = require('path');
var moment = require('moment');

exports.uploadFile = function (req, res) {
    var form = new formidable.IncomingForm();
    form.maxFieldsSize = 50 * 1024 * 1024;
    form.parse(req, function(err, fields, files) {
        if (err)
            res.render('500');
        else
        {
            if (files.file !== undefined)
            {
                var error = false;
                var ext = "unknown";

                switch(files.file.type)
                {
                    case 'image/jpeg':
                        ext = "jpg";
                        break;
                    case 'image/png':
                        ext = "png";
                        break;
                    case 'image/gif':
                        ext = "gif";
                        break;
                    case 'image/bmp':
                        ext = "bmp";
                        break;
                    case 'image/tiff':
                        ext = "tiff";
                        break;
                    default:
                        error = true;
                        break;
                }

                if (error)
                    res.redirect('/');
                else
                {
                    var file_id = uuid.v4() + '-' + moment().format('X') + "." + ext;
                    fs.rename(files.file.path, process.cwd() + path.sep + "public" + path.sep + file_id, function(err) {
                        if (err)
                            res.render('500');
                        else
                            res.redirect('/view/' + file_id);
                    });
                }
            }
            else
                res.redirect('/');
        }
    });
};

exports.uploadFileForm = function (req, res) {
    res.render('upload');
};

exports.viewFile = function (req, res) {
    fs.exists(process.cwd() + path.sep + "public" + path.sep + path.basename(req.params.id), function (exists) {
        if (exists)
        {
            var data = {
                id: req.params.id,
                imageShareLink: req.protocol + '://' + req.host + '/view/' +req.params.id
            };
            res.render('show', data);
        }
        else
        {
        res.render('404');
        }
    });
};

