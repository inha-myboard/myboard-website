// var MYBOARD_HOST = "http://myboards.ml";
var MYBOARD_HOST = "http://172.30.1.23:5000/inspects";

// 편집모드 활성화
function enableEdit() {
    var gridstack = $('.grid-stack').data("gridstack");
    gridstack.movable(gridstack.container.children('.' + gridstack.opts.itemClass), true);
    gridstack.resizable(gridstack.container.children('.' + gridstack.opts.itemClass), true);
    $(".nav-edit", "ul.nav").show();
    $(".nav-normal", "ul.nav").hide();
    $(".btn-box-tool", "div.box-header").show();
    $(".mfb-component__wrap", "ul.mfb-component--br").show();
}

// 편집모드 비활성화
function disableEdit() {
    var gridstack = $('.grid-stack').data("gridstack");
    gridstack.disable();
    $(".nav-edit", "ul.nav").hide();
    $(".nav-normal", "ul.nav").show();
    $(".btn-box-tool", "div.box-header").hide();
    $(".mfb-component__wrap", "ul.mfb-component--br").hide();
}

// 편집중인 보드 전체저장
function saveBoard() {

}

// 위젯 삭제
function removeWidget() {

}

// API 관리창 로딩
function onShowManageWidgetModal() {
    $.ajax({
        "url": MYBOARD_HOST + "/users/1/widgets",
        "success": function(data) {
            var tableEl = templates["table-manage-widget"](data);
            $("#manageWidgetTable").html(tableEl);
        }
    });
}

function onShowAddWidgetModal() {
    $("#addWidgetModal .nav > li:eq(0) a").tab("show");
    $("#prevButton").hide();
    $("#finishButton").addClass("hidden");
    $("#nextButton").show();
    $("#apiJsonText").val("");
}

// 위젯 생성
function makeWidget(widgetTemplate, data) {
    var widgetEl = templates["widget-wrapper"]({
        "widget": widgetTemplate,
        "data": data
    });
    return widgetEl;
}

// 대시보드 위젯 추가
function addWidget(widgetTemplate, data) {
    var gridstack = $('.grid-stack').data("gridstack");
    var widgetEl = makeWidget(widgetTemplate, data);
    gridstack.addWidget(widgetEl); // el, x, y, width, height, autoPosition, minWidth, maxWidth, minHeight, maxHeight, id]
}

// 위젯추가 스텝넘기기전 검사
function checkStep(id) {
    if(id == "step1") {
        try {
            JSON.parse($("#apiJsonText").val());
        } catch(e) {
            return "Please valid input json";
        }
    } else if(id == "step2") {
        if(!addWidgetData.type) {
            return "Please select widget type";
        }
    }
}

// 위젯추가 스텝넘기고나서
function onShowStep(id) {
    if(id == "step2") {
        addWidgetData.apiJson = JSON.parse($("#apiJsonText").val());
        addWidgetData.type = null;
    }
}

// 이벤트 바인딩
function bindEvent() {
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
    $('#manageWidgetTable').on('click', '.clickable-row', function(event) {
        $(this).addClass('active').siblings().removeClass('active');
        $("#manageWidgetTable").data("selectedRow", this);
    });

    $("#addWidgetModal").on("show.bs.modal", function(){
        onShowAddWidgetModal();
    });

    $("#manageWidgetModal").on("show.bs.modal", function(){
        onShowManageWidgetModal();
    });

    $("#nextButton").on("click", function(){
        var curPane = $("#addWidgetModal .tab-content > .active");
        var msg = checkStep(curPane.attr("id"));
        if(msg) {
            alert(msg);
            return;
        }
        var nextPane = curPane.next();
        if(nextPane.size() > 0) {
            $("a[href='#" + nextPane.attr("id") + "']").tab("show");
        }
        if(nextPane.next().size() == 0) {
            $("#finishButton").removeClass("hidden");
            $("#nextButton").hide();
        }
        $("#prevButton").show();
        onShowStep(nextPane.attr("id"));
    });

    $("#prevButton").on("click", function(){
        var prevPane = $("#addWidgetModal .tab-content > .active").prev();
        if(prevPane.size() > 0) {
            $("a[href='#" + prevPane.attr("id") + "']").tab("show");
        }
        if(prevPane.prev().size() == 0) {
            $("#prevButton").hide();
        }
        $("#finishButton").addClass("hidden");
        $("#nextButton").show();
        onShowStep(prevPane.attr("id"));
    });

    $("#finishButton").on("click", function(){
        console.log(addWidgetData);
        $("#addWidgetModal").modal("hide");
        $("#manageWidgetModal").modal("show");
    });

    $("[data-type='widgetType'").on("click", function(){
        addWidgetData.type = $(this).data("value");
        $("#nextButton").click();
    })
}
// Handlebars templates
var templates = {};
var addWidgetData = {
    "type": "",
    "apiJson": ""
};

var widgetData = {};

$(document).on("ready", function(){
    var data = [{"data": "[{\"rank\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%EA%B6%8C%EC%84%A0%ED%83%9D&sm=top_lve&ie=utf8\", \"text\": \"1\", \"type\": \"text\"}, \"keyword\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%EA%B6%8C%EC%84%A0%ED%83%9D&sm=top_lve&ie=utf8\", \"text\": \"\uad8c\uc120\ud0dd\", \"type\": \"text\"}}, {\"rank\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%EC%B9%B4%EC%B9%B4%EC%98%A4+%EB%B0%B0%ED%8B%80%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C&sm=top_lve&ie=utf8\", \"text\": \"2\", \"type\": \"text\"}, \"keyword\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%EC%B9%B4%EC%B9%B4%EC%98%A4+%EB%B0%B0%ED%8B%80%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C&sm=top_lve&ie=utf8\", \"text\": \"\uce74\uce74\uc624 \ubc30\ud2c0\uadf8\ub77c\uc6b4\ub4dc\", \"type\": \"text\"}}, {\"rank\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%EC%A0%95%ED%95%B4%EC%9D%B8&sm=top_lve&ie=utf8\", \"text\": \"3\", \"type\": \"text\"}, \"keyword\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%EC%A0%95%ED%95%B4%EC%9D%B8&sm=top_lve&ie=utf8\", \"text\": \"\uc815\ud574\uc778\", \"type\": \"text\"}}, {\"rank\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%EB%9F%AC%EB%B8%94%EB%A6%AC%EC%A6%88&sm=top_lve&ie=utf8\", \"text\": \"4\", \"type\": \"text\"}, \"keyword\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%EB%9F%AC%EB%B8%94%EB%A6%AC%EC%A6%88&sm=top_lve&ie=utf8\", \"text\": \"\ub7ec\ube14\ub9ac\uc988\", \"type\": \"text\"}}, {\"rank\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%EA%B9%80%EC%A3%BC%ED%98%81+%EB%B8%94%EB%9E%99%EB%B0%95%EC%8A%A4&sm=top_lve&ie=utf8\", \"text\": \"5\", \"type\": \"text\"}, \"keyword\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%EA%B9%80%EC%A3%BC%ED%98%81+%EB%B8%94%EB%9E%99%EB%B0%95%EC%8A%A4&sm=top_lve&ie=utf8\", \"text\": \"\uae40\uc8fc\ud601 \ube14\ub799\ubc15\uc2a4\", \"type\": \"text\"}}, {\"rank\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%EC%84%B8%EB%A5%B4%EB%B9%84%EC%95%84&sm=top_lve&ie=utf8\", \"text\": \"6\", \"type\": \"text\"}, \"keyword\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%EC%84%B8%EB%A5%B4%EB%B9%84%EC%95%84&sm=top_lve&ie=utf8\", \"text\": \"\uc138\ub974\ube44\uc544\", \"type\": \"text\"}}, {\"rank\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%EB%B0%B0%ED%98%84%EC%A7%84&sm=top_lve&ie=utf8\", \"text\": \"7\", \"type\": \"text\"}, \"keyword\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%EB%B0%B0%ED%98%84%EC%A7%84&sm=top_lve&ie=utf8\", \"text\": \"\ubc30\ud604\uc9c4\", \"type\": \"text\"}}, {\"rank\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%EC%A0%95%EC%95%BD%EC%9A%A9&sm=top_lve&ie=utf8\", \"text\": \"8\", \"type\": \"text\"}, \"keyword\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%EC%A0%95%EC%95%BD%EC%9A%A9&sm=top_lve&ie=utf8\", \"text\": \"\uc815\uc57d\uc6a9\", \"type\": \"text\"}}, {\"rank\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%ED%95%9C%EA%B5%AD+%EC%84%B8%EB%A5%B4%EB%B9%84%EC%95%84&sm=top_lve&ie=utf8\", \"text\": \"9\", \"type\": \"text\"}, \"keyword\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%ED%95%9C%EA%B5%AD+%EC%84%B8%EB%A5%B4%EB%B9%84%EC%95%84&sm=top_lve&ie=utf8\", \"text\": \"\ud55c\uad6d \uc138\ub974\ube44\uc544\", \"type\": \"text\"}}, {\"rank\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%EC%B6%95%EA%B5%AC+%EA%B5%AD%EA%B0%80%EB%8C%80%ED%91%9C+%ED%8F%89%EA%B0%80%EC%A0%84&sm=top_lve&ie=utf8\", \"text\": \"10\", \"type\": \"text\"}, \"keyword\": {\"href\": \"http://search.naver.com/search.naver?where=nexearch&query=%EC%B6%95%EA%B5%AC+%EA%B5%AD%EA%B0%80%EB%8C%80%ED%91%9C+%ED%8F%89%EA%B0%80%EC%A0%84&sm=top_lve&ie=utf8\", \"text\": \"\ucd95\uad6c \uad6d\uac00\ub300\ud45c \ud3c9\uac00\uc804\", \"type\": \"text\"}}]", "api_id": 0}, {"data": "[{\"date\": {\"text\": \"11.14.\", \"type\": \"text\"}, \"title\": {\"href\": \"http://cse.inha.ac.kr/board_notice/view.aspx?Seq=23380\", \"text\": \"\uc878\uc5c5\uc0dd \uc0ac\uc9c4\ucd2c\uc601 \ubbf8\ucc38\uc5ec \ud559\uc0dd \ucd2c\uc601 \ucc38\uc5ec \uc548\ub0b4\", \"type\": \"text\"}}, {\"date\": {\"text\": \"11.14.\", \"type\": \"text\"}, \"title\": {\"href\": \"http://cse.inha.ac.kr/board_notice/view.aspx?Seq=23372\", \"text\": \"2017 KERIS \ubbf8\ub798\uad50\uc721 \uc2ec\ud3ec\uc9c0\uc5c4 \uac1c\ucd5c \uc54c\ub9bc ...\", \"type\": \"text\"}}, {\"date\": {\"text\": \"11.08.\", \"type\": \"text\"}, \"title\": {\"href\": \"http://cse.inha.ac.kr/board_notice/view.aspx?Seq=23326\", \"text\": \"2017\ub144 \ub3d9\uacc4 UST \uc5f0\uad6c\uc778\ud134\uc2ed \uc6b4\uc601 \uc548\ub0b4\", \"type\": \"text\"}}, {\"date\": {\"text\": \"11.07.\", \"type\": \"text\"}, \"title\": {\"href\": \"http://cse.inha.ac.kr/board_notice/view.aspx?Seq=23311\", \"text\": \"2017\ud559\ub144\ub3c4 \ub3d9\uacc4 \uacc4\uc808\ud559\uae30 \uc219\uba85\uc5ec\uc790\ub300\ud559\uad50 \ud559\uc810 ...\", \"type\": \"text\"}}, {\"date\": {\"text\": \"11.07.\", \"type\": \"text\"}, \"title\": {\"href\": \"http://cse.inha.ac.kr/board_notice/view.aspx?Seq=23310\", \"text\": \"2017\ud559\ub144\ub3c4 \ub3d9\uacc4 \uacc4\uc808\ud559\uae30 \uc138\uc885\ub300\ud559\uad50 \ud559\uc810\uad50\ub958 ...\", \"type\": \"text\"}}, {\"date\": {\"text\": \"11.06.\", \"type\": \"text\"}, \"title\": {\"href\": \"http://cse.inha.ac.kr/board_notice/view.aspx?Seq=23303\", \"text\": \"\ub300\ud559\uc6d0 \uc124\uba85\ud68c(OPEN LAB) \ud589\uc0ac \uc548\ub0b4\", \"type\": \"text\"}}, {\"date\": {\"text\": \"11.06.\", \"type\": \"text\"}, \"title\": {\"href\": \"http://cse.inha.ac.kr/board_notice/view.aspx?Seq=23297\", \"text\": \"2018-1\ud559\uae30 \uc218\uac15\uc2e0\uccad \ubcc0\uacbd \uc0ac\ud56d \uc548\ub0b4\", \"type\": \"text\"}}]", "api_id": 13}, {"data": "[{\"img\": {\"src\": \"http://t1.daumcdn.net/thumb/F155x100ht.u/?fname=https%3A%2F%2Ft1.daumcdn.net%2Fnews%2F201711%2F14%2Fspotvnews%2F20171114074835258xafh.jpg\", \"type\": \"img\"}, \"desc\": {\"href\": \"http://v.sports.media.daum.net/v/20171114074835813\", \"text\": \"\uc120\ub3d9\uc5f4 \uc544\uc2dc\uc544\ucc54\ud53c\uc5b8\uc2ed\uc2dc\ub9ac\uc988 2017 \uc57c\uad6c \ub300\ud45c \ud300 \uac10\ub3c5..\", \"type\": \"text\"}, \"title\": {\"href\": \"http://v.sports.media.daum.net/v/20171114074835813\", \"text\": \"\uac10\ub3c5\ub3c4 \uc120\uc218\ub3c4 \\\"\uccab \uacfc\uc81c\ub294 \ub3c4\ucf54\ub3d4 \uc801\uc751\\\"\", \"type\": \"text\"}}, {\"img\": {\"src\": \"http://t1.daumcdn.net/thumb/F155x100ht.u/?fname=https%3A%2F%2Ft1.daumcdn.net%2Fnews%2F201711%2F14%2FSpoChosun%2F20171114061110471nndi.jpg\", \"type\": \"img\"}, \"desc\": {\"href\": \"http://v.sports.media.daum.net/v/20171114061111665\", \"text\": \"'\uc544\uc2dc\uc544 \ud504\ub85c\uc57c\uad6c \ucc54\ud53c\uc5b8\uc2ed(APBC) 2017' \uad6d\uac00\ub300..\", \"type\": \"text\"}, \"title\": {\"href\": \"http://v.sports.media.daum.net/v/20171114061111665\", \"text\": \"'APBC \uc548\ubc29\ub9c8\ub2d8' \ud55c\uc2b9\ud0dd \\\"\uc6b0\ub9ac \ud22c\uc218\ub4e4\uc5d0 \uc9d1\uc911\ud558\uaca0\ub2e4\\\"\", \"type\": \"text\"}}, {\"img\": {\"src\": \"http://t1.daumcdn.net/thumb/F155x100ht.u/?fname=https%3A%2F%2Ft1.daumcdn.net%2Fnews%2F201711%2F14%2Fpoctan%2F20171114072048228bxgm.jpg\", \"type\": \"img\"}, \"desc\": {\"href\": \"http://v.sports.media.daum.net/v/20171114072048354\", \"text\": \"\uc120\ub3d9\ub82c\ud638\uac00 '\uacb0\uc804\uc758 \ub545' \uc77c\ubcf8 \ub3c4\ucfc4\ub85c \ub5a0\ub09c\ub2e4. \uc120\ub3d9\ub82c ..\", \"type\": \"text\"}, \"title\": {\"href\": \"http://v.sports.media.daum.net/v/20171114072048354\", \"text\": \"'\u65e5 \ucd9c\uad6d' \uc120\ub3d9\ub82c \uac10\ub3c5, \\\"\uc120\uc218\ub4e4 \uc758\uc695\uc801\uc73c\ub85c \uc900\ube44 \uc798\ud588\ub2e4\\\"\", \"type\": \"text\"}}]", "api_id": 16}];
    
    widgetData = [];
    for(var i in data) {
        var a = data[i];
        a = JSON.parse(a.data);
        widgetData.push(a);

    }
    console.log(widgetData);
    $('.grid-stack').gridstack();
    var gridstack = $('.grid-stack').data("gridstack");
    $.when(
      $.ajax({
          "url": "html/templates.html",
          "dataType": "html"
      })).done(function(data){
            var html = $(data);
            html.filter("script").each(function(i, script) {
                if(script.type=="text/x-handlebars-tpl") {
                    templates[script.id] = Handlebars.compile(script.innerHTML);
                } else if(script.type=="text/x-handlebars-ptl") {
                    Handlebars.registerPartial(script.id, script.innerHTML);
                }
            });

            // Test Widget Script
            // testData[3] = testData[2];
            // testData[4] = testData[2];
            // widgetData[3] = widgetData[2];
            // widgetData[4] = widgetData[2];
            for(var i = 0 ; i < testWidgets.length; i++) {
                //addWidget(testWidgets[i], testData[i]);    
                addWidget(testWidgets[i], widgetData[i]);
            }

    });
      disableEdit();

    // var sse = new EventSource("http://172.30.1.23:5000/inspects");
    // sse.onmessage = function(message){
        
        // var widgets = message.widgets;

        // widgets[0] = $.extend(true, {}, widgets[0], {
        //     // additional props
        //     "props_json": {
        //         "bound": {
        //             "x": 0,
        //             "y": 0,
        //             "width": 9,
        //             "height": 4
        //         },
        //         "border-top-color": "#00a65a"
        //     }
        // })
        // widgets[1] = $.extend(true, {}, widgets[1], {
        //     // additional props
        //     "props_json": {
        //         "bound": {
        //             "x": 0,
        //             "y": 0,
        //             "width": 9,
        //             "height": 4
        //         },
        //         "border-top-color": "#00a65a"
        //     }
        // })
        // widgets[2] = $.extend(true, {}, widgets[2], {
        //     // additional props
        //     "props_json": {
        //         "bound": {
        //             "x": 0,
        //             "y": 0,
        //             "width": 9,
        //             "height": 4
        //         },
        //         "border-top-color": "#00a65a"
        //     }
        // })
    // }
    // sse.close();

    

      // $("#manageApiModal .modal-body .nav").hide();
    
    bindEvent();
    

    // TODO - next/prev button
});