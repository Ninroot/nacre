# Nacre

[![stability-alpha](https://img.shields.io/badge/stability-alpha-f4d03f.svg)](https://github.com/mkenney/software-guides/blob/master/STABILITY-BADGES.md#alpha)

[Nacre](https://nacre.sh/) is an **intuitive shell** designed for those who prefer to work with **objects** over text. [Want to give it a try?](https://nacre.sh/getting-started)

An example is better than a long speech:
```js
> ls()
[ 'foo' ]

> touch('bar')
'bar'

> ls()
[ 'bar', 'foo' ]
  
// inspect foo's permissions
> chmod('foo')
{
  user: { read: true, write: true, execute: false },
  group: { read: true, write: false, execute: false },
  others: { read: true, write: false, execute: false }
}

> chmod.add.execute.user('foo')
{
  user: { read: true, write: true, execute: true },
  group: { read: true, write: false, execute: false },
  others: { read: true, write: false, execute: false }
}

> const perm = chmod('foo')

// inspect the value of perm variable
> perm
{
  user: { read: true, write: true, execute: true },
  group: { read: true, write: false, execute: false },
  others: { read: true, write: false, execute: false }
}

// give bar the same permissions as foo 
> chmod.set('bar', perm)
{
  user: { read: true, write: true, execute: true },
  group: { read: true, write: false, execute: false },
  others: { read: true, write: true, execute: false }
}
```

## Available commands

See the [documentation](https://nacre.sh/docs).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT. See [LICENSE](./LICENSE).
