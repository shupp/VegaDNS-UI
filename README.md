# VegaDNS UI

VegaDNS UI is a JavaScript UI for the [VegaDNS 2 API](https://github.com/shupp/VegaDNS/tree/python-api).  Once you check out this branch, you'll need to bundle up the JavaScript before you can use it using [npm](https://www.npmjs.com).  Once npm is installed, you can go into the root directory of this branch and do the following

```
npm install
npm run-script build
```

If you want to run this locally, you can run the webpack-dev-server by typing the following:

```
npm run-script watch
```

Then you can point your browser to [http://localhost:8080/webpack-dev-server](http://localhost:8080/webpack-dev-server).  By default, it points at a local API server at http://localhost:5000 (flask test server default).  If you want to change this, uncomment and modify the VegaDNSHost variable in public/index.html.
