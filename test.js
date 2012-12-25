var should = require('chai').should(),
    Map    = require('./');

it('sets and gets values', function(done){
  var a = Map();

  a.set('foo', 3.14);
  a.set('bar', 156);

  a.get('foo').should.be.equal(3.14);
  a.get('bar').should.be.equal(156);

  should.not.exist(a.get('qux'));

  done();
});

it('resets content object', function(done){
  var a = Map();

  a.set('foo', 3.14);

  a.content().should.have.property('foo', 3.14);

  a.reset({ 'bar': 3.14 });

  a.content().should.have.property('bar', 3.14);

  done();
});

it('publishes set events', function(done){

  var a = Map();

  a.onSet(function(key, value){
    key.should.be.equal('foo');
    value.should.be.equal(3.14);

    done();
  });

  a.set('foo', 3.14);

});

it('removes content and fires an event', function(done){
  var a = Map();

  a.onRemove(function(key){

    key.should.be.equal('foo');
    should.not.exist(a.get(key));

    done();

  });

  a.set('foo', 3.14);
  a.remove('foo');

});
