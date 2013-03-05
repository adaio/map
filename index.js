var pubsub = require('pubsub'),
    on     = require("on"),
    once   = require('once');

module.exports = Map;

function Map(){
  var map      = {},
      content  = {},
      bindings = {};

  map.onRemove = pubsub();
  map.onSet    = pubsub();

  map.bind = function(){
    var publishOnce;

    Array.prototype.forEach.call(arguments, function(name){

      if(name.once){
        name = name.once;
        publishOnce = true;
      }

      map[name] = pubsub();
      bindings[name] = (publishOnce ? once : on)(map[name].publish);

    });

    return map;
  };

  map.content = function getContent(){
    return content;
  };

  map.get = function get(key){
    return content[key];
  };

  map.remove = function remove(key){
    var bkey;
    for(bkey in bindings){
      content[key][bkey] && bindings[bkey].unsubscribeTo(content[key][bkey]);
    }

    delete content[key];
    map.onRemove.publish(key);
  };

  map.reset = function reset(newContent){
    if(!newContent) throw new Error('Invalid content replacement: ' + newContent);
    content = newContent;
  };

  map.set = function set(key, value){
    content[key] = value;
    map.onSet.publish(key, value);

    var bkey;
    for(bkey in bindings){
      value[bkey] && bindings[bkey].subscribeTo(value[bkey]);
    }

    return value;
  };

  return map;
}
