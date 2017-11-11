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
           "paging":"newline"
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
           "paging":"newline"
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
    "api_name": "news",
    "api_user":"admin",
    "caption": "Daum 뉴스",
    "description": "desc",
    "mapping_json": {
       "main_field":{
          "api_path":"img",
          "type":"img",
          "floating":{
             "api_path":"floatMsg",
             "position":"bottom",
             "style":{
               "text-align":"left",
               "max_line":1,
               "font-size":12,
               "font-color":"0x000000"
            }
          }
       },
       "fields_position": "bottom",
       "fields":[{
             "api_path":"article1",
             "style":{
               "text-align":"center",
               "font-size":"10",
               "font-color":"0x000000",
               "background-color":"0xffffff"
             }
          }, {
             "api_path":"article2",
             "style":{
               "text-align":"center",
               "font-size":"10",
               "font-color":"0x000000",
               "background-color":"0xffffff"
             }
          }, {
             "api_path":"article3",
             "style":{
               "text-align":"center",
               "font-size":"10",
               "font-color":"0x000000",
               "background-color":"0xffffff"
             }
          }, {
             "api_path":"article4",
             "style":{
               "text-align":"center",
               "font-size":"10",
               "font-color":"0x000000",
               "background-color":"0xffffff"
             }
          }
       ]
    },
    "props_json": {
        "repeats": {
           "start_index":0,
           "repeat_cnt":10,
           "paging":"newline"
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
}], [ /* Composite data */ {
   "img": {
      "type": "img",
      "src": "img/head-article-1.jpg"
   }, "article1" : {
      "type": "text",
      "text": "文대통령 \"APEC 정신 강화돼야\" 아·태 기업인 만나 다자외교...",
      "href": "http://v.media.daum.net/v/20171110191651647"
   }, "article2": {
      "type": "text",
      "text": "文대통령 \"디지털 경제, 계층간 격차 해소 기회로 활용...",
      "href": "http://v.media.daum.net/v/20171110192510786"  
   }, "article3": {
      "type": "text",
      "text": "11일 韓·中 정상회담.. '경제 복원' 합의 주목",
      "href": "http://v.media.daum.net/v/20171110184330161"
   }, "article4": {
      "type": "text",
      "text": "文대통령, 내일 시진핑 만난다..APEC에서는 \"공평한...",
      "href": "http://v.media.daum.net/v/20171110183106970"
   }
}, {
   "img": {
      "type": "img",
      "src": "img/head-article-1.jpg"
   }, "article1" : {
      "type": "text",
      "text": "文대통령 \"APEC 정신 강화돼야\" 아·태 기업인 만나 다자외교...",
      "href": "http://v.media.daum.net/v/20171110191651647"
   }, "article2": {
      "type": "text",
      "text": "文대통령 \"디지털 경제, 계층간 격차 해소 기회로 활용...",
      "href": "http://v.media.daum.net/v/20171110192510786"  
   }, "article3": {
      "type": "text",
      "text": "11일 韓·中 정상회담.. '경제 복원' 합의 주목",
      "href": "http://v.media.daum.net/v/20171110184330161"
   }, "article4": {
      "type": "text",
      "text": "文대통령, 내일 시진핑 만난다..APEC에서는 \"공평한...",
      "href": "http://v.media.daum.net/v/20171110183106970"
   }
}, {
   "img": {
      "type": "img",
      "src": "img/head-article-1.jpg"
   }, "article1" : {
      "type": "text",
      "text": "文대통령 \"APEC 정신 강화돼야\" 아·태 기업인 만나 다자외교...",
      "href": "http://v.media.daum.net/v/20171110191651647"
   }, "article2": {
      "type": "text",
      "text": "文대통령 \"디지털 경제, 계층간 격차 해소 기회로 활용...",
      "href": "http://v.media.daum.net/v/20171110192510786"  
   }, "article3": {
      "type": "text",
      "text": "11일 韓·中 정상회담.. '경제 복원' 합의 주목",
      "href": "http://v.media.daum.net/v/20171110184330161"
   }, "article4": {
      "type": "text",
      "text": "文대통령, 내일 시진핑 만난다..APEC에서는 \"공평한...",
      "href": "http://v.media.daum.net/v/20171110183106970"
   }
}, {
   "img": {
      "type": "img",
      "src": "img/head-article-1.jpg"
   }, "article1" : {
      "type": "text",
      "text": "文대통령 \"APEC 정신 강화돼야\" 아·태 기업인 만나 다자외교...",
      "href": "http://v.media.daum.net/v/20171110191651647"
   }, "article2": {
      "type": "text",
      "text": "文대통령 \"디지털 경제, 계층간 격차 해소 기회로 활용...",
      "href": "http://v.media.daum.net/v/20171110192510786"  
   }, "article3": {
      "type": "text",
      "text": "11일 韓·中 정상회담.. '경제 복원' 합의 주목",
      "href": "http://v.media.daum.net/v/20171110184330161"
   }, "article4": {
      "type": "text",
      "text": "文대통령, 내일 시진핑 만난다..APEC에서는 \"공평한...",
      "href": "http://v.media.daum.net/v/20171110183106970"
   }
}]];


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
