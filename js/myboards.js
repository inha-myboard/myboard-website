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
    "type": "single",
    "api_name": "naver",
    "api_user":"admin",
    "caption": "인기검색어",
    "description": "desc",
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

var testSingleWidget2 = {
    "id": 2,
    "type": "single",
    "api_name": "cseboard",
    "api_user":"admin",
    "caption": "컴퓨터학과 공지사항",
    "description": "desc",
    "mapping_json": {
        "headers": [{
            "caption": "번호",
            "width":"10%"
         },{
            "caption": "제목",
            "width":"60%"
         },{
            "caption": "작성자",
            "width":"10%"
         },{
            "caption": "작성일",
            "width":"20%"
         }],
        "fields":[{
             "api_path":"index",
             "style": {
                 "text-align":"left",
                 "font-size":"12px",
                 "color":"#000000",
                 "background-color":"#ffffff"
             },
             "class": ["a", "b"]
         }, {
             "api_path":"title",
             "style": {
                 "text-align":"left",
                 "font-size":"12px",
                 "color":"#000000",
                 "background-color":"#ffffff"
              }
         }, {
             "api_path":"writer",
             "style": {
                 "text-align":"left",
                 "font-size":"12px",
                 "color":"#000000",
                 "background-color":"#ffffff"
              }
         }, {
             "api_path":"date",
             "style": {
                 "text-align":"left",
                 "font-size":"12px",
                 "color":"#000000",
                 "background-color":"#ffffff"
              }
         }]
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

var testData = [
[{
   "rank": {
      "type": "text",
      "text": "1"
   },
   "keyword": {
      "type": "text",
      "text": "coinone",
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
      "text": "naver",
      "href": "http://www.naver.com"
   },
   "img": {
      "type": "img",
      "src": "img/shop-img3.jpg"
   }
}], [{
   "index": {
      "type": "text",
      "text": "400"
   }, "title" : {
      "type": "text",
      "text": "2018-1학기 수강신청 변경 사항 안내",
      "href": "http://cse.inha.ac.kr/board_notice/View.aspx?Seq=23297&CateNum=0&PageNum=1&SearchField=Title&Keyword=&SortExp=&SortDir=0"
   }, "writer": {
      "type": "text",
      "text": "관리자"
   }, "date": {
      "type": "text",
      "text": "2017.11.06"
   }
}, {
   "index": {
      "type": "text",
      "text": "399"
   }, "title" : {
      "type": "text",
      "text": "2017학년도 2학기 인하졸업우수인재 인증제안내",
      "href": "http://cse.inha.ac.kr/board_notice/View.aspx?Seq=23296&CateNum=0&PageNum=1&SearchField=Title&Keyword=&SortExp=&SortDir=0"
   }, "writer": {
      "type": "text",
      "text": "관리자"
   }, "date": {
      "type": "text",
      "text": "2017.11.06"
   }
}, {
   "index": {
      "type": "text",
      "text": "398"
   }, "title" : {
      "type": "text",
      "text": "2017학년도 동계방학 러시아 파견 프로그램 안내",
      "href": "http://cse.inha.ac.kr/board_notice/View.aspx?Seq=23252&CateNum=0&PageNum=1&SearchField=Title&Keyword=&SortExp=&SortDir=0"
   }, "writer": {
      "type": "text",
      "text": "이지아"
   }, "date": {
      "type": "text",
      "text": "2017.11.01"
   }
}, {
   "index": {
      "type": "text",
      "text": "397"
   }, "title" : {
      "type": "text",
      "text": "제17회 한국대학생프로그래밍경시대회 안내",
      "href": "http://cse.inha.ac.kr/board_notice/View.aspx?Seq=23247&CateNum=0&PageNum=1&SearchField=Title&Keyword=&SortExp=&SortDir=0"
   }, "writer": {
      "type": "text",
      "text": "관리자"
   }, "date": {
      "type": "text",
      "text": "2017.10.31"
   }
}, {
   "index": {
      "type": "text",
      "text": "396"
   }, "title" : {
      "type": "text",
      "text": "국제처 동계방학 단기파견교육연수 프로그램 안내",
      "href": "http://cse.inha.ac.kr/board_notice/View.aspx?Seq=23238&CateNum=0&PageNum=1&SearchField=Title&Keyword=&SortExp=&SortDir=0"
   }, "writer": {
      "type": "text",
      "text": "관리자"
   }, "date": {
      "type": "text",
      "text": "2017.10.31"
   }
}, {
   "index": {
      "type": "text",
      "text": "395"
   }, "title" : {
      "type": "text",
      "text": "2017학년도 외국어성적 우수장학생 선발관련",
      "href": "http://cse.inha.ac.kr/board_notice/View.aspx?Seq=23213&CateNum=0&PageNum=1&SearchField=Title&Keyword=&SortExp=&SortDir=0"
   }, "writer": {
      "type": "text",
      "text": "관리자"
   }, "date": {
      "type": "text",
      "text": "2017.10.26"
   }
}],
[ /* Composite data */ ]];




var testWidgets = [ $.extend(true, {}, testSingleWidget, {
    "caption": "인기검색어",
    "props_json": {
        "bound": {
            "x": 6,
            "y": 0,
            "width": 3,
            "height": 7
        }
    }
}, true), testSingleWidget2, testCompositeWidget];


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
                addWidget(testWidgets[i], testData[i]);    
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