//#SETTINGS
var _TRACKER_TOKEN_ = "7654144c311049709908131343ae497d";
var _TRACKER_KEYS_ = {
  CONSOLE_LOG: "CONSOLE_LOG",
  CONSOLE_WARN: "CONSOLE_WARN",
  CONSOLE_ERROR: "CONSOLE_ERROR",
  SCRIPT_ERROR: "SCRIPT_ERROR",
  REQUEST_SEND: "REQUEST_SEND",
  REQUEST_OPEN: "REQUEST_OPEN",
};

var _TRACKER_SERVER_ = "http://52.64.142.54:8080";

window.onerror = function(msg, url, line, col, error) {
   console.log("onerror triggered", msg, url, line, col, error);
   return false;
};

setTimeout(function() { notThere(); }, 0);
window.addEventListener('unhandledrejection', function(e) {
   console.log(e);
   
});

 

(function () {
  //#GET USER PROFILE DATA

  function myAjaxFn() {
    fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${_TRACKER_TOKEN_}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        window._TRACKER_MASTER_DATA_ = data;
        setTimeout(() => {
          startTracker();
        }, 1000);
        //console.log(data, 'hhhh')
      });
  }

  myAjaxFn();

  function startTracker() {
    //console.log("Tracker started...");

    var oldWarn = console.warn;
    console.warn = function (message) {
      // DO MESSAGE HERE.
     // postData(_TRACKER_KEYS_.CONSOLE_WARN, message);
      oldWarn.apply(console, arguments);
    };

    var oldError = console.error;
    console.oldError = function (message) {

      console.log(message, 'messagemessagemessage')
      // DO MESSAGE HERE.
     // postData(_TRACKER_KEYS_.CONSOLE_ERROR, message);
      oldError.apply(console, arguments);
    };


 
     
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (
      method,
      url,
      params = null,
      otherObject = null
    ) {

      console.log("request open")
      if (url.indexOf(_TRACKER_SERVER_) === -1) {

        postData(_TRACKER_KEYS_.REQUEST_OPEN, {
          method,
          url,
          params,
          otherObject,
        });
      }

      open.call(this, method, url, params, otherObject);
    };

 
    
    XMLHttpRequest.prototype.send = (function(fsend, t){
      
      return function(tt){
        
        this.addEventListener('load', function(e){          
          console.log("Data received.",this.responseURL,  this.response, e)
        }, {once: true})

        this.addEventListener('error', function(e, t){          
         console.log("rrrrr", this.sendError )
       }, {once: true});

       this.addEventListener('readystatechange', function(e, t){          
         console.log("----------", e, t )
       }, {once: true})

        


        return fsend.apply(this, arguments); 
      }
    })(XMLHttpRequest.prototype.send);
    


    function captureNetworkRequest(e) {
      var capture_network_request = [];
      var capture_resource = performance.getEntriesByType("resource");

       
       console.log(performance.getEntriesByType("resource"), 'capture_network_request')
      for (var i = 0; i < capture_resource.length; i++) {

         if(capture_resource[i].initiatorType == "xmlhttprequest" || capture_resource[i].initiatorType == "fetch") {
            if(!capture_resource[i].token) {
               console.log(capture_resource[i].name, capture_resource[i].responseStatus , "new item")
               capture_resource[i].token = Date.now()
            }
         }
         /*
          if (capture_resource[i].initiatorType == "xmlhttprequest" || capture_resource[i].initiatorType == "script" || capture_resource[i].initiatorType == "img") {
              if (capture_resource[i].name.indexOf('www.demo.com OR YOUR URL') > -1) {
                  capture_network_request.push(capture_resource[i].name)
              }
          }
          */
      }

      
      return capture_network_request;
  }
 
  setTimeout(() => {
   captureNetworkRequest()
}, 2000)

 
    //-------------------

    window.onerror = function (exception, url, lineNo, columnNo, error) {
 
      processError(exception, url);
    };

    /*
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.ipify.org/?format=json", { name: "abc" });
    xhttp.send();
    */


    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.ipiddfy.org/?format=json", { name: "abc" });
    xhttp.send();

 

    
  }
})();

//https://api.ipify.org/?format=json



function sendError(log) {
   console.log(log, 'log')
  postData(_TRACKER_KEYS_.SCRIPT_ERROR, log);
}

var processError = function (msg, url, lineNo, columnNo, error) {
  var log = {};

  // Handle error objects (/w stack trace)
  if (msg && msg.message) {
    log.err = {
      msg: msg.message,
      file: !!msg.fileName ? msg.fileName : false,
      ln: !!msg.lineNumber ? msg.lineNumber : !!lineNo ? lineNo : false,
      col: !!msg.columnNumber
        ? msg.columnNumber
        : !!columnNo
        ? columnNo
        : false,
      stacktrace: !!msg.stack ? msg.stack : false,
      cause: !!url ? JSON.stringify(url) : false,
      errorObj: !!error ? error : false,
    };
  } else {
    log.err = {
      msg: msg,
    };

    if (!!url) {
      log.err.file = url;
    }
  }

  log.url = window.location.href;
  log.userAgent = window.navigator.userAgent;

  sendError(log);
};

/**/

//setTimeout(() => {

//}, 2000);

function postData(TYPE, DATA) {
  //console.log(window._TRACKER_MASTER_DATA_, "DATA");
  if (window._TRACKER_MASTER_DATA_) {
    console.log({ TYPE, DATA });
    var xhttp = new XMLHttpRequest();
    /*
    xhttp.open("POST", `${_TRACKER_SERVER_}/logs`, {
      TYPE,
      DATA,
      USER_PROFILE: _TRACKER_MASTER_DATA_,
      URL: DATA.url,
      METHOD: DATA.method,
    });
    xhttp.send(); */
    //console.log(JSON.parse(window._TRACKER_MASTER_DATA_));
    //console.log(TYPE, DATA, navigator, window._TRACKER_MASTER_DATA_)
    //http://52.64.142.54:8080/api
  }
}
