var wikk_params = ( function() {

  var argv = {}; //Hash of params passed into x.html in URL. eg. x.html?a=b&c=d

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
              if (sParam[1] != "")
                value = unescape(sParam[1]);
              else
                value = null;

              if(argv[key] == null)
                  argv[key] = value;
              else if(typeof argv[key] === 'string')
                  argv[key] = [ argv[key], value ];
              else
                  argv[key].push(value);
          }
      }
  }

  function get_argv(key) {
    return argv[key];
  }

  //return a hash of key: function pairs, with the key being the same name as the function.
  //Hence call with wikk_params.function_name()
  return {
    getURLParameters: getURLParameters,
    get_argv: get_argv
  }
})();
