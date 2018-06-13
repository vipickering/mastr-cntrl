const base64 = require('base64it');

exports.checkIn = function checkIn(micropubContent) {
     let layout = 'myDate';
        let title = 'myDate';
        let date = '2018-06-15 07:00:00 +/-GMT';
        let summary = 'myDate';
        let category = 'myDate';
        let tags = 'myDate';
        let entry;
        let frontmatter = `---
        layout: ${layout}
        title: ${title}
        date: ${date}
        meta: ${summary}
        summary: ${summary}
        category: ${category}
        modified :
        modifiedReason:
        twitterCard: true
        tags: ${tags}
        ---
        `;
        let micropubContentFormatted;

        entry =`<p>some text</p>`;
        micropubContent = frontmatter + entry;
        micropubContentFormatted =  base64.encode(micropubContent);
        return micropubContentFormatted;
};

exports.note = function note(serviceContent) {
    //Notes here later.
};
