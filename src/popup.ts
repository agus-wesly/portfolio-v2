import './style.css'

const menuButton = document.getElementById("menu-btn") as HTMLButtonElement
const menuPopover = document.getElementById("menu-popover") as HTMLDivElement

function closeMenuPopover() {
    menuPopover.style.opacity = "0"
    menuPopover.style.pointerEvents = "none"
    menuPopover.blur()
    removeClickOutsideListener(menuPopover)
}

function openMenuPopover() {
    menuPopover.style.pointerEvents = "auto"
    menuPopover.style.opacity = "1"
    menuPopover.focus()
    addClickOutsideListener(menuPopover, () => {
        closeMenuPopover()
    })

}

menuButton.onclick = () => {
    const isVisible = menuPopover.style.pointerEvents === "auto"
    if (isVisible) {
        closeMenuPopover()
    } else {
        openMenuPopover()
    }
}

menuPopover.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
        closeMenuPopover()
    }
})

const onClickOutsideCbMap = new WeakMap<HTMLElement, (e: MouseEvent) => void>;

function addClickOutsideListener(el: HTMLElement, cb: () => void) {
    const fn = (e: MouseEvent) => {
        const bound = el.getBoundingClientRect()
        const isWithin = e.clientX > bound.left && e.clientX < bound.right 
            && e.clientY > bound.top && e.clientY < bound.bottom
        if (!isWithin) {
            cb()
        } 
    }

    const skipFirstClick = () => {
        document.removeEventListener("click", skipFirstClick);
        document.addEventListener("click", fn);
        onClickOutsideCbMap.set(el, fn);
    };

    document.addEventListener("click", skipFirstClick, { once: true });
}

function removeClickOutsideListener(el: HTMLElement){
    const stuff = onClickOutsideCbMap.get(el)
    if (!stuff) throw new Error("Should have cb")
    document.removeEventListener("click", stuff)
}

