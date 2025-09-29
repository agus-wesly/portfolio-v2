const imgEl = document.getElementById("hero-img") as HTMLImageElement
function main() {
    return
    const img = new Image()
    img.onload = () => {
        imgEl.src = img.src
        imgEl.style.display = "block"
    }
    img.src = "images/sullyoon.gif"
}

main()
