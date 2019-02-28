# Mastr Cntrl

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fvipickering%2Fmastr-cntrl.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fvipickering%2Fmastr-cntrl?ref=badge_shield) [![Known Vulnerabilities](https://snyk.io/test/github/vipickering/mastr-cntrl/badge.svg?targetFile=package.json)](https://snyk.io/test/github/vipickering/mastr-cntrl?targetFile=package.json) ![npm Dependencies](https://david-dm.org/vipickering/mastr-cntrl.svg)

Mastr Cntrl is the [indieweb](https://indieweb.org) server for [this blog](https://vincentp.me).

## Purpose

Content is routed via this server (hosted on Heroku). Anything POST'ed and accepted to the server is transformed and POST'ed to the Github API.

This triggers a webhook that tells [Netlify](https://netlify.com) to rebuild the static site.

POST'ed content also triggers a webhook informing Mastr Cntrl to syndicate/post/update content to 3rd party providers.

## Dependencies

- This service uses Redis for cache management with Redis togo add-on
- Heroku is used to host this.

## Support / Roadmap

### To Do

- Webmention updates, delete, undelete


### Currently Supported

- Micropub Notes/Replies/RSVP/Like/Bookmarking/Repost created on [Quill](https://quill.p3k.io) and other 3rd party providers that support IndieAuth are supported.
- PESOS 3rd party content posted on [Swarm](https://www.swarmapp.com) are currently backfed to the blog via [https://ownyourswarm.p3k.io](https://ownyourswarm.p3k.io) respectively.
- Syndication Endpoint - Mastr Cntrl will supply a list of 3rd party social accounts to be syndicated. But will not currently action them (see above).
- Collecting [Webmention](https://indieweb.org/webmention) via (webmention.io) then saved to individual JSON files.
- Media endpoint. Images sent via Micropub are uploading and encoding to the Github API.
- Syndication. Syndication target is marked is true in front matter. On website build this generates a feed which is used to syndicate to target.

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fvipickering%2Fmastr-cntrl.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fvipickering%2Fmastr-cntrl?ref=badge_large)
