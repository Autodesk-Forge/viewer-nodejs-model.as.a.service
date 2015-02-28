		//global variable 
    	var oViewer ;

        //replace with your own urn ...
		var urn = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRuLTE3LjA3LjIwMTQtMTAuNTYuMTYvRW5naW5lLmR3Zg==';
        $(document).ready(function () {
            var adnViewerMng = new Autodesk.ADN.Toolkit.Viewer.AdnViewerManager(
                'http://' + window.location.host + '/api/rawtoken',
                document.getElementById('viewerDiv'));

            var paramUrn = Autodesk.Viewing.Private.getParameterByName('urn');
            urn = (paramUrn !== '' ? paramUrn : urn);
            if (urn.substring(0,4)!="urn:")
                urn = 'urn:' + urn;
            adnViewerMng.loadDocument(urn, onViewerInitialized, onError);
        });

        var onViewerInitialized = function(viewer)
        {
        	//export the viewer object to global object
        	oViewer = viewer;

            //Now it's your turn to have fun with viewer client API...
            //For example, you can get the camera of viewer
            //var camera = viewer.getCamera();
            //console.dir(camera);
        };
        var onError = function(error)
        {
            console.error(error);
        };