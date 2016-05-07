jQuery(document).ready(function($) {

    var viewDataClient = new Autodesk.ADN.Toolkit.ViewData.AdnViewDataClient(
                  'https://developer.api.autodesk.com',
                  'http://' + window.location.host + '/api/rawtoken');

    ////////////////////
    //private const

    var files= [];

    var bucket = Config.BucketName;

    //////////////////

    $('#inputModellist').change(function(event) {
        /* Show the screen-shot */
        var urn = $('#inputModellist').val();

        if(urn === '')
        {
            //hide the screen shot
            $('#screenshot').hide();
            //clear the urn text box
            $('#inputSelectedUrn').val('');

            return;
        }

        $('#inputSelectedUrn').val(urn);

        console.log('selected urn:' + urn);
        

        // generating the screen-shot
        getThumbnail(urn, setScreenshot);


    });

    var getThumbnail = function(urn, callback)
    {
        
        viewDataClient.getThumbnailAsync (
            viewDataClient.fromBase64(urn),
            callback, //callback
            onError,
            150,//width,
            150,//height,
            null//guid
            );
    }

    var setScreenshot = function(base64){

        $('#screenshot').show();
        $('#screenshot').attr('src','data:image/png;base64,' + base64);
    };

    var onError = function(err){
        console.error(err);
    };


    $('#btnGetEmbededingcode').click(function(event) {
        
        //replace with the selected urn

        var urn = $('#inputModellist').val();

        if (urn) {
            var code = $('#codecontent').text();
            code = code.replace('dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRuLTE3LjA3LjIwMTQtMTAuNTYuMTYvRW5naW5lLmR3Zg==',urn);
            $('#codecontent').text(code);
        };

        selectText('codecontent');


    });


    var selectText = function(elementId) {
        if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(document.getElementById(elementId));
            range.select();
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(document.getElementById(elementId));
            window.getSelection().addRange(range);
        }
    }

    var addToCombo = function(urn, filename){
        var newOption = new  Option(filename, urn);
        $('#inputModellist').append(newOption);

        //select the item by default
        $('#inputModellist').val(urn);

        $('#inputSelectedUrn').val(urn);

        // generating the screen-shot
        getThumbnail(urn, setScreenshot);


    }

    var createAutoClosingAlert = function(message) {
        $('#alert_placeholder').html('<div id="alertDiv" class="alert alert-success"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + message + '</div>');
        var alert = $('#alertDiv');
        window.setTimeout(function () { alert.alert('close'); }, 500000);
    }

    $('#btnFullscreen').click(function()
    {
        var urn = $('#inputSelectedUrn').val();
        var viewerUrl = 'TestViewerApiLive.html?urn='+urn;

        window.open(viewerUrl);
    })



    ///////////////////////////////////////////////////////////////////////////
    // 
    //
    ///////////////////////////////////////////////////////////////////////////
    function createBucket(bucket) {
        var bucketCreationData = {
            bucketKey: bucket,
            servicesAllowed: {},
            policy: 'transient'
        }
        viewDataClient.createBucketAsync(
            bucketCreationData,
            //onSuccess
            function (response) {
                console.log('Bucket creation successful:');
                console.log(response);
                uploadFiles(response.key, files);
            },
            //onError
            function (error) {
                console.log('Bucket creation failed:');
                console.log(error);
                console.log('Exiting ...');
                return;
            });
    }
    ///////////////////////////////////////////////////////////////////////////
    // 
    //
    ///////////////////////////////////////////////////////////////////////////
    function uploadFiles(bucket, files) {
        for (var i = 0; i < files.length; ++i) {
            var file = files[i];
            console.log('Uploading file: ' + file.name + ' ...');
            createAutoClosingAlert('Uploading file: ' + file.name + ' ...');
            viewDataClient.uploadFileAsync(
                file,
                bucket,
                file.name,
                //onSuccess
                function (response) {
                    console.log('File is uploaded successfully:');
                    console.log(response);
                    var fileId = response.objects[0].id;
                    var registerResponse =
                        viewDataClient.register(fileId);
                    if (registerResponse.Result === "Success" ||
                        registerResponse.Result === "Created") {
                        console.log("Registration result: " +
                            registerResponse.Result);
                        createAutoClosingAlert("You model is uploaded successfully. Translation starting...");
                        console.log('Starting translation: ' +
                            fileId);
                        checkTranslationStatus(
                            fileId,
                            1000 * 60 * 5, //5 mins timeout
                            //onSuccess
                            function (viewable) {
                                console.log("Translation is successful: " +
                                    response.file.name);
                                createAutoClosingAlert("Translation is successful: " +
                                    response.file.name + ".");
                      
                                console.log("Viewable: ");
                                console.log(viewable);
                                //var fileId = viewDataClient.fromBase64(
                                //    viewable.urn);
                                addToCombo(viewable.urn, response.file.name);
                            });
                    }
                },
                //onError
                function (error) {
                    console.log('File uploading is failed:');
                    console.log(error);
                });
        }
        files = [];
    }
    ///////////////////////////////////////////////////////////////////////////
    // 
    //
    ///////////////////////////////////////////////////////////////////////////
    function checkTranslationStatus(fileId, timeout, onSuccess) {
        var startTime = new Date().getTime();
        var timer = setInterval(function () {
            var dt = (new Date().getTime() - startTime) / timeout;
            if (dt >= 1.0) {
                clearInterval(timer);
            }
            else {
                viewDataClient.getViewableAsync(
                    fileId,
                    function (response) {
                        var msg = 'Translation Progess ' +
                            fileId + ': '
                            + response.progress;
                        console.log(msg);
                        createAutoClosingAlert(msg);

                        if (response.progress === 'complete') {
                            clearInterval(timer);
                            onSuccess(response);
                        }
                    },
                    function (error) {
                    });
            }
        }, 2000);
    };





    ///////////jQuery(document).ready() running from here//////////////////////


    // Tell FileDrop we can deal with iframe uploads using this URL:
    var options = {
        //iframe: {url: 'upload.php'}
    };
    // Attach FileDrop to an area ('zone' is an ID but you can also give a DOM node):
    var zone = new FileDrop('zone', options);

    // Do something when a user chooses or drops a file:
    zone.event('send', function (selectedFiles) {
    // // Depending on browser support files (FileList) might contain multiple items.
    selectedFiles.each(function (file) {
      // // React on successful AJAX upload:
      // file.event('done', function (xhr) {
      //   // 'this' here points to fd.File instance that has triggered the event.
      //   alert('Done uploading ' + this.name + ', response:\n\n' + xhr.responseText);
      // });

        //add the native file to the array
        files.push(file.nativeFile);
        //console.log(file.name);

        viewDataClient.getBucketDetailsAsync(
            bucket,
            //onSuccess
            function (bucketResponse) {
                console.log('Bucket details successful:');
                console.log(bucketResponse);
                uploadFiles(bucket, files);
            },
            //onError
            function (error) {
                console.log("Bucket doesn't exist");
                console.log("Attempting to create...");
                createBucket(bucket);
            });

      });

      // // Send the file:
      // file.sendTo('upload.php');
    });
    


    // React on successful iframe fallback upload (this is separate mechanism
    // from proper AJAX upload hence another handler):
    zone.event('iframeDone', function (xhr) {
    alert('Done uploading via <iframe>, response:\n\n' + xhr.responseText);
    });

    // A bit of sugar - toggling multiple selection:
    fd.addEvent(fd.byID('multiple'), 'change', function (e) {
    zone.multiple(e.currentTarget || e.srcElement.checked);
    });

    
});