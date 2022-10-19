const timeoutArr = [];

const newAnimationTimeout = (fn, time) => timeoutArr.push(setTimeout(fn, time));

const clearAnimationTimeout = () => timeoutArr.forEach((t) => clearTimeout(t));

const getFavs = () => {
    let oldListRaw = localStorage.getItem('favs');
    const list = JSON.parse(oldListRaw);

    if (list && Array.isArray(list) && list.every((e) => typeof e === 'string'))
        return list;

    // console.warn('issue with favs');
    return [];
};

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

//handle init
const renderFavItem = (favSlot, favId, favElement) => () => {
    if (favId && favElement) {
        const label = favElement.getElementsByTagName('label')[0];
        favSlot.replaceChildren(
            htmlToElement(
                `
                    <label>
                        <img src="/icons/ffffff/transparent/1x1/delapouite/round-star.svg" data-id="${favId}"/>
                        <a href='${favId}.html'>${label.textContent.trim()}</a>
                    </label>
                    `
            )
        );
        favSlot.className = 'fav filled';
    } else {
        favSlot.className = 'fav';
        favSlot.replaceChildren();
    }
};

const renderFav = (fadeIn = false) => {
    clearAnimationTimeout();
    const favList = getFavs();

    const titleStar = document.querySelector('div.title img');
    titleStar.className = favList.includes(titleStar.dataset.id)
        ? 'current-fav'
        : '';

    for (let i = 0; i < 10; i++) {
        const favSlot = document.getElementById(`fav-${i}`);
        const favId = favList[i] || '';
        const favElement = document.querySelector(`li[data-id='${favId}']`);
        const favFn = renderFavItem(favSlot, favId, favElement);

        if (fadeIn) {
            newAnimationTimeout(favFn, 500 + 300 * i);
        } else {
            favFn();
        }
    }
};

const toggleFav = (event) => {
    const id = event.target.dataset.id;
    const oldList = getFavs();
    if (Array.isArray(oldList)) {
        if (oldList.includes(id)) return removeFav(event);
        oldList.push(id);
        const listRaw = JSON.stringify(
            oldList.filter((e, i) => oldList.indexOf(e) === i)
        );
        localStorage.setItem('favs', listRaw);
    } else {
        localStorage.setItem('favs', `["${id}"]`);
    }

    renderFav();
};

const removeFav = (event) => {
    const id = event.target.dataset.id;
    const oldList = getFavs();
    if (Array.isArray(oldList)) {
        
        const listRaw = JSON.stringify(
            oldList.filter((e, i) => oldList.indexOf(e) === i && e !== id)
        );
        localStorage.setItem('favs', listRaw);
    } else {
        localStorage.setItem('favs', `["${id}"]`);
    }

    renderFav();
};

document.addEventListener('click', (event) => {
    if (event.target.matches('li.fav>label>img')) return removeFav(event);

    if (event.target.matches('.title img')) return toggleFav(event);
});

// localStorage.setItem('favs', `["/class"]`);
renderFav(true);
