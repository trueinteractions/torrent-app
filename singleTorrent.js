'use strict';
var numeral = require('numeral');
var moment = require('moment');

var Torrent = function(torrent, downloadPath) {
	var rowHeight = 15;
	var leftpadding = 5;

	var torrentTitle = new TextInput({
		left: leftpadding,
		top: 5,
		width: '100%',
		readonly: true
	});

	var progressBar = new ProgressBar({
		left: leftpadding,
		top: rowHeight + 5,
		right: 60
	});

	var percent = new TextInput({
		right: 5,
		top: rowHeight + 5,
		readonly: true,
		width: 50,
		alignment: 'right'
	});

	var downSpeed = new TextInput({
		left: leftpadding,
		top: rowHeight + 25,
		width: 100,
		readonly: true
	});

	var upSpeed = new TextInput({
		left: 101,
		top: rowHeight + 25,
		width: 100,
		readonly: true
	});

	var timeReamaingLabel = new TextInput({
		top: 5,
		right: 100,
		width: 200,
		readonly: true,
		alignment: 'right',
		value: 'Time Remaining:'
	});

	var timeRemainingValue = new TextInput({
		top: 5,
		right: 5,
		width: 95,
		readonly: true,
		alignment: 'center'
	});

	var showTorrent = new Button({
		right: 5,
		bottom: 5,
		title: 'Show'
	});
	showTorrent.addEventListener('click', function() {
		console.log('before crash ', downloadPath);
		console.log(System.home);
		System.openFile(downloadPath);
	});

	this.torrentView = new Container();
	this.torrentView.appendChild(
		[
			torrentTitle,
			progressBar,
			downSpeed,
			upSpeed,
			percent,
			timeReamaingLabel,
			timeRemainingValue,
			showTorrent
		]
	);

	progressBar.value = torrent.progress;
	downSpeed.value = '▼ ' + numeral(torrent.downloadSpeed()).format('0.0a');
	upSpeed.value = '▲ ' + numeral(torrent.uploadSpeed()).format('0.0a');
	percent.value = numeral(torrent.progress).format('0.00%');
	torrentTitle.value = torrent.name;
	timeRemainingValue.value = '500 days';

	this.update = function(torrent) {
		progressBar.value = torrent.progress;

		if (torrent.progress === 1) {
			downSpeed.value = '▼ ' + numeral(0).format('0.0a');
			timeRemainingValue.value = 'Completed';
		} else {
			downSpeed.value = '▼ ' + numeral(torrent.downloadSpeed()).format('0.0a');
			timeRemainingValue.value = moment.duration(torrent.timeRemaining).humanize();
		}
		upSpeed.value = '▲ ' + numeral(torrent.uploadSpeed()).format('0.0a');
		percent.value = numeral(torrent.progress).format('0.00%');
	};

};

module.exports = Torrent;
