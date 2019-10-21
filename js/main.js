'use strict'; // 厳密なエラーチェックを行う
{
  // モーダル画面の表示・非表示
  $(function () {
    $('#openModal').click(function(){
        $('#modalArea').fadeIn();
    });
    $('#closeModal , #modalBg').click(function(){
      $('#modalArea').fadeOut();
    });
  });

  // GETパラメータ取得
  var getParameterByName = function(name) {
      var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
      return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  // プログレスバーjs
  var bar = new ProgressBar.Line(progressBar, {
    strokeWidth: 3,
    easing: 'easeOut',
    duration: 1000,
    color: '#FFEA82',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: {width: '100%', height: '100%'}
  });
  // bar.animate(0.7);

  let defaultWords = [
    'index',
    'import',
    'result',
    'continue',
    'return',
    'configuration',
    'edit',
    'highlight',
    'merge',
    'query',
    'specify',
    'upload',
    'range',
    'position',
    'override',
    'network',
    'module',
    'manager',
    'location',
    'label',
    'interface',
    'item',
    'layout',
    'normal',
    'parameter',
    'public',
    'private',
    'recommend',
    'record',
    'remove',
    'commit',
    'cookie',
    'define',
    'domain',
    'error',
    'fail',
    'fix',
    'global',
    'host',
    'hide',
    'icon',
    'instance',
    'integer',
    'issue',
    'level',
    'local',
    'lock',
    'log',
    'login',
    'loop',
  ];

  const targetWordCount = document.getElementById('targetWordCount');
  const targetWordList = document.getElementById('targetWordList');

  // 順番に注意
  // タイピング対象の単語数を選択できるようにselectを作成
  for(var i=0; i<defaultWords.length; i++){
    var option_count = document.createElement("option");
    // optionタグのテキストを設定する
    option_count.text = i+1;
    // optionタグのvalueを設定する
    option_count.value = i+1;
    targetWordCount.appendChild(option_count);
  }
  // 対象のwordsを生成
  let words = new Array();
  if(getParameterByName("target_word_count") != null){
    // words の length が target_word_count になるまでランダムに追加
    while(words.length < getParameterByName("target_word_count")){
      const randomCount = Math.floor(Math.random() * defaultWords.length);
      words.push(defaultWords[randomCount]);
      defaultWords.splice(randomCount, 1);
    }

    targetWordCount.value = getParameterByName("target_word_count");
  } else {
    words = defaultWords;
  }
  // タイピング対象の一覧作成
  for(var i=0; i<words.length; i++){
    // 一覧
    var option_word = document.createElement("option");
    option_word.text = words[i];
    targetWordList.appendChild(option_word);
  }


  // デバッグ
  console.log(words);

  let word = words[Math.floor(Math.random() * words.length)];
  let loc  // 変数宣言
  let score  // スコア格納
  let miss  // ミス格納
  let speedCPM  // 速度
  let speedWPM  // 速度

  const sleepTime = 3;

  // 制限時間
  let playingTime = 30;
  if(getParameterByName("play_time") != null){
    playingTime = getParameterByName("play_time");

    const playTimeSelect = document.getElementById('playTimeSelect');
    playTimeSelect.value = playingTime;
  }
  const timeLimit = playingTime * 1000; // ミリ秒 * 1000

  // 大文字小文字モード
  let isUppercaseMode = false;
  if(getParameterByName("case_mode") != null){
    isUppercaseMode = getParameterByName("case_mode") === "upperCase" ? true : false;

    const caseModeSelect = document.getElementById('caseModeSelect');
    caseModeSelect.value = isUppercaseMode ? "upperCase" : "lowerCase";
  }

  let startWorsLengs = 0;
  let startTime = 0;
  let isPlaying = false; // ゲーム開始フラグ(クリックするとtrueとなる)
  let isSleepMode = false;
  let isNoMoreWord = false;

  const target = document.getElementById('target');
  if(isUppercaseMode){
    // 大文字モードは最初の画面の文字も大文字にする。
    target.textContent = target.textContent.toUpperCase();
  }

  const doneTarget = document.getElementById('doneTarget');
  const speedCPMLabel = document.getElementById('speed_CPM');
  const speedWPMLabel = document.getElementById('speed_WPM');
  const scoreLabel = document.getElementById('score');
  const missLabel = document.getElementById('miss');

  // 残り時間表示
  const timerLabel = document.getElementById('timer');
  timerLabel.textContent = playingTime + ".00";

  // 残り単語数表示
  const wordLeftCountLabel = document.getElementById('wordLeftCount');
  wordLeftCountLabel.textContent = words.length;

  // クリアした単語数
  const wordClearCountLabel = document.getElementById('wordClearCount');

  const darkButton = document.getElementById('darkButton');
  const normalButton = document.getElementById('normalButton');

  // ダークモード
  // GETパラメーターに「dark_mode=true」を付与すると実行される
  if(getParameterByName("dark_mode") === "true"){
    target.style.color = "white";
    doneTarget.style.color = "#00FF00";
    document.body.style.background = "#000000";

    document.getElementById("game_setting_0").value = true;

    var infoClass = document.getElementsByClassName("info");
    for(var i=0;i<infoClass.length;i++){
      infoClass[i].style.color = "#DDDDDD";
    }
    var infoBigClass = document.getElementsByClassName("infoBig");
    for(var i=0;i<infoBigClass.length;i++){
      infoBigClass[i].style.color = "#DDDDDD";
    }
  }

  // init count down
  function sleep(waitSec, callbackFunc) {
    // スリープモード実行中は処理をスキップする
    if(isSleepMode === true){
      return;
    }

    target.textContent = waitSec;

    var spanedSec = 0;
    var waitFunc = function () {
        spanedSec++;
        if (spanedSec >= waitSec) {
            if (callbackFunc) callbackFunc();
            isSleepMode = false;
            return;
        }
        clearTimeout(id);
        id = setTimeout(waitFunc, 1000);
        target.textContent = waitSec - spanedSec;
    };
    var id = setTimeout(waitFunc, 1000);
    target.textContent = waitSec;
    isSleepMode = true;
  }

  // init処理
  function init(){
    isPlaying = true;

    loc = 0;
    score = 0;
    speedCPM = 0;
    speedWPM = 0;
    miss = 0;
    scoreLabel.textContent = score;
    speedCPMLabel.textContent = speedCPM;
    speedWPMLabel.textContent = speedWPM;
    missLabel.textContent = miss;
    word = words[Math.floor(Math.random() * words.length)];

    // タイピング単語を表示
    if(isUppercaseMode){
      target.textContent = word.toUpperCase();
    } else {
      target.textContent = word;
    }

    startTime = Date.now(); // Date.now 基準日から経過ミリ秒を計算
    // スタート時の単語の数
    startWorsLengs = words.length;

    wordLeftCountLabel.textContent = words.length;
    wordClearCountLabel.textContent = startWorsLengs - words.length;

    bar.animate(0);

    updateTimer();
  }

  // クリックイベント
  target.addEventListener('click', () => {
    // プレイ中のクリック、もしくは、モード切り替えのためのクリックは無効
    if(isPlaying === true){
      return;
    }

    if(words.length == 0){
      alert("残りの単語がありません。リロードしてください。");
      return;
    }

    sleep(sleepTime, function() {
      // console.log(`${sleepTime}秒経過しました！`);
      // 処理開始
      init();
    });
  });

  // キー入力イベント
  window.addEventListener('keyup' , e => {

    // clickするまではキー入力を無効にする
    if(isPlaying === false){
      return;
    }

    // console.log(e.key); // デバッグ用処理(コンソールに入力結果を表示)
    // １文字正解
    if(e.key === word[loc]){
      // console.log('score'); // デバッグ用処理(コンソールにscoreと表示)
      loc++;
      // １単語正解
      if(loc === word.length){
        // 正解した単語は削除する
        words.splice(words.indexOf(word), 1);
        wordLeftCountLabel.textContent = words.length;
        wordClearCountLabel.textContent = startWorsLengs - words.length;

        bar.animate((startWorsLengs - words.length) / startWorsLengs);

        // 用意されている単語をすべて正解した場合は終了する。
        if(words.length == 0){
          isNoMoreWord = true;
          score++;
          scoreLabel.textContent = score;
          return;
        }

        word = words[Math.floor(Math.random() * words.length)];
        doneTarget.textContent = "";
        loc = 0;
      }
      score++;
      scoreLabel.textContent = score;
      updateTarget();
    } else {
      miss++;
      missLabel.textContent = miss;
      // console.log('miss'); // デバッグ用処理(コンソールにmissと表示)
    }
  });

  function updateTarget(){
    /* substring(loc) 先頭から指定した文字数を削除する */
    if(isUppercaseMode){
      doneTarget.textContent += word.charAt(loc-1).toUpperCase();
      target.textContent = word.substring(loc).toUpperCase();
    } else {
      doneTarget.textContent += word.charAt(loc-1);
      target.textContent = word.substring(loc);
    }
  }

  /* 残り時間更新処理 */
  function updateTimer(){
    /* 残り時間を計算　開始時間　－ 制限時間 - 基準日からの経過時間 */
    const timeLeft = startTime + timeLimit - Date.now();
    /* 残り時間表示(ミリ秒→秒に変更。toFixedで少数点以下桁数調整(今回は2桁)) */
    timerLabel.textContent = (timeLeft / 1000).toFixed(2);

    // タイピング速度計算（経過分あたりの正解文字数）
    speedCPM = (score / (((Date.now() - startTime) / 1000) / 60)).toFixed(2);
    speedCPMLabel.textContent = speedCPM;
    // タイピング速度計算（経過分あたりの正解単語数）
    speedWPM = ((startWorsLengs - words.length) / (((Date.now() - startTime) / 1000) / 60)).toFixed(2);
    speedWPMLabel.textContent = speedWPM;

    const timeoutId = setTimeout(() => {
      updateTimer();
    },10);

    /* 残り時間が0になったらタイマーの更新をストップし、ゲーム終了 */
    if (timeLeft < 0 || isNoMoreWord == true){
      isPlaying = false;

      // 画面の更新を100ミリ秒遅らせる。遅らせることでタイマーが0秒になったら表示される
      // 画面の更新を1000ミリ秒遅らせる。遅らせることでプログレスバーがMAXまで表示される
      setTimeout(() => {
        showResult();
      }, 1000);

      clearTimeout(timeoutId);
      doneTarget.textContent = "";
      timerLabel.textContent = '0.00';
      target.textContent = 'click here to continue..';
      if(isUppercaseMode){
        // 大文字モードの場合は、説明も大文字で表示。
        target.textContent = target.textContent.toUpperCase();
      }
    }
  }

  /* 結果表示処理 */
  function showResult(){
    // 正答率算出 未入力時に分母が0になるため、0の時は正答率を0として表示する
    const accuracy = score + miss === 0 ? 0 : score / (score + miss) * 100;
    let results;
    if(words.length == 0){
      results = "おめでとうございます！！\nすべての単語をクリアしました。";
    } else {
      results = "残念！\n時間切れです。";
    }
    // alert(``)でないとscore等の数値が表示されないため注意。alert('')だと文字がそのまま表示される
    alert(`${results}\n\n=== 結果 ===\nクリアした単語: ${startWorsLengs-words.length}個\n正解: ${score}文字\nミス: ${miss}文字\n正確度: ${accuracy.toFixed(2)}%\nタイピング速度: ${speedCPM} CPM / ${speedWPM} WPM`);
  }

}
