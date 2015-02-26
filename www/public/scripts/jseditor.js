(function() {
		
		

		var runJsCode = function(){
			
			
			var jsCode = js_editor.getValue();
			try{

				//save the code into localStorage every running
				localStorage.setItem('code',jsCode);

				//if oViewer exsit, the viewer has been initialized,
				//ready to run viewer API code
				if(typeof(oViewer)!=='undefined'){

					eval(jsCode);
					//clear error msg if no error 
					console_box_editor.setValue('');
				}
				else
				{
					console.log('viewer is not initialied yet...');
				}
			}
			catch (e){

				var msg = e.name + ":" + e.message;
				console_box_editor.setValue(msg);
				console.log(msg);
			}
		}
			
		

	// EDITORS

	// CM OPTIONS
	var cm_opt = {
		mode: 'text/html',
		gutter: true,
		lineNumbers: true,
	};

	//RUN button
	$('#btnRun').click(function(){
		runJsCode();
	});

	
	// JAVASCRIPT EDITOR
	cm_opt.mode = 'javascript';
	var js_box = document.querySelector('#js textarea');
	var js_editor = CodeMirror.fromTextArea(js_box, cm_opt);

	var console_box = document.querySelector('#console textarea');
	var console_box_editor = CodeMirror.fromTextArea(console_box, cm_opt);

	js_editor.on('change', function (inst, changes) {
		//console.log(inst);
		//console.log(changes);
		runJsCode();
	});

	// SETTING CODE EDITORS INITIAL CONTENT

	var initialScript = '';
	if (localStorage.getItem('code')) {
		initialScript = localStorage.getItem('code');
	}
	else{
		initialScript = '//oViewer is global variable which is the viewer instance for this sample\n';
		initialScript = initialScript + 'oViewer.setBackgroundColor(255, 255, 255, 255, 255, 255);\n';
		initialScript = initialScript + 'oViewer.explode(0.7);';
	}		

	js_editor.setValue(initialScript);

	
	//runJsCode();
	
	



	// RENDER CALL ON PAGE LOAD
	// NOT NEEDED ANYMORE, SINCE WE RELY
	// ON CODEMIRROR'S onChange OPTION THAT GETS
	// TRIGGERED ON setValue
	// render();


	// NOT SO IMPORTANT - IF YOU NEED TO DO THIS
	// THEN THIS SHOULD GO TO CSS

	/*
	Fixing the Height of CodeMirror.
	You might want to do this in CSS instead
	of JS and override the styles from the main
	codemirror.css
	*/
	var cms = document.querySelectorAll('.CodeMirror');
	for (var i = 0; i < cms.length; i++) {

		cms[i].style.position = 'absolute';
		cms[i].style.top = '30px';
		cms[i].style.bottom = '0';
		cms[i].style.left = '0';
		cms[i].style.right = '0';
		cms[i].style.height = '100%';
	}
	/*cms = document.querySelectorAll('.CodeMirror-scroll');
	for (i = 0; i < cms.length; i++) {
	cms[i].style.height = '100%';
	}*/
		
	}());