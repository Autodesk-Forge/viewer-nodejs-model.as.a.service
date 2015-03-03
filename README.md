#Model as a Service Workflow Sample


##Description

A sample demonstrating the workflow and provide a tool to learn view and data API quickly.

Live demo: [http://still-spire-1606.herokuapp.com](http://still-spire-1606.herokuapp.com/)

##Dependencies

This sample is written in Javascript, hosted on a node.js web server. 

##Setup/Usage Instructions


* Install Node.js
* Run "npm install" command from the server directory
* Replace the place holder with your own credentials in credentials.js
* In www/public/scripts/config.js, around line 8, change the bucket name to your own unique name. The bucket name must match the pattern  “^[-_.a-z0-9]{3,128}$” - i.e. the bucket name must be between 3 to 128 characters long and contain only lowercase letters, numbers and the symbols ._–.  Bucket keys must be unique within the data center or region in which they were created. Therefore, to ensure uniqueness, we recommend you incorporate your company name/domain name or consumer public key (converted to lowercase) into the bucket name..
* Run the server: "node server.js" from command line
* Connect to server locally using a WebGL-compatible browser: http://localhost:3000


## License

That samples are licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

##Written by 

Written by [Daniel Du](http://adndevblog.typepad.com/cloud_and_mobile/daniel-du.html)  

