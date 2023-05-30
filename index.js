const { Plugin, Menu } = require('siyuan');

const icon = '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1928" width="200" height="200"><path d="M1024 910.222222V113.777778c0-62.577778-51.2-113.777778-113.777778-113.777778H113.777778C51.2 0 0 51.2 0 113.777778v796.444444c0 62.577778 51.2 113.777778 113.777778 113.777778h796.444444c62.577778 0 113.777778-51.2 113.777778-113.777778zM312.888889 597.333333l142.222222 170.666667 199.111111-256L910.222222 853.333333H113.777778l199.111111-256z" p-id="1929"></path></svg>';

module.exports = class MoreBackgroundPlugin extends Plugin {
    onload() {
        const c = this.addTopBar({
            icon,
            title: '随机题头图',
            callback: (e) => {
                this.showThemesMenu(c.getBoundingClientRect())
            },
            position: "right"
        });

        this.types = [
            { label: 'ACG', url: 'https://img.xjh.me/random_img.php?return=302' },
        ];

        this.loadStorage();
    }

    async loadStorage() {
        const data = await this.loadData('settings');
        if (!data) {
            this.saveData('settings', JSON.stringify(this.types));
        } else {
            this.types = JSON.parse(data);
        }
    }

    showThemesMenu(c) {
        const e = new Menu('MoreBackground');
        this.types.forEach((t) => {
            e.addItem({
                label: t.label,
                click: () => this.loadRandomBackground(t.label),
            })
        })
        e.open({ x: c.left, y: c.bottom, isLeft: !1 })
    }

    loadRandomBackground(label) {
        const url = this.types.find((t) => t.label === label).url;
        triggerRandomIfNoImg();
        this.loadImgSetHeader(url);
    }

    async loadImgSetHeader(url) {
        const currentId = getFileID();
        const headers = document.querySelectorAll(`.protyle-background[data-node-id="${currentId}"] div.protyle-background__img img`)
        const img = await fetch(url)
        const imgurl = img.url
        headers.forEach(
            el => {
                el.setAttribute("style", "")
                el.setAttribute("src", imgurl)
            }
        )
        fetch('/api/attr/setBlockAttrs', {
            method: 'post',
            body: JSON.stringify({
                id: currentId,
                attrs: {
                    "title-img": `background-image:url(${imgurl})`
                }
            })
        })
    }

}

function getFileID() {
    //获取当前页面
    const currentPage = getCurrentPage();
    //获取当前页面id
    const currentPageID = currentPage.querySelector(
        "span.protyle-breadcrumb__item--active"
    ).getAttribute("data-node-id");

    return currentPageID;
}

function triggerRandomIfNoImg() {
    const currentPage = getCurrentPage();
    currentPage.querySelector('.protyle-background__img > img.fn__none')?.classList.remove('fn__none');
    currentPage.querySelector('.protyle-background')?.setAttribute('style', 'min-height: 30vh;');
    currentPage.querySelector('.protyle-background__img > .protyle-icons > span[data-type="position"]')?.classList.remove('fn__none');
}

function getCurrentPage() {
    var currentScreen;
    var currentPage;
    try {
        //获取当前屏幕
        currentScreen = document.querySelector(".layout__wnd--active");
        //获取当前页面
        currentPage = currentScreen.querySelector(
            ".fn__flex-1.protyle:not(.fn__none)"
        );
        return currentPage;
    } catch (e) {
        console.error(`未能获取到页面焦点！`)
    }
    throw new Error("未能获取到页面焦点！");
}