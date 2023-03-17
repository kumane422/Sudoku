const previewCanvas = document.getElementById("preview")
const recognizeCanvas = document.getElementById("recognize")
const array = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const main = () => {
  const upload = document.getElementById("upload")
  upload.addEventListener("change", e => {
    const file = e.target.files[0]
    loaded(file)
  })
}

const loaded = async file => {
  const prev = await previewImage(file)
  const img = await loadImage(prev)
  await imageToCanvas(img)

  const text = await recognize()
  setQuizArray(text)
  console.log(array)
}

// アップロードされた画像をプレビュー表示
const previewImage = async file => {
  return new Promise(resolve => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      previewCanvas.src = fileReader.result
      resolve(fileReader.result)
    }
    fileReader.readAsDataURL(file)
  })
}

// ファイルロード
const loadImage = async src => {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = src
  })
}

// 数字か空欄か
const isNum = (sx, sy, sw, sh) => {
  const ctx = recognizeCanvas.getContext("2d")
  let ave = 0
  for (let x = sx; x < sx + sw; x++) {
    for (let y = sy; y < sy + sh; y++) {
      const { data: [r, g, b] } = ctx.getImageData(x, y, 1, 1)
      ave += (255 - r + 255 - g + 255 - b)
    }
  }
  ave /= sw * sh
  return ave > 30 // 30は適当?
}

// アップロードされた画像から解析用に調整してCanvas表示
const imageToCanvas = async image => {
  return new Promise(resolve => {
    recognizeCanvas.getContext("2d").drawImage(image, 0, 0, image.width, image.height, 0, 0, recognizeCanvas.width, recognizeCanvas.height)
    const iw = image.width / 9
    const ih = image.height / 9
    const cw = recognizeCanvas.width / 9
    const ch = recognizeCanvas.height / 9
    const d = recognizeCanvas.width / image.width - 0.11
    const ctx = recognizeCanvas.getContext("2d")
    ctx.fillStyle = "blue"
    ctx.font = `${Math.floor(cw * 1)}px sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    for(let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        const n = 
        ctx.drawImage(
          image,
          iw * (j + (1 - d) / 2), ih * (i + (1 - d) / 2),
          iw * d,
          ih * d,
          cw * j,
          ch * i,
          cw,
          ch
        )
        if (!isNum(cw * j, ch * i, cw, ch)) {
          ctx.fillText("0", cw * (j + 0.5), ch * (i + 0.5))
        }
      }
    }
    resolve()
  })
}

// クイズ画像に対する文字認識
const recognize = async () => {
  const { data: { text } } = await Tesseract.recognize(recognizeCanvas, "eng", {
    logger: function(m) {
      console.log(m.status)
    }
  })
  return text
}

// 解析した文字列を問題の初期状態の形にする
const setQuizArray = (text = "") => {
  text = text.replace(" ", "").replace("　", "")
  let t = 0
  for(let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      array[i][j] = text[t] == 0 ? "0" : text[t]
      t++
    }
    t++
  }
}

window.onload = main()
