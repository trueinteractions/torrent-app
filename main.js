require('Common');
var debounce = require('debounce');
var WebTorrent = require('webtorrent');
var wt = new WebTorrent();

var TorrentDownloadTable = require('./download-view.js');

// application.registerHotKey('q', 'cmd', function(){

// })

var win = new Window();

win.visible = true;
win.title = 'Demo Torrent App';

var toolbar = new Toolbar();
win.toolbar = toolbar;

var config = {
	downloadPath: '.',
	selectedTorrent: {}
};

var addTorrent = new ToolbarItem();
addTorrent.tooltip = 'Add torrent files to download';
addTorrent.image = 'add';
addTorrent.addEventListener('click', function() {
	var fileDialog = new FileDialog('open');
	fileDialog.allowFileTypes = ['torrent'];
	fileDialog.open(win);
	fileDialog.on('select', function() {
		var torrentFile = fileDialog.selection[0];
		wt.download(torrentFile, { path: config.downloadPath }, function(torrent) {
			torrent.id = logview.addTorrent(torrent);
		});
	});
});

toolbar.appendChild([
	addTorrent
]);

var logview = new TorrentDownloadTable();
logview.form.visible = true;
logview.form.top = 50;
win.appendChild(logview.form);

/*
 * Torrent Instance
 */

var torrents = [];

// wt.download('./test.torrent', { path: '.' }, function(torrent) {
// 	var t = logview.addTorrent(torrent);
// 	torrents.push(t);
// });

var update = debounce(function(torrent) {
	logview.updateProgress(torrent);
}, 80);

wt.on('torrent', function(torrent) {
	torrent.on('download', function(){
		update(torrent);
	});

	torrent.on('done', function() {
		update(torrent);
	});
});
