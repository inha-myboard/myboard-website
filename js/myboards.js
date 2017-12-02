// var MYBOARD_HOST = "http://local.myboards.ml";
var MYBOARD_HOST = "http://api.myboards.ml";

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

function getDashboardsData() {
    return $("#dashboardList li").map(function(i){
        return $.extend({}, $(this).data("data"), {"order_index": i+1});
    }).toArray();
 }

// 대시보드 리스트 관리 활성화
function enableDashManage() {
    $("#manageDashboard", "ul.nav").hide("slow");
    $("#saveDashboard", "ul.nav").show("slow");
    $("#addDashboard", "ul.nav").show("slow");

    // panel drag & drop
    $('#dashboardList').addClass("editing");
    $("#dashboardList").sortable({
        disabled: false,
        start: function(){
            $("#saveDashboard", "ul.nav").hide();
            $("#addDashboard", "ul.nav").hide();
            $("#removeDashboard", "ul.nav").show();
        },
        stop: function(){
            $("#saveDashboard", "ul.nav").show("slow");
            $("#addDashboard", "ul.nav").show("slow");
            $("#removeDashboard", "ul.nav").hide("slow");
        }
    });

    $("#removeDashboard").droppable({
        accept: '#dashboardList > li',
        hoverClass: 'onHover',
        drop: function(event, ui) {
            console.log(ui);
            console.log(ui.draggable);
            ui.draggable.remove();
        }
    });
    
    $("#dashboardList").data("originalData", getDashboardsData());
}

// 대시보드 리스트 관리 비활성화
function disableDashManage() {
    $("#manageDashboard", "ul.nav").show("slow");
    $("#saveDashboard", "ul.nav").hide("slow");
    $("#addDashboard", "ul.nav").hide("slow");
    $('#dashboardList').removeClass("editing");
    $("#newDashboardItem", "ul.nav").remove();
    $("#dashboardList").sortable("disable");
}

// 편집중인 보드 전체저장
function saveBoard() {
    var widgetPosData = serializeWidget();
    $.ajax({
        url: MYBOARD_HOST + "/dashboards/" + dashboardId + "/widgets",
        method: "POST",
        data: JSON.stringify(widgetPosData)
    });
}

// 대시보드 로드
function loadDashboard(id) {
    dashboardId = id;
    disableEdit();
    $.ajax({
        url: MYBOARD_HOST + "/dashboards/" + dashboardId + "/widgets",
        success: function(result) {
            $("#dashboardName").text($("#dashboard_" + id).data("data").name);
            var gridstack = $('.grid-stack').data("gridstack");
            gridstack.removeAll(true);
            for(var i in result) {
                var widgetTemplate = result[i];
                widgetTemplate["mapping_json"] = JSON.parse(widgetTemplate["mapping_json"]);
                widgetTemplate["props_json"] = JSON.parse(widgetTemplate["props_json"]);
                addWidget(widgetTemplate);
            }
            refreshAllWidgetData();
            localStorage.setItem('dashboardId', id);
        }
    });   
}

// 대시보드 리스트 저장
function saveDashboardList() {
    // 편집 시작 전 대시보드 데이터
    var dashboardsOriginalData = $("#dashboardList").data("originalData");
    // 편집 종료시 대시보드 데이터
    var dashboardsData = getDashboardsData();
    var insertList = [];
    var deleteList = [];
    var updateList = [];

    var checkedList = [];
    for(var i in dashboardsData) {
        var dashboardData = dashboardsData[i];
        if(!dashboardData.id) {
            insertList.push(dashboardData);
        } else {
            // 편집시작직후 대시보드 데이터
            for(var j in dashboardsOriginalData) {
                console.log(dashboardsOriginalData[j]);
                var targetDashboardData = dashboardsOriginalData[j];
                // Update
                if(dashboardData.id == targetDashboardData.id) {
                    delete dashboardsOriginalData[j];
                    if(dashboardData.name != targetDashboardData.name || dashboardData.order_index != targetDashboardData.order_index
                        || dashboardData.icon != targetDashboardData.icon) {
                        updateList.push(dashboardData);
                    }
                    break;
                }
            }
        }
    }
    for(var i in dashboardsOriginalData) {
        if(dashboardsOriginalData[i] && dashboardsOriginalData[i].id) {
            deleteList.push(dashboardsOriginalData[i]);
        }
    }

    function ajaxDashboard(method, list) {
        if(list.length == 0) {
            var dummy = $.Deferred();
            dummy.resolve();
            return dummy;
        }
        return $.ajax({
            url: MYBOARD_HOST + "/users/" + loggedUserId + "/dashboards", 
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(list)
        });
    }

    if(deleteList.length > 0) {
        bootbox.confirm({
            title: "Delete Dashboard??",
            message: "Do you want to delete dashboard ? All widgets in dashboard will be deleted and this cannot be undone.",
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> Cancel'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Confirm'
                }
            },
            callback: function (result) {
                if(result) {
                    $.when(ajaxDashboard("POST", insertList),  ajaxDashboard("PUT", updateList), ajaxDashboard("DELETE", deleteList))
                    .then(function(insertedResult, updatedResult, deletedResult){
                        console.log("Saved!");
                        window.location.reload(true);
                    });
                }
            }
        });
    } else if(insertList.length + updateList.length > 0) {
        $.when(ajaxDashboard("POST", insertList),  ajaxDashboard("PUT", updateList))
        .then(function(insertedResult, updatedResult, deletedResult){
            console.log("Saved!");
            window.location.reload(true);
        });
    }
}

// 대시보드 추가 input box 생성
function makeDashboardInputBox() {
    var inboxEL = templates["sidebar-inputbox"]();
    $(inboxEL).appendTo($("#dashboardList")).data("data", {icon: "pe-7s-female", name: ""});

    $("input[id=dashboardInput]").focus();
}

// API 관리창 로딩
function onShowManageWidgetModal() {
    $.ajax({
        "url": MYBOARD_HOST + "/widgets",
        "success": function(results) {
            for(var i in results) {
                var result = results[i];
                if($("#widget_" + result.id).size() > 0) {
                    result["added"] = 1;
                }
            }
            var tableEl = templates["table-manage-widget"](results);
            $("#manageWidgetTable").html(tableEl);
        }
    });
    $("#deleteWidgetButton").addClass("disabled");
}

function onShowAddWidgetModal() {
    // var testApiJson = {"type":"static","body_selector":"html > body > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > ul:nth-child(4) > li","segments":[{"selector":"a:nth-child(1) > span:nth-child(1)","name":"rank"},{"selector":"a:nth-child(1) > span:nth-child(2)","name":"keyword"}]};
    var testApiJson = {"url":"http://www.naver.com", "type":"static","body_selector":"html > body > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > ul:nth-child(4) > li","segments":[{"selector":"a:nth-child(1) > span:nth-child(1)","name":"rank"},{"selector":"a:nth-child(1) > span:nth-child(2)","name":"keyword"},{"selector":"a:nth-child(1) > span:nth-child(2)","name":"keyword2"},{"selector":"a:nth-child(1) > span:nth-child(2)","name":"keyword3"},{"selector":"a:nth-child(1) > span:nth-child(2)","name":"keyword4"}]};
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
    var widget = gridstack.addWidget(widgetEl); // el, x, y, width, height, autoPosition, minWidth, maxWidth, minHeight, maxHeight, id]
    widget.data("template", widgetTemplate);
    widget.data("data", data);
}

// Widget 데이터 적용
function setWidgetData(widget, data) {
    var widgetEl = undefined;
    if(typeof widget == "number") {
        widgetEl = $("#widget_" + widget);
    } else {
        widgetEl = $(widget);
    }
    
    var widgetBody = $(".box-body", widgetEl);
    var widgetTemplate = widgetEl.data("template");
    var newWidgetBody = $(".box-body", templates['widget-wrapper']({widget: widgetTemplate, data: data}));
    widgetBody.replaceWith(newWidgetBody);
    widgetEl.data("data", data);
    if(widgetTemplate.type == "composite" && newWidgetBody.find(".composite:eq(0)").size() > 0) {
        var maxWidth = 0, maxHeight = 0;
        newWidgetBody.find(".composite").each(function(){
            var width = $(this).outerWidth();
            var height = $(this).outerHeight();
            if(maxWidth < width){
                maxWidth = width;
            }
            if(maxHeight < height){
                maxHeight = height;
            }
        });
        newWidgetBody.find(".composite").css("min-width", maxWidth);
        newWidgetBody.find(".composite").css("min-height", maxHeight);
        var fieldPosition =widgetTemplate.mapping_json.fields_position;
        if(fieldPosition == "left" || fieldPosition == "right") {
            newWidgetBody.find(".composite img").css("width", maxWidth * 0.38);
        }  else {
            newWidgetBody.find(".composite img").css("width", maxWidth * 0.88);
        }
    }
}

// 대시보드 Widget 데이터 갱신
function refreshAllWidgetData() {
    $.ajax({
        url: MYBOARD_HOST + "/dashboards/" + dashboardId + "/widgets/data",
        success: function(results){
            for(var i in results) {
                var result = results[i];
                setWidgetData(result.id, JSON.parse(result.data));
            }
        }
    });
}

// 대시보드 Widget 데이터 갱신
function refreshWidgetData(widgetId) {
    $.ajax({
        url: MYBOARD_HOST + "/widgets/" + widgetId + "/data",
        success: function(result){
            setWidgetData(result.id, JSON.parse(result.data));
        }
    });
}

// 대시보드 Widget 위치 직렬화
function serializeWidget() {
    var serializedData = _.map($('.grid-stack > .grid-stack-item:visible'), function (el) {
        el = $(el);
        var node = el.data('_gridstack_node');
        return {
            id: node.el.data("template").id,
            props_json: JSON.stringify({
                bound: {
                    x: node.x,
                    y: node.y,
                    width: node.width,
                    height: node.height,        
                }
            })
        };
    }, this);
    return serializedData;
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
        widgetJson.mapping_json.color = $("#widgetColor").val();
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
        $("#previewLoading").show();
        $("#previewWidget").hide();

        $.ajax({
            url: MYBOARD_HOST + "/inspects",
            method: "POST",
            dataType: "json",
            data: JSON.stringify({
                url: addWidgetData.apiJson["url"],
                api_json: JSON.stringify(addWidgetData.apiJson)
            }),
            success: function(data){
                $("#previewLoading").hide();
                $("#previewWidget").data("template", addWidgetData.widgetJson);
                $("#previewWidget").show();
                $("#previewWidget").html(templates['widget-wrapper']({widget: addWidgetData.widgetJson})); 
                setWidgetData($("#previewWidget"), data);
                $("#previewWidget .box-body").css("position", "static");
                $("#previewWidget .box-body").css("height", "300px");
            }
        });
    }
}

// 이벤트 바인딩
function bindEvent() {
    /* Dashboard */
    $("#editButton").on("click", function(){
        enableEdit();   
    });
    $("#exitButton").on("click", function(){
        loadDashboard(dashboardId);
    });
    $("#saveButton").on("click", function(){
        disableEdit();
        saveBoard();
    });
    $(".grid-stack").on("click", "[data-widget]", function() {
        var gridstack = $('.grid-stack').data("gridstack");
        var tool = $(this).data("widget");
        var widget = $(this).parents(".grid-stack-item");
        if(tool == "remove") {
            gridstack.removeWidget(widget, true);
        }
    });
    $("body").on("click",  "li.dashboard-item", function(){
        if($("#dashboardList").is(".editing"))
            return;
        var dashboard = $("#" + this.id).data("data");
        loadDashboard(dashboard.id);
    });

    // 대시보드 리스트 관리
    $("#manageDashboard").on("click", function(){
        enableDashManage();
    });
    $("#saveDashboard").on("click", function(){
        saveDashboardList();
        disableDashManage();
    });

    $("#dashboardList").parent().on("mouseover", "#dashboardList.editing .dashboard-item", function(){
        if($(this).find("#dashboardEditingInput").size() == 0)
            $(".dash-handler", this).show();
    });

    $("#dashboardList").parent().on("mouseout", "#dashboardList.editing .dashboard-item", function(){
        $(".dash-handler", this).hide();
    });

    // 대시보드 이름수정 클릭
    $("body").on("click", "#dashboardList.editing .dash-name" ,function(e) {
        e.stopPropagation();
        var dashboardLi = $(this).parents("li");
        if(dashboardLi.find("input").size() > 0)
            return;

        var editingInput = $("#dashboardEditingInput");
        if(editingInput.size() > 0) {
            var editingDashboardLi = $(editingInput).parents("li");
            var editingOriginName = editingDashboardLi.data("data")["name"];
            $(".dash-name", editingDashboardLi).text(editingOriginName);
        }

        var originName = dashboardLi.data("data")["name"];
        $(this).text('').append($('<input type="text" class="form-control" id="dashboardEditingInput"/>').val(originName).select());
        dashboardLi.find(".dash-handler").hide();
    });

    // 대시보드 이름수정 입력이벤트
    $("#dashboardList").on("keydown", "#dashboardEditingInput", function(event){
        if (event.keyCode == 13) {
            var value = $(this).val();
            if(!value) {
                alert("Input dashboard name");
                return;
            }
            $(this).parents("li").data("data")["name"] = value;
            $(this).parents("li").find(".dash-handler").show();
            $(this).parent().text(value);
        } else if(event.keyCode == 27) {
            var dashboardLi = $(this).parents("li");
            var name = dashboardLi.data("data")["name"];
            $(".dash-name", dashboardLi).text(name);
            dashboardLi.find(".dash-handler").show();
        }
    });
    
    // 대시보드 추가 입력이벤트
    $("#dashboardList").on("keydown", "#dashboardInput", function(event){
        if (event.keyCode == 13) {
            var value = $(this).val();
            if(!value) {
                alert("Input dashboard name");
                return;
            }
            var icon = $(this).parent().children("i").attr("class");

            $("#newDashboardItem").remove();
            var dashboardData = {
                    "icon": icon,
                    "name": value
            };
            var dashboardEl = templates["sidebar-dashboard"](dashboardData);
            $(dashboardEl).appendTo($("#dashboardList")).data("data", dashboardData);
        } else if(event.keyCode == 27) {
            $("#newDashboardItem").remove();
        }
    });

    $("#addDashboard").on("click", function(){
        if($("#dashboardInput").size() > 0)
            return;
        makeDashboardInputBox();
    });

    // 위젯 관리
    $('#manageWidgetTable').on('click', '.clickable-row', function(event) {
        $(this).addClass('active').siblings().removeClass('active');
        $("#manageWidgetTable").data("selectedRow", this);
    });

    $('#manageWidgetTable').on('click', '.widget-plus-btn', function(event){
        var widgetId = $(this).data("id");
        var self = this;
        $.ajax({
            url: MYBOARD_HOST + "/widgets/" + widgetId,
            success: function(widgetTemplate) {
                widgetTemplate.mapping_json = JSON.parse(widgetTemplate.mapping_json);
                addWidget(widgetTemplate);
                refreshWidgetData(widgetId);
                enableEdit();
                $(self).css("visibility", "hidden");
            }
        });
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
        $.ajax({
            url: MYBOARD_HOST + "/apis",
            data: JSON.stringify({
                url: addWidgetData.apiJson["url"],
                user_id: loggedUserId,
                type: addWidgetData.apiJson.type,
                name: addWidgetData.widgetJson.caption,
                caption: addWidgetData.widgetJson.caption,
                description: addWidgetData.widgetJson.caption,
                api_json: JSON.stringify({
                    "body_selector": addWidgetData.apiJson["body_selector"],
                    "segments": addWidgetData.apiJson["segments"]
                })
            }),
            method: "POST",
            success: function(result) {
                addWidgetData.widgetJson.api_id = result.id;
                addWidgetData.widgetJson.mapping_json = JSON.stringify(addWidgetData.widgetJson.mapping_json);
                addWidgetData.widgetJson.description = addWidgetData.widgetJson.caption;
                addWidgetData.widgetJson.user_id = loggedUserId;
                $.ajax({
                    url: MYBOARD_HOST + "/widgets",
                    method: "POST",
                    data: JSON.stringify(addWidgetData.widgetJson),
                    success: function() {
                        bootbox.alert("Finish!");
                        $("#addWidgetModal").modal("hide");
                        $("#manageWidgetModal").modal("show");
                    }
                });        
            }
        });
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
        if(!widgetTableData.selectedWidget)
            return;
        var id = $(widgetTableData.selectedWidget).data("id");
        bootbox.confirm("Are you sure ?", function(result) {
            if(result) {
                $.ajax({
                    url: MYBOARD_HOST + "/widgets/" + id,
                    method: "DELETE",
                    success: function() {
                        var gridstack = $('.grid-stack').data("gridstack");
                        gridstack.removeWidget($("#widget_" + id), true);
                        onShowManageWidgetModal();
                    }
                });
            }
        });
        
    })

    $("body").on("click",  "#dashboardList.editing li.dashboard-item a>i", function(e){
        e.stopPropagation();
        $("#selectIconModal").data("selectedDashboard", $(this));
        $("#selectIconModal").modal("show");
    });

    // Dashboard Modal Icon Event
    $("#selectIconModal").on("click", ".pe-icon", function(){
        var iconClass = $(this).attr("class");
        var peIconClass = iconClass.split(" ")[1];
        var selectedDashboard = $("#selectIconModal").data("selectedDashboard");
        selectedDashboard.attr("class", peIconClass);
        selectedDashboard.parents("li").data("data")["icon"] = peIconClass;
        $("#selectIconModal").modal("hide");
    });

    setInterval(function(){
        refreshAllWidgetData();
    }, refreshDataTime);
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

// Widget Manage Modal
var widgetTableData = {
    "selectedWidget": ""
}

// Current Dashboard
var dashboardId = undefined;
var loggedUserId = 0;
var refreshDataTime = 300000;

$(document).on("ready", function(){
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

            //$("#addWidgetModal").modal("show");
            //$("#nextButton").click();
            //addWidgetData.type="single";

            $.ajax({
                url: MYBOARD_HOST + "/users/" + loggedUserId + "/dashboards",
                dataType: "json",
                success: function(dashboards) {
                    dashboards = _.sortBy(dashboards, function(dashboard) {
                        return dashboard.order_index;
                    });
                    // 대시보드 리스트 생성
                    for(var i in dashboards) {
                        var dashboardEl = templates["sidebar-dashboard"](dashboards[i]);
                        $(dashboardEl).appendTo($("#dashboardList")).data("data", dashboards[i]);
                    }
                    var dashboardId = localStorage.getItem('dashboardId');
                    if(dashboardId) {
                        loadDashboard(dashboardId);
                    } else {
                        var firstDashboardLi = $("#dashboardList li:eq(0)");
                        if(firstDashboardLi.size() == 0) {
                            console.log("Empty board");
                        } else {
                            var id = firstDashboardLi.data("data")["id"];
                            loadDashboard(id);
                        }
                    }
                }
            });

            // 아이콘 모달 생성
            var iconEL = templates["icon-elements"](iconlist);
            $("#iconList").html(iconEL);
    });

      // $("#manageApiModal .modal-body .nav").hide();
    
    bindEvent();
    disableEdit();
    //disableDashManage();
});