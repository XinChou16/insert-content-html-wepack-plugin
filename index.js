/**
 * ReplaceContentHtmlPlugin
 * Based on: https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/InterpolateHtmlPlugin.js
 */

/**
 *
 * new ReplaceContentHtmlPlugin({
 *   replacements: {
 *      NODE_ENV: 'test',
 *      BASE_URL: '//a.com'
 *   },
 *   transform: (html) => {
 *     return html += '<p>extra content</p>'
 *   }  
 * 
 * });
 */
 class ReplaceContentHtmlPlugin {
    constructor(option) {
        // cotent { transform: () => {}, replacements: {} }
        this.injectOption = option;
    }
    apply(complier) {
        complier.plugin('compilation', compilation => {
            compilation.plugin('html-webpack-plugin-before-html-processing', (data, callback) => {
                const { transform, replacements } = this.injectOption;

                if (transform) {
                    data.html = transform(data.html);
                }

                if (replacements) {
                    Object.keys(replacements).forEach((key) => {
                        data.html = data.html.replace(
                            new RegExp(`%${key}%`, 'g'),
                            replacements[key]
                        );
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

module.exports = ReplaceContentHtmlPlugin;
