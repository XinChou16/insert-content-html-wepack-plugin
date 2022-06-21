/**
 * improved plugin version
 * 
 * dependencies:
 * "webpack": "^4.46.0"
 * "html-webpack-plugin": "^3.2.0"
 * 
 * 在特定位置下插入内容
 */

// usage
// new InsertContentHtmlPlugin([
//     {
//         insertedAfter: '<!--rem-outlet-->',
//         content: '<script>..</script>'
//     }
// ]);

function insertContent(raw, keyword, inserted) {
    keyword = String(keyword);
    var index = raw.indexOf(keyword);
    if (index < 0) {
        return raw;
    }

    var endIndex = index + keyword.length;

    return raw.slice(0, endIndex) + inserted.trim() + raw.slice(endIndex);
}

const normalizeOption = option => {
    if (!Array.isArray(option)) {
        return [option];
    }
    return option;
};

class InsertAfterContentHtmlPlugin {
    constructor(option) {
        // cotent [{ insertedAfter: '', content: ''}]
        this.injectOptions = normalizeOption(option);
    }
    apply(complier) {
        complier.plugin('compilation', compilation => {
            compilation.plugin('html-webpack-plugin-before-html-processing', (data, callback) => {
                if (data && data.html) {
                    for (const injectOption of this.injectOptions) {
                        const { insertedAfter, content } = injectOption;
                        data.html = insertContent(data.html, insertedAfter, content);
                    }
                } else if (data && data.then) {
                    data.then(async passedData => {
                        for (const injectOption of this.injectOptions) {
                            const { insertedAfter, content } = injectOption;
                            if (typeof content === 'string') {
                                passedData.html = insertContent(passedData.html, insertedAfter, content);
                            } else {
                                const htmlStr = await content;
                                passedData.html = insertContent(passedData.html, insertedAfter, htmlStr);
                            }
                        }
                    });
                }

                if (callback) {
                    callback(null, data);
                } else {
                    return Promise.resolve(data);
                }
            });
        });
    }
}

module.exports = InsertAfterContentHtmlPlugin;
