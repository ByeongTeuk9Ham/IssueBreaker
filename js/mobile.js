window.onload = function() {
	var btn_jump = document.getElementsByClassName('controll--jump')[0];
	var btn_defence = document.getElementsByClassName('controll--defence')[0];

	btn_jump.onclick = _jump;
	btn_defence.onclick = _defence;
}

function _jump(event) {
	event.preventDefault();
}

function _defence(event) {
	event.preventDefault();
}