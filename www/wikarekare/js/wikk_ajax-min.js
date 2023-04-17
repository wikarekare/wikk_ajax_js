var wikk_ajax = ( function() {
var VERSION = "1.0.1";
function version() { return VERSION; }
function ajax_error(jqXHR, textStatus, errorMessage) {
alert('Error: ' + jtextStatus  + '\n' + errorMessage);
}
function delayed_ajax_post_call(url, args, callback, error_callback, completion_callback, response_type, stringify, delay) {
if(response_type == null) response_type='html';
if(stringify == null) stringify=false;
if(error_callback == null) error_callback=ajax_error;
if(delay == null) delay = 180000;
setTimeout(function () {ajax_post_call(url , args, callback, error_callback, completion_callback, response_type, stringify); }, delay );
}
function delayed_ajax_get_call(url,args,callback, error_callback, completion_callback, response_type, traditional, delay) {
if(response_type == null) response_type='html';
if(traditional == null) traditional=false;
if(error_callback == null) error_callback=ajax_error;
if(delay == null) delay = 180000;
setTimeout(function () {ajax_get_call(url , args, callback, error_callback, completion_callback, response_type, traditional); }, delay );
}
function ajax_post_call(url, args, callback, error_callback, completion_callback, response_type, stringify) {
if(response_type == null) response_type='html';
if(stringify == null) stringify=false;
if(error_callback == null) error_callback=ajax_error;
var serial_args = stringify ? JSON.stringify(args) : $.param(args);
var content_type = stringify ? "application/json; charset=UTF-8" : "application/x-www-form-urlencoded; charset=UTF-8";
var newDataRequest = $.ajax( url, {
type: 'POST',
data: serial_args,
contentType: content_type,
dataType: response_type,
cache: false,
timeout: 3600000,
success: callback ,
error: error_callback == null ? ajax_error : error_callback,
complete: completion_callback
});
}
function ajax_get_call(url, args, callback, error_callback, completion_callback, response_type, traditional) {
if(response_type == null) response_type='html';
if(traditional == null) traditional=false;
if(error_callback == null) error_callback=ajax_error;
var serial_args = $.param(args,traditional);
var newDataRequest = $.ajax( url, {
type: 'GET',
data: serial_args, processData: false,
dataType: response_type == null ? 'html' : response_type,
contentType: "application/x-www-form-urlencoded; charset=UTF-8",
timeout: 3600000,
cache: false,
success: callback ,
error: error_callback == null ? ajax_error : error_callback,
complete: completion_callback
});
}
return {
delayed_ajax_post_call: delayed_ajax_post_call,
delayed_ajax_get_call: delayed_ajax_get_call,
ajax_post_call: ajax_post_call,
ajax_get_call: ajax_get_call,
ajax_error: ajax_error,
version: version
};
})();
