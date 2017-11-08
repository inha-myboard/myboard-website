// 편집모드 활성화
function enableEdit() {
	gridstack.movable(gridstack.container.children('.' + gridstack.opts.itemClass), true);
	gridstack.resizable(gridstack.container.children('.' + gridstack.opts.itemClass), true);
	$(".nav-edit", "ul.nav").show();
	$(".nav-normal", "ul.nav").hide();
}

// 편집모드 비활성화
function disableEdit() {
	gridstack.disable();
	$(".nav-edit", "ul.nav").hide();
	$(".nav-normal", "ul.nav").show();
}

// 편집중인 보드 전체저장
function saveBoard() {

}

var testProps = {
   "fields":[{
         "api_path":"rank",
         "type":"text",
         "caption": "순위",
         "width":"20%",
         "alignment":"right",
         "font_size":12,
         "font_color":"0x000000",
         "bg_color":"0xffffff"
      }, {
         "api_path":"keyword",
         "type":"text",
         "caption": "검색어",
         "width":"80%",
         "alignment":"middle",
         "font_size":12,
         "font_color":"0x000000",
         "bg_color":"0xffffff"
      }
   ]
}

var testData = [{
   "rank": {
   	  "type": "text",
      "text": "1"
   },
   "keyword": {
   	  "type": "text",
      "text": "ASD",
      "href": "http://www.coinone.com"
   },
   "img": {
   	  "type": "img",
      "src": "img/shop-img4.jpg",
      "href": "http://www.google.com"
   }
}, {
   "rank": {
   	  "type": "text",
      "text": "2"
   },
   "keyword": {
   	  "type": "text",
      "text": "ASD",
      "href": "http://www.naver.com"
   },
   "img": {
   	  "type": "img",
      "src": "img/shop-img3.jpg"
   }
}];

$(document).on("ready", function(){
	$('.grid-stack').gridstack();
	var gridstack = $('.grid-stack').data("gridstack");
	$("#editButton").on("click", function(){
		enableEdit();	
	});
	$("#exitButton").on("click", function(){
		disableEdit();
	});
	$("#saveButton").on("click", function(){
		saveBoard();
		disableEdit();
	});
});