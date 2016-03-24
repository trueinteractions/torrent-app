var Torrent = require('./singleTorrent');

var torrents = {
	torrents: []
};

module.exports = function(win) {
	var f = this.form = new Scroll();
	f.left = f.right = f.top = f.bottom = 0;

	this.logs = new Table({
		rowHeight: 60
	});

	this.form.setChild(this.logs);

	this.logs.addColumn('Torrents');

	this.addTorrent = function(torrent, downloadPath) {
		var t = torrents[torrent.name] = new Torrent(torrent, downloadPath);

		this.logs.addRow();
		this.logs.setValueAt('Torrents', torrents.torrents.length, torrents[torrent.name].torrentView);
		torrents.torrents.push(torrent);
	};

	this.updateProgress = function(torrent) {
		torrents[torrent.name].update(torrent);
	};

	this.updateOrder = function() {
		torrents.torrents.forEach(function(torrent, idx) {
			this.logs.setValueAt('Torrents', idx, torrent.torrentView);
		}.bind(this));
	};

	this.removeTorrent = function() {
		var torrent = torrents.torrents[this.logs.selectedRows[0]];
		torrents.torrents.forEach(function(tor, idx) {
			if (torrent.name === tor.name) {
				tor.destroy();
				torrents.torrents.splice(idx, 1);
			}
		});
		delete torrents[torrent.name];
		this.logs.removeRow();
		this.updateOrder();
	};
};
