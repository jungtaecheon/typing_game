'use strict'; // 厳密なエラーチェックを行う

{
  // GETパラメータ取得
  var getParameterByName = function(name) {
      var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
      return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  let words = [
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
  ];
  let word = words[Math.floor(Math.random() * words.length)];
  let loc  // 変数宣言
  let score  // スコア格納
  let miss  // ミス格納
  let speed  // 速度


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

  let startTime = 0;
  let isPlaying = false; // ゲーム開始フラグ(クリックするとtrueとなる)
  let isSleepMode = false;
  let isNoMoreWord = false;

  const target = document.getElementById('target');
  const doneTarget = document.getElementById('doneTarget');
  const speedLabel = document.getElementById('speed');
  const scoreLabel = document.getElementById('score');
  const missLabel = document.getElementById('miss');

  // 残り時間表示
  const timerLabel = document.getElementById('timer');
  timerLabel.textContent = playingTime + ".00";

  // 残り単語数表示
  const wordCountLabel = document.getElementById('wordCount');
  wordCountLabel.textContent = words.length;

  const darkButton = document.getElementById('darkButton');
  const normalButton = document.getElementById('normalButton');

  // ダークモード
  // GETパラメーターに「dark_mode=true」を付与すると実行される
  if(getParameterByName("dark_mode") === "true"){
    target.style.color = "white";
    doneTarget.style.color = "#00FF00";
    document.body.style.background = "#000000";

    document.getElementById("game_setting_0").value = true;
    document.getElementById("game_setting_1").style.color = "white";
    document.getElementById("game_setting_2").style.color = "white";

    var infoClass = document.getElementsByClassName("info");
    for(var i=0;i<infoClass.length;i++){
      infoClass[i].style.color = "#DDDDDD";
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
    speed = 0;
    miss = 0;
    scoreLabel.textContent = score;
    speedLabel.textContent = speed;
    missLabel.textContent = miss;
    word = words[Math.floor(Math.random() * words.length)];

    // タイピング単語を表示
    if(isUppercaseMode){
      target.textContent = word.toUpperCase();
    } else {
      target.textContent = word;
    }

    wordCountLabel.textContent = words.length;

    startTime = Date.now(); // Date.now 基準日から経過ミリ秒を計算
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
    if(e.key === word[loc]){
      // console.log('score'); // デバッグ用処理(コンソールにscoreと表示)
      loc++;
      if(loc === word.length){
        // 正解した単語は削除する
        words.splice(words.indexOf(word), 1);
        wordCountLabel.textContent = words.length;

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
    }else{
      miss++;
      missLabel.textContent = miss;
      // console.log('miss'); // デバッグ用処理(コンソールにmissと表示)
    }
  });

  function updateTarget(){
    /* substring(loc) 先頭から指定した文字数を削除する */
    wordCountLabel.textContent = words.length;
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
    speed = (score / (((Date.now() - startTime) / 1000) / 60)).toFixed(2);
    speedLabel.textContent = speed;

    const timeoutId = setTimeout(() => {
      updateTimer();
    },10);

    /* 残り時間が0になったらタイマーの更新をストップし、ゲーム終了 */
    if (timeLeft < 0 || isNoMoreWord == true){
      isPlaying = false;

      // 画面の更新を100ミリ秒遅らせる。遅らせることでタイマーが0秒になったら表示される
      setTimeout(() => {
        showResult();
      }, 100);

      clearTimeout(timeoutId);
      doneTarget.textContent = "";
      timerLabel.textContent = '0.00';
      target.textContent = 'Click here to continue..';
    }
  }

  /* 結果表示処理 */
  function showResult(){
    // 正答率算出 未入力時に分母が0になるため、0の時は正答率を0として表示する
    const accuracy = score + miss === 0 ? 0 : score / (score + miss) * 100;
    let results;
    if(words.length == 0){
      results = "おめでとうございます！すべての単語をクリアしました。";
    } else {
      results = "時間切れです。";
    }
    // alert(``)でないとscore等の数値が表示されないため注意。alert('')だと文字がそのまま表示される
    alert(`${results}\n\n=== 結果 ===\n残り単語: ${words.length}個\n正解: ${score}文字\nミス: ${miss}文字\n正確度: ${accuracy.toFixed(2)}%\nタイピング速度: ${speed} WPM`);
  }

}
