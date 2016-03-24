# Tint2 Torrent App

This is a simple torrent app. It is built using Tint2 and [webtorrent](https://github.com/feross/webtorrent).

### Prerequisites
1. [Tint 2](https://github.com/trueinteractions/tint2)
2. [npm](http://npmjs.org/)

### To Get Started
1. Install dependencies
	```
	npm install
	```

2. Use Tint to execute your app. This is best used when developing. Once you're ready to bundle the app, see the next step.
	```
	tint main.js
	```

3. To build and bundle the app:
	```
	tntbuild package.json
	```

	You'll find the bundled app in `/build`

There is a .torrent file included in the repo if you don't want to be bothered to find one of your own.
