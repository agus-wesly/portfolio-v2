const button = document.getElementById("button") as HTMLButtonElement

const drawerBg = document.getElementById("drawer-bg") as HTMLDivElement
const drawer = document.getElementById("drawer") as HTMLDivElement

async function show() {
    drawerBg.style.display = "block"
    drawer.style.display = "block"

    drawer.classList.remove("hide")
    drawer.classList.add("show")
}

function hide() {
    const fn = () => {
        drawer.style.display = "none"
        drawer.style.transform = `translate3d(0px, 0px, 0px)`
        drawer.removeEventListener("animationend", fn)
    }
    drawer.addEventListener("animationend", fn)

    drawerBg.style.display = "none"
    drawer.classList.remove("show")
    drawer.classList.add("hide")

}

button.addEventListener("click", () => {
    show()
})

let showMe = false
function cb(e: MouseEvent) {
    if (!showMe) {
        console.log("SHOWW", drawer.getBoundingClientRect().top)
        showMe = true
    }
    drawer.style.transform = `translate3d(0px, ${e.clientY}px, 0px)`
}

drawer.addEventListener("pointerdown", () => {
    document.addEventListener("pointermove", cb)
})

document.addEventListener("pointerup", () => {
    console.log("removing")
    const translate = window.getComputedStyle(drawer).transform
    const mtrx = new DOMMatrixReadOnly(translate)
    const deltaY = mtrx.m42
    document.removeEventListener("pointermove", cb)

    if (deltaY > 200) {
        hide()
    }

    // We also need to find how fast we dropped it
    // And based on that we can choose to hide
})

document.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
        hide()
    }
})
