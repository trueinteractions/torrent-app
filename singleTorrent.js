'use strict';
var numeral = require('numeral');
var moment = require('moment');

var Torrent = function(torrent) {
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
		right: 40
	});

	var percent = new TextInput({
		right: 0,
		top: rowHeight + 5,
		readonly: true,
		widht: 40,
		alignment: 'center'
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

	this.torrentView = new Container();
	this.torrentView.appendChild(
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

	progressBar.value = torrent.progress;
	downSpeed.value = '▼ ' + numeral(torrent.downloadSpeed()).format('0.0a');
	upSpeed.value = '▲ ' + numeral(torrent.uploadSpeed()).format('0.0a');
	percent.value = numeral(torrent.progress).format('0%');
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
		percent.value = numeral(torrent.progress).format('0%');
	};

};

module.exports = Torrent;
