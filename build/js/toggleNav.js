const pageMedia = document.querySelector('#page-media');
const toggleNav = document.querySelector('#nav-sidebar');

document.getElementById('toggle-nav').addEventListener(
    'click',
    function (event) {
        // If the clicked element doesn't have the right selector, bail
        if (!event.target.matches('#toggle-nav')) return;

        // Don't follow the link
        event.preventDefault();

        // Log the clicked element in the console
        console.log(event.target);

        pageMedia.classList.toggle('hidden-mobile');
        toggleNav.classList.toggle('hidden-mobile');
    },
    false
);

window.addEventListener(
    'keydown',
    function (e) {
        if (
            [
                'Space',
                'ArrowUp',
                'ArrowDown',
                'ArrowLeft',
                'ArrowRight',
            ].indexOf(e.code) > -1
        ) {
            e.preventDefault();
        }
        switch (e.code) {
            case 'ArrowLeft':
                window.location.href = prevSlug;
                break;

            case 'ArrowRight':
                window.location.href = nextSlug;
                break;
            case 'ArrowUp':
                pageMedia.scrollBy({
                    top: -0.3 * this.window.innerHeight,
                    behavior: 'smooth',
                });
                break;
            case 'ArrowDown':
                pageMedia.scrollBy({
                    top: 0.3 * this.window.innerHeight,
                    behavior: 'smooth',
                });
                break;
        }
    },
    false
);
