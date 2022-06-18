//authentication
var just_lock_img = false;
var login_page_return_url = '';
var lock_image = new Image();
var unlock_image = new Image();
var logged_in_test = false;
var logged_in_trigger = null;

function lockAJAXCallback(data)
{
  var login_span =  document.getElementById('login_span');
  if(data.returnCode == 'true') {
    lock_text = window.just_lock_img ? '' : 'Logout ';
    logged_in_test = true;
    url = '<a href="/ruby/login.rbx?action=logout&ReturnURL=' + window.login_page_return_url + '">' + lock_text + '<img src="/images/unlocked.gif"></a>';
  } else {
    logged_in_test = false;
    lock_text = window.just_lock_img ? '' : 'Login ';
    url = '<a href="/ruby/login.rbx?ReturnURL=' + window.login_page_return_url + '">' + lock_text + '<img src="/images/locked.gif"></a>';
  }
  login_span.innerHTML = url
  if(logged_in_trigger != null) {logged_in_trigger(logged_in_test);}
  setTimeout(function () { RGraph.AJAX.getJSON('/ruby/login.rbx?action=test', lockAJAXCallback); }, 180000); //keep checking
}

function logged_in(lock_only, return_url) {
  lock_image.src="/images/locked.gif";
  unlock_image.src = "/images/unlocked.gif";

  window.just_lock_img = lock_only
  window.login_page_return_url = return_url;
//cookie is _wikk_rb_sess_id , validated by ruby/login.rbx
  RGraph.AJAX.getJSON('/ruby/login.rbx?action=test', lockAJAXCallback);
}

//Parsing parameters in an HTML file
function getURLParameters(paramName)
{
    var sURL = window.document.URL.toString();
    if (sURL.indexOf("?") > 0)
    {
        var arrParams = sURL.split("?");
        var arrURLParams = arrParams[1].split("&");
        var arrParamNames = new Array(arrURLParams.length);
        var arrParamValues = new Array(arrURLParams.length);

        var i = 0;
        for (i = 0; i<arrURLParams.length; i++)
        {
            var sParam =  arrURLParams[i].split("=");
            arrParamNames[i] = sParam[0];
            if (sParam[1] != "")
                arrParamValues[i] = unescape(sParam[1]);
            else
                arrParamValues[i] = null;
        }

        for (i=0; i<arrURLParams.length; i++)
        {
            if (arrParamNames[i] == paramName)
            {
                return arrParamValues[i];
            }
        }
        return null;
    }
}

function allURLParameters() {
  var sURL = window.document.URL.toString();
  if (sURL.indexOf("?") > 0) {
    var arrParams = sURL.split("?");
    return arrParams[1];
  } else {
    return '';
  }
}

//String
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

//Network IPV4
function aton(str) {
  var a = str.split('.');
  return ( (parseInt(a[0]) << 24) + (parseInt(a[1]) << 16) + (parseInt(a[2]) << 8) + parseInt(a[3]) );
}

function ntoa(num) {
  var a = [];
  for(var i = 3; i >= 0; i--) {
    a[i] = ( num & 0xFF ).toString();
    num = num >> 8;
  }
  return a.join('.');
}

function mask_from_subnet_size(subnet_size) {
  var themask = (0xffffffff & ~(subnet_size-1));
  return themask;
}

function calc_uplink(v) {
  tower = parseInt(window.original_tower.value);
  switch(tower) {
  case 7: case 24: case 18: case 19: case 16: // LK3, relay069, relay069a, relay069b, Terminated.
    return [0,0, 0];
  default:
    return [v + 1,1, 0];
  }
}

//Getting client list and populating select options
var client_site_ids = [];
var client_list = [];
var registered_client_site_list_local_completion = null;

function client_site_list_callback(data) {
  if(data != null && data.customer != null) {
    data.customer.sort(function(a, b){return (a.site_name == b.site_name) ? 0 : (a.site_name > b.site_name ? 1 : -1 )})
    window.client_list = data.customer;
    for(var s in window.client_site_ids) {
      for(var c in data.customer) {
        var option = document.createElement("option");
        option.value = data.customer[c].site_name;
        option.text = data.customer[c].site_name + ' ' + data.customer[c].name;
        window.client_site_ids[s].appendChild(option);
      }
    }
  }
  if(registered_client_site_list_local_completion != null) { registered_client_site_list_local_completion(); }
}

function client_site_list(selectList) {
  window.client_site_ids = selectList;
  RGraph.AJAX.getJSON('/ruby/customer.rbx?active=1', client_site_list_callback);
}

//Getting distribution tower list and populating select options
var tower_site_ids = [];
var tower_locations = [];
var tower_site_sites = [];
var registered_tower_site_list_local_completion;
var registered_tower_site_site_list_local_completion;

function tower_site_list_callback(data) {
  if(data != null && data.distribution != null && data.returnCode == 0) {
    data.distribution.sort(function(a, b){return (a.site_name == b.site_name) ? 0 : (a.site_name > b.site_name ? 1 : -1 )})
    window.tower_locations = data.distribution;
    for(var s in window.tower_site_ids) {
      for(var c in data.distribution) {
        var option = document.createElement("option");
        option.value = c;
        option.text = data.distribution[c].site_name ;
        window.tower_site_ids[s].appendChild(option);
      }
    }
  }
  if(registered_tower_site_list_local_completion != null) {
    registered_tower_site_list_local_completion();
  }
}

function tower_site_site_list_callback(data) {
   if(data != null) {
     tower_site_sites = data
     if(registered_tower_site_site_list_local_completion != null) {registered_tower_site_site_list_local_completion();}
     tower_site_site_list(null, 18000000); //Every 5 minutes, refresh the sites list
   }
}

function tower_site_site_list(local_completion, delay) {
  registered_tower_site_site_list_local_completion = local_completion;
  setTimeout(function () {RGraph.AJAX.getJSON('/ruby/distribution.rbx?summary=true', tower_site_site_list_callback); }, delay );
}

function tower_site_list(selectList, active_only, local_completion) {
  registered_tower_site_list_local_completion = local_completion;
  window.tower_site_ids = selectList;
  active_string = active_only ? '&active=1' : '';
  RGraph.AJAX.getJSON('/ruby/distribution.rbx?site_name=%' + active_string, tower_site_list_callback);
}

function find_tower_by_site_name(site_name) {
  for(var s in window.tower_locations) {
    if(window.tower_locations[s].site_name == site_name) { return s; }
  }
  return null;
}

function find_tower_by_distribution_id(distribution_id) {
  for(var s in window.tower_locations) {
    if(window.tower_locations[s].distribution_id == distribution_id) { return s; }
  }
  return null;
}

//Mac address mapping
var mac_table = {};
function mac_table_callback(data) {
  window.mac_table = data
}
function get_mac_table() {
  RGraph.AJAX.getJSON('mac_router.json', mac_table_callback);
}

function get_hostname(mac) {
  if(mac == null || mac == "") {
    return "";
  } else {
    clean_mac = mac.replace( /:/g, '' );
    if(window.mac_table[clean_mac] != null) {
      return window.mac_table[clean_mac];
    } else {
      return "";
    }
  }
}

Date.prototype.monthDays= function(){
    var d = new Date(this.getFullYear(), this.getMonth()+1, 0);
    return d.getDate();
}

function ajax_call(url, args, callback, error_callback) {
  var serial_args = $.param(args,true)
  var newDataRequest = $.ajax( url, {
       type: 'POST',
       data: serial_args,
       dataType: 'json', // type of response data
       timeout: 1800000, // timeout after 30 minutes
       success: ping_form_callback ,
       error: ping_form_error_callback
     });
}
