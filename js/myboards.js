// var MYBOARD_HOST = "http://myboards.ml";
var MYBOARD_HOST = "http://local.myboards.ml";

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
    var testApiJson = {"type":"static","body_selector":"html > body > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > ul:nth-child(4) > li","segments":[{"selector":"a:nth-child(1) > span:nth-child(1)","name":"rank"},{"selector":"a:nth-child(1) > span:nth-child(2)","name":"keyword"}]};

    $("#addWidgetModal .nav > li:eq(0) a").tab("show");
    $("#prevButton").hide();
    $("#finishButton").addClass("hidden");
    $("#nextButton").show();
    $("#apiJsonText").val(JSON.stringify(testApiJson));
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

// API JSON 검사
function validApiJson() {
    if(addWidgetData.apiJson) {
        if(addWidgetData.apiJson["body_selector"] && addWidgetData.apiJson["segments"] && addWidgetData.apiJson["segments"] )
            return true;
    }

    return false;
}

// API JSON 을 Widget JSON로 변환
function convertApiToWidgetJson(apiJson, widgetType) {
    var widgetJson = null;
    if(widgetType == "single") {
        widgetJson = {
            mapping_json: {
                headers: [],
                fields: []
            },
            props_json: {
                bound: {}
            }
        };
        widgetJson.type = "single";
        for(var i in apiJson.segments) {
            var segment = apiJson.segments[i];
            widgetJson.mapping_json.headers.push({
                "caption": segment.name,
                "width": ""
            });
            widgetJson.mapping_json.fields.push({
                "api_path": segment.name,
                "style": {
                    "text-align":"left",
                    "font-size":"12px",
                    "color":"#000000",
                    "background-color":"#ffffff"
                }
            });
        }
    } else if(widgetType.startsWith("composite")) {
        widgetJson = {
            mapping_json: {
                fields_position: "",
                main_field: {},
                fields: []
            },
            props_json: {
                bound: {}
            }
        };
        widgetJson.type = "composite";
        if(widgetType == "compositeA") {
            wigetJson.mapping_json.fields_position= "right";
        } else if(widgetType == "compositeB") {
            wigetJson.mapping_json.fields_position= "left";
        } else if(widgetType == "compositeC") {
            wigetJson.mapping_json.fields_position= "down";
        }
        // main field
        widgetJson.mapping_json.main_field = {
            "api_path": apiJson.segments[0].name,
            "style": {
                "text-align":"left",
                "font-size":"12px",
                "color":"#000000",
                "background-color":"#ffffff"
            }
        };
        // sub fields
        if(apiJson.segments.length > 1) {
            for(var i=1; i<apiJson.segments.length;i++) {
                var segment = apiJson.segments[i];
                widgetJson.mapping_json.fields.push({
                    "api_path": segment.name,
                    "style": {
                        "text-align":"left",
                        "font-size":"12px",
                        "color":"#000000",
                        "background-color":"#ffffff"
                    }
                });
            }    
        }
        
    }

    return widgetJson;
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
        if(!validApiJson()) {
            return "API Json is incorrect. Please check 'body_selector', 'segments', 'url' fields. ";
        }
    } else if(id == "step3") {

    }
}

// 위젯추가 스텝넘기고나서
function onShowStep(id) {
    if(id == "step2") {
        addWidgetData.apiJson = JSON.parse($("#apiJsonText").val());
        addWidgetData.type = null;
    } else if(id == "step3") {
        var widgetJson = convertApiToWidgetJson(addWidgetData.apiJson, addWidgetData.type);
        var widgetMappingEl = templates["widget-mapping-" + widgetJson.type](widgetJson);
        var segmentsMappingEl = templates["segments-mapping"](addWidgetData.apiJson);
        $("#mappingTable").html(widgetMappingEl);
        $("#mappingSegments").html(segmentsMappingEl);
        
        if(widgetJson.type == "single") {
            $("#widgetProps").html(templates['single-props'](widgetJson));
        } else if(widgetJson.type == "composite") {
            $("#widgetProps").html(templates['composite-props'](widgetJson));
        }
    }
}

// 이벤트 바인딩
function bindEvent() {
    /* Dashboard */
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

    /* Showing Modal */
    $("#addWidgetModal").on("show.bs.modal", function(){
        onShowAddWidgetModal();
    });

    $("#manageWidgetModal").on("show.bs.modal", function(){
        onShowManageWidgetModal();
    });

    /* Add Widget Modal */
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
    });

    /*  Add Widget - Step 3*/
    $("body").on("change", "#singleHeaderCheck", function(val){
        if(!$(this).is(":checked")) {
            $("#singleHeaderProps input[type='text']").attr("disabled", "disabled");
        } else {
            $("#singleHeaderProps input[type='text']").attr("disabled", null);
        }
    });

    // Selecting segment
    $("body").on("click", "#mappingTable .segment", function(e){
        var segmentName = $(this).data("segment");
        mappingSegmentData.selectedSegment = segmentName;
        $("#mappingTable .segment").removeClass("selected");
        $(this).addClass("selected");
    });

    // Mapping segment
    $("body").on("click", "#mappingSegments .mapping-segment", function(e){

        $("#mappingTable .segment").removeClass("selected");
        $(this).addClass("selected");
    });
    
}
// Handlebars templates
var templates = {};

// Temporary Widget json
var addWidgetData = {
    "type": "",
    "apiJson": {},
    "widgetJson": {}
};

// Temporary Mapping Segment Data
var mappingSegmentData = {
    "selectedSegment": ""
};

$(document).on("ready", function(){
    // var sse = new EventSource(url);
    // sse.onmessage = function(message){
    //     var data = message.data;
    //     var widgets = message.widgets;

    //     widgets[0] = $.extend(true, {}, widgets[0], {
    //         // additional props
    //         "props_json": {
    //             "bound": {
    //                 "x": 0,
    //                 "y": 0,
    //                 "width": 9,
    //                 "height": 4
    //             },
    //             "border-top-color": "#00a65a"
    //         }
    //     })
    //     widgets[1] = $.extend(true, {}, widgets[1], {
    //         // additional props
    //         "props_json": {
    //             "bound": {
    //                 "x": 0,
    //                 "y": 0,
    //                 "width": 9,
    //                 "height": 4
    //             },
    //             "border-top-color": "#00a65a"
    //         }
    //     })
    //     widgets[2] = $.extend(true, {}, widgets[2], {
    //         // additional props
    //         "props_json": {
    //             "bound": {
    //                 "x": 0,
    //                 "y": 0,
    //                 "width": 9,
    //                 "height": 4
    //             },
    //             "border-top-color": "#00a65a"
    //         }
    //     })
    // }
    // sse.close();
    
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
            testData[3] = testData[2];
            testData[4] = testData[2];
            for(var i = 0 ; i < testWidgets.length; i++) {
                addWidget(testWidgets[i], testData[i]);    
            }

    $("#addWidgetModal").modal("show");
    $("#nextButton").click();
    addWidgetData.type="single";
    });

      // $("#manageApiModal .modal-body .nav").hide();
    
    bindEvent();
    disableEdit();

    // TODO - next/prev button
});