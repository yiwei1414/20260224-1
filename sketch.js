// 全域變數定義
let shapes = [];
let song;
let amplitude;
// 外部定義的二維陣列，作為多邊形頂點的基礎座標
let points = [[-3, -5], [0, -10], [3, -5], [10, -5], [5, 0], [7, 7], [0, 3], [-7, 7], [-5, 0], [-10, -5]];

function preload() {
  // 1. 在程式開始前預載入外部音樂資源
  // 請確保你的目錄下有這個音檔，或換成有效的 URL
  song = loadSound('midnight-quirk-255361.mp3');
}

function setup() {
  // 2. 初始化畫布
  createCanvas(windowWidth, windowHeight);
  
  // 初始化音量解析器
  amplitude = new p5.Amplitude();
  
  // 自動播放並循環音樂
  if (song.isLoaded()) {
    song.loop();
  }

  // 3. 使用迴圈產生 10 個形狀物件
  for (let i = 0; i < 10; i++) {
    let shapeObj = {
      x: random(0, windowWidth),
      y: random(0, windowHeight),
      dx: random(-3, 3),
      dy: random(-3, 3),
      size: random(1, 10), // 初始縮放比例
      color: color(random(255), random(255), random(255)),
      // 透過 map 讀取 points，並乘上 10 到 30 之間的隨機倍率產生變形
      points: points.map(p => ({
        x: p[0] * random(10, 30),
        y: p[1] * random(10, 30)
      }))
    };
    shapes.push(shapeObj);
  }
}

function draw() {
  // 4. 設定背景顏色與邊框
  background('#ffcdb2');
  strokeWeight(2);

  // 5. 抓取音量並映射縮放倍率
  let level = amplitude.getLevel(); // 取得 0.0 到 1.0 的數值
  // 將 level 從 (0, 1) 映射到 (0.5, 2) 做為動態縮放基礎
  let sizeFactor = map(level, 0, 1, 0.5, 2);

  // 6. 走訪每個 shape 進行更新與繪製
  for (let shape of shapes) {
    // 位置更新
    shape.x += shape.dx;
    shape.y += shape.dy;

    // 邊緣反彈檢查
    if (shape.x < 0 || shape.x > windowWidth) {
      shape.dx *= -1;
    }
    if (shape.y < 0 || shape.y > windowHeight) {
      shape.dy *= -1;
    }

    // 設定外觀顏色
    fill(shape.color);
    stroke(shape.color);

    // 座標轉換與繪製
    push();
    translate(shape.x, shape.y);
    // 依照音樂音量即時縮放
    scale(sizeFactor); 
    
    // 繪製多邊形
    beginShape();
    for (let p of shape.points) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
    pop();
  }
}

// 處理視窗大小改變
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 點擊畫面開始播放 (瀏覽器通常要求使用者互動後才能播放音訊)
function mousePressed() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}