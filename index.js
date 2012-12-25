var pubsub = require('ada-pubsub');

module.exports = Map;

function Map(){
  var map     = {},
      content = {};

  map.onSet    = pubsub();
  map.onRemove = pubsub();

  map.content = function getContent(){
    return content;
  };

  map.get = function get(key){
    return content[key];
  };

  map.remove = function remove(key){
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
    return value;
  };

  return map;
}
