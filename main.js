require('Common');
var throttle = require('lodash.throttle');
var WebTorrent = require('webtorrent');
var TorrentDownloadTable = require('./download-view.js');
var wt = new WebTorrent();

var win = new Window();
var settings = {},
		storage;

// Error Logging
process.on('uncaughtException', function(err) {
	console.log(err, err.stack);
});

try {
	storage = JSON.parse(application.storage);
} catch(err) {
	console.log(err)
}

if (!storage) {
	console.log('no previous settings')
	// Set default settings
	settings = {
		downloadPath: System.home + '/Downloads',
	};
} else if (storage && !storage.downloadPath) {
	console.log('no previous settings.downloadPath')
	settings.downloadPath = System.home + '/Downloads';
} else {
	console.log('previous settings')
	settings = JSON.parse(application.storage);
}

process.on('exit', function() {
	console.log(settings);
	application.storage = JSON.stringify(settings);
});

win.visible = true;
win.title = 'Demo Torrent App';

var toolbar = new Toolbar();
win.toolbar = toolbar;

var addTorrent = new ToolbarItem();
addTorrent.tooltip = 'Add torrent files to download';
addTorrent.image = 'add';
addTorrent.addEventListener('click', function() {
	var fileDialog = new FileDialog('open');
	fileDialog.allowFileTypes = ['torrent'];
	fileDialog.open(win);
	fileDialog.on('select', function() {
		var torrentFile = fileDialog.selection[0];
		wt.download(torrentFile, { path: settings.downloadPath }, function(torrent) {
			logview.addTorrent(torrent, settings.downloadPath + '/' + torrent.name);
			if (!settings.torrents) {
				settings.torrents = {};
				settings.torrents[torrent.name] = torrentFile;
			} else {
				settings.torrents[torrent.name] = torrentFile;
			}
		});
	});
});

toolbar.appendChild([
	addTorrent
]);

var logview = new TorrentDownloadTable({form: {visible: true, top: 50}});
win.appendChild(logview.form);

/*
 * Torrent Instance
 */

var update = throttle(function(torrent) {
	logview.updateProgress(torrent);
}, 200);

wt.on('torrent', function(torrent) {
	torrent.on('download', function(){
		update(torrent);
	});

	torrent.on('done', function() {
		update.flush();
		update(torrent);

		Notification.requestPermission(function(response) {
			if (response) {
				var notif = new Notification();
				notif.title = 'Torrent has finished downloading.';
				notif.subtitle = torrent.name + ' is complete';
				notif.text = torrent.name + ' is complete';
				notif.buttonLabel = 'Show';
				notif.addEventListener('click', function() {
					System.openFile(settings.downloadPath + '/' + torrent.name);
				});
				notif.dispatch();
			}
		});
	});
});

/*
 * If torrents exist from previous session re-start them
 */

var prevTor = settings.torrents;

if (prevTor) {
	for (var i in prevTor) {
		wt.download(prevTor[i], { path: settings.downloadPath }, function(torrent) {
			logview.addTorrent(torrent, settings.downloadPath + '/' + torrent.name);
		});
	}
}
