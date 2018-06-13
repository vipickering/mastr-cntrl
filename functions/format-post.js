 let layout = 'myDate';
        let title = 'myDate';
        let date = '2018-06-15 07:00:00 +/-GMT';
        let summary = 'myDate';
        let category = 'myDate';
        let tags = 'myDate';

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

let bob = `<p>some text</p>`;
let test = frontmatter + bob;
