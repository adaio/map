## Install

```bash
$ npm install ada-map # component install adaio/map
```

## API

### Map(content)

Creates a new Map object with given content (optional).

```js
var prices = Map(); // or Map({ eggs: '$5.00' });

prices.set('foo', 3.14);
prices.get('foo');
// => 3.14

prices.remove('foo');
prices.get('foo');
// => undefined
```

### #content

Returns content object.

```js
var prices = Map({ eggs: 3, pen: 5 });

prices.content();
// => { eggs:3, pen: 5 }
```

### #onSet

A [pubsub](http://github.com/adaio/pubsub) object that publishes new keys & values.

```js
var prices = Map();

prices.onSet(function(product, price){ // or prices.onSet.subscribe(function...
    console.log('Product: %s Price: %s', product, price);
});

prices.set('A Box Eggs', '$4.35');
```

### #onRemove

A [pubsub](http://github.com/adaio/pubsub) object that publishes removed keys.

```js
var prices = Map();

prices.onRemove(function(product){
    console.log('Removed product: %s', product);
});

prices.set('eggs', '$4.35');
prices.remove('eggs');
```

### #reset

Resets content object.

```js
var prices = Map();

prices.set('foo', 3.14);
prices.reset({});
prices.get('foo');
// => undefined
```

## License

  MIT
