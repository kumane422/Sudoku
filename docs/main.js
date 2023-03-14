const main = async () => {
  const buf = document.querySelector("#img")
  const { data: { text } } = await Tesseract.recognize(buf, "eng", {
    logger: function(m) {
      console.log(m.status)
    }
  })

  document.querySelector("#result").textContent = text
}

window.onload = main()
