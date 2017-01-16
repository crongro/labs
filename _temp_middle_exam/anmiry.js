/* 
기능의 완성도 높음.
컴포넌트 방식의 개발방법을 알고 있음.
OOP 개념을 잘 알고 있어 모듈단위로 개발하는 방법을 잘 알고 있음.
학습속도가 상당히 빠른 편임
전역변수와 함수를 좀더 줄일 필요가 있겠음.
function을 받아서 이벤트 처리를 하게 한 건 좋았음.
    registClickEvent: function(eventFunc) {
그런데 다른코드에서는 그렇게 처리하지 않는 부분도 있었음.
하나의 컴포넌트로 이를 쉽게 재활용하기 위해서 어떤 부분을 컴포넌트에서 처리하고, 변경이 될 소지가 있는 부분은 어떻게 처리해야 할지 고민하면 좋겠음.
데이터를 코드와 분리한 건 좋음.
함수의 분리가 잘 되다보니 복잡한 코드가 별로 없음.
전체적으로는 범용성 있는 코드가 되도록 고민을 더 하면 좋겠음.
모듈패턴을 찾아서 적용하는 것도 좋겠음.
*/
var className = {
  searchField: ".input-field",
  clear: ".clear-query",
  searchButton: ".button-wrap",
  ul: ".ul-wrap"
}

var listType = {
  auto: "auto-complete",
  recent: "recent-word"
}

/* Search box */
function InputBox() {
  this.eleText = document.querySelector(className.searchField);
  this.clearBtn = new Button(className.clear);
  this.autoList = new KeywordList(listType.auto);
  this.recentList = new KeywordList(listType.recent);
}

InputBox.prototype = {
  init: function() {
    this.eleText.addEventListener("input", this.textOnInput.bind(this), false);
    this.eleText.addEventListener("click", this.textOnClick.bind(this), false);
    this.clearBtn.registClickEvent(clearEvent.bind(this));
  },

  textOnInput: function() {
    var value = this.getValue();
    var list = this.autoList;
    if(this.recentList.getStatus !== "none") {
      this.recentList.setStatus("none");
    }
    if (value === "") {
      list.print(null, list);
      this.clearBtn.eleBtn.style.display = "none"
    } else {
      this.setAutoKeyword(value, list);
      this.clearBtn.eleBtn.style.display = "inline-block";
    }
  },

  textOnClick: function() {
    if (this.getValue() === "") {
      var list = this.recentList;
      var keywords = JSON.parse(localStorage.getItem("recent"));
      this.recentList.print(keywords);
    }
  },

  getValue: function() {
    return this.eleText.value;
  },

  setValue: function(text) {
    this.eleText.value = text;
  },

  setAutoKeyword: function(keyword, list) {
    var result = JSON.parse(localStorage.getItem("search:" + keyword));

    if (result === null) {
      var oReq = new XMLHttpRequest;
      var baseUrl = "./data/";

      oReq.addEventListener("load", (function() {
        result = JSON.parse(oReq.responseText)[1];
        localStorage.setItem("search:" + keyword, JSON.stringify(result));
        list.print(result);
      }).bind(this));
      oReq.open("GET", baseUrl + keyword + ".json");
      oReq.send();
    } else {
      list.print(result);
    }
  }
}

/* Button */
function Button(selector) {
  this.eleBtn = document.querySelector(selector);
}

Button.prototype = {
  registClickEvent: function(eventFunc) {
    this.eleBtn.addEventListener("click", eventFunc, false);
  }
}

/* Search list */
function KeywordList(type) {
  this.listWrap = document.querySelector("." + type + "-wrap");
  this.list = this.listWrap.querySelector(className.ul);
}

KeywordList.prototype = {
  open: function() {
    this.listWrap.style.display = "block";
  },
  close: function() {
    this.listWrap.style.display = "none";
  },

  print: function(keywords) {
    if(keywords !== null) {
      var len = keywords.length;
      this.open();
      var listHTML = "";
      for (var i = 0; i < len; i++) {
          listHTML += "<li>" + keywords[i] + "</li>";
      }
      this.list.innerHTML = listHTML;
      this.setClickEvent();
      } else {
      this.close();
    }
  },

  setClickEvent: function() {
    var listItem = this.list.childNodes;
    var len = listItem.length;
    for (var i = 0; i < len; i++) {
      listItem[i].addEventListener("click", this.listItemOnClick.bind(this), false);
    }
  },

  listItemOnClick: function(evt) {
    var text = evt.target.innerText;
    inputBox.setValue(text);
    this.close();
  },

  getStatus: function() {
    return this.listWrap.style.display;
  },

  setStatus: function(status) {
    this.listWrap.style.display = status;
  }

}

/* Events for buttons */
function clearEvent() {
  this.eleText.value = "";
  this.textOnInput();
}

function saveEvent() {
  var savedData = JSON.parse(localStorage.getItem("recent"));
  var newKeyword = this.eleText.value;

  if (savedData === null) {
    savedData = [];
  }
  if (!savedData.includes(newKeyword))
  savedData.push(newKeyword);

  localStorage.setItem("recent", JSON.stringify(savedData));
}

/* initialization */
document.addEventListener("DOMContentLoaded", setDocument, false);
var inputBox;
var searchBtn;
function setDocument() {
  inputBox = new InputBox;
  inputBox.init();

  searchBtn = new Button(className.searchButton);
  searchBtn.registClickEvent(saveEvent.bind(inputBox));

  document.addEventListener("click", getClickedElement.bind(inputBox), false);

  function getClickedElement(evt) {
    if(evt.target !== this.eleText && this.recentList.listWrap) {
      this.recentList.close();
    }
  }
}
