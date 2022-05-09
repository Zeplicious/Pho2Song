let backToTopButton = document.getElementById("back-to-top")    /* Prendo il bottone dal file html */

window.addEventListener("scroll", scrollFunction);

function scrollFunction() {
    if (window.scrollY > 300) {
        if(!backToTopButton.classList.contains("btnEntrance")) {
            backToTopButton.classList.remove("btnExit");
            backToTopButton.classList.add("btnEntrance");
            backToTopButton.style.display = "block";        /* Mostra a schermo il bottone */
        }
    }
    else {
        if (backToTopButton.classList.contains("btnEntrance")) {
            backToTopButton.classList.remove("btnEntrance");
            backToTopButton.classList.add("btnExit");
            setTimeout(() => {
                backToTopButton.style.display = "none";         /* Nanscondi il bottone */
            }, 250);
        }
    }
}

backToTopButton.addEventListener("click", backToTop);

function backToTop() {
    window.scrollTo(0, 0)
}

/* Popovers della Landing Page */
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})