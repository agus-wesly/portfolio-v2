const button = document.getElementById("button") as HTMLButtonElement
const drawerBg = document.getElementById("drawer-bg") as HTMLDivElement
const drawer = document.getElementById("drawer") as HTMLDivElement

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

    document.body.style.overflow = "hidden"
    document.body.style.touchAction = "none"
}

function hide() {
    const fn = () => {
        drawer.style.display = "none"
        drawer.style.transform = `translate3d(0px, 0px, 0px)`

        document.body.style.overflow = "auto"
        document.body.style.touchAction = "auto"

        drawer.removeEventListener("animationend", fn)
    }
    drawer.addEventListener("animationend", fn)

    drawerBg.style.display = "none"
    drawer.classList.remove("restore")
    drawer.classList.remove("show")
    drawer.classList.add("hide")
}

function hideInstant() {
    drawerBg.style.display = "none"
    drawer.classList.remove("restore")
    drawer.classList.remove("show")
    drawer.classList.add("hide")

    drawer.style.display = "none"
    drawer.style.transform = `translate3d(0px, 0px, 0px)`

    document.body.style.overflow = "auto"
    document.body.style.touchAction = "auto"
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
    posDifference = Math.max(-8, posDifference)
    drawer.style.transform = `translate3d(0px, ${posDifference}px, 0px)`
}

drawer.addEventListener("pointerdown", (e) => {
    const targetElement = e.target as Element;
    if (targetElement.closest(".scrollable")) {
        return;
    }
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

    const yOffset = 0.25 * drawer.offsetHeight;
    const isBelowOffset = posY > yOffset;
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





/* 
* The Hashchange Handler
*
* */
{
    const allElements: Array<Element> = []

    const h2List = document.querySelectorAll("article h2");
    const h3List = document.querySelectorAll("article h3");

    const set: Set<Element> = new Set();

    h2List.forEach(el => {
        allElements.push(el)
    })
    h3List.forEach(el => {
        allElements.push(el)
    })

    const observer = new IntersectionObserver(onIntersect, {
        root: null,
        rootMargin: '0px',
        threshold: 0,
    })

    function makeEntryActive(entry: Element | undefined) {
        if (!entry) return
        for (let i = 0; i < allElements.length; ++i) {
            const current = allElements[i];
            const linkInDrawer = document.querySelector(`#link-${current.id}`) as HTMLAnchorElement | null
            const linkInAside = document.querySelector(`aside #link-${current.id}`) as HTMLAnchorElement | null;
            if (current === entry) {
                if (linkInAside)
                    linkInAside.style.color = "#e5e5e5"
                if (linkInDrawer)
                    linkInDrawer.style.color = "#e5e5e5"
            } else {
                if (linkInAside)
                    linkInAside.style.color = "#525252"
                if (linkInDrawer)
                    linkInDrawer.style.color = "#525252"
            }
        }
    }

    function onIntersect(entries: IntersectionObserverEntry[]) {
        for (let i = 0; i < entries.length; ++i) {
            const entry = entries[i];
            if (entry.isIntersecting) {
                set.add(entry.target)
            } else {
                set.delete(entry.target)
            }
            const sorted = Array.from(set).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
            makeEntryActive(sorted[0])
        }
    }
    allElements.forEach(el => {
        observer.observe(el)
    })
}

{
    /* 
    * The Hashchange Handler
    *
    * */
    const tocInDrawer = document.querySelectorAll('[id^="link-"]') as NodeListOf<HTMLAnchorElement>
    const tocInAside = document.querySelectorAll('aside [id^="link-"]') as NodeListOf<HTMLAnchorElement>
    const toc = [...tocInDrawer, ...tocInAside]

    function updateHash() {
        hideInstant()
        toc.forEach(el => {
            const curr_hash = new URL(el.href).hash
            if (curr_hash === window.location.hash) {
                el.style.color = "#e5e5e5"
            } else {
                el.style.color = "#525252"
            }
        })

    }

    window.addEventListener("hashchange", updateHash)

    document.body.onload = () => {
        updateHash()
    }
}
