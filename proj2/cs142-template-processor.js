'use strict';

window.Cs142TemplateProcessor = class Cs142TemplateProcessor {
    constructor(template) {
        this.template = template;
        this.pattern = /{{\w+}}/g;
        this.props = template.match(this.pattern);
    }

    fillIn(dictionary) {
        let res = this.template;
        for (const x of this.props) {
            const w = x.substring(2, x.length - 2);
            res = res.replace(x, dictionary[w] || " ");
        }
        return res;
    }
};