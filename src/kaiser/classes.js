const { cape } = require('../util/cape');
const { toTitleCase } = require('../util/stringHelper');

class PageNode {
    constructor(slug, weight, name, navName, tabName) {
        this.slug = String(slug);
        this.weight = Number(weight);
        this.path = slug.split('/').filter((e) => e);
        this.name = name;
        this.navName = navName || name;
        this.tabName = tabName || name;
        this.children = {};
        this.parent = {};
        this.orphans = [];
    }

    get breadName() {
        return this.name;
    }

    get depth() {
        return this.path.length;
    }

    putChild(childNode) {
        const myNodeLevel = this.depth;
        const childNodeLevel = childNode.depth;
        //IGNORE INVALID CHILDREN
        if (
            childNodeLevel <= myNodeLevel ||
            !this.path.every((s, i) => childNode.path[i] === s)
        ) {
            return;
        }

        const nextLevelPath = childNode.path[myNodeLevel];

        //Check and handle grandchild
        if (this.children[nextLevelPath]) {
            console.log(
                '[GRAND]',
                childNode.name,
                'is grandchild to',
                this.name
            );
            // this.children[nextLevelPath].putChild(childNode);
            return;
        }

        //Check and handle Direct child
        if (childNodeLevel === myNodeLevel + 1) {
            console.log('[CHILD]', childNode.name, 'is child to', this.name);
            this.children[nextLevelPath] = childNode;
            childNode.parent = this;
            return;
        }

        //Handle Orphan
        console.log('[ORPHN]', childNode.name, 'is an orphan to', this.name);
        this.orphans.push(childNode.name);
    }

    get navigationArray() {
        return Object.values(this.children).sort(PageNode.sort);
    }

    static sort(a, b) {
        if (typeof a.weight === 'number' && typeof b.weight === 'number') {
            if (a.weight < b.weight) return -1;
            if (a.weight > b.weight) return 1;
        }

        if (typeof a.name === 'string' && typeof b.name === 'string') {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        }
        return 0;
    }
}

class Tag {
    constructor(id, altId, slug, name, fnMap = {}, tipString) {
        this.id = String(id);
        this.altId = cape(altId)
            .map((e) => String(e))
            .filter((e) => e);

        this.slug = String(slug);

        this.name = String(name);

        this.tip = tipString;

        this.formatted = {
            a: fnMap?.a || fnMap['abbreviation'] || name,
            f: fnMap?.f || fnMap['formal'] || toTitleCase(name),
            p: fnMap?.p || fnMap['plural'] || toPlural(name),

            index: name,
        };

        this.formatted.af =
            fnMap?.af || fnMap['abbreviation+formal'] || this.formatted.a;
        this.formatted.ap =
            fnMap?.ap ||
            fnMap['abbreviation+plural'] ||
            toPlural(this.formatted.a);
        this.formatted.fp =
            fnMap?.fp || fnMap['formal+plural'] || toPlural(this.formatted.f);
        this.formatted.afp =
            fnMap?.afp ||
            fnMap['abbreviation+formal+plural'] ||
            toPlural(this.formatted.af);
    }

    toFormat(formatCode) {
        switch (formatCode) {
            case 'a': // abbreviation
            case 'f': // formal
            case 'p': // plural

            case 'af': // abbreviation + formal
            case 'ap': // abbreviation + plural

            case 'fp': // formal + plural

            case 'afp': // abbreviation + formal + plural
                return {
                    id: this.id,
                    slug: this.slug,
                    tip: this.tip,
                    name: this.formatted[formatCode],
                };
        }

        return {
            id: this.id,
            slug: this.slug,
            tip: this.tip,
            name: this.name,
        };
    }
}

const toPlural = (str) => {
    if (str) return str + 's';
    return undefined;
};

module.exports = { PageNode, Tag };
