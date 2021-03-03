`use strict`;
const CHRHEIGHT = 9;                //キャラの高さ
const CHRWIDTH = 8;                 //キャラの幅
const FONT = "12px monospace";      //使用フォント・サイズ
const FONTSTYLE = "#ffffff";        //文字色
const HEIGHT = 120;                 //仮想画面サイズ。高さ
const WIDTH = 128;                  //仮想画面サイズ。幅
const INTERVAL = 33;                //フレーム呼び出し間隔
const MAP_WIDTH = 32;               //マップ幅
const SCROLL = 2;                   //スクロール速度
const MAP_HEIGHT = 32;              //マップ高さ
const SCR_HEIGHT = 8;               //画面タイルサイズ高さ/2
const SCR_WIDTH = 8;                //画面タイルサイズ幅/2
const SMOOTH = 0;                   //ドットの補完処理用
const START_HP = 40;                //開始HP
const START_X = 15;                 //開始位置Ｘ座標
const START_Y = 17;                 //開始位置Ｙ座標
const TILECOLUMN = 4;
const TILEROW = 4;
const TILESIZE = 8;                 //タイルサイズ（ドット）
const WINDSTYLE = "rgba(0, 0, 0, 0.75)"; //ウインドウの色

const gKey = new Uint8Array( 0x100 ); //キー入力バッファ

let gAngle = 0;                     //プレイヤーの向き
let gEx = 0;                        //経験値
let gHP = START_HP;                 //プレイヤーのHP
let gMHP = START_HP;                //プレイヤーの最大HP
let gLv = 1;                        //プレイヤーのレベル
let gCursor = 0;                    //カーソル位置
let gEnemyHP;                       //敵のHP
let gEnemyType;                     //敵の種類
let gFrame = 0;                     //内部カウンター
let gHeight;                        //実画面の高さ
let gWidth;                         //実画面の幅
let gImgMap;                        //画像マップ
let gImgMonster;                    //画像モンスター
let gImgBoss;                       //画像ボス
let gImgPlayer                      //画像プレイヤー
let gItem = 0;                      //所持アイテム(鍵)
let gMessage1 = null;               //表示メッセージ
let gMessage2 = null;               //表示メッセージ
let gMoveX = 0;                     //移動量X
let gMoveY = 0;                     //移動量Y
let gOrder;                         //行動順
let gPhase = 0;                         //戦闘フェーズ
let gPlayerX = START_X * TILESIZE + TILESIZE / 2;  //プレイヤー座標X
let gPlayerY = START_Y * TILESIZE + TILESIZE / 2;  //プレイヤー座標Y
let gScreen;                        //仮想画面


const gFileMap = "img/map.png";
const gFileMonster = "img/monster.png";
const gFilePlayer = "img/player.png";
const gFileBoss = "img/boss.png";

const gEncounter = [0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0];  //敵エンカウント確立

const gMonsterName = ["スライム", "うさぎ", "ナイト", "ドラゴン", "魔王"] //モンスター名称

//マップ
const gMap = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 3, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 3, 6, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 3, 6, 6, 7, 7, 7, 2, 2, 2, 7, 7, 7, 7, 7, 7, 7, 6, 3, 0, 0, 0, 3, 3, 0, 6, 6, 6, 0, 0, 0,
    0, 0, 3, 3, 6, 6, 6, 7, 7, 2, 2, 2, 7, 7, 2, 2, 2, 7, 7, 6, 3, 3, 3, 6, 6, 3, 6, 13, 6, 0, 0, 0,
    0, 3, 3, 10, 11, 3, 3, 6, 7, 7, 2, 2, 2, 2, 2, 2, 1, 1, 7, 6, 6, 6, 6, 6, 3, 0, 6, 6, 6, 0, 0, 0,
    0, 0, 3, 3, 3, 0, 3, 3, 3, 7, 7, 2, 2, 2, 2, 7, 7, 1, 1, 6, 6, 6, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 7, 7, 7, 7, 2, 7, 6, 3, 1, 3, 6, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 7, 2, 7, 6, 3, 1, 3, 3, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 0, 3, 3, 3, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 3, 12, 3, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 7, 7, 6, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 6, 6, 6, 6, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 1, 1, 3, 3, 3, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 3, 3, 3, 6, 6, 6, 3, 3, 3, 1, 1, 1, 1, 1, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 8, 9, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 3, 3, 1, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 3, 3, 3, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0,
    7, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 0, 0, 0, 0,
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7,
];

//戦闘行動処理
function Action()
{
    gPhase++;                           //フェーズ経過

    if( ( (gPhase + gOrder) & 1) == 0) {       //敵の行動順の場合
        const d = GetDamage(gEnemyType + 2);
        SetMessage(gMonsterName[gEnemyType] + "の攻撃！", d + "のダメージ");
        gHP -= d;                           //プレイヤーのHP減少
        if(gHP <= 0) {      //プレイヤーのHPが0の場合
            gPhase = 7;     //ゲームオーバーフェーズに以降
        }
        return;
    }

    //プレイヤーの行動手順
    if(gCursor == 0) {                  //戦う選択時
        let d = GetDamage(gLv + 5);
        SetMessage("あなたの攻撃！", d + "のダメージ！");
        gEnemyHP -= d;
        if(gEnemyHP <= 0) {
            gPhase = 5;
        }
        return;
    }

    if(Math.random() < 0.5) {       //逃げる成功時
        SetMessage("走って逃げた！", null);
        gPhase = 6;
        return;
    }
    SetMessage("敵に回り込まれた！", null);
    
}

//敵出現処理
function AppearEnemy(t)
{
    gPhase = 1;                         //敵出現フェーズ
    gEnemyHP = t * 3 + 5;               //敵HP
    gEnemyType = t;
    SetMessage("敵が現れた！", null);
}

//戦闘コマンド
function CommandFight() 
{
gPhase = 2;         //戦闘コマンド選択フェーズ
gCursor = 0;
SetMessage("  戦う", "  逃げる");
}

//経験値加算
function AddExp(val)
{
    gEx += val;                         //経験値加算
    while(gLv * (gLv + 1) * 2 <= gEx) {     //レベルアップ条件
        gLv++;                          //レベルアップ
        gMHP += 8 + Math.floor(Math.random() * 3);;  //4~6の間ランダムで最大HPが加算される
        gHP = gMHP;
    }
}


///////////////戦闘描画処理////////////////
function DrawFight(g)
{
    g.fillStyle = "#000000";                    //背景色
    g.fillRect(0, 0, WIDTH, HEIGHT)             //画面全体を矩形描画
    if(gPhase <= 5) {
        if (IsBoss()) { //ラスボスの場合
        g.drawImage(gImgBoss, WIDTH / 2 - gImgBoss.width / 2, HEIGHT / 2 - gImgBoss.height / 2);
        }else{          //そうじゃない場合
        let w = gImgMonster.width / 4;
        let h = gImgMonster.height;
        g.drawImage(gImgMonster, gEnemyType * w, 0, w, h, Math.floor(WIDTH / 2 - w / 2), Math.floor(HEIGHT / 2 - h / 2), w, h);
        }
    }

    //ステータスウィンドウ(常に描画される)
    DrawStatus(g);                          //ステータス描画    
    DrawMessage(g);                         //メッセージ描画
    
    if(gPhase == 2) {       //コマンド選択中の場合
        g.fillText("⇒", 6, 96 + 14 * gCursor);   //カーソル描画
        }
}

///////////////フィールド・マップ描画処理//////////////
function DrawField(g) 
{   
    let mx = Math.floor(gPlayerX / TILESIZE);       //プレイヤーのタイル座標X
    let my = Math.floor(gPlayerY / TILESIZE);       //プレイヤーのタイル座標Y

    for (let dy = -SCR_HEIGHT; dy <= SCR_HEIGHT; dy++)   {
        let ty = my + dy;                           //タイル座標Y
        let py = (ty + MAP_HEIGHT) % MAP_HEIGHT;    //ループ後タイル座標Y
        for (let dx = -SCR_WIDTH; dx <= SCR_WIDTH; dx++) {
            let tx = mx + dx;                       //タイル座標X
            let px = (tx + MAP_WIDTH) % MAP_WIDTH;  //ループ後タイル座標X
            DrawTile(g, 
                tx * TILESIZE + WIDTH / 2 - gPlayerX,
                ty * TILESIZE + HEIGHT / 2 - gPlayerY,
                gMap[py * MAP_WIDTH + px]);
        }
    }

////////////////プレイヤーの描画//////////////
    g.drawImage(gImgPlayer, 
        (gFrame >> 3 & 1) * CHRWIDTH, gAngle * CHRHEIGHT, CHRWIDTH, CHRHEIGHT, 
        WIDTH / 2 - CHRWIDTH / 2, HEIGHT / 2 - CHRHEIGHT + TILESIZE / 2, CHRWIDTH, CHRHEIGHT);

        //ステータスウィンドウ(常に描画される)
        g.fillStyle = WINDSTYLE;                 //ウィンドウの色
        g.fillRect(2, 2, 44, 37);              //矩形描画
        DrawStatus(g);                          //ステータス描画    
        DrawMessage(g);                         //メッセージ描画
}



//////////メイン/////////////////////////
function DrawMain() {
    const g = gScreen.getContext("2d");             //仮想画面の2D描画コンテキストを取得

    if(gPhase <= 1) {
    DrawField(g);                   //フィールド画面描画
    }else{
        DrawFight(g);
    }
       

    /*g.fillStyle = WINDSTYLE;                 //ウィンドウの色
    g.fillRect(20, 3, 105, 15);              //矩形描画
    g.font = FONT;                                 //文字フォントを設定
    g.fillStyle = FONTSTYLE;                       //文字色
    g.fillText("x=" + gPlayerX + " y=" + gPlayerY + " m=" + gMap[my * MAP_WIDTH + mx], 25, 15);               //座標表示
    */
}


///////////////メッセージ描画 //////////////
function DrawMessage(g)
{
    if(!gMessage1){
        return;
    }

    g.fillStyle = WINDSTYLE;                 //ウィンドウの色
    g.fillRect(4, 84, 120, 30);              //矩形描画

    g.font = FONT;                        //文字フォントを設定
    g.fillStyle = FONTSTYLE;              //文字色
    g.fillText(gMessage1, 6, 96);         //メッセージ1行目表示
    if(gMessage2) {
    g.fillText(gMessage2, 6, 110);}       //メッセージ2行目表示
}

///////////ステータス描画////////////
function DrawStatus(g)
{
    g.font = FONT;                        //文字フォントを設定
    g.fillStyle = FONTSTYLE;              //文字色
    g.fillText("Lv", 4, 13);    DrawTextR(g, gLv, 40, 13);        //Lv
    g.fillText("HP", 4, 25);    DrawTextR(g, gHP, 40, 25);        //HP
    g.fillText("Ex", 4, 37);    DrawTextR(g, gEx, 40, 37);        //Ex
    
    g.font = FONT;                                 //文字フォントを設定
    g.fillStyle = FONTSTYLE;                      //文字色
}

function DrawTextR(g, str, x, y) {
    g.textAlign = "right";
    g.fillText(str, x, y);
    g.textAlign = "left";
}

function DrawTile(g, x, y, idx) 
{
    const ix = (idx % TILECOLUMN) * TILESIZE;
    const iy = Math.floor(idx / TILECOLUMN) * TILESIZE;

    g.drawImage(gImgMap, ix, iy, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE);
}

//ダメージ量算出式
function GetDamage(a) 
{
    return(Math.floor(a * (1 + Math.random() ) ) );     //攻撃力の1~2倍
}

function IsBoss()
{
    return(gEnemyType == gMonsterName.length - 1);
}

function LoadImage() 
{
    gImgBoss = new Image(); gImgBoss.src = gFileBoss; //ボス画像読み込み
    gImgMap = new Image(); gImgMap.src = gFileMap; //マップ画像読み込み
    gImgMonster = new Image(); gImgMonster.src = gFileMonster; //モンスター画像読み込み
    gImgPlayer = new Image(); gImgPlayer.src = gFilePlayer; //プレイやー画像読み込み
}

function SetMessage(v1, v2)
{
    gMessage1 = v1;
    gMessage2 = v2;
}

// IE対応
function Sign(val)
{
    if(val == 0) {
        return(0);
    }
    if(val < 0) {
        return(-1);
    }
    return(1);
}

/////////////フィールド進行処理//////////////////
function TickField()
{
    if(gMoveX != 0 || gMoveY != 0 || gMessage1) {}            //移動中またはメッセージ表示中の場合
    else if(gKey[ 37 ]) {gAngle = 1; gMoveX = -TILESIZE;}     //左
    else if(gKey[ 38 ]) {gAngle = 3; gMoveY = -TILESIZE;}     //上
    else if(gKey[ 39 ]) {gAngle = 2; gMoveX = TILESIZE;}      //右
    else if(gKey[ 40 ]) {gAngle = 0; gMoveY = TILESIZE;}      //下

    //移動後のタイル座標判定
    let mx = Math.floor((gPlayerX + gMoveX) / TILESIZE);   //移動後のタイル座標X
    let my = Math.floor((gPlayerY + gMoveY) / TILESIZE);   //移動後のタイル座標Y
    mx += MAP_WIDTH;                                       //マップループ処理X
    mx %= MAP_WIDTH;                                       //マップループ処理X 
    my += MAP_HEIGHT;                                      //マップループ処理Y
    my %= MAP_HEIGHT;                                      //マップループ処理Y
    let m = gMap[my * MAP_WIDTH + mx];                     //移動後のタイル番号
    if(m < 3) {                                            //侵入不可の地形（タイル番号2以下）の場合、移動量を0にする
        gMoveX = 0;                                        
        gMoveY = 0;                                        //
    }
    if(Math.abs(gMoveX) + Math.abs(gMoveY) == SCROLL) { //マス目移動が終わる直前
        if(m == 8 || m == 9) {  //お城
            gHP = gMHP;         //HP回復
            SetMessage("魔王を倒して", null);
        }
        if(m == 10 || m == 11) {    //街
            gHP = gMHP;         //HP回復
            SetMessage("最果てにも", "村があります");
        }
        if(m == 12) {    //村
            gHP = gMHP;         //HP回復
            SetMessage("カギは", "洞窟にあります");
        }
        if(m == 13) {    //洞窟
            gItem = 1;   //カギ入手
            SetMessage("カギを", "手に入れた！");
        }
        if(m == 14) {    //扉
            if(gItem == 0) {
            gPlayerY -= TILESIZE;      //1マス上に移動
            SetMessage("カギが必用です", null);
            }else{
            SetMessage("扉が開いた", null);
            }
        }
        if(m == 15) {    //魔王
            AppearEnemy(gMonsterName.length - 1);

        }
        if(Math.random() * 24 < gEncounter[m]) {
            let t = Math.abs(gPlayerX / TILESIZE - START_X) +
            Math.abs(gPlayerY / TILESIZE - START_Y);    //開始位置からの距離に応じて敵が変化

            if(m == 6) {    //マップが林の場合
                t += 8;     //敵レベルを0.5あげる,
            }
            if(m == 7) {    //マップが山の場合
                t += 40;    //敵レベルを1あげる
            }
            t += Math.random() * 8          //敵レベルをランダムであげる(0 ~ 0.5上昇)
            t = Math.floor(t / 24);
            t = Math.min(t, gMonsterName.length -2);  //上限処理
            AppearEnemy(t);
        }
    }
    gPlayerX += Sign(gMoveX) * SCROLL;              //プレイヤー座標移動X
    gPlayerY += Sign(gMoveY) * SCROLL;              //プレイヤー座標移動Y
    gMoveX -= Sign(gMoveX) * SCROLL;                //移動量消費X
    gMoveY -= Sign(gMoveY) * SCROLL;                //移動量消費Y

    //////////マップループ処理//////////////////
    gPlayerX += (MAP_WIDTH * TILESIZE);
    gPlayerX %= (MAP_WIDTH * TILESIZE);
    gPlayerY += (MAP_HEIGHT * TILESIZE);
    gPlayerY %= (MAP_HEIGHT * TILESIZE);
}

function WmPaint() {                               //描画処理、関連の関数
    DrawMain();
    const ca = document.getElementById('main');    //HTMLのキャンバスを取得
    const g = ca.getContext("2d");                 //2D描画コンテキストを取得
    g.drawImage(gScreen, 0, 0, gScreen.width, gScreen.height, 0, 0, gWidth, gHeight); //仮想画面のイメージを実画面に転送

}

//////////// ブラウザサイズ変更イベント//////////////
function WmSize() {
    const ca = document.getElementById('main');
    ca.width = window.innerWidth;                  //キャンバスの幅をブラウザの幅にする
    ca.height = window.innerHeight;                //キャンバスの幅をブラウザの高さに設定

    const g = ca.getContext("2d");                 //2D描画コンテキストを取得
    g.imageSmoothingEnabled = g.msImaggeSmoothingEnabled = SMOOTH;

    //実画面サイズを計測。ドットのアスペクト比を維持したままでの最大サイズを計測する。
    gHeight = ca.width;
    gWidth = ca.height;
    if (gWidth / WIDTH < gHeight / HEIGHT) {
        gHeight = gWidth * HEIGHT / WIDTH;
    } else {
        gWidth = gHeight * WIDTH / HEIGHT;
    }
}

// タイマーイベント発生時の処理
function WmTimer() {
    gFrame++;
    TickField();     //フィールド進行処理
    WmPaint();
}

/////////////キー入力(DOWNイベント)////////////////
window.onkeydown = function(ev)
{
    let c = ev.keyCode; //キーコード取得

    if(gKey[c] != 0) {  //すでに押下中の場合(キーリピート)
        return;
    }
    gKey[ c ] = 1;

    if(gPhase == 1) {       //敵が出現したフェーズ
        CommandFight();
        return;
    }
    if(gPhase == 2) {
        if(c == 13 || c == 90) {    //EnterまたはZキーの場合
            gOrder = Math.floor(Math.random() * 2); //行動順決め
            Action()                //戦闘行動処理
             
        }else{
            gCursor = 1 - gCursor;      //カーソル移動
        }
        return;
    }
    if(gPhase == 3) {
        Action();                   //戦闘行動処理
        return;
    }
    if(gPhase == 4) {
        CommandFight();         //戦闘コマンド選択
        return;
    }
    if(gPhase == 5) {
        gPhase = 6;
        AddExp(gEnemyType + 1);           //経験値加算
        SetMessage("敵をやっつけた！", null);
        return;
    }
    if(gPhase == 6) {
        if(IsBoss() && gCursor == 0) {  //ラスボスかつ戦い選択時
        SetMessage("魔王を倒し", "世界に平和が訪れた");
        return;
        }
        
        gPhase = 0;
    }
    if(gPhase == 7) {
        gPhase = 8;
        SetMessage("あなたは力尽きた！", null);
        return;
    }
    if(gPhase == 8) {
        SetMessage("ゲームオーバー", null);
        return;
    }
    gMessage1 = null;
}

//////////////キー入力(UPイベント)///////////////////
window.onkeyup = function(ev)
{
    gKey[ev.keyCode] = 0;
}

////////////// ブラウザ起動イベント ////////////////
window.onload = function () {
    LoadImage(); //マップ画像読み込み
    gScreen = document.createElement("canvas"); //仮想画面を作成
    gScreen.width = WIDTH; //仮想画面の幅を設定
    gScreen.height = HEIGHT; //仮想画面の高さを設定
    WmSize(); //画面サイズの初期化
    window.addEventListener("resize", function () {
        WmSize()
    }); //ブラウザサイズ変更時にWmSizeが呼びなおされる
    setInterval(function () {
        WmTimer()
    }, INTERVAL); //ミリ秒間隔でWmTimerを呼び出すよう指示

};