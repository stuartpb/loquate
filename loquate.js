var Loquate; (function(){
  var localLoquate;
  function decoder(opts) {
    opts = opts || {};
    var newlines = opts.newlines === undefined ? '\n' : opts.newlines;
    return function decode(str){
      var decoded = decodeURIComponent(str.replace(/\+/g,' '));
      if(newlines || newlines === '')
        return decoded.replace(/\r\n|\r|\n/g, newlines);
      else return decoded;
    };
  }
  localLoquate = function(str, opts) {
    opts = opts || {};
    var sep = opts.sep || /[&;]/g;
    var eq = opts.eq || '=';
    var decode = opts.decode;
    if(decode === undefined) {
      decode = (localLoquate.decode || decoder)(opts);
    }
    var boolval;
    var multival = opts.multival;
    var onbool = opts.onbool;
    if (onbool == 'undefined') {
      boolval = undefined;
    } else if (opts.boolval === undefined) {
      boolval = true;
    } else {
      boolval = opts.boolval;
    }

    //The value we will return.
    var query = {};

    //For every key/value
    var pairs = str.split(sep);
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      var k,v;

      //Find the first key/value separator in it
      //(any later separators are part of the value)
      var sepmatch = pair.match(eq);

      //If there was no separator at all
      if (!sepmatch && onbool != "ignore") {
        if (onbool == "both") {
          k = decode(pair);
          v = k;
        } else if (onbool == "value") {
          k = boolval;
          v = decode(pair);
        } else {
          k = decode(pair);
          v = boolval;
        }
      } else {
        var eqindex = sepmatch.index;

        // If `eq` is a global regex, the index will be missing
        // from the match array. You can solve this on the
        // input side by not ending your eq regex with "/g",
        // but if you can't do that, we'll handle it.
        if(!eqindex) eqindex = pair.indexOf(sepmatch[0]);

        k = decode(pair.slice(0,eqindex));
        v = decode(pair.slice(eqindex+sepmatch[0].length));
      }

      // If K was undefined, we're ignoring it
      if(k !== undefined){
        // If this key has already been defined, and we're saving arrays
        if( (Object.prototype.hasOwnProperty.call(query,k)
          && multival != "last" && multival != "first")){

          // If this key has not yet been made an array
          if(Array.isArray ? !Array.isArray(query[k]) :
            Object.prototype.toString.call(query[k]) != "[object Array]") {
            
            // Put the existing value in an array
            query[k] = [query[k]];
          }
          
          // Add this value to the array
          query[k].push(v);

        // If this key has not yet been defined, or should be clobbered
        } else {
          
          // Start an array if we're saving all values in an array
          if (multival == "always") {
            query[k] = [v];
            
          // Save this value if previous values don't preempt it
          } else if (multival != "first") {
            query[k] = v;
          }
        }
      } //if (k !== undefined)
    }

    return query;
  };
  Loquate = localLoquate;
  Loquate.decode = decoder;
})();

if(typeof module !== "undefined") {
  module.exports = Loquate;
}

//if the location object exists, there's a querystring
//for this location, and adding a 'location.query'
//wouldn't clobber anything
if(typeof location !== "undefined" && location.search
  && !('query' in location)){
  //set location.query from the query part of the query string
  location.query = Loquate(location.search.slice(1));
}
