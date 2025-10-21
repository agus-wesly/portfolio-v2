const button = document.getElementById("button") as HTMLButtonElement
const drawerBg = document.getElementById("drawer-bg") as HTMLDivElement
const drawer = document.getElementById("drawer") as HTMLDivElement

const POS_Y_OFFSET = 200;
const TIME_OFFSET = 150;

function isDrawerDisplayed() {
    return drawer.style.display === "block";
}

function isDrawerHide() {
    return drawer.style.display === "none";
}

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

function restore() {
    drawer.classList.remove("show");
    drawer.classList.add("restore");

    const animationEndCb = () => {
        drawer.classList.remove("restore");
        drawer.style.transform = `translate3d(0px, 0px, 0px)`
        drawer.removeEventListener("animationend", animationEndCb)
    }
    drawer.addEventListener("animationend", animationEndCb)
}

button.addEventListener("click", () => {
    show()
})

let initPos: number = 0;
let initTime: number = 0;
let posDifference: number = 0;

function pointerMoveCb(e: MouseEvent) {
    posDifference = e.clientY - initPos;
    drawer.style.transform = `translate3d(0px, ${posDifference}px, 0px)`
}

drawer.addEventListener("pointerdown", (e) => {
    initPos = e.clientY;
    initTime = Date.now();
    document.addEventListener("pointermove", pointerMoveCb)
})

document.addEventListener("pointerup", () => {
    if (isDrawerHide()) return;
    document.removeEventListener("pointermove", pointerMoveCb)

    let timeDifference = Date.now() - initTime;
    let isHighlySnapped = timeDifference < TIME_OFFSET && posDifference > 0;

    const translate = window.getComputedStyle(drawer).transform
    const mtrx = new DOMMatrixReadOnly(translate)
    const posY = mtrx.m42
    const isBelowOffset = posY > POS_Y_OFFSET;
    if (isBelowOffset || isHighlySnapped) {
        hide()
    } else {
        restore()
    }

    initTime = 0;
    posDifference = 0;
    initPos = 0;
})


document.addEventListener("keydown", (e) => {
    if (isDrawerDisplayed() && e.code === "Escape") {
        hide()
    }
})

drawerBg.addEventListener("pointerdown", () => {
    hide();
})
