/*
완성도가 아쉬움. (최근검색어노출 안되고, 레이어 닫히지 않음.

5와 같은 숫자는 별로 안좋읨
줄간격을 두 줄씩 띌 필요 없음.
onload 보다는 addEventListener를 사용하는게 더 좋음.
onkeyup 에 j, ja, jav 와 같은 글자는 너무 전용기능임. 범용적으로 동작되도록 해야 함. 이렇게 하드코딩은 아님.
getElementsByTagName 보다는 querySelector 를 사용학는게 좋겟음.
onkeyup 이 너무 많은 일을 함.
auto-complete-wrap 을 너무 많이 중복해서 선언해서 사용하고 있음. 함수의 인자로 전달할 수는 없을까? 
함수이름은 동사+명사형태로 (이거 안좋음 listAdd)
함수가 전용기능이 아닌 범용성 있게 변경가능하는 걸 마지막으로 시도.
OOP로 전환.
*/

var lastKey = 0; // 최근 키워드가 같이 저장 되는 키값.
var key = 0; // 함수안에서 key값을 1씩 올려주면서 lastkey에 저장됨.


window.onload = function() {

    document.getElementsByTagName("button")[0].disabled = 'true'; // submit buttone diaabled

    var inputBOX = document.querySelector(".input-field");

    inputBOX.onkeyup = function() {

        var keyword = document.querySelector("input").value;


        var clearQuery = document.querySelector(".clear-query");

        clearQuery.style.display = "inline-block";


        if (keyword === "") { //inpux 박스안에 글이 없으면 clearQuery을 숨겨버림

            clearQuery.style.display = "none";
        }

        if (keyword === "j" || keyword === "ja" || keyword === "jav" || keyword === "java") {

            var value = localStorage.getItem(keyword);

            if (!value) ajax(keyword); //localStorage에 정보 없으면 ajax실행
            else insertAutoComplate(value);

        } else {

            document.querySelector(".auto-complete-wrap").style.display = "none";
            document.querySelector('.recent-word-wrap').style.display = "none";

        }

        if (event.keyCode === 13) { //엔터누르면 검색키워도 저장

            key += 1;
            lastKey = key; // key값을 1씩 올려서 lastkey값이 가장 큰 숫자를 갖게 됨.
            localStorage.setItem(lastKey, keyword);

        }

    };
};



document.addEventListener("click", function(event) {

    var recentWordWrap = document.querySelector('.recent-word-wrap');

    var autoCompleteWrap = document.querySelector(".auto-complete-wrap").style.display ;
    //input 박스를 클릭했을때, autoCompleteWrap이 보이는 상태가 아니면  recentWordWrap을 나타냄.
    if (event.target.className === 'input-field' && autoCompleteWrap !== "inline-block") {

        recentWordWrap.style.display = "inline-block";

        var str = "";
        for (var i = 0; i < 5; i++) {

            var value = localStorage.getItem(lastKey - i); //전역변수 lastkey값을 1씩 빼서 저장된 키워드 5개씩 불러냄.

            if (value) {
                str += "<li>" + value + "</li>";
            }
        }


        recentWordWrap.firstElementChild.innerHTML = str; //  recentWordWrap 에 저장된 키워드 삽입.


    }

});



document.addEventListener("click", function(event) {

    var target = event.target;
      //클릭한 타겟이 recent-word-wrap  이 아니고 input-field 가 아니면 recent-word-wrap을 숨김.
    if (target.className !== "recent-word-wrap" && target.className !== 'input-field') {


        if (target.tagName === "LI") { //  recentKeyword list중 클릭하면 해당 keyword가 inputBOX 에 입력됨.

            var recentKeyword = target.innerHTML;
            document.querySelector("input").value = recentKeyword;

        }

        document.querySelector('.recent-word-wrap').style.display = "none";

    }

});




function ajax(keyword) {

    oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function(e) {

        var data = JSON.parse(oReq.responseText);
        listAdd(data, keyword);

    });

    oReq.open("GET", "./data/" + keyword + ".json", false);
    oReq.send();

}



function listAdd(data, keyword) { // list tag를 추가하여 localStorage에 저장

    var str = "";
    for (var i = 0; i < data[1].length; i++) {
        str += "<li>" + data[1][i] + "</li>";
    }

    localStorage.setItem(keyword, str);
    insertAutoComplate(str);

}


function insertAutoComplate(strdata) { //자동완성 기능

    var autoCompleteWrap = document.querySelector('.auto-complete-wrap');

    autoCompleteWrap.firstElementChild.innerHTML = strdata;
    autoCompleteWrap.style.display = "inline-block";
    document.querySelector('.recent-word-wrap').style.display = "none";

}
