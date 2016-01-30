require('Common');
var throttle = require('lodash.throttle');
var WebTorrent = require('webtorrent');
var wt = new WebTorrent();

var TorrentDownloadTable = require('./download-view.js');

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
			logview.addTorrent(torrent);
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
		update(torrent);
	});
});
