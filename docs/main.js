const previewCanvas = document.getElementById("preview")
const recognizeCanvas = document.getElementById("recognize")
const main = () => {
  const upload = document.getElementById("upload")
  upload.addEventListener("change", e => {
    const file = e.target.files[0]
    loaded(file)
  })
}

const loaded = async file => {
  const prev = await previewImage(file)
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
}
}

// クイズ画像に対する文字認識
const recognize = async () => {
  const { data: { text } } = await Tesseract.recognize(recognizeCanvas, "eng", {
    logger: function(m) {
      console.log(m.status)
    }
  })

  document.querySelector("#result").textContent = text
}

window.onload = main()
