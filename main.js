require('Common');
var throttle = require('lodash.throttle');
var WebTorrent = require('webtorrent');
var TorrentDownloadTable = require('./download-view.js');
var wt = new WebTorrent();

var win = new Window();
var settings = {};

// Error Logging
process.on('uncaughtException', function(err) {
	console.log(err, err.stack);
});

settings.downloadPath = System.home + '/Downloads';

win.visible = true;
win.title = 'Tint Torrent App';

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

var removeTorrent = new ToolbarItem({
	tooltip: 'Remove Selected Torrent From The App',
	image: 'remove'
});
removeTorrent.addEventListener('click', function() {
	logview.removeTorrent();
});

toolbar.appendChild([
	addTorrent,
	removeTorrent
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

// var prevTor = settings.torrents;

// if (prevTor) {
// 	for (var i in prevTor) {
// 		wt.download(prevTor[i], { path: settings.downloadPath }, function(torrent) {
// 			logview.addTorrent(torrent, settings.downloadPath + '/' + torrent.name);
// 		});
// 	}
// }
