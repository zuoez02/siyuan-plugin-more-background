const { Plugin, Menu, showMessage, addIcon } = require('siyuan');

const icon = '<symbol id="icon-more-background" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/symbol" p-id="1928" ><path d="M1024 910.222222V113.777778c0-62.577778-51.2-113.777778-113.777778-113.777778H113.777778C51.2 0 0 51.2 0 113.777778v796.444444c0 62.577778 51.2 113.777778 113.777778 113.777778h796.444444c62.577778 0 113.777778-51.2 113.777778-113.777778zM312.888889 597.333333l142.222222 170.666667 199.111111-256L910.222222 853.333333H113.777778l199.111111-256z" p-id="1929"></path></symbol>';

module.exports = class MoreBackgroundPlugin extends Plugin {
    onload() {
        this.types = [
            { label: 'ACG', url: 'https://img.xjh.me/random_img.php?return=302' },
            { label: '必应壁纸', url: 'https://bing.biturl.top/?format=image&index=random&mkt=zh-CN' },
            { label: 'Unsplash', url: 'https://unsplash.it/1920/1080?random' },
            { label: 'Picsum', url: 'https://picsum.photos/1920/1080' }
        ];

        this.loadStorage();

        this.addIcons(icon);

        this.eventBus.on('loaded-protyle-static', (e) => {
            const protyle = e.detail.protyle;
            const background = protyle.background.element;
            if (!background) {
                return;
            }
            background.addEventListener('mouseover', (event) => {
                let el = event.target;
                if (!el.classList.contains('protyle-top')) {
                    el = el.closest('.protyle-top');
                }
                if (!el) {
                    return;
                }
                if (!el.querySelector('.protyle-icons') || el.querySelector('.protyle-icons > .more-background-icon')) {
                    return;
                }
                const firstIcon = el.querySelector('.protyle-icons > .protyle-icon.ariaLabel');
                if (!firstIcon) {
                    return;
                }
                const newIcon = document.createElement('span');
                newIcon.classList.add('protyle-icon');
                newIcon.classList.add('ariaLabel');
                newIcon.classList.add('more-background-icon');
                newIcon.setAttribute('data-link', 'more-background');
                newIcon.setAttribute('aria-label', this.i18n.moreBackgroundBtn);
                newIcon.innerHTML = '<svg><use xlink:href="#icon-more-background"></use></svg>';
                firstIcon.before(newIcon);
                newIcon.addEventListener('click', (e) => {
                    this.showThemesMenu(e.target.getBoundingClientRect(), protyle)
                    e.preventDefault();
                    e.stopImmediatePropagation();
                })
            })
        })


    }

    async loadStorage() {
        const data = await this.loadData('settings');
        if (!data) {
            return;
        } else {
            const types = typeof data === 'string' ? JSON.parse(data) : data;
            this.types = this.types.concat(types);
        }
    }

    showThemesMenu(c, protyle) {
        const e = new Menu('MoreBackground');
        this.types.forEach((t) => {
            e.addItem({
                label: t.label,
                icon: null,
                click: () => this.loadRandomBackground(t.label, protyle),
            })
        })
        e.addSeparator();
        e.addItem({
            label: this.i18n.uploadFromClipboard,
            icon: 'iconClipboard',
            click: () => this.uploadFromClipboard(protyle),
        });
        e.open({ x: c.left, y: c.bottom, isLeft: !1 })
    }

    loadRandomBackground(label, protyle) {
        const url = this.types.find((t) => t.label === label).url;
        const el = protyle.contentElement;
        triggerRandomIfNoImg(el);
        this.loadImgSetHeader(url, protyle);
        this.lastType = label;
    }

    async uploadFromClipboard(protyle) {
        let img;
        const clipboardItems = await navigator.clipboard.read();
        for (const clipboardItem of clipboardItems) {
            if (clipboardItem.types.includes("image/png")) {
                const blob = await clipboardItem.getType("image/png");
                const imageURL = URL.createObjectURL(blob);
                img = imageURL;
                break;
            }
        }
        if (!img) {
            showMessage(this.i18n.noImageInClipboard);
            return;
        }
        const el = protyle.contentElement;
        triggerRandomIfNoImg(el);
        this.loadImgBlobSetHeader(img, protyle);
    }

    async loadImgBlobSetHeader(url, protyle) {
        const id = protyle.background.ial.id;
        protyle.background.element.setAttribute('style', 'cursor: wait');
        let img;
        try {
            img = await fetch(url)
        } catch {
            showMessage(this.i18n.loadUrlFailed)
            protyle.background.element.setAttribute('style', 'cursor: wait');
            return;
        }
        const imgurl = img.url
        try {
            const res = await fetch(imgurl);
            const blob = await res.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            await new Promise((resolve, reject) => {
                reader.onloadend = () => {
                    const base64data = reader.result;
                    fetch('/api/attr/setBlockAttrs', {
                        method: 'post',
                        body: JSON.stringify({
                            id: id,
                            attrs: {
                                "title-img": `background-image:url(${base64data})`
                            }
                        })
                    }).finally(() => {
                        resolve();
                    })
                }
                reader.onerror = reject;
                reader.onabort = reject;
            });
        } finally {
            protyle.background.element.removeAttribute('style');
        }
    }

    async loadImgSetHeader(url, protyle) {
        const id = protyle.background.ial.id;
        protyle.background.element.setAttribute('style', 'cursor: wait');
        let img;
        try {
            img = await fetch(url)
        } catch {
            showMessage(this.i18n.loadUrlFailed)
            protyle.background.element.setAttribute('style', 'cursor: wait');
            return;
        }
        const imgurl = img.url
        try {
            const res = await fetch(imgurl);
            const blob = await res.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            await new Promise((resolve, reject) => {
                reader.onloadend = () => {
                    const base64data = reader.result;
                    fetch('/api/attr/setBlockAttrs', {
                        method: 'post',
                        body: JSON.stringify({
                            id: id,
                            attrs: {
                                "title-img": `background-image:url(${base64data})`
                            }
                        })
                    }).finally(() => {
                        resolve();
                    })
                }
                reader.onerror = reject;
                reader.onabort = reject;
            });
        } finally {
            protyle.background.element.removeAttribute('style');
        }
    }

}

function triggerRandomIfNoImg(currentPage) {
    currentPage.querySelector('.protyle-background__img > img.fn__none')?.classList.remove('fn__none');
    currentPage.querySelector('.protyle-background')?.setAttribute('style', 'min-height: 30vh;');
    currentPage.querySelector('.protyle-background__img > .protyle-icons > span[data-type="position"]')?.classList.remove('fn__none');
}
