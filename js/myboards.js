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

// 테스트용 Single Widget
var testSingleWidget = {
    "id": 1,
    "api_name": "naver",
    "api_user":"admin",
    "caption": "컴퓨터학과 공지사항",
    "description": "desc",
    "type": "single",
    "mapping_json": {
        "headers": [{
            "caption": "순위",
            "width":"20%"
        },{
            "caption": "검색어"
        }],
        "fields":[{
                "api_path":"rank",
                "style": {
                    "text-align":"left",
                    "font-size":"12px",
                    "color":"#000000",
                    "background-color":"#ffffff"
                },
                "class": ["a", "b"]
            }, {
                "api_path":"keyword",
                "style": {
                    "text-align":"left",
                    "font-size":"12px",
                    "color":"#222",
                    "background-color":"#6f2"
                }
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


// 테스트용 Composite Widget
var testCompositeWidget = {
    "id": 1,
    "type": "composite",
    "api_name": "naver",
    "api_user":"admin",
    "caption": "My Shopping Mall",
    "description": "desc",
    "mapping_json": {
       "main_field":{
          "api_path":"img",
          "type":"image",
          "floating":{
             "api_path":"rank",
             "position":"bottom",
             "alignment":"left",
             "max_line":1,
             "font_size":12,
             "font_color":"0x000000"
          }
       },
       "fields_position": "bottom",
       "fields":[{
             "api_path":"keyword",
             "text-align":"center",
             "font-size":"10",
             "font-color":"0x000000",
             "background-color":"0xffffff"
          }, {
             "api_path":"rank",
             "text-align":"center",
             "font-size":"10",
             "font-color":"0x000000",
             "background-color":"0xffffff"
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
            "y": 4,
            "width": 9,
            "height": 4
        }
    },
    "created_time": "2017-02-01 22:11:11"
};

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




var testWidgets = [testSingleWidget, $.extend(true, {}, testSingleWidget, {
    "caption": "인기검색어",
    "props_json": {
        "bound": {
            "x": 6,
            "y": 0,
            "width": 3,
            "height": 7
        }
    }
}, true), testCompositeWidget];


// 위젯 생성
function makeWidget(widgetTemplate, data) {
    var widgetEl = templates["widget-wrapper"]({
        "widget": widgetTemplate,
        "data": data
    });
    return widgetEl;
}

// 위젯 추가
function addWidget(widgetTemplate, data) {
    var gridstack = $('.grid-stack').data("gridstack");
    var widgetEl = makeWidget(widgetTemplate, data);
    gridstack.addWidget(widgetEl); // el, x, y, width, height, autoPosition, minWidth, maxWidth, minHeight, maxHeight, id]
}

// Handlebars templates
var templates = {};

$(document).on("ready", function(){
    $('.grid-stack').gridstack();
    var gridstack = $('.grid-stack').data("gridstack");
    $.ajax({
        "url": "html/templates.html",
        "dataType": "html",
        "success": function(data) {
            var html = $(data);
            html.filter("script").each(function(i, script) {
                if(script.type=="text/x-handlebars-tpl") {
                    templates[script.id] = Handlebars.compile(script.innerHTML);
                } else if(script.type=="text/x-handlebars-ptl") {
                    Handlebars.registerPartial(script.id, script.innerHTML);
                }
            });

            for(var i = 0 ; i < testWidgets.length; i++) {
                addWidget(testWidgets[i], testData);    
            }
        }
    });

    
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