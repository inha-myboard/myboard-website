// var MYBOARD_HOST = "http://myboards.ml";
var MYBOARD_HOST = "http://local.myboards.ml";

// 편집모드 활성화
function enableEdit() {
    var gridstack = $('.grid-stack').data("gridstack");
    gridstack.movable(gridstack.container.children('.' + gridstack.opts.itemClass), true);
    gridstack.resizable(gridstack.container.children('.' + gridstack.opts.itemClass), true);
    $(".nav-edit", "ul.nav").show();
    $(".nav-normal", "ul.nav").hide();
    //$(".mfb-component__wrap", "ul.mfb-component--br").show();
}

// 편집모드 비활성화
function disableEdit() {
    var gridstack = $('.grid-stack').data("gridstack");
    gridstack.disable();
    $(".nav-edit", "ul.nav").hide();
    $(".nav-normal", "ul.nav").show();
    //$(".mfb-component__wrap", "ul.mfb-component--br").hide();
}

// 편집중인 보드 전체저장
function saveBoard() {

}

// API 관리창 로딩
function onShowManageApi() {
    $("#manageApiModal .nav a[href='#apiListPane']").tab("show");
    $.ajax({
        "url": MYBOARD_HOST + "/users/api",
        "success": function(data) {
            var tableEl = templates["table-manage-api"](data);
            $("#manageApiTable").html(tableEl);
        }
    });
}

function onShowAddWidgetWizard() {

}

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
    $('#manageApiTable').on('click', '.clickable-row', function(event) {
        $(this).addClass('active').siblings().removeClass('active');
        $("#manageApiTable").data("selectedRow", this);
    });

    $("#manageApiModal").on("show.bs.modal", function(){
        onShowManageApi();
    });
}
// Handlebars templates
var templates = {};

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

            // Test Widget Script
            testData[3] = testData[2];
            testData[4] = testData[2];
            for(var i = 0 ; i < testWidgets.length; i++) {
                addWidget(testWidgets[i], testData[i]);    
            }

    });

      // $("#manageApiModal .modal-body .nav").hide();
    
    bindEvent();
    disableEdit();

    // TODO - next/prev button
});