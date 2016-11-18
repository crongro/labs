/* 
좌에서 우측으로 background 와 동시에 width 를 변경하는 로직이 자연스럽지 않다. 
번쩍이는 효과가 있다. 그렇다고 width만 transition 을 하니 이도저도 아니다. 레이어가 나눠서 노출되는 느낌이랄까.
그래서 width를 늘리지 않고 width 를 100%로 채운상태에서 오히려 background 만 변경하는 것이 어떨까 한다. 물론 이것도 껌뻑거리는 느낌이 들긴하다.
 한가지 더 해볼 수 있는 건 width를 늘리지 않고 translateX값을 조정해서 길다란 창이 좌에서 우로 이동해서 마치 늘어리즈는 것 같은 느낌을 줄 수 있을 거 같다. 
*/

(function() {

 (function() {
    var _headerHeight = $("header").height();
    var _searchIcon = $(".searchIcon");
    var _inputPreviewOfIconSide = $('.inputPreviewOfIconSide');
    var _searchView = $("#searchView");

    //set icon style. 
    iconTopPos = _headerHeight - (_searchIcon.height() / 2);
    _searchIcon.css({'top': iconTopPos});
    _inputPreviewOfIconSide.css({'top': iconTopPos});
    _searchView.css({'top': iconTopPos + 31});

  })();

  var mainView = $("#mainView");
  var headerHeight = $("header").height();
  var inputPreviewOfIconSide = $('.inputPreviewOfIconSide');
  var inputPreviewOfIconSideTop = parseInt(inputPreviewOfIconSide.css("top"));
  var searchBar = $(".searchBar");
  var searchBarInput = $('.searchBarInput');
  var searchIcon = $(".searchIcon");
  var searchView = $("#searchView");
  var closeBtn = $(".closebtn");
  var bigScroll = false;
  var searchBarPrevColor = 'rgb(241, 159, 198)';
  var searchBarAfterColor = '#fff';
  var sTSE = _cu.getCSSTransitionEnd(); 
  var inputPreview = $('.inputPreview');
  var searchViewPreTopPos = searchView.css('top');

  function onScroll() {
    if ($(window).scrollTop() > headerHeight)  { 

      if(bigScroll) return;

      $(document.body).addClass("scroll");
      inputPreview.css({'opacity':1});
      inputPreview.css('backgroundColor', searchBarAfterColor);
      //inputPreview.css({'top' : 0});
      bigScroll = true;

      // setTimeout(function() {
      //   console.log("setimtoue");
      //   //inputPreview.css('backgroundColor', searchBarAfterColor);
      //   bigScroll = true;
      // }, 1);

    } else {
      if(!bigScroll) return;
      $(document.body).removeClass("scroll");
       inputPreview.css('backgroundColor', searchBarPrevColor);
       inputPreview.css({'opacity':0});
      bigScroll = false;
    } 
  }

  function showSearchView(evt) {
    searchBar.show();
    searchBar.css({'backgroundColor': '#fff'});
    searchBarInput.show();
    searchIcon.hide();
    searchView.show();

    setTimeout(function() {
      var translateDistance = $(window).scrollTop() - inputPreviewOfIconSideTop; 

      searchView.css({
        'top': '62px'
      });

    },1);

    mainView.hide();
  }

  function onSearchIconTouchEnd(evt) {
    inputPreviewOfIconSide.show();

    var translateDistance = $(window).scrollTop() - inputPreviewOfIconSideTop; 

    setTimeout(function(){
      inputPreviewOfIconSide.css({
        'transform': 'translate3d(0, ' + (translateDistance) + 'px, 0)',
        'width': '100%',
        'backgroundColor': '#fff',
        'marginLeft' :0,
        'borderRadius':0
      });
    },1);

    mainView.css({'opacity':0});
    searchIcon.hide();
      
    searchView.show();
     setTimeout(function() {
       searchView.css({
         'transform': 'translate3d(0, ' + (translateDistance) + 'px, 0)'
       });
    },1);
  }

  function searchViewInputTransitionEnd(evt) {
    var _name = _cu.getCSSName("transform");
    var y = parseInt(evt.target.style[_name].split(',')[1]);

    if ( y !== 0 ) {
      //show transition 
      searchBar.show();
      searchBar.css({'backgroundColor': '#fff'});
      searchBarInput.show();
    } else {
      //close transition 
      searchIcon.show();
      inputPreviewOfIconSide.css({'display': 'none'});
    }
  }

  function onBack(evt) {
    searchView.css(
      {
        'transform': 'translate3d(0,0,0)',
        //'top': '454px'
        'top': searchViewPreTopPos
      }
    );
    searchView.hide();

    searchBarInput.hide();
    searchBar.css({'backgroundColor': 'rgb(241, 221, 231)'});
    searchBar.hide();

    if(mainView.css("display") === "none") {
      mainView.show();
      searchIcon.show();
    }

    mainView.css({'opacity':1});

    inputPreviewOfIconSide.css({
      'transition': 'all 800ms cubic-bezier(0.000, 1.075, 0.035, 0.915)',
      'transform': 'translate3d(0, 0, 0)',
      'width': '62px',
      'backgroundColor': '#E3418E',
      'marginLeft' : '5%',
      'borderRadius': '50px' 
    });
  }

  function registerEvents() {
    $(window).scroll(onScroll);

    //inputPreview
    inputPreview.on("touchend", showSearchView);

    //search Icon.
    searchIcon.on("touchend", onSearchIconTouchEnd);
    inputPreviewOfIconSide.on(sTSE, searchViewInputTransitionEnd);

    closeBtn.on("touchend", onBack);
  }

  registerEvents();

  // $(window).trigger( "scroll" );
  // $(document).trigger("touchstart");
  // $(document).trigger("touchend");
  // $(window).trigger("touchstart");
  // $(window).trigger("touchend");

})();


