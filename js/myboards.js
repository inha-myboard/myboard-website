 var MYBOARD_HOST = "http://myboards.ml";
//var MYBOARD_HOST = "http://local.myboards.ml";

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

// 대시보드 리스트 관리 활성화
function enableDashManage() {
    $(".dash").on("mouseover", function(){
        $(".dash-handler", "#" + this.id).show();
    });
    $(".dash").on("mouseout", function(){
        $(".dash-handler", "#" + this.id).hide();
    });

    $("#addDashboard").on("click", function(){
        makeInputBox();
        
    });

    $("#manageDashboard", "ul.nav").hide();
    $("#saveDashboard", "ul.nav").show();
    $("#addDashboard", "ul.nav").show();

    $("i", "li.dash").on("click", function(){
        $("#selectIconModal").modal("show");
    });


    // panel drag & drop
    jQuery(function($) {
        var dashList = $('#dashboardList');

        dashList.sortable({
            handle: '.dash-handler',
            update: function() {
                $('.dash', dashList).each(function(index, elem) {
                    var $listItem = $(elem),
                        newIndex = $listItem.index();
                });
            }
        })
    });
}

// 대시보드 리스트 관리 비활성화
function disableDashManage() {
    $(".dash-handler", "li.dash").hide();
    $("#manageDashboard", "ul.nav").show();
    $("#saveDashboard", "ul.nav").hide();
    $("#addDashboard", "ul.nav").hide();
    $("#newDash", "ul.nav").remove();

    $("#addDashboard").unbind("click");
    $(".dash").unbind("mouseover mouseout");
    $("i", "li.dash").unbind("click");
}

// 편집중인 보드 전체저장
function saveBoard() {

}

// 대시보드 리스트 저장
function saveList() {

}

// 대시보드 추가 input box 생성
function makeInputBox() {
    $("#addDashboard").unbind("click");
    $(".dash").unbind("mouseover mouseout");

    var inboxEL = templates["sidebar-inputbox"]();
    $(inboxEL).appendTo($("#dashboardList"));

    $("#dashName").on("keypress", function(event){
        if (event.keyCode == 13) {
            var value = $(this).val();
            var icon = $(this).parent().children("i").attr("class");

            $("#newDash").remove();
            var dashEL = templates["sidebar-dashboard"]({
                "elements": [{
                    "id": "4",
                    "icon": icon,
                    "name": value
                }]
            });
            $(dashEL).appendTo($("#dashboardList"));

            $("#addDashboard").on("click", function(){
                makeInputBox();
            });
        }
    });
}

// 아이콘 선택창 로딩
function onShowSelectIconModal(name) {
    $(".pe-icon").on("click", function(){
        var icon = $(this).attr("class");

    });
}

// 위젯 삭제
function removeWidget() {

}

// API 관리창 로딩
function onShowManageWidgetModal() {
    $.ajax({
        "url": MYBOARD_HOST + "/widgets",
        "success": function(data) {
            var tableEl = templates["table-manage-widget"](data);
            $("#manageWidgetTable").html(tableEl);
        }
    });
    $("#deleteWidgetButton").addClass("disabled");
}

function onShowAddWidgetModal() {
    // var testApiJson = {"type":"static","body_selector":"html > body > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > ul:nth-child(4) > li","segments":[{"selector":"a:nth-child(1) > span:nth-child(1)","name":"rank"},{"selector":"a:nth-child(1) > span:nth-child(2)","name":"keyword"}]};
    var testApiJson = {"type":"static","body_selector":"html > body > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > ul:nth-child(4) > li","segments":[{"selector":"a:nth-child(1) > span:nth-child(1)","name":"rank"},{"selector":"a:nth-child(1) > span:nth-child(2)","name":"keyword"},{"selector":"a:nth-child(1) > span:nth-child(2)","name":"keyword2"},{"selector":"a:nth-child(1) > span:nth-child(2)","name":"keyword3"},{"selector":"a:nth-child(1) > span:nth-child(2)","name":"keyword4"}]};
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
            widgetJson.mapping_json.fields_position= "right";
        } else if(widgetType == "compositeB") {
            widgetJson.mapping_json.fields_position= "left";
        } else if(widgetType == "compositeC") {
            widgetJson.mapping_json.fields_position= "down";
        }
        // main field
        widgetJson.mapping_json.main_field = {
            "api_path": apiJson.segments[0].name,
            "style": {
            }
        };
        // sub fields
        if(apiJson.segments.length > 1) {
            for(var i=1; i<apiJson.segments.length;i++) {
                var segment = apiJson.segments[i];
                widgetJson.mapping_json.fields.push({
                    "api_path": segment.name,
                    "style": {
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
        if(!$("#widgetName").val()) {
            return "Input widget name";
        }
        var widgetJson = addWidgetData.widgetJson;
        widgetJson.caption = $("#widgetName").val();
        if($("#singleHeaderCheck").is(":checked")) {
            widgetJson.mapping_json.headers = [];
            $("#singleHeaderProps input[type='text']").each(function(i, input){
                widgetJson.mapping_json.headers.push({
                    caption: input.value
                });
            });
        } else {
            delete widgetJson.mapping_json.headers;
        }
    }
}

// 위젯추가 스텝넘기고나서
function onShowStep(id) {
    if(id == "step2") {
        addWidgetData.apiJson = JSON.parse($("#apiJsonText").val());
        addWidgetData.type = null;
    } else if(id == "step3") {
        var widgetJson = convertApiToWidgetJson(addWidgetData.apiJson, addWidgetData.type);
        addWidgetData.widgetJson = widgetJson;
        var widgetMappingEl = templates["widget-mapping-" + widgetJson.type](widgetJson);
        var segmentsMappingEl = templates["segments-mapping"](addWidgetData.apiJson);
        $("#mappingTable").html(widgetMappingEl);
        $("#mappingSegments").html(segmentsMappingEl);
        $("#mappingTable .segment").each(function(){
            var fieldIndex = $(this).data("field");
            if(fieldIndex == "main") {
                $(this).data("segment", widgetJson.mapping_json.main_field);
            } else {
                $(this).data("segment", widgetJson.mapping_json.fields[fieldIndex]);
            }
        });
        if(widgetJson.type == "single") {
            $("#widgetProps").html(templates['single-props'](widgetJson));
        } else if(widgetJson.type == "composite") {
            $("#widgetProps").html(templates['composite-props'](widgetJson));
        }
        $("#mappingTable .segment:eq(0)").click();
    } else if(id == "step4") {
        console.log(addWidgetData);
        $("#previewWidget").html(templates['widget-wrapper']({
            widget: addWidgetData.widgetJson,
            data: [{
                "rank": {"type":"text", "text":"1"}, "keyword": {"type":"text", "text":"asdasdasd"}, "keyword2": {"type":"text", "text":"asdasdasd"}, "keyword3": {"type":"text", "text":"asdasdasd"}, "keyword4": {"type":"text", "text":"asdasdasd"}
            },{
                "rank": {"type":"text", "text":"1"}, "keyword": {"type":"text", "text":"asdasdasd"}, "keyword2": {"type":"text", "text":"asdasdasd"}, "keyword3": {"type":"text", "text":"asdasdasd"}, "keyword4": {"type":"text", "text":"asdasdasd"}
            },{
                "rank": {"type":"text", "text":"1"}, "keyword": {"type":"text", "text":"asdasdasd"}, "keyword2": {"type":"text", "text":"asdasdasd"}, "keyword3": {"type":"text", "text":"asdasdasd"}, "keyword4": {"type":"text", "text":"asdasdasd"}
            },{
                "rank": {"type":"text", "text":"1"}, "keyword": {"type":"text", "text":"asdasdasd"}, "keyword2": {"type":"text", "text":"asdasdasd"}, "keyword3": {"type":"text", "text":"asdasdasd"}, "keyword4": {"type":"text", "text":"asdasdasd"}
            },{
                "rank": {"type":"text", "text":"1"}, "keyword": {"type":"text", "text":"asdasdasd"}, "keyword2": {"type":"text", "text":"asdasdasd"}, "keyword3": {"type":"text", "text":"asdasdasd"}, "keyword4": {"type":"text", "text":"asdasdasd"}
            },{
                "rank": {"type":"text", "text":"1"}, "keyword": {"type":"text", "text":"asdasdasd"}, "keyword2": {"type":"text", "text":"asdasdasd"}, "keyword3": {"type":"text", "text":"asdasdasd"}, "keyword4": {"type":"text", "text":"asdasdasd"}
            },{
                "rank": {"type":"text", "text":"1"}, "keyword": {"type":"text", "text":"asdasdasd"}, "keyword2": {"type":"text", "text":"asdasdasd"}, "keyword3": {"type":"text", "text":"asdasdasd"}, "keyword4": {"type":"text", "text":"asdasdasd"}
            },{
                "rank": {"type":"text", "text":"1"}, "keyword": {"type":"text", "text":"asdasdasd"}, "keyword2": {"type":"text", "text":"asdasdasd"}, "keyword3": {"type":"text", "text":"asdasdasd"}, "keyword4": {"type":"text", "text":"asdasdasd"}
            },{
                "rank": {"type":"text", "text":"1"}, "keyword": {"type":"text", "text":"asdasdasd"}, "keyword2": {"type":"text", "text":"asdasdasd"}, "keyword3": {"type":"text", "text":"asdasdasd"}, "keyword4": {"type":"text", "text":"asdasdasd"}
            }]
        }));
        $("#previewWidget .box-body").css("position", "static");
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

    // 대시보드 리스트 관리
    $("#manageDashboard").on("click", function(){
        enableDashManage();
    });
    $("#saveDashboard").on("click", function(){
        saveList();
        disableDashManage();
    });
    
    $("#selectIconModal").on("show.bs.modal", function() {
        console.log("$(this) :: " + $(this));
        console.log("$(this).parent() :: " + $(this).parent());
        console.log("$(this).parent().chileren('p') :: " + $(this).parent().children("p"));
        var name = $(this).parent().children("p").text();
        onShowSelectIconModal(name);
    });
    $('#selectIconModal').on('hidden.bs.modal', function () {
        $("#selectIcon", "div.modal-content").show();
        $("#previewIcon", "div.modal-content").hide();
    });
    $("#gotoIconList").on("click", function() {
        $("#selectIcon", "div.modal-content").show();
        $("#previewIcon", "div.modal-content").hide();
    });

    // 위젯 관리
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
    });

    $("#finishButton").on("click", function(){
        console.log(addWidgetData);
        // Add API , Add Widget, 
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
        var segmentData = $(this).data("segment");
        mappingSegmentData.selectedSegment = this;
        $("#mappingTable .segment").removeClass("selected");
        $(this).addClass("selected");
        $("#mappingSegments .mapping-segment").removeClass("selected");
        $("#mappingSegments .mapping-segment[data-segment='"+segmentData.api_path+"']").addClass("selected");
        if($(this).is(".main-field")) {
            $("#segmentsProps").hide();
        } else {
            $("#segmentsProps").show();
        }
        var segmentsPropsSelects = $("#segmentsProps select");
        segmentsPropsSelects.each(function(i, selectEl){
            selectEl = $(selectEl);
            var key = selectEl[0].name;
            if(segmentData.style[key] && selectEl.find("[value='"+segmentData.style[key]+"']").size() > 0) {
                selectEl.val(segmentData.style[key]);
            } else {
                selectEl.val(selectEl.find(":eq(0)").val());
            }
        });
    });

    // Mapping segment
    $("body").on("click", "#mappingSegments .mapping-segment", function(e){
        if(!mappingSegmentData.selectedSegment)
            return false;
        $("#mappingSegments .mapping-segment").removeClass("selected");
        $(this).addClass("selected");
        var selectedSegment = $(this).data("segment");
        var segmentData = $(mappingSegmentData.selectedSegment).data("segment");
        segmentData["api_path"] = selectedSegment;
        $(mappingSegmentData.selectedSegment).text(selectedSegment);
    });
    
    // Mapping segment
    $("body").on("change", "#segmentsProps select", function(e){
        if(!mappingSegmentData.selectedSegment)
            return false;
        var selectedProp = this.name;
        var selectedValue = this.value;
        var segmentData = $(mappingSegmentData.selectedSegment).data("segment");
        segmentData["style"][selectedProp] = selectedValue;
        $(mappingSegmentData.selectedSegment).css(selectedProp, selectedValue);
    });
    
    // Widget management
    $("body").on("click", "#widgetTable .widget-row", function(e){
        $("#widgetTable .widget-row").removeClass("selected");
        $(this).addClass("selected");
        $("#deleteWidgetButton").removeClass("disabled");
        widgetTableData.selectedWidget = this;
    });

    $("#deleteWidgetButton").on("click", function(){
        alert(widgetTableData.selectedWidget);
    })
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

var widgetTableData = {
    "selectedWidget": ""
}

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

            //$("#addWidgetModal").modal("show");
            //$("#nextButton").click();
            //addWidgetData.type="single";


            // 대시보드 리스트 생성
            var dashEL = templates["sidebar-dashboard"](dashlist);
            $("#dashboardList").html(dashEL);

            // 아이콘 모달 생성
            var iconEL = templates["icon-elements"](iconlist);
            $("#iconList").html(iconEL);
    });

      // $("#manageApiModal .modal-body .nav").hide();
    
    bindEvent();
    disableEdit();
    disableDashManage();
});