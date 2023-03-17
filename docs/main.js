const main = () => {
  console.log("Start")
}

const loadImage = (obj) => {
  for(const file of obj.files) {
    const fileReader = new FileReader()
    fileReader.onload = (e => {
      const img = document.getElementById("img")
      img.src = e.target.result
    })
    fileReader.readAsDataURL(file)
  }
  kaiseki()
}

const kaiseki = async () => {
  const buf = document.querySelector("#img")
  const { data: { text } } = await Tesseract.recognize(buf, "eng", {
    logger: function(m) {
      console.log(m.status)
    }
  })

  document.querySelector("#result").textContent = text
}

window.onload = main()
