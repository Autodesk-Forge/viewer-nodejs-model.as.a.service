/////////////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Philippe Leefsma 2014 - ADN/Developer Technical Services
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////////////////
var credentials = require('../credentials');
var express = require('express');
var request = require('request');

var router = express.Router();

///////////////////////////////////////////////////////////////////////////////
// Generates access token
//
///////////////////////////////////////////////////////////////////////////////
router.get('/token', function (req, res) {


    var creds = new credentials();

    var params = {
        client_id: creds.ClientId,
        client_secret: creds.ClientSecret,
        grant_type: 'client_credentials'
    }

    request.post(
        creds.AuthenticateUrl,
        { form: params },

        function (error, response, body) {

            if (!error && response.statusCode == 200) {

                var accessToken = JSON.parse(body);

                // Website you wish to allow to connect
                res.setHeader('Access-Control-Allow-Origin', '*');

                // Request methods you wish to allow
                res.setHeader('Access-Control-Allow-Methods', 'GET');

                // // Request headers you wish to allow
                // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

                // // Set to true if you need the website to include cookies in the requests sent
                // // to the API (e.g. in case you use sessions)
                // res.setHeader('Access-Control-Allow-Credentials', true);

                res.send(accessToken.access_token);
                
            }
        });
});

///////////////////////////////////////////////////////////////////////////////
// Generates access token in raw json
//
///////////////////////////////////////////////////////////////////////////////
router.get('/rawtoken', function (req, res) {


    var creds = new credentials();

    var params = {
        client_id: creds.ClientId,
        client_secret: creds.ClientSecret,
        grant_type: 'client_credentials'
    }

    request.post(
        creds.AuthenticateUrl,
        { form: params },

        function (error, response, body) {

            if (!error && response.statusCode == 200) {

                // Website you wish to allow to connect
                res.setHeader('Access-Control-Allow-Origin', '*');

                // Request methods you wish to allow
                res.setHeader('Access-Control-Allow-Methods', 'GET');

                // // Request headers you wish to allow
                // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

                // // Set to true if you need the website to include cookies in the requests sent
                // // to the API (e.g. in case you use sessions)
                // res.setHeader('Access-Control-Allow-Credentials', true);

                //res.send(accessToken.access_token);
                res.send(body);
            }
        });
});

module.exports = router;
