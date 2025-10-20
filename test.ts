const button = document.getElementById("button") as HTMLButtonElement

const drawerBg = document.getElementById("drawer-bg") as HTMLDivElement
const drawer = document.getElementById("drawer") as HTMLDivElement

const MAX_OFFSET_Y = 200;

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

let p1: number = 0;
let t1: number = 0;
let posDiff: number = 0;
function cb(e: MouseEvent) {
    posDiff = e.clientY - p1;
    drawer.style.transform = `translate3d(0px, ${posDiff}px, 0px)`
}

drawer.addEventListener("pointerdown", (e) => {
    p1 = e.clientY;
    t1 = Date.now();
    document.addEventListener("pointermove", cb)
})

document.addEventListener("pointerup", () => {
    if (drawer.style.display === "none") return;
    document.removeEventListener("pointermove", cb)

    let timeDiff = Date.now() - t1;
    let isHighlySnapped = timeDiff < 150 && posDiff > 0;

    const translate = window.getComputedStyle(drawer).transform
    const mtrx = new DOMMatrixReadOnly(translate)
    const posY = mtrx.m42
    const isBelowOffset = posY > MAX_OFFSET_Y;
    if (isBelowOffset || isHighlySnapped) {
        hide()
    } else {
        drawer.classList.remove("show");
        drawer.classList.add("back");

        const fn = () => {
            drawer.classList.remove("back");
            drawer.style.transform = `translate3d(0px, 0px, 0px)`
            drawer.removeEventListener("animationend", fn)
        }
        drawer.addEventListener("animationend", fn)
    }

    t1 = 0;
    posDiff = 0;
    p1 = 0;
})

document.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
        hide()
    }
})
