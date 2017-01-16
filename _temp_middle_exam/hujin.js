/*
기능 완성됐음.

start 함수는 좀더 나눌 수 있어보임.

이런코드는 변수에 담아둬도 좋을 거 같음.
data[1].length

autoCompleteWrap 변수가 하나이상 사용되고 있는데, 인자를 잘 넘겨받아 사용하면 줄일 수 있어보임.
함수->함수->함수가 아니고 중간에 컨트롤러 역할의 함수를 두면 좋을 듯.
예를들어 writeRecentContent  함수가 불리는 관계가 추적하기 어렵다. 중간에 전체흐름을 한눈에 볼 수 있는 방법은 없을까?

selectWord2 라는 이름은 별로임.

if 문이 중첩되어 있다면 줄이려고 노력하기. 

함수가 나눠진건 규모가 좋음.

함수에서 데이터를 분리하는게 좋겠음. 데이터는 객체로 보관할 수도 있음. 

객체지향으로 개선하는 걸 마지막으로 해보기

*/
/*
1. 키보드 이벤트가 발생하는 순간 - clear-query 영역 노출 /
동시에 해당 키워드에 해당하는 json파일과 ajax통신 - 해당 내용을 하단 영역에 내용으로 추가 + localstorage에 저장(저장되었으면 불러오기)

2. go click event = 해당 키워드를 localstorage에 저장

3. input영역 click event = 하단 리스트 노출 - localstorage에 정보가 있으면 리스트에 노출
3-1. 하단 리스트가 열려있는 상태에서 다른 영역을 클릭하면 리스트 레이ㅓ가 닫힘
3-2. list에 있는 단어를 클릭 event = 하단의 리스트 레이어는 닫히고 + input 영역에 text 추가
*/

document.addEventListener("DOMContentLoaded", start, false);

function start() {
  var search = document.querySelector(".input-field");
  var goBtn = document.querySelector(".button-wrap");

  search.addEventListener("click", showRecentSearchItems, false);
  search.addEventListener("keyup", startInputText, false);
  search.addEventListener("blur", function (evt) {
    evt.preventDefault();
    var recentCompleteWrap = document.querySelector(".recent-word-wrap");
    recentCompleteWrap.style.display = "none";
  }, false)

  goBtn.addEventListener("click", sendSearchResult, false);

  var autoCompleteWrap = document.querySelector(".auto-complete-wrap");

  autoCompleteWrap.addEventListener("click", selectWord2, false);
  function selectWord2(evt) {
    if(evt.target.nodeName === "LI") {
      var search = document.querySelector(".input-field");
      search.value = evt.target.innerText;
    }
    autoCompleteWrap.style.display = "block";
  }
}


// 검색창이 비어있을 때 클릭시 최근 검색어를 보여줌
function showRecentSearchItems(evt) {
  if(evt.target.value) {
    return false;
  }

  var data = localStorage.getItem("recent");
  if(data) {
    goExecRecent(data);
  }
}

// 검색창에 키를 입력했을 때 자동완성 기능 및 검색어를 지울수 있는 UI를 제공
function changeClearQueryBtn(searchBox) {
  var clearQueryBtn = document.querySelector(".clear-query");
  var thisDisplay = clearQueryBtn.style.display;

    if(searchBox.value.length > 0) {
      if(thisDisplay === "none"){
        thisDisplay = "inline-block";
      }
    } else {
      if(thisDisplay === "inline-block") {
        thisDisplay = "none";
      }
    }
  clearQueryBtn.style.display = thisDisplay;
}
function startInputText(evt) {
  var clearQueryBtn = document.querySelector(".clear-query");
  var recentCompleteWrap = document.querySelector(".recent-word-wrap");

  recentCompleteWrap.style.display = "none";
  //clearQueryBtn.style.display = "inline-block";
  changeClearQueryBtn(evt.target);
  // clear-query를 클릭하면 input-field의 값을 모두 지우고 + clear-query의 display속성을 되돌린다.
  clearQueryBtn.addEventListener("click", clearQueryEvt, false);

  // input-field의 내용을 모두 받아옴
  keyupEvent(evt);

}
// word.value로 ajax통신
function keyupEvent(evt) {
  var word = document.querySelector(".input-field").value;
  // console.log(word);

  // input내용을 모두 지운 상태
  if(word === "") {
    clearQueryEvt(evt);
  } else {
    // localStorage에 데이타가 있으면
    var data = localStorage.getItem(word);
    if(data) {
      writeContent(word, data);
    } else {  // 저장된 데이터가 없으면 새로 통신
      ajax(word);
    }
  }
}

function ajax(word) {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function() {
      if(oReq.status === 200) {
        goExec(oReq);
      }
    });
    oReq.open("GET", "./data/" + word + ".json");
    oReq.send();
}

function goExec(oReq) {
    var data = JSON.parse(oReq.responseText);
    var list = "";
    for(var i=0; i<data[1].length; i++) {
      var str = "<li>"+data[1][i]+"</li>";
      list += str;
    }
    writeContent(data[0], list);
}

function writeContent(key, content) {
  var autoCompleteWrap = document.querySelector(".auto-complete-wrap");
  autoCompleteWrap.style.display = "block";

  var autoCompletewords = autoCompleteWrap.childNodes[1];
  autoCompletewords.innerHTML = content;

  localStorage.setItem(key, content);
}

// X버튼 눌렀을 떄 처리
function clearQueryEvt(evt) {
  var autoCompleteWrap = document.querySelector(".auto-complete-wrap");
  autoCompleteWrap.style.display = "none";

  var search = document.querySelector(".input-field");
  search.value = "";

  var clearQueryBtn = document.querySelector(".clear-query");
  clearQueryBtn.style.display = "none";
}

function sendSearchResult(evt) {
  // 버튼 기본 submit 이벤트 방지
  evt.preventDefault();

  var word = document.querySelector("form#search-form input");
  if(word.value !== "") {
    var prev = localStorage.getItem("recent");
    if(prev)
      prev += " " + word.value;
    else
      prev = word.value;
    localStorage.setItem("recent", prev);
  }
  clearQueryEvt();
}

function goExecRecent(words) {
    var data = words.split(" ");
    var list = "";
    for(var i=0; i<data.length; i++) {
      var str = "<li>"+data[i]+"</li>";
      list += str;
    }
    writeRecentContent(list);
}

function writeRecentContent(content) {
  var recentCompleteWrap = document.querySelector(".recent-word-wrap");
  recentCompleteWrap.style.display = "block";

  var recentWords = recentCompleteWrap.childNodes[1];
  recentWords.innerHTML = content;

  recentCompleteWrap.addEventListener("click", selectWord, false);

}

function selectWord(evt) {
  var recentCompleteWrap = document.querySelector(".recent-word-wrap");
  var searchBox = document.querySelector(".input-field");
  recentCompleteWrap.style.display = "none";
  // 다른 영역 클릭하면
  if(evt.target.nodeName === "LI") {
    searchBox.value = evt.target.innerText;
    changeClearQueryBtn(searchBox);
  }
}
