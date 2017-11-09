// 편집모드 활성화
function enableEdit() {
    var gridstack = $('.grid-stack').data("gridstack");
    gridstack.movable(gridstack.container.children('.' + gridstack.opts.itemClass), true);
    gridstack.resizable(gridstack.container.children('.' + gridstack.opts.itemClass), true);
    $(".nav-edit", "ul.nav").show();
    $(".nav-normal", "ul.nav").hide();
}

// 편집모드 비활성화
function disableEdit() {
    var gridstack = $('.grid-stack').data("gridstack");
    gridstack.disable();
    $(".nav-edit", "ul.nav").hide();
    $(".nav-normal", "ul.nav").show();
}

// 편집중인 보드 전체저장
function saveBoard() {

}

var testWidget = {
    "id": 1,
    "api_name": "naver",
    "api_user":"admin",
    "caption": "asd",
    "description": "desc",
    "mapping_json": {
        "header": true,
        "fields":[{
                "api_path":"rank",
                "type":"text",
                "caption": "순위",
                "width":"20%",
                "alignment":"right",
                "font_size":"small",
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
    },
    "props_json": {
        "repeats": {
           "start_index":0,
           "repeat_cnt":10,
           "direction":"down",
           "paging":{
                "type":"newline",
                "max_item":"5"
            }
        },
        "bound": {
            "x": 0,
            "y": 0,
            "width": 9,
            "height": 4
        }
    },
    "created_time": "2017-02-01 22:11:11"
};

var testWidgets = [testWidget, $.extend(testWidget, {
    "props_json": {
        "bound": {
            "x": 10,
            "y": 0,
            "width": 3,
            "height": 7   
        }
    }
}, true), $.extend(testWidget, {
    "props_json": {
        "bound": {
            "x": 0,
            "y": 0,
            "width": 5,
            "height": 7   
        }
    }
}, true), $.extend(testWidget, {
    "props_json": {
        "bound": {
            "x": 0,
            "y": 4,
            "width": 9,
            "height": 4   
        }
    }
}, true)];

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

function addWidget(widget, data) {
    var gridstack = $('.grid-stack').data("gridstack");
    var widgetWrapper = templates["widget-wrapper"]({
        "widget": widget,
        "data": data
    });
    // gridstack.makeWidget(widgetWrapper, x, y, width, height, autoPosition, minWidth, maxWidth, minHeight, maxHeight, id])
}

var templates = {};

$(document).on("ready", function(){
    $.ajax({
        "url": "html/templates.html",
        "dataType": "html",
        "success": function(data) {
            var html = $(data);
            html.filter("script[type='text/x-handlebars']").each(function(i, script) {
                templates[script.id] = Handlebars.compile(script.innerHTML);
            });
        }
    });

    $('.grid-stack').gridstack();
    var gridstack = $('.grid-stack').data("gridstack");
    for(var i = 0 ; i < testWidget.length; i++) {
        addWidget(testWidgets[i], testData);    
    }
    
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
    disableEdit();
});