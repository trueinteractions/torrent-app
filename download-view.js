var numeral = require('numeral');
var moment = require('moment');
var average = require('average');

var rowHeight = 15;
var leftpadding = 5;

module.exports = function(win) {
	var f = this.form = new Scroll();
	f.left = f.right = f.top = f.bottom = 0;

	this.logs = new Table();
	this.logs.rowHeight = 100;

	this.form.setChild(this.logs);

	this.logs.addColumn('Torrents');

	this.rownum = 0;

	var torrentTitle = new TextInput();
	torrentTitle.left = leftpadding;
	torrentTitle.top = 5;
	torrentTitle.width = '100%';
	torrentTitle.readonly = true;

	var progressBar = new ProgressBar();
	progressBar.left = leftpadding;
	progressBar.top = rowHeight + 5;
	progressBar.right = 40;

	var percent = new TextInput();
	percent.right = 0;
	percent.top = rowHeight + 5;
	percent.readonly = true;
	percent.width = 40;
	percent.alignment = 'center';

	var downSpeed = new TextInput();
	downSpeed.left = leftpadding;
	downSpeed.top = rowHeight + 25;
	downSpeed.width = 100;
	downSpeed.readonly = true;

	var upSpeed = new TextInput();
	upSpeed.left = 101;
	upSpeed.top = rowHeight + 25;
	upSpeed.width = 100;
	upSpeed.readonly = true;

	var timeReamaingLabel = new TextInput();
	timeReamaingLabel.top = 5;
	timeReamaingLabel.right = 100;
	timeReamaingLabel.width = 200;
	timeReamaingLabel.readonly = true;
	timeReamaingLabel.alignment = 'right';
	timeReamaingLabel.value = 'Time Remaining:';

	var timeRemainingValue = new TextInput();
	timeRemainingValue.top = 5;
	timeRemainingValue.right = 5;
	timeRemainingValue.width = 95;
	timeRemainingValue.readonly = true;
	timeRemainingValue.alignment = 'center';

	var progressBarContainer = new Container();
	progressBarContainer.appendChild(
		[
			torrentTitle,
			progressBar,
			downSpeed,
			upSpeed,
			percent,
			timeReamaingLabel,
			timeRemainingValue
		]
	);

	this.addTorrent = function(torrent) {
		progressBar.value = torrent.progress;
		downSpeed.value = '▼ ' + numeral(torrent.downloadSpeed()).format('0.0a');
		upSpeed.value = '▲ ' + numeral(torrent.uploadSpeed()).format('0.0a');
		percent.value = numeral(torrent.progress).format('0%');
		torrentTitle.value = torrent.name;
		timeRemainingValue.value = '500 days';

		this.logs.addRow();
		this.logs.setValueAt('Torrents', this.rownum, (progressBarContainer));

		torrent.rownum = this.rownum++;

		return torrent;

	};

	this.updateProgress = function(torrent) {
		progressBar.value = torrent.progress;

		if (torrent.progress === 1) {
			downSpeed.value = '▼ ' + numeral(0).format('0.0a');
			timeRemainingValue.value = 'Completed';
		} else {
			downSpeed.value = '▼ ' + numeral(torrent.downloadSpeed()).format('0.0a');
			timeRemainingValue.value = moment.duration(torrent.timeRemaining).humanize();
		}
		upSpeed.value = '▲ ' + numeral(torrent.uploadSpeed()).format('0.0a');
		percent.value = numeral(torrent.progress).format('0%');

		this.logs.setValueAt('Torrents', torrent.rownum, (progressBarContainer));
	};
};
