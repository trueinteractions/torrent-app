var progressBar = new ProgressBar();

module.exports = function(torrent) {
	this.logs.addRow();
	this.logs.setValueAt('File Name', this.rownum, name);
	this.logs.setValueAt('Progress', this.rownum, downloadStatus);

	return this.rownum++;

}.bind(this);
