/*
Preparation

configure VISS server's information
VISS_HOST : host name or IP address

TODO:...


Configure TOKEN_VALID and TOKEN_INVALID those are
 recognized as valid and invalid security tokens.

*/


// === General setting ===
var VISS_HOST = "127.0.0.1";

var VISS_PORT = "3000";
// select ws:// or wss:// according to your VISS server
var VISS_PROTOCOL = "ws://";
//var VISS_PROTOCOL = "wss://";
var VISS_SUBPROTO = "wvss1.0";

// most tests uses this as URL to VISS server
var VISS_URL = VISS_PROTOCOL + VISS_HOST + ":" + VISS_PORT

var TIME_FINISH_WAIT = 500; // wait time to let human see test result in test window
var TIME_OUT_TIME = 5000;    // time to forcefully terminate the test

// ==== for test 0080, 0090 (Authorize test) ====
// Please replace with token strings those are valid/invalid for your VISS server implementation.
var TOKEN_VALID   = "token_valid";
var TOKEN_INVALID = "token_invalid";

// == path for get method test ==
//var path = "Signal.Drivetrain.Transmission.Speed";
var GET_STANDARD_PATH = "Signal.Drivetrain.Transmission.Speed";
var GET_WILDCARD_PATH = "Signal.Drivetrain.Transmission.*";
var GET_INVALID_PATH = "Signal.Drivetrain.Transmission.abcdef";

// == path for set method test ==
// 'path' and 'value'  which doesn't require authorization.
var SET_NO_AUTH_PATH  = "Signal.Drivetrain.Transmission.Gear";
var SET_INVALID_PATH  = "Signal.Drivetrain.Transmission.abcdef";
var SET_NO_AUTH_VALUE = 5; //Gear value: -1 to 15
// 'path' and 'value'  which requires authorization.
var SET_NEED_AUTH_PATH  = "Signal.Drivetrain.Transmission.Gear";
var SET_NEED_AUTH_VALUE = 5; //Gear value: -1 to 15

// == path for subscribe method test ==
var SUBSCRIBE_STANDARD_PATH = GET_STANDARD_PATH;
var SUBSCRIBE_INVALID_PATH  = GET_INVALID_PATH;

// === for test 0010, 0020, 0030, 0040 ===
// Need to configure a set of 'data path' and 'action' which requires
//  authorization by Authorize() method to successfully do this action for this data path.
// [PLEASE CONFIGURE THIS SECTION]
var AUTH_ACCESS_PATH   = "Signal.Cabin.Door.Row1.Right.IsLocked";
var AUTH_ACCESS_ACTION = "set"; // should be 'get' or 'set'
var AUTH_ACCESS_VALUE  = true;  // necessary when AUTH_ACCESS_ACTION == set

// === for 0220 ===
var SUBSCRIBE_PATH = "Signal.Drivetrain.Transmission.Speed";

// === get helper ===
function isAuthorizeSuccessResponse( _reqId, _inJson) {
  // TODO: better to check with Json schema
  if (
      _inJson.action === "authorize" &&
      _inJson.requestId  &&
      _inJson.TTL &&                //'TTL' exists
      _inJson.error === undefined)  //'error' not exists
  {
    if (_reqId === "" || _reqId === _inJson.requestId) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
function isAuthorizeErrorResponse( _reqId, _inJson) {
  // TODO: better to check with Json schema
  if (
      _inJson.action === "authorize" &&
      _inJson.requestId &&
      _inJson.TTL === undefined &&  //'TTL' not exists
      _inJson.error)                //'error' exists
  {
    if (_reqId === "" || _reqId === _inJson.requestId) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function isVssSuccessResponse( _reqId, _inJson) {
  // TODO: better to check with Json schema
  if (
      _inJson.action === "getVSS" &&
      _inJson.requestId &&
      _inJson.vss &&                //'TTL' exists
      _inJson.error === undefined)  //'error' not exists
  {
    if (_reqId === "" || _reqId === _inJson.requestId) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
function isVssErrorResponse( _reqId, _inJson) {
  // TODO: better to check with Json schema
  if (
      _inJson.action === "authorize" &&
      _inJson.requestId &&
      _inJson.vss === undefined &&  //'vss' not exists
      _inJson.error)                //'error' exists
  {
    if (_reqId === "" || _reqId === _inJson.requestId) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function isGetSuccessResponse( _reqId, _inJson) {
  // TODO: better to check with Json schema
  // getSuccessResponse has action?
  if (_inJson.action === "get" &&
      _inJson.requestId &&
      _inJson.timestamp &&      //'timestamp' exists
      _inJson.value &&          //'value' exists
      _inJson.error === undefined )           //'error' exists
  {
    if (_reqId === "" || _reqId === _inJson.requestId) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
function isGetErrorResponse( _reqId, _inJson) {
  // TODO: better to check with Json schema
  if (_inJson.action === "get" &&
      _inJson.requestId &&
      _inJson.timestamp &&      //'timestamp' exists
      _inJson.value === undefined &&          //'value' exists
      _inJson.error )           //'error' exists
  {
    if (_reqId === "" || _reqId === _inJson.requestId) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

// === set helper ===
function isSetSuccessResponse( _reqId, _inJson) {
  // TODO: better to check with Json schema
  if (_inJson.action === "set" &&
      _inJson.requestId &&
      _inJson.timestamp &&        //'timestamp' exists
      _inJson.error == undefined) //'error' exists
  {
    if (_reqId === "" || _reqId === _inJson.requestId) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
function isSetErrorResponse( _reqId, _inJson) {
  // TODO: better to check with Json schema
  if (_inJson.action === "set" &&
      _inJson.requestId &&
      _inJson.timestamp &&      //'timestamp' exists
      _inJson.error)            //'error' exists
      //_inJson.error.number &&   //'error.number' exists
      //_inJson.error.reason)     //'error.reason' exists
  {
    if (_reqId === "" || _reqId === _inJson.requestId) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

// === subscribe helper ===
function isSubscribeSuccessResponse( _reqId, _inJson) {
  // TODO: better to check with Json schema
  // getSuccessResponse has action?
  if (_inJson.action === "subscribe" &&
      _inJson.requestId &&
      _inJson.subscriptionId &&   //'subId' exists
      _inJson.timestamp &&      //'timestamp' exists
      _inJson.error === undefined )
  {
    if (_reqId === "" || _reqId === _inJson.requestId) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function isSubscribeErrorResponse( _reqId, _inJson) {
  // TODO: better to check with Json schema
  if (_inJson.action === "subscribe" &&
      _inJson.requestId &&
      _inJson.subscriptionId === undefined &&   //'subId' exists
      _inJson.timestamp &&      //'timestamp' exists
      _inJson.error )
  {
    if (_reqId === "" || _reqId === _inJson.requestId) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function isSubscriptionNotificationResponse( _subId, _inJson) {
  // TODO: better to check with Json schema
  if (_inJson.subscriptionId &&     //'subscriptionId' just exists
      _inJson.timestamp &&          //'timestamp' exists
      _inJson.value &&              //'value' exists
      _inJson.error === undefined)  //'error' not exists
  {
    if (_subId === "" || _subId === _inJson.subscriptionId) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
function isSubscriptionNotificationErrorResponse( _subId, _inJson) {
  // TODO: better to check with Json schema
  if (_inJson.subscriptionId &&       //'subscriptionId' just exists
      _inJson.timestamp &&            //'timestamp' exists
      _inJson.value === undefined &&  //'value' not exist
      _inJson.error)                  //'error' exists
  {
    // if _subId is empty string, don't check subId matching
    if (_subId === "" || _subId === _inJson.subscriptionId) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

// === unsubscribe helper ===
function isUnsubscribeSuccessResponse( _reqId, _subId, _inJson) {
  // TODO: better to check with Json schema
  if (_inJson.action === "unsubscribe" &&
      _inJson.requestId  &&
      _inJson.subscriptionId &&
      _inJson.error === undefined &&
      _inJson.timestamp)      //'timestamp' exists
  {
    if (_subId === "" || _subId === _inJson.subscriptionId) {
      if (_reqId === "" || _reqId === _inJson.requestId) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}
function isUnsubscribeErrorResponse( _reqId, _subId, _inJson) {
  // TODO: better to check with Json schema
  if (_inJson.action === "unsubscribe" &&
      _inJson.requestId &&
      _inJson.subscriptionId &&
      _inJson.timestamp &&      //'timestamp' exists
      _inJson.error)          //'error' exists
  {
    if (_subId === "" || _subId === _inJson.subscriptionId){
      if (_reqId === "" || _reqId === _inJson.requestId) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function isUnsubscribeAllSuccessResponse( _reqId, _inJson) {
  // TODO: better to check with Json schema
  if (_inJson.action === "unsubscribeAll" &&
      _inJson.requestId &&
      _inJson.subscriptionId === null &&
      _inJson.timestamp &&     //'timestamp' exists
      _inJson.error === undefined)
  {
    if (_reqId === "" || _reqId === _inJson.requestId) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
function isUnsubscribeAllErrorResponse( _reqId, _inJson) {
  // TODO: better to check with Json schema
  if (_inJson.action === "unsubscribeAll" &&
      _inJson.requestId &&
      _inJson.subscriptionId === null &&
      _inJson.timestamp &&      //'timestamp' exists
      _inJson.error)          //'error' exists
  {
    if (_reqId === "" || _reqId === _inJson.requestId) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}


// === utility ===
function getTimestamp() {
  var date = new Date();
  var unixTimeMsec = date.getTime();
  var unixTimeSec = Math.floor(date.getTime()/1000);

  return unixTimeMsec;
}

function addLogMessage(_msg) {
  msg = document.getElementById('log').innerHTML;
  msg = msg + "<br>" + _msg;
  document.getElementById('log').innerHTML = msg;
}
function addLogSuccess(_msg) {
  msg = document.getElementById('result').innerHTML;
  // show message with green background
  msg = msg + "<br>"
        + '<div style="font-size:30px; background-color:#00CC00;">'
        + "SUCCESS : " + _msg
        + '</div>';
  document.getElementById('result').innerHTML = msg;
}
function addLogFailure(_msg) {
  msg = document.getElementById('result').innerHTML;
  // show message with red background
  msg = msg + "<br>"
        + '<div style="font-size:30px; background-color:red;">'
        + "FAILURE : " + _msg
        + '</div>';
  document.getElementById('result').innerHTML = msg;
}

function getUniqueReqId() { 
  // create semi-uniquID (for implementation easyness) as timestamp(milli sec)+random string
  // uniqueness is not 100% guaranteed.
  var strength = 1000;
  var uniq = new Date().getTime().toString(16) + Math.floor(strength*Math.random()).toString(16);
  return "reqid-"+uniq;
}

function createRequestJson(_action, _path, _val, _filter ) {
  var reqJson = null;   
  var reqId = getUniqueReqId();
  if (_action === 'get') {
    reqJson = '{"action":"get","path":"'+_path+'","requestId":"'+reqId+'"}';   
  } else if (_action === 'set') {
    reqJson = '{"action":"set","path":"'+_path+'","value":"'+_val+'","requestId":"'+reqId+'"}';  
  } else if (_action === 'subscribe') {
    var str_filter = JSON.stringify(_filter);
    reqJson = '{"action":"subscribe","path":"'+_path+'","filters":"'+ str_filter +'","requestId":"'+reqId+'"}';   
  }
  return reqJson;  
}

// === test suite helper ===
function helper_terminate_normal( _msg, _wsconn1, _wsconn2 ) {
  addLogMessage( _msg );
  t.step_timeout(function() {
    if (_wsconn1)
      _wsconn1.close();
    if (_wsconn2)
      _wsconn2.close();

    //close websocket connection
    if (_wsconn1 == undefined && _wsconn2 == undefined && typeof(vehicle) != "undefined")
      vehicle.close();
    t.done();
  }, TIME_FINISH_WAIT); // wait time to let human read the result.
}
function helper_terminate_success( _msg, _wsconn1, _wsconn2 ) {
  addLogSuccess( _msg );
  t.step_timeout(function() {
    assert_true(true, _msg);
    if (_wsconn1)
      _wsconn1.close();
    if (_wsconn2)
      _wsconn2.close();

    //close websocket connection
    if (_wsconn1 == undefined && _wsconn2 == undefined && typeof(vehicle) != "undefined")
      vehicle.close();
    t.done();
  }, TIME_FINISH_WAIT); // wait time to let human read the result.
}
function helper_terminate_failure( _msg, _wsconn1, _wsconn2 ) {
  addLogFailure( _msg );
  t.step_timeout(function() {
    assert_throws(null, function(){}, _msg);
    if (_wsconn1)
      _wsconn1.close();
    if (_wsconn2)
      _wsconn2.close();

    //close websocket connection
    if (_wsconn1 == undefined && _wsconn2 == undefined && typeof(vehicle) != "undefined")
      vehicle.close();
    t.done();
  }, TIME_FINISH_WAIT); // wait time to let human read the result.
}

