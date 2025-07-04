const { Plugin, Menu, showMessage, getAllEditor, Setting, openSetting } = require('siyuan');

const icon = '<symbol id="icon-more-background" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/symbol" p-id="1928" ><path d="M1024 910.222222V113.777778c0-62.577778-51.2-113.777778-113.777778-113.777778H113.777778C51.2 0 0 51.2 0 113.777778v796.444444c0 62.577778 51.2 113.777778 113.777778 113.777778h796.444444c62.577778 0 113.777778-51.2 113.777778-113.777778zM312.888889 597.333333l142.222222 170.666667 199.111111-256L910.222222 853.333333H113.777778l199.111111-256z" p-id="1929"></path></symbol>';

const STORAGE_NAME = 'settings';

module.exports = class MoreBackgroundPlugin extends Plugin {
    data = {
        [STORAGE_NAME]: {
            width: 1920,
            height: 1080,
            readFromAssets: true,
            writeToAssets: false,
            assetsLocation: '/assets/siyuan-plugin-more-background',
            types: [
                { label: 'ACG', url: 'https://img.xjh.me/random_img.php?return=302' },
                { label: '必应壁纸', url: 'https://bing.biturl.top/?format=image&index=random&mkt=zh-CN' },
                { label: 'Unsplash', url: 'https://unsplash.it/{width}/{height}?random' },
                { label: 'Picsum', url: 'https://picsum.photos/{width}/{height}' }
            ],
        }
    }

    onload() {
        this.loadStorage();

        this.setSetting();

        this.addIcons(icon);

        const editors = getAllEditor();

        editors.forEach((editor) => {
            const protyle = editor.protyle;
            try {
                this.initBackgroundPlusOnProtyle(protyle);
            } catch (e) {
                console.error(e)
            }
        });

        this.eventBus.on('loaded-protyle-static', (e) => {
            const protyle = e.detail.protyle;
            try {
                this.initBackgroundPlusOnProtyle(protyle);
            } catch (e) {
                console.error(e)
            }
        });
    }

    setSetting() {
        const widthEl = document.createElement("input");
        const heightEl = document.createElement("input");
        const readFromAssetsEl = document.createElement('input')
        const writeToAssetsEl = document.createElement('input')
        const assetsLocationEl = document.createElement('input')
        const descriptionEl = document.createElement('div');
        descriptionEl.textContent = this.i18n.supportImageSize;

        this.setting = new Setting({
            confirmCallback: () => {
                console.log(readFromAssetsEl.checked, readFromAssetsEl.value)
                this.data[STORAGE_NAME].width = widthEl.value || '1920';
                this.data[STORAGE_NAME].height = heightEl.value || '1080';
                this.data[STORAGE_NAME].readFromAssets = readFromAssetsEl.checked;
                this.data[STORAGE_NAME].writeToAssets = writeToAssetsEl.checked;
                this.data[STORAGE_NAME].assetsLocation = assetsLocationEl.value || '/assets/siyuan-plugin-more-background';
                console.log(this.data[STORAGE_NAME])
                this.saveStorage();
            }
        });
        this.setting.addItem({
            title: this.i18n.descriptionTitle,
            direction: 'row',
            createActionElement: () => descriptionEl,
        });
        this.setting.addItem({
            title: this.i18n.widthTitle,
            direction: 'column',
            createActionElement: () => {
                widthEl.className = "b3-text-field fn__flex-center fn__size200";
                widthEl.placeholder = this.i18n.widthTitle;
                widthEl.value = this.data[STORAGE_NAME].width;
                return widthEl;
            },
        });
        this.setting.addItem({
            title: this.i18n.heightTitle,
            direction: 'column',
            createActionElement: () => {
                heightEl.className = "b3-text-field fn__flex-center fn__size200";
                heightEl.placeholder = this.i18n.heightTitle;
                heightEl.value = this.data[STORAGE_NAME].height;
                return heightEl;
            },
        });
        this.setting.addItem({
            title: this.i18n.assetsLocation,
            direction: 'column',
            description: this.i18n.assetsLocationDesc,
            createActionElement: () => {
                assetsLocationEl.className = "b3-text-field fn__flex-center fn__size200";
                assetsLocationEl.placeholder = this.i18n.assetsLocation;
                assetsLocationEl.value = this.data[STORAGE_NAME].assetsLocation;
                return assetsLocationEl;
            },
        });
        this.setting.addItem({
            title: this.i18n.readFromAssets,
            direction: 'column',
            createActionElement: () => {
                readFromAssetsEl.className = "b3-switch fn__flex-center fn__size200";
                readFromAssetsEl.type = "checkbox";
                if (this.data[STORAGE_NAME].readFromAssets) {
                    readFromAssetsEl.checked = true;
                } else {
                    readFromAssetsEl.checked = undefined;
                }
                return readFromAssetsEl;
            },
        });
        this.setting.addItem({
            title: this.i18n.writeToAssets,
            direction: 'column',
            createActionElement: () => {
                writeToAssetsEl.className = "b3-switch fn__flex-center fn__size200";
                writeToAssetsEl.type = "checkbox";
                if (this.data[STORAGE_NAME].writeToAssets) {
                    writeToAssetsEl.checked = true;
                } else {
                    writeToAssetsEl.checked = undefined;
                }
                return writeToAssetsEl;
            },
        });

        const resetBtn = document.createElement("button");
        resetBtn.className = "b3-button b3-button--outline fn__flex-center fn__size200";
        resetBtn.textContent = this.i18n.resetBtn;
        resetBtn.addEventListener("click", () => {
            this.data[STORAGE_NAME] = {
                width: 1920,
                height: 1080,
                readFromAssets: true,
                writeToAssets: false,
                assetsLocation: '/assets/siyuan-plugin-more-background',
                types: [
                    { label: 'ACG', url: 'https://img.xjh.me/random_img.php?return=302' },
                    { label: '必应壁纸', url: 'https://bing.biturl.top/?format=image&index=random&mkt=zh-CN' },
                    { label: 'Unsplash', url: 'https://unsplash.it/{width}/{height}?random' },
                    { label: 'Picsum', url: 'https://picsum.photos/{width}/{height}' }
                ],
            };
            widthEl.value = this.data[STORAGE_NAME].width;
            heightEl.value = this.data[STORAGE_NAME].height;
            assetsLocationEl.value = this.data[STORAGE_NAME].assetsLocation;
            if (this.data[STORAGE_NAME].readFromAssets) {
                readFromAssetsEl.checked = true;
            } else {
                readFromAssetsEl.checked = undefined;
            }
            if (this.data[STORAGE_NAME].writeToAssets) {
                writeToAssetsEl.checked = true;
            } else {
                writeToAssetsEl.checked = undefined;
            }

        });
        this.setting.addItem({
            title: this.i18n.resetBtn,
            actionElement: resetBtn,
        });

    }

    initBackgroundPlusOnProtyle(protyle) {
        const background = protyle.background?.element;

        // handle url change
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    const url = mutation.target.getAttribute('src');
                    if (this.isVideo(url)) {
                        this.renderVideo(protyle, url);
                    }
                }
            });
        });

        mutationObserver.observe(background.querySelector('img'), {
            attributes: true,
            attributeFilter: ['src'],

        });
        const url = protyle.background.element.querySelector('img')?.getAttribute('src');
        if (url && this.isVideo(url)) {
            this.renderVideo(protyle, url);
        }
        // cover显示按钮添加保存
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
    }

    async loadStorage() {
        const data = await this.loadData(STORAGE_NAME);
        if (!data) {
            return;
        } else {
            const obj = typeof data === 'string' ? JSON.parse(data) : data;
            if (Array.isArray(obj)) {
                this.data[STORAGE_NAME].types = this.data[STORAGE_NAME].concat(types);
                await this.saveStorage();
            } else {
                Object.assign(this.data[STORAGE_NAME], obj)
            }
        }
    }

    async saveStorage() {
        this.saveData(STORAGE_NAME, this.data[STORAGE_NAME]);
    }

    showThemesMenu(c, protyle) {
        const e = new Menu('MoreBackground');
        this.data[STORAGE_NAME].types.forEach((t) => {
            e.addItem({
                label: t.label,
                icon: null,
                click: () => this.loadRandomBackground(t.label, protyle),
            })
        });
        e.addSeparator();
        e.addItem({
            label: this.i18n.uploadFromClipboard,
            icon: 'iconCopy',
            click: () => this.uploadFromClipboard(protyle),
        });
        if (this.data[STORAGE_NAME].readFromAssets) {
            e.addItem({
                label: this.i18n.loadFromAssets,
                icon: 'iconUpload',
                click: () => this.uploadFromAssets(protyle),
            })
        }
        e.addSeparator();
        e.addItem({
            label: this.i18n.openSetting,
            icon: 'iconSettings',
            click: () => this.openSetting()
        })
        e.open({ x: c.left, y: c.bottom, isLeft: !1 })
    }

    loadRandomBackground(label, protyle) {
        const url = this.data[STORAGE_NAME].types.find((t) => t.label === label).url;
        const uurl = url.replace('{height}', this.data[STORAGE_NAME].height).replace('{width}', this.data[STORAGE_NAME].width);
        const el = protyle.contentElement;
        triggerRandomIfNoImg(el);
        this.loadImgSetHeader(uurl, protyle);
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

    async uploadFromAssets(protyle) {
        if (!this.data[STORAGE_NAME].readFromAssets) {
            return;
        }
        const imgs = await this.listDirectory(this.data[STORAGE_NAME].assetsLocation)
        if (!imgs) {
            return;
        }
        if (!imgs.length) {
            showMessage(this.i18n.emptyAssets);
            return;
        }
        const imgIndex = Math.floor(Math.random() * imgs.length)
        const img = imgs[imgIndex];
        const el = protyle.contentElement;
        triggerRandomIfNoImg(el);
        this.loadImgAssetSetHeader(img, protyle);
    }

    async loadImgAssetSetHeader(url, protyle) {
        const id = protyle.background.ial.id;
        let u = url;
        if (u.startsWith('/')) {
            u = u.slice(1)
        }
        fetch('/api/attr/setBlockAttrs', {
            method: 'post',
            body: JSON.stringify({
                id: id,
                attrs: {
                    "title-img": `background-image:url("${(u)}")`,
                }
            })
        })
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
            if (this.data[STORAGE_NAME].writeToAssets) {
                const p = await this.saveBlobToImage(blob);
                if (p) {
                    return fetch('/api/attr/setBlockAttrs', {
                        method: 'post',
                        body: JSON.stringify({
                            id: id,
                            attrs: {
                                "title-img": `background-image:url("${(p)}")`,
                            }
                        })
                    })
                }
            }
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
            if (this.data[STORAGE_NAME].writeToAssets) {
                const p = await this.saveBlobToImage(blob);
                if (p) {
                    return fetch('/api/attr/setBlockAttrs', {
                        method: 'post',
                        body: JSON.stringify({
                            id: id,
                            attrs: {
                                "title-img": `background-image:url("${(p)}")`,
                            }
                        })
                    })
                }
            }
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

    async saveBlobToImage(blob) {
        const { type, name } = await detectImageTypeAndName(blob);
        const file = new File([blob], name, {
            type,
        });
        const formData = new FormData();
        const p = `/data/${this.data[STORAGE_NAME].assetsLocation}/${name}`;
        formData.append('path', p);
        formData.append('isDir', 'false')
        formData.append('file', file)
        return fetch('/api/file/putFile', {
            method: 'post',
            body: formData,
        }).then((res) => res.json())
            .then((res) => {
                if (res.code !== 0) {
                    showMessage(this.i18n.writeImgToAssetsFaild);
                } else {
                    return `${this.data[STORAGE_NAME].assetsLocation}/${name}`;
                }
            }).catch((e) => {
                console.error(e);
                showMessage(this.i18n.writeImgToAssetsFaild);
                return null;
            })

    }

    isVideo(url) {
        const regex = /\.(mp4|webm|ogg|ogv|mov|avi|wmv|flv|mkv|rm|rmvb|3gp|mpg|mpeg|mp4v|mpg4|mpeg4|vob|qt|divx|xvid|f4v|f4p|f4a|f4b)$/g;
        return regex.test(url.toLowerCase());
    }

    renderVideo(protyle, url) {
        const u = url;
        const el = protyle.background.element.querySelector('.protyle-background__img');
        let video = el.querySelector('video')
        if (video) {
            video.remove();
        }
        const img = el.querySelector('img');

        video = document.createElement('video');
        video.currentTime = 0;
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.setAttribute('src', u);
        video.setAttribute('data-playing', "false");
        video.setAttribute('style', 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;');
        video.classList.add('protyle-background__video');
        const objectPosition = img.style.objectPosition;
        if (objectPosition) {
            video.style.objectPosition = objectPosition;
        }
        el.appendChild(video);
        video.addEventListener("mousedown", (event) => {
            event.preventDefault();
            if (!video.parentElement.querySelector(".protyle-icons").classList.contains("fn__none")) {
                return;
            }
            const y = event.clientY;
            const height = video.videoHeight * video.clientWidth / video.videoWidth - video.clientHeight;
            let originalPositionY = parseFloat(video.style.objectPosition.substring(7)) || 50;
            if (video.style.objectPosition.endsWith("px")) {
                originalPositionY = -parseInt(video.style.objectPosition.substring(7)) / height * 100;
            }
            document.onmousemove = (moveEvent) => {
                video.style.objectPosition = `center ${((y - moveEvent.clientY) / height * 100 + originalPositionY).toFixed(2)}%`;
                img.style.objectPosition = `center ${((y - moveEvent.clientY) / height * 100 + originalPositionY).toFixed(2)}%`;
                event.preventDefault();
            };

            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
                document.ondragstart = null;
                document.onselectstart = null;
                document.onselect = null;
            };
        });


    }

    clear(protyle) {
        protyle.background.element.querySelector('video').remove();
    }

    async listDirectory(path) {
        return fetch('/api/file/readDir', {
            method: 'post',
            body: JSON.stringify({
                "path": `/data/${path}`,
            })
        }).then(res => res.json())
            .then((res) => {
                const data = res.data;
                const result = [];
                const imageFileRegex = /\.(jpe?g|png|gif|bmp|webp|svg|avif)$/i;
                if (Array.isArray(data) && data.length > 0) {
                    for (const file of data) {
                        if (imageFileRegex.test(file.name.toLowerCase())) {
                            result.push(`${path}/${file.name}`);
                        }
                    }
                }
                return result;
            }).catch((e) => {
                showMessage(this.i18n.readAssetsError + " :" + path)
                console.error(e);
                return null;
            })
    }
}

function triggerRandomIfNoImg(currentPage) {
    currentPage.querySelector('.protyle-background__img > img.fn__none')?.classList.remove('fn__none');
    currentPage.querySelector('.protyle-background')?.setAttribute('style', 'min-height: 30vh;');
    currentPage.querySelector('.protyle-background__img > .protyle-icons > span[data-type="position"]')?.classList.remove('fn__none');
}

function generateTimeId() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，补0
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

async function detectImageTypeAndName(blob) {
    // 读取 Blob 的前 4 个字节（足够识别常见图片格式）
    const buffer = await blob.slice(0, 4).arrayBuffer();
    const view = new Uint8Array(buffer);
    const hex = Array.from(view).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    // 检查文件签名（Magic Numbers）
    switch (hex) {
        case '89504E47': return { type: 'image/png', name: generateTimeId() + '.png' };     // PNG
        case 'FFD8FFDB':
        case 'FFD8FFE0':
        case 'FFD8FFE1': return { type: 'image/jpeg', name: generateTimeId() + '.jpg' };    // JPEG
        case '47494638': return { type: 'image/gif', name: generateTimeId() + '.gif' };     // GIF
        case '52494646': return { type: 'image/webp', name: generateTimeId() + '.webp' };    // WebP
        case '3C737667': return { type: 'image/svg', name: generateTimeId() + '.svg' }; // SVG（文本格式，可能需要完整检查）
        case '0000000C': return { type: 'image/avif', name: generateTimeId() + '.avif' };    // AVIF
        default: return { type: 'application/octet-stream', name: generateTimeId }; // 未知类型
    }
}
