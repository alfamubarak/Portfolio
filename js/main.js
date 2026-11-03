let hamburger = document.querySelector('.hamburger');
let menu = document.querySelector('.menu');

hamburger.addEventListener('click', () => {
    menu.classList.toggle('show');
    hamburger.classList.toggle('open');
});


// ---- SCROLL REVEAL (phones and tablets) ----

// The three white panels on the home page.
let panels = document.querySelectorAll(
    '.about__inner, .what-i-do__inner, .featured-projects__inner'
);

// Only run on pages that have panels and in browsers that support it.
if (panels.length > 0 && 'IntersectionObserver' in window) {

    // Tells the CSS that JavaScript is ready, so it can safely start
    // panels hidden. Without JS they stay visible.
    document.documentElement.classList.add('js-ready');

    // The observer watches each panel and tells us when it enters the screen.
    let observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // reveal each panel only once
            }
        });
    }, { threshold: 0.1 });

    panels.forEach((panel) => observer.observe(panel));
}


// ---- STICKY CARDS ----

// Home panels and the two about-page cards.
// A card only sticks on small screens while it fits under the navbar.
// A card taller than the screen would hide its own bottom edge.
let stickyCards = document.querySelectorAll(
    '.about, .what-i-do, .featured-projects, .about-sticky'
);

if (stickyCards.length > 0) {
    let updateStickyCards = () => {
        let narrow = window.innerWidth <= 960;

        stickyCards.forEach((card) => {
            if (narrow) {
                // Phone/tablet: keep the card's bottom edge on screen.
                // Tall cards scroll by first, then park with a negative top.
                let top = Math.min(96, window.innerHeight - card.offsetHeight - 16);
                card.style.setProperty('--sticky-top', top + 'px');
                card.classList.add('is-pinned');
            } else {
                // Desktop: only pin a card if it fits under the navbar.
                // A card taller than the screen would hide its own bottom.
                let room = window.innerHeight - 152 - 16;
                card.style.removeProperty('--sticky-top');
                card.classList.toggle('is-pinned', card.offsetHeight <= room);
            }
        });
    };

    updateStickyCards();
    window.addEventListener('load', updateStickyCards);
    window.addEventListener('resize', updateStickyCards);

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(updateStickyCards);
    }
}
