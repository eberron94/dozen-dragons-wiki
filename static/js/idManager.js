const toast = (str, timeout = 3000) => {
    // Get the snackbar DIV
    var x = document.getElementById('snackbar');

    x.textContent = str;

    // Add the "show" class to DIV
    x.className = 'show';

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
        x.className = x.className.replace('show', '');
    }, timeout);
};

const getList = () => {
    let oldListRaw = localStorage.getItem('copy-id-list');
    const list = JSON.parse(oldListRaw);

    if (list && Array.isArray(list) && list.every((e) => typeof e === 'string'))
        return list.sort();

    console.warn('issue with list');
    return [];
};

const getItemList = () => {
    const list = idList2Cards(getList());

    const toLI = ({ id, title }) =>
        `<li class=""><i class="delete" data-id="${id}">×</i> ${title
            .split('[')[0]
            .trim()}</li>`;

    const items = list
        .filter((e) => e.id.startsWith('item') || e.id.startsWith('baseitem'))
        .map(toLI);

    const spells = list.filter((e) => e.id.startsWith('spell')).map(toLI);
    const feats = list.filter((e) => e.id.startsWith('feat')).map(toLI);

    return { items, feats, spells };
};

const addItem = (newId) => {
    const oldList = getList();
    if (Array.isArray(oldList)) {
        oldList.push(newId);
        const listRaw = JSON.stringify(
            oldList.filter((e, i) => oldList.indexOf(e) === i).sort()
        );
        localStorage.setItem('copy-id-list', listRaw);
    } else {
        localStorage.setItem('copy-id-list', `["${newId}"]`);
    }
};

const removeItem = (delId) => {
    const oldList = getList();
    if (Array.isArray(oldList)) {
        const listRaw = JSON.stringify(
            oldList
                .filter((e, i) => oldList.indexOf(e) === i && e !== delId)
                .sort()
        );
        localStorage.setItem('copy-id-list', listRaw);
    } else {
        localStorage.setItem('copy-id-list', `["${newId}"]`);
    }
};

const idList2Cards = (list) => {
    if (Array.isArray(list) && list.length > 0)
        return list
            .filter((e) => typeof e === 'string')
            .map((id) => kaiser[id])
            .filter((e) => typeof e === 'object' && e.title);
    else if (typeof list === 'string') {
        return idList2Cards([list]);
    }

    return [];
};

const idList2Names = (list) => {
    return idList2Cards(list)
        .map((e) => e.title.split('[')[0].trim())
        .join(', ');
};

const handleUpdateId = () => {
    const idCountElem = document.getElementById('id-count');

    const list = getList();

    if (Array.isArray(list)) {
        idCountElem.textContent = list.length;
    } else {
        idCountElem.textContent = '0';
    }

    // Update dynamic list

    const dList = document.getElementById('id-tool-menu-selected-list');
    const itemLists = getItemList();

    let inner = '';

    if (itemLists.items?.length)
        inner += `<li>Items<ul>${itemLists.items.join('')}</ul></li>`;

    if (itemLists.spells?.length)
        inner += `<li>Spells<ul>${itemLists.spells.join('')}</ul></li>`;

    if (itemLists.feats?.length)
        inner += `<li>Feats<ul>${itemLists.feats.join('')}</ul></li>`;

    dList.innerHTML = inner;
};

const handleDeleteSingle = (event) => {
    const delId = event.target.dataset.id;

    if (delId) {
        removeItem(delId);
        toast(`Removed ${idList2Names([delId]) || delId}`, 1000);
    }

    handleUpdateId();
};

const handleClickCopyId = (event) => {
    event.preventDefault();

    const newId = event.target.dataset.id;

    if (newId) {
        addItem(newId);

        toast(`Selected ${idList2Names([newId]) || newId}`, 1000);
    }

    handleUpdateId();
};

const handleClickToggleManager = (event) => {
    event.preventDefault();

    if (document.getElementById('id-tool-min').style.display === 'none') {
        document.getElementById('id-tool-min').style.display = 'flex';
        document.getElementById('id-tool').style.display = 'none';
    } else {
        handleUpdateId();
        document.getElementById('id-tool-min').style.display = 'none';
        document.getElementById('id-tool').style.display = 'flex';
    }
};

const handleCopyId = (event) => {
    event.preventDefault();
    const idList = getList();
    console.log('copying', idList);
    if (isList.length) {
        navigator.clipboard.writeText(idList.join(', '));
        toast('Copied IDs to clipboard');
    }
};

const handleDownload = (event) => {
    event.preventDefault();
    const idList = getList();
    if (!idList.length) return;

    const data = idList2Cards(idList);

    var element = document.createElement('a');
    element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(data, null, 4))
    );
    element.setAttribute('download', 'rpg-common-cards.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
};

const handleCopyName = (event) => {
    event.preventDefault();
    const idList = getList();
    if (!idList.length) return;

    const names = idList2Names(idList);

    navigator.clipboard.writeText(names);
    toast('You have selected the following cards:\n' + names);
};

const handleCopyData = (event) => {
    event.preventDefault();
    const idList = getList();
    if (!idList.length) return;

    const data = idList2Cards(idList);

    navigator.clipboard.writeText(JSON.stringify(data));
    toast(
        'Copied card data to clipboard. You can use it on www.rpgmaterialcard.com'
    );
};

const handleTrashData = (event) => {
    event.preventDefault();
    localStorage.removeItem('copy-id-list');
    handleUpdateId();
    toast('Cleared ID clipboard');
};

const handleClickToTop = () => {
    document.getElementById('page-media').scrollTop = 0;
};

document.addEventListener('click', (event) => {
    if (event.target.matches('.item-card-title img'))
        return handleClickCopyId(event);

    if (event.target.matches('#id-tool-menu-selected-list .delete'))
        return handleDeleteSingle(event);
});

document
    .getElementById('id-tool-min')
    .addEventListener('click', handleClickToggleManager);

document
    .getElementById('id-tool-menu-bar')
    .addEventListener('click', handleClickToggleManager);

document
    .getElementById('top-scroll-btn')
    .addEventListener('click', handleClickToTop);

document
    .getElementById('id-tool-actions-copy-id')
    .addEventListener('click', handleCopyId);

document
    .getElementById('id-tool-actions-download-data')
    .addEventListener('click', handleDownload);

document
    .getElementById('id-tool-actions-copy-data')
    .addEventListener('click', handleCopyData);

document
    .getElementById('id-tool-actions-delete')
    .addEventListener('click', handleTrashData);

document
    .getElementById('id-tool-actions-copy-name')
    .addEventListener('click', handleCopyName);

// document
//     .getElementById('id-tool-actions')
//     .getElementsByClassName('download-data')
//     .addEventListener('click', (event) => {
//         event.preventDefault();
//     });

// document
//     .getElementById('id-tool-actions')
//     .getElementsByClassName('copy-data')
//     .addEventListener('click', (event) => {
//         event.preventDefault();
//     });

// document
//     .getElementById('id-tool-actions')
//     .getElementsByClassName('delete')
//     .addEventListener('click', (event) => {
//         event.preventDefault();
//         localStorage.removeItem('copy-id-list');
//     });
