var Loquate; function(){
  function decoder(newlines) {
    if(newlines === undefined) newlines = '\n';
    return function decode(str){
      var decoded = decodeURIComponent(str.replace(/\+/g,' '));
      if(newlines || newlines === '')
        return decoded.replace(/\r\n|\r|\n/g, newlines);
      else return decoded;
    }
  }
  Loquate = function(str, opts) {
    opts = opts || {};
    var sep = opts.sep || /[&;]/g;
    var eq = opts.eq || '=';
    var decode = opts.decode;
    if(decode === undefined) {
      decode = (Loquate.decode || decoder)(opts.newlines);
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
      var equals = pair.match(eq);
      
      //If there was no separator at all
      if(!match){
        //Treat the whole thing as a key and give it a truth value
        k = decode(pair);
        v = true;
      } else {
        var eqindex = match.index

        // If `eq` is a global regex, the index will be missing
        // from the match array. You can solve this on the
        // input side by not ending your eq regex with "/g",
        // but if you can't do that, we'll handle it.
        if(!eqindex) eqindex = pair.indexOf(match[0])
  
        k = decode(pair.slice(0,eqindex));
        v = decode(pair.slice(0,eqindex+match[0].length));
      }
      
      //If this key has already been defined
      if(query.hasOwnProperty(k)){

        //if the value at this key that's already been defined is 
        //one of the two types we create the first time through,
        //and not already an array like it would be after the second time
        if(typeof query[k] == "string" || typeof query[k] == "boolean"){
          query[k] = [query[k]];
        }
        query[k].push(v);

      //If this key has not yet been defined
      } else {
        query[k] = v;
      }
    }
  
    return query;
  }
  Loquate.decode = decoder;
}();

if(typeof location !== "undefined" && location.search && !location.hasOwnProperty('query')){
  location.query = Loquate(location.search.slice(1));
}

if(typeof module !== "undefined") {
  module.exports = Loquate;
}
