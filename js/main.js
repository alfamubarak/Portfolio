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
