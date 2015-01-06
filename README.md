loquate
=======

Loquate is a JavaScript library for the wide, wide world of making an object
from a query string.

## Usage

By default, Loquate adds a `query` property to `location` based on
`location.search`, so if you don't need anything fancier than plain old
`?shana=na+na&bat=ba%2fna%2fna` pair handling, you can just use
`location.query` right after including `loquate.js`,
[like so](http://stuartpb.github.io/loquate/example.html):

```html
<script src="loquate.js"></script>
<script>
if(!location.query){ //if there's no query string on the URL
  document.write('<form method="GET"><input name="name" value="Stuart">'+
    '<input name="hairInches" value="1.2"> inches'+
    '<input type="submit" value="I need some hair advice"></form>');
} else {
  document.write('<h1>Should I, '
    + (location.query.name || "Anonymous") + ', cut my hair?</h1>');
  if(location.query.hairInches == 0)
    document.write("<p>What hair?</p>");
  else if(location.query.hairInches < 80)
    document.write("<p>Ask a hairdresser</p>");
  else if(location.query.hairInches < 221.54)
    document.write("<p>Only if you like riding on escalators</p>");
  else document.write("<p>Not now, you're setting the world record!</p>");
}</script>
```

If you want anything more complex than that, you can get a new object by
calling the Loquate method with your desired options (see below). If you want
to use Loquate's default string decoder (which converts plusses to spaces and
normalizes all whitespace on top of doing decodeURIComponent), you can
construct an instance of it with `Loquate.decode({newline: newline})`, where
`newline` is the string to normalize newlines to (or a defined falsy value to
leave all CR/LF/CRLF instances as they are).

```js
//We keep our options in a hashbang with JSON-esque syntax
var hashoptions = Loquate(location.hash.slice(2),{
    sep: ',', eq: ':', decode: function(str){
    return Loquate.decoder()(str).replace(/^\s*"|"\s*$/g,'')}})
```

## Options

You can override pretty much any constant behavior on Loquate with options:

- **sep**: The string or regex to match when splitting the query string into
  pairs. Defaults to `/[&;]/g`, [per W3C recommendation][1].
- **eq**: The string or regex to match when splitting a pair into key and value.
  Defaults to `'='`.
- **decode**: The filter to apply to keys and values. Defaults to
  `Loquate.decode(opts)`. This means you can modify the default decoder
  constructor for all later `Loquate` calls by assigning to `Loquate.decode`.
  - **newline**: Used by the default decoder as the sequence to normalize
    newlines to. Defaults to `'\n'`.
- **onbool**: The behavior to use when encountering elements without pair
  separators (eg. `?keybyitself&anotherlonelykey`). If unrecognized, treats the
  element as a key and assigns it the value of **boolval**.
  - `'undefined'`: Assign the key to the value of `undefined`. (This is
    controlled by **onbool** because setting **boolval** to `undefined` will
    cause it to use the default value.
  - `'ignore'`: Ignore completely.
  - `'both'`: Assign the key at the name of the element to the value of the
    element.
  - `'value'` Assign the value of the element to the key named in **boolval**.
    (If multiple values are present in this fashion, they will be assigned to
    the key accoring to the behavior specified in **multidef**.)
- **boolval**: In the absence of a recognized value for **onbool**, the value
  to assign to keys without specified values. Defaults to `true` if `boolval`
  is `undefined`.
- **multidef**: Which behavior to use when encountering the same key multiple
    times.
    - `'first'`: Only use the dirst definition of the value.
    - `'last'`: Only use the last definition of the value.
    - `'always'`: Use an array for every value, defined multiple times or not.
      - This allows for closer matching of Python's behavior.

[1]: http://www.w3.org/TR/1999/REC-html401-19991224/appendix/notes.html#h-B.2.2

## Compatiblity

Query string handling is surprisingly ill-defined, and different environments
have different behaviors. Here are the options to match the behavior of other
querystring parsing implementations.

### Node querystring module
```js
{ sep: '&',
  boolval: '' }
```

### Python (urlparse/urllib.parse).parse_qs
```js
{ sep: '&',
  onbool: 'ignore', //omit this line for keep_blank_values = True behavior
  boolval: '',
  multidef: 'always' }
```

## FAQ

### Extending the DOM offends my delicate sensibilities.

Loquate only adds `location.query` if it's definitely not going to block access
to anything. If you can't tolerate its existence, you can delete it right after
including the script:

```html
<script src="//stuartpb.github.io/loquate/loquate.js"></script>
<script>if(location.query) delete location.query;</script>
```

If your whole site is programmed to set off alarm bells whenever anything is
assigned to DOM objects, make your own local copy of the script and delete the
last ten lines.

## Roadmap

- Add options:
  - **subindex**: A pattern (applied before decoding) for matching subindexing
    elements in keys. If `true`, defaults to `/\[([^\]*)\]/g`.
  - **dot**: A pattern (applied before decoding) for separating subindexing
    elements in keys. If true, defaults to `'.'`.
- Evaluate other querystring implementations and maybe change the defaults to
  match the most common cases.
- Make the `Loquate()` interface at least come close to following normal
  JavaScript object conventions.
  - At least extend all options to work something like how `decode` does.
  - Maybe either make `Loquate` a proper constructor or decapitalize the name.
