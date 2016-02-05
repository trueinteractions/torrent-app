var Torrent = require('./singleTorrent');

var torrents = {};

module.exports = function(win) {
	var f = this.form = new Scroll();
	f.left = f.right = f.top = f.bottom = 0;

	this.logs = new Table({
		rowHeight: 60
	});

	this.form.setChild(this.logs);

	this.logs.addColumn('Torrents');

	this.rownum = 0;

	this.addTorrent = function(torrent, downloadPath) {
		torrents[torrent.name] = new Torrent(torrent, downloadPath);

		this.logs.addRow();
		this.logs.setValueAt('Torrents', this.rownum, torrents[torrent.name].torrentView);

		this.rownum++;

	};

	this.updateProgress = function(torrent) {
		torrents[torrent.name].update(torrent);
	};
};
