# About

Mastr Cntrl is a part of a Microservices suite of [IndieWeb](https://indieweb.org/) tools.

- [Mastr Cntrl](https://github.com/vipickering/mastr-cntrl) is the Microservice responsible for recieving Micropub content, webmentions and social content.
- [MC Webmebtion](https://github.com/vipickering/mc-webmention) is the webmention service. Designed to send and recieve [Webmentions](https://indieweb.org/Webmention).
- [MC Syndication](https://github.com/vipickering/mc-syndicate-content) is the syndication service. Designed to syndicate content to other platforms.

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

This service uses Redis for cache management.
