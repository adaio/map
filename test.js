var expect = require('chai').expect,
    pubsub = require('pubsub'),
    Map    = require('./');

it('sets and gets values', function(){
  var a = Map();

  a.set('foo', 3.14);
  a.set('bar', 156);

  expect(a.get('foo')).to.equal(3.14);
  expect(a.get('bar')).to.equal(156);

  expect(a.get('qux')).to.not.exist;
});

it('resets content object', function(){
  var a = Map();

  a.set('foo', 3.14);

  expect(a.content()).to.have.property('foo', 3.14);

  a.reset({ 'bar': 3.14 });

  expect(a.content()).to.have.property('bar', 3.14);
});

it('publishes set events', function(done){

  var a = Map();

  a.onSet(function(key, value){
    expect(key).to.equal('foo');
    expect(value).to.equal(3.14);

    done();
  });

  a.set('foo', 3.14);

});

it('removes content and fires an event', function(done){
  var a = Map();

  a.onRemove(function(key){

    expect(key).to.equal('foo');
    expect(a.get(key)).to.not.exist;

    done();

  });

  a.set('foo', 3.14);
  a.remove('foo');
});

it('binds events with "on" and "once"', function(done){
  var a = Map().bind('onError', { once: 'onReady' }),
      b = { onError: pubsub(), onReady: pubsub() },
      c = { onError: pubsub(), onReady: pubsub() },
      d = { onError: pubsub(), onReady: pubsub() };

  a.set('b', b);
  a.set('c', c);
  a.set('d', d);

  a.onError(function(updated){
    expect(updated[0].pubsub).to.equal(b.onError);
    expect(updated[1].pubsub).to.equal(c.onError);

    done();
  });

  var ready, once = true;
  a.onReady(function(updated){
    expect(ready).to.be.true;
    expect(once).to.be.true;

    once = false;

    b.onError.publish();
    c.onError.publish();

    expect(updated[0].pubsub).to.equal(b.onReady);
    expect(updated[1].pubsub).to.equal(c.onReady);

    done();
  });

  b.onReady.publish();

  setTimeout(function(){
    a.remove('d');
    ready = true;
    c.onReady.publish();
  }, 200);

});
