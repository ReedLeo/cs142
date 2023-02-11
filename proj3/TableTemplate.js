'use strict';

class TableTemplate {
    static fillTemplate(temp, dict) {
        const pat = /{{\w+}}/g;
        const properties = temp.match(pat);
        let res = temp;

        if (properties != null) {
            properties.forEach(element => {
                const w = element.substring(2, element.length - 2);
                res = res.replace(element, dict[w] || '');
            });
        }
        return res;
    }

    static fillIn(id, dict, columnName) {
        const table = document.getElementById(id);
        const rows = Array.from(table.rows);
        // convert table into 2-dimension array of td-objects.
        const tds = [];
        rows.forEach(tr => {
            tds.push(Array.from(tr.children));
        });

        let colIdx = null;
        // rows[0] is the header, format headers first.
        tds[0].forEach((th, index) => {
            const hName = TableTemplate.fillTemplate(th.textContent, dict);
            if (hName === columnName) {
                colIdx = index;
            }
            th.textContent = hName;
        });

        if (colIdx !== null) {
            tds.forEach(curRow => {
                const td = curRow[colIdx];
                const tdText = TableTemplate.fillTemplate(
                    td.textContent,
                    dict
                );
                td.textContent = tdText;
            });
        } else {
            rows.forEach(curRow => {
                const htmlText = TableTemplate.fillTemplate(
                    curRow.innerHTML,
                    dict
                );
                curRow.innerHTML = htmlText;
            });
        }

        table.setAttribute('style', 'visibility:visible');
    }
}