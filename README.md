# About

Mastr Cntrl is a part of a Microservices suite of [IndieWeb](https://indieweb.org/) tools.

- [Mastr Cntrl](https://github.com/vipickering/mastr-cntrl) is the Microservice responsible for recieving Micropub and social content.
- [MC Webmention](https://github.com/vipickering/mc-webmention) is the webmention service. Designed to send and recieve [Webmentions](https://indieweb.org/Webmention).
- [MC Syndication](https://github.com/vipickering/mc-syndication) is the syndication service. Designed to syndicate content to other platforms.

## Purpose

The service:
    - Recieves Micropub content, and transform the JSON in to a Markdown file with associated frontmatter.
    - POST's transformed content in to a Github Repo (via the API) to a designated location.
    - Recieves Media content and POST in to a Github Repo (via the API) to a designated location.
    - Recieves 3rd party Social content (in development at the moment).

## Install

1. Download the content and install with ```npm install```.
2. Create your ```.env``` file and use the ```sample.env``` as your guide.
3. Make sure to install and start your [Redis](https://redis.io/) server.
4. Run with ```npm start```

## Dependencies

### Timezone
You will need to specify your timezone using this [timezone list](https://github.com/moment/moment-timezone/blob/develop/data/meta/latest.json) in the ```.env``` file. Use the ```sample.env``` as your guide.

The timezone is used to generate the blog post frontmatter and is also used on my blog to generate URLs. You may also do the same, so I recommend setting it to a 24 local timezone to avoid clashes in a 12 hour period or to avoid posts published at random times, instead of your local time.

It is also advantageous to do this so you are not constrained where you host Mastr-Cntrl. You can host it in one part of the world and post using your local time if you like.

## Optional extras

### Slack

If you wish to use additional Slack logging:

1. Create an 'Incoming WebHooks app', over on Slack.
2. Copy the webhook key., generated.
3. Paste the key in to your  ```.env``` file following the ```sample.env``` file as a guide.

### Syndicating to Twitter

Mastr-Cntrl doesn't syndicate to Twitter (but mc-syndication does). However if you are creating a Micropub post and wish to syndicate to Twitter, the Micropub client needs to know your Twitter details, so they can be saved alongside the post in the frontmatter.

Add your twitter username in the ```.env``` file following the ```sample.env``` file as a guide and it will appear in the micropub client as an option.
