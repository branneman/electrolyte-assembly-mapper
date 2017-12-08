# electrolyte-assembly-mapper
An Assembly Mapper and Loader for the [Electrolyte](https://github.com/jaredhanson/electrolyte) DI/IoC Container in Node.js.

This npm module can be used to map any dependency loaded via Electrolyte to another dependency, like a stub instead of the real implementation.

## Installation
```sh
npm install electrolyte-assembly-mapper --save
```

## Use case
Given this example web project structure:

```text
app/
  areas/
    homepage/
      controller.js
  lib/
    content-client/
      index.js
      stub.js
  bootstrap.js
  router.js
index.js
package.json
```

In `app/areas/homepage/controller.js` you require the `content-client` dependency:

```js
module.exports = factory
module.exports['@singleton'] = true
module.exports['@require'] = ['lib/content-client']

function factory (content) {
  return (req, res) => {
    const home = await content.getPage('homepage')
    res.end(`<h1>${home.title}</h1>`)
  }
}
```

If you're bootstrapping [Electrolyte](https://github.com/jaredhanson/electrolyte) with the **electrolyte-assembly-mapper** from your entrypoint file (`index.js`):

```js
// Configure DI/IoC container
const IoC = require('electrolyte')
const loader = require('electrolyte-assembly-mapper')('.ioc-mapper.json')
IoC.use(loader('.', 'app'))
IoC.use(IoC.node_modules())

// Start app
IoC.create('app/bootstrap')
  .then(app => app())
```

The `.ioc-mapper.json` will instruct to map the `content-client` to it's stub:

```json
{
  "lib/content-client": "lib/content-client/stub"
}
```

In this example, it's best to put `.ioc-mapper.json` in your `.gitignore` file, since stubs are only used for development.

If the `.ioc-mapper.json` file is not found, the loader will only load from the specified directories (in the example `.` and `app`), and not map to anything. This way you can leave out the `.ioc-mapper.json` from your deployment package to production.
