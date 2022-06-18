//Wait for "delay" seconds, then do an async ajax call, using POST
//Useful for fetching data every "delay" seconds, by calling at the end of the callback function.
function delayed_ajax_post_call(url, args, callback, error_callback, completion_callback, delay) {
    setTimeout(function () {ajax_post_call(url , args, callback, error_callback, completion_callback); }, delay );
}

//Wait for "delay" seconds, then do an async ajax call, using POST, and passing JSON as a String.
//Useful for fetching data every "delay" seconds, by calling at the end of the callback function.
function delayed_ajax_json_post_call(url,args,callback, error_callback, completion_callback, delay) {
    setTimeout(function () {ajax_json_post_call(url , args, callback, error_callback, completion_callback); }, delay );
}

//Wait for "delay" seconds, then do an async ajax call, using GET
//Useful for fetching data every "delay" seconds, by calling at the end of the callback function.
function delayed_ajax_get_call(url,args,callback, error_callback, completion_callback, delay) {
    setTimeout(function () {ajax_get_call(url , args, callback, error_callback, completion_callback); }, delay );
}

//Do an async ajax call, using POST, and passing JSON as a string.
function ajax_json_post_call(url, args, callback, error_callback, completion_callback) {
  var newDataRequest = $.ajax( url, {
       type: 'POST',
       data: JSON.stringify(args), // type of response data
       //dataType: 'json', // type of response data
       contentType: 'application/json', //and we want to send it as json.
       cache: false,
       timeout: 3600000, // timeout after 5 minutes
       success: callback ,
       error: error_callback,
       complete: completion_callback //Changing to always.
     });
}

//Do an async ajax call, using POST.Encoding is determined by the type of args.
function ajax_post_call(url, args, callback, error_callback, completion_callback) {
  var newDataRequest = $.ajax( url, {
       type: 'POST',
       data: args,
       cache: false,
       timeout: 3600000, // timeout after 5 minutes
       success: callback ,
       error: error_callback,
       complete: completion_callback //Changing to always.
     });
}

//Do an async ajax call, using GET
function ajax_get_call(url, args, callback, error_callback, completion_callback, traditional) {
  var serial_args = $.param(args,traditional);
  var newDataRequest = $.ajax( url, {
       type: 'GET', //default behaviour
       data: serial_args, processData: false,
       timeout: 3600000, // timeout after 5 minutes
       cache: false,
       success: callback , //Changing to done in js 1.8
       error: error_callback, //Changing to fail
       complete: completion_callback //Changing to always.
     });
}

function ajax_error(jqXHR, textStatus, errorMessage) {
    alert('Error: ' + jqXHR != null ? jqXHR.status.toString() : '' + '\n' + errorMessage);
}

var ARGV = {};

//Parsing parameters in an HTML file, so we can use an html file as a cgi
//and populate the form based on args passed in.
function getURLParameters()
{
    var sURL = window.document.URL.toString();
    if (sURL.indexOf("?") > 0)
    {
        var arrParams = sURL.split("?");
        var arrURLParams = arrParams[1].split("&");

        var i = 0;
        for (i = 0; i<arrURLParams.length; i++)
        {
            var sParam =  arrURLParams[i].split("=");
            key = unescape(sParam[0]);
            value = sParam[1];
            if(ARGV[key] == null)
                ARGV[key] = value;
            else if(typeof ARGV[key] === 'string')
                ARGV[key] = [ ARGV[key], value ];
            else 
                ARGV[key].push(value);
        }
    }
}
