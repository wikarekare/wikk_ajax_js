var wikk_ajax = ( function() {

  var VERSION = "1.0.1";
  function version() { return VERSION; }

  //Default error callback is an alert
  //  @param jqXHR [Object]
  //  @param textStatus [String] Error code
  //  @param errorMessage[String] Brief explaination of the error
  function ajax_error(jqXHR, textStatus, errorMessage) {
      alert('Error: ' + jtextStatus  + '\n' + errorMessage);
  }

  //Wait for "delay" seconds, then do an async ajax call, using POST
  //Useful for fetching data every "delay" seconds, by calling at the end of the callback function.
  //  @param url [String] CGI we are targeting
  //  @param args [Object] Gets turned into POST arguments, or passed with Stringify
  //  @param callback [Function] Called if the request succeeds.  Function( Anything data, String textStatus, jqXHR jqXHR )
  //  @param error_callback [Function] Called if the request fails. Function( jqXHR jqXHR, String textStatus, String errorThrown )
  //  @param completion_callback [Function] Called when the request finishes (after success and error callbacks are executed).  Function( jqXHR jqXHR, String textStatus )
  //  @param response_type [String] The available data types are text, html (Default), xml, json, jsonp, and script
  //  @param stringify [Boolean] stringify ? JSON.stringify(args) : $.param(args)
  //  @param delay [Integer] Millisecond delay before ajax call is made.
  function delayed_ajax_post_call(url, args, callback, error_callback, completion_callback, response_type, stringify, delay) {
    if(response_type == null) response_type='html';
    if(stringify == null) stringify=false;
    if(error_callback == null) error_callback=ajax_error;
    if(delay == null) delay = 180000;
    setTimeout(function () {ajax_post_call(url , args, callback, error_callback, completion_callback, response_type, stringify); }, delay );
  }


  //Wait for "delay" seconds, then do an async ajax call, using GET
  //Useful for fetching data every "delay" seconds, by calling at the end of the callback function.
  //  @param url [String] CGI we are targeting
  //  @param args [Object] Gets turned into POST arguments, or passed with Stringify
  //  @param callback [Function] Called if the request succeeds.  Function( Anything data, String textStatus, jqXHR jqXHR )
  //  @param error_callback [Function] Called if the request fails. Function( jqXHR jqXHR, String textStatus, String errorThrown )
  //  @param completion_callback [Function] Called when the request finishes (after success and error callbacks are executed).  Function( jqXHR jqXHR, String textStatus )
  //  @param response_type [String] The available data types are text, html (Default), xml, json, jsonp, and script
  //  @param delay [Integer] Millisecond delay before ajax call is made.
  function delayed_ajax_get_call(url,args,callback, error_callback, completion_callback, response_type, traditional, delay) {
    if(response_type == null) response_type='html';
    if(traditional == null) traditional=false;
    if(error_callback == null) error_callback=ajax_error;
    if(delay == null) delay = 180000;
    setTimeout(function () {ajax_get_call(url , args, callback, error_callback, completion_callback, response_type, traditional); }, delay );
  }


  //Do an async ajax call, using POST.Encoding is determined by the type of args.
  //  @param url [String] CGI we are targeting
  //  @param args [Object] Gets turned into POST arguments, or passed with Stringify
  //  @param callback [Function] Called if the request succeeds.  Function( Anything data, String textStatus, jqXHR jqXHR )
  //  @param error_callback [Function] Called if the request fails. Function( jqXHR jqXHR, String textStatus, String errorThrown )
  //  @param completion_callback [Function] Called when the request finishes (after success and error callbacks are executed).  Function( jqXHR jqXHR, String textStatus )
  //  @param response_type [String] The available data types are text, html (Default), xml, json, jsonp, and script
  //  @param stringify [Boolean] stringify ? JSON.stringify(args) : $.param(args)
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
         dataType: response_type, // type of response data
         cache: false,
         timeout: 3600000, // timeout after 5 minutes
         success: callback ,
         error: error_callback == null ? ajax_error : error_callback,
         complete: completion_callback //Changing to always.
       });
  }

  //Do an async ajax call, using GET
  //  @param url [String] CGI we are targeting
  //  @param args [Object] Gets turned into POST arguments, or passed with Stringify
  //  @param callback [Function] Called if the request succeeds.  Function( Anything data, String textStatus, jqXHR jqXHR )
  //  @param error_callback [Function] Called if the request fails. Function( jqXHR jqXHR, String textStatus, String errorThrown )
  //  @param completion_callback [Function] Called when the request finishes (after success and error callbacks are executed).  Function( jqXHR jqXHR, String textStatus )
  //  @param response_type [String] The available data types are text, html (Default), xml, json, jsonp, and script
  function ajax_get_call(url, args, callback, error_callback, completion_callback, response_type, traditional) {
    if(response_type == null) response_type='html';
    if(traditional == null) traditional=false;
    if(error_callback == null) error_callback=ajax_error;
    var serial_args = $.param(args,traditional);
    var newDataRequest = $.ajax( url, {
         type: 'GET', //default behaviour
         data: serial_args, processData: false,
         dataType: response_type == null ? 'html' : response_type, // type of response data
         contentType: "application/x-www-form-urlencoded; charset=UTF-8", //default
         timeout: 3600000, // timeout after 5 minutes
         cache: false,
         success: callback , //Changing to done in js 1.8
         error: error_callback == null ? ajax_error : error_callback, //Changing to fail
         complete: completion_callback //Changing to always.
       });
  }

  //return a hash of key: function pairs, with the key being the same name as the function.
  //Hence call with web_ajax_module.function_name()
  return {
    delayed_ajax_post_call: delayed_ajax_post_call,
    delayed_ajax_get_call: delayed_ajax_get_call,
    ajax_post_call: ajax_post_call,
    ajax_get_call: ajax_get_call,
    ajax_error: ajax_error,
    version: version
  };
})();
