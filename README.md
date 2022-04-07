# Nacre

![version-beta](https://img.shields.io/badge/version-beta-yellow)

[Nacre](https://nacre.sh/) is an **intuitive shell** designed for those who prefer to work with **objects** over text. [Want to give it a try?](https://nacre.sh/getting-started)

## Builtins at your fingertips

Navigate smoothly with preview, completion and your favorits builtins: `ls`, `cd`, `chmod`, `chown`, `stat`, `grep`, and [more](https://nacre.sh/docs#builtins).

![builtins_black](https://user-images.githubusercontent.com/11426226/160006956-f44a6bf0-96f6-475c-93db-b42f1be230ba.gif)

## Automatic module loading

The [auto-require](https://nacre.sh/getting-started#auto-require) mechanism imports your modules when you need it. Explicit import can also be done with `require()`.

![import_back](https://user-images.githubusercontent.com/11426226/160008043-e1cfc744-182f-443c-b480-59372560abc2.gif)

## Installation

```bash
npm install -g nacre
```

More [details](https://nacre.sh/getting-started#installation) about the installation.

## Example

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
