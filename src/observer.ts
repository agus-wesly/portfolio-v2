const observer = new IntersectionObserver(onIntersect, {
    root: null,
    rootMargin: '0px',
    threshold: 0,
})

let elements = document.querySelectorAll('[intersect-target]');
elements.forEach(el => {
    observer.observe(el)
})

function onIntersect(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log("test")
            entry.target.classList.add("fade")
        } 
    })
}
