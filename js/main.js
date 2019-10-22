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

  let fullWordHash = [
    {"name":"index", "yomi":"インデックス", "meaninig":"インデックス、索引"},
    {"name":"import", "yomi":"インポート", "meaninig":"インポート／インポートする"},
    {"name":"result", "yomi":"リザルト", "meaninig":"結果"},
    {"name":"continue", "yomi":"コンティニュー", "meaninig":"続行する"},
    {"name":"return", "yomi":"リターン", "meaninig":"戻す、返す"},
    {"name":"configuration", "yomi":"コンフィグレーション", "meaninig":"構成"},
    {"name":"edit", "yomi":"エディット", "meaninig":"編集する"},
    {"name":"highlight", "yomi":"ハイライト", "meaninig":"ハイライト／強調表示する"},
    {"name":"merge", "yomi":"マージ", "meaninig":"マージする、統合する"},
    {"name":"query", "yomi":"クエリー", "meaninig":"クエリー"},
    {"name":"specify", "yomi":"スペシファイ", "meaninig":"指定する"},
    {"name":"upload", "yomi":"アップロード", "meaninig":"アップロードする／アップロード"},
    {"name":"range", "yomi":"レンジ", "meaninig":"範囲"},
    {"name":"position", "yomi":"ポジション", "meaninig":"位置"},
    {"name":"override", "yomi":"オーバーライド", "meaninig":"オーバーライドする、優先する"},
    {"name":"network", "yomi":"ネットワーク", "meaninig":"ネットワーク"},
    {"name":"module", "yomi":"モジュール", "meaninig":"モジュール"},
    {"name":"manager", "yomi":"マネージャー", "meaninig":"マネージャー"},
    {"name":"location", "yomi":"ロケーション", "meaninig":"位置、場所"},
    {"name":"label", "yomi":"ラベル", "meaninig":"ラベル／ラベルを貼る"},
    {"name":"interface", "yomi":"インターフェイス", "meaninig":"インターフェイス"},
    {"name":"item", "yomi":"アイテム", "meaninig":"項目"},
    {"name":"layout", "yomi":"レイアウト", "meaninig":"レイアウト"},
    {"name":"normal", "yomi":"ノーマル", "meaninig":"標準の"},
    {"name":"parameter", "yomi":"パラメーター", "meaninig":"パラメーター、仮引数"},
    {"name":"public", "yomi":"パブリック", "meaninig":"公開の"},
    {"name":"private", "yomi":"プライベート", "meaninig":"プライベートな、非公開の"},
    {"name":"recommend", "yomi":"レコメンド", "meaninig":"推奨する"},
    {"name":"record", "yomi":"レコード", "meaninig":"記録する／記録、レコード"},
    {"name":"remove", "yomi":"リムーブ", "meaninig":"削除する"},
    {"name":"commit", "yomi":"コミット", "meaninig":"コミットする、（処理などを）確定する"},
    {"name":"cookie", "yomi":"クッキー", "meaninig":"クッキー"},
    {"name":"define", "yomi":"ディファイン", "meaninig":"定義する"},
    {"name":"domain", "yomi":"ドメイン", "meaninig":"ドメイン"},
    {"name":"define", "yomi":"ディファイン", "meaninig":"定義する"},
    {"name":"error", "yomi":"エラー", "meaninig":"エラー"},
    {"name":"fail", "yomi":"フェイル", "meaninig":"失敗する"},
    {"name":"fix", "yomi":"フィックス", "meaninig":"修正する、解決する"},
    {"name":"global", "yomi":"グローバル", "meaninig":"グローバルな、大域の"},
    {"name":"host", "yomi":"ホスト", "meaninig":"ホスト"},
    {"name":"hide", "yomi":"ハイド", "meaninig":"隠す、非表示にする"},
    {"name":"icon", "yomi":"アイコン", "meaninig":"アイコン"},
    {"name":"instance", "yomi":"インスタンス", "meaninig":"インスタンス、実例"},
    {"name":"integer", "yomi":"インテジャー", "meaninig":"整数"},
    {"name":"issue", "yomi":"イシュー", "meaninig":"問題点"},
    {"name":"level", "yomi":"レベル", "meaninig":"レベル、水準"},
    {"name":"library", "yomi":"ライブラリー", "meaninig":"図書館"},
    {"name":"license", "yomi":"ライセンス", "meaninig":"ライセンス／ライセンス供与する"},
    {"name":"log", "yomi":"ログ", "meaninig":"ログ／ログを取る"},
    {"name":"login", "yomi":"ログイン", "meaninig":"ログイン"},
  ];
  // abc順にソート
  fullWordHash.sort(
    function(a,b){
      var aName = a["name"];
      var bName = b["name"];
      if( aName < bName ) return -1;
      if( aName > bName ) return 1;
      return 0;
    }
  );

  const targetWordCountSelect = document.getElementById('targetWordCountSelect');
  const targetWordTable = document.getElementById('targetWordTable');

  // 順番に注意
  // タイピング対象の単語数を選択できるようにselectを作成（すべての単語の数）
  for(var i=0; i<fullWordHash.length; i++){
    var option_count = document.createElement("option");
    // optionタグのテキストを設定する
    option_count.text = i+1;
    // optionタグのvalueを設定する
    option_count.value = i+1;
    targetWordCountSelect.appendChild(option_count);
  }
  // 単語の数を絞り込み
  if(getParameterByName("target_word_count") != null){
    // fullWordHash の length が target_word_count になるまでランダムに削除
    while(fullWordHash.length > getParameterByName("target_word_count")){
      const randomCount = Math.floor(Math.random() * fullWordHash.length);
      fullWordHash.splice(randomCount, 1);
    }

    targetWordCountSelect.value = getParameterByName("target_word_count");
  } else {
    targetWordCountSelect.value = targetWordCountSelect.length;
  }

  // タイピング対象の一覧作成
  for(var i=0; i<fullWordHash.length; i++){
    var tr_word = document.createElement("tr");
    var td_eng_lower = document.createElement("td");
    var td_eng_upper = document.createElement("td");
    var td_yomi = document.createElement("td");
    var td_mean = document.createElement("td");
    td_eng_lower.textContent = fullWordHash[i].name;
    td_eng_upper.textContent = fullWordHash[i].name.toUpperCase();
    td_yomi.textContent = fullWordHash[i].yomi;
    td_mean.textContent = fullWordHash[i].meaninig;
    tr_word.appendChild(td_eng_lower);
    tr_word.appendChild(td_eng_upper);
    tr_word.appendChild(td_yomi);
    tr_word.appendChild(td_mean);
    targetWordTable.appendChild(tr_word);
  }

  let word;
  let wordMeaning;
  let loc  // 変数宣言
  let score  // スコア格納
  let miss  // ミス格納
  let accuracy  // 正確度
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

  const targetMeaning = document.getElementById('targetMeaning');
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
  const accuracyLabel = document.getElementById('accuracy');

  // 残り時間表示
  const timerLabel = document.getElementById('timer');
  timerLabel.textContent = playingTime + ".00";

  // 残り単語数表示
  const wordLeftCountLabel = document.getElementById('wordLeftCount');
  wordLeftCountLabel.textContent = fullWordHash.length;

  // クリアした単語数
  const wordClearCountLabel = document.getElementById('wordClearCount');

  const darkButton = document.getElementById('darkButton');
  const normalButton = document.getElementById('normalButton');

  // ダークモード
  // GETパラメーターに「dark_mode=true」を付与すると実行される
  if(getParameterByName("dark_mode") === "true"){
    target.style.color = "white";
    targetMeaning.style.color = "white";
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
    accuracy = 0;
    scoreLabel.textContent = score;
    speedCPMLabel.textContent = speedCPM;
    speedWPMLabel.textContent = speedWPM;
    accuracyLabel.textContent = accuracy;
    missLabel.textContent = miss;
    const initRandom = Math.floor(Math.random() * fullWordHash.length);
    word = fullWordHash[initRandom].name;
    wordMeaning = fullWordHash[initRandom].meaninig;

    // タイピング単語を表示
    targetMeaning.textContent = wordMeaning;
    if(isUppercaseMode){
      target.textContent = word.toUpperCase();
    } else {
      target.textContent = word;
    }

    startTime = Date.now(); // Date.now 基準日から経過ミリ秒を計算
    // スタート時の単語の数
    startWorsLengs = fullWordHash.length;

    wordLeftCountLabel.textContent = fullWordHash.length;
    wordClearCountLabel.textContent = startWorsLengs - fullWordHash.length;

    bar.animate(0);

    updateTimer();
  }

  // クリックイベント
  target.addEventListener('click', () => {
    // プレイ中のクリック、もしくは、モード切り替えのためのクリックは無効
    if(isPlaying === true){
      return;
    }

    if(fullWordHash.length == 0){
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
      if(loc === word.length){ //
        // 正解した単語は削除する
        for (var index in fullWordHash) {
          if(fullWordHash[index].name === word){
            fullWordHash.splice(index, 1);
          }
        }
        wordLeftCountLabel.textContent = fullWordHash.length;
        wordClearCountLabel.textContent = startWorsLengs - fullWordHash.length;

        bar.animate((startWorsLengs - fullWordHash.length) / startWorsLengs);

        // 用意されている単語をすべて正解した場合は終了する。
        if(fullWordHash.length == 0){
          isNoMoreWord = true;
          score++;
          scoreLabel.textContent = score;
          // 正確度を都度チェック
          accuracy = (score + miss === 0 ? 0 : score / (score + miss) * 100).toFixed(2);
          accuracyLabel.textContent = accuracy;
          return;
        }

        const keyupRandom = Math.floor(Math.random() * fullWordHash.length);
        word = fullWordHash[keyupRandom].name;
        wordMeaning = fullWordHash[keyupRandom].meaninig;
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

    // 正確度を都度チェック
    accuracy = (score + miss === 0 ? 0 : score / (score + miss) * 100).toFixed(2);
    accuracyLabel.textContent = accuracy;
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
    targetMeaning.textContent = wordMeaning;
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
    speedWPM = ((startWorsLengs - fullWordHash.length) / (((Date.now() - startTime) / 1000) / 60)).toFixed(2);
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
      targetMeaning.textContent = "";
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
    accuracy = (score + miss === 0 ? 0 : score / (score + miss) * 100).toFixed(2);
    let results;
    if(fullWordHash.length == 0){
      results = "おめでとうございます！！\nすべての単語をクリアしました。";
    } else {
      results = "残念！\n時間切れです。";
    }
    // alert(``)でないとscore等の数値が表示されないため注意。alert('')だと文字がそのまま表示される
    alert(`${results}\n\n=== 結果 ===\nクリアした単語: ${startWorsLengs-fullWordHash.length}個\n正解: ${score}文字\nミス: ${miss}文字\n正確度: ${accuracy}%\nタイピング速度: ${speedCPM} CPM / ${speedWPM} WPM`);
  }

}
