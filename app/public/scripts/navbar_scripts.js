function highlightLink(id) {
    let navLinks = document.getElementsByClassName("nav-link")

    for (let i = 0; i < navLinks.length; i++) {
        if (navLinks[i].id == id) {
            navLinks[i].classList.add("active")
        }
    }
}