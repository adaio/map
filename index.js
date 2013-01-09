var pubsub = require('ada-pubsub'),
    on     = require("ada-on");

module.exports = Map;

function Map(){
  var map     = {},
      content = {};

  map.onError  = pubsub();
  map.onReady  = pubsub();
  map.onRemove = pubsub();
  map.onSet    = pubsub();
  map.onUpdate = pubsub();


  var onErrorController = pubsub.on(map.onError.publish),
      onReadyController = pubsub.on(map.onReady.publish),
      onUpdateController = pubsub.on(map.onUpdate.publish);

  map.content = function getContent(){
    return content;
  };

  map.get = function get(key){
    return content[key];
  };

  map.remove = function remove(key){
    content[key] && content[key].onUpdate && onUpdateController.subscribeTo(content[key].onUpdate);
    content[key] && content[key].onReady && onReadyController.subscribeTo(content[key].onReady);
    content[key] && content[key].onError && onErrorController.subscribeTo(content[key].onError);

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

    value && value.onUpdate && onUpdateController.subscribeTo(value.onUpdate);
    value && value.onError && onErrorController.subscribeTo(value.onError);
    value && value.onReady && onReadyController.subscribeTo(value.onReady);

    return value;
  };

  return map;
}
