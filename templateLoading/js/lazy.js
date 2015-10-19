
window.addEventListener("load", function() {
	initAnimation();
	getMoreImages();
});

function getMoreImages() {
	var elTemplate = document.querySelector('template');
	var elTemplateContent = elTemplate.content;
	var elParent = elTemplate.parentNode;
	elParent.removeChild(elTemplate);
	elParent.appendChild(elTemplateContent);
}


function initAnimation() {
	var elUL = document.querySelector("ul");
	var nSize = 680;

	document.querySelector("#controller").addEventListener("click", function(ev) {
		var preCss = elUL.style.transform;
		var nPreX = +preCss.replace(/translate3d\((-*\d+)(px)*\,.+\)/g , "$1");
		nNewX = nPreX + (-nSize);
		elUL.style.transform = "translate3d("+ nNewX +"px, 0, 0)";
	},false);
}