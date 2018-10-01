# Mastr Cntrl

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fvipickering%2Fmastr-cntrl.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fvipickering%2Fmastr-cntrl?ref=badge_shield) [![Known Vulnerabilities](https://snyk.io/test/github/vipickering/mastr-cntrl/badge.svg?targetFile=package.json)](https://snyk.io/test/github/vipickering/mastr-cntrl?targetFile=package.json) ![npm Dependencies](https://david-dm.org/vipickering/mastr-cntrl.svg)

Mastr Cntrl is the [indieweb](https://indieweb.org) server for [this blog](https://vincentp.me).

## Purpose

Content is routed via this server (hosted on Heroku). Anything POST'ed and accepted to the server is POST'ed to the Github API.

This triggers a webhook that tells [Netlify](https://netlify.com) to rebuild the [Jekyll site](http://jekyllrb.com) static site.

POST'ed content also triggers a webhook informing Mastr Cntrl to syndicate/post/update content to 3rd party providers.

Currently webmentions are updated from [Webmention.io](https://webmention.io) on a nightly basis, via a Zapier zap. In future Mastr Cntrl will manage this.

## Dependencies

- This service uses Redis for cache management with Redis to go add-on
- Heroku is used to host this.

## Support / Roadmap

### In progress

- [Webmention] replies. Partial support. Code is captured and added to files.
- [Webmentions] sending is not automated yet.
- [Webmention] RSVP
- [Webmention] Like
- [Webmention] Bookmarking

### Currently Supported

- [PESOS](https://indieweb.org/PESOS) 3rd party content posted on [Instagram](https://www.instagram.com) and [Swarm](https://www.swarmapp.com) is currently aggregated back to the blog via [https://ownyourgram.com](https://ownyourgram.com) and [https://ownyourswarm.p3k.io](https://ownyourswarm.p3k.io) respectively.
- [PESOS](https://indieweb.org/PESOS) Notes created on [Quill](https://quill.p3k.io) are supported.
- [Webmention](https://indieweb.org/webmention) Webmentions via Twitter and Medium are supported via [Brid.gy](https://brid.gy) and [Webmention.io](https://webmention.io).
- Syndication Endpoint - Mastr Cntrl will supply a list of 3rd party site accounts to syndicated towards. But currently will not action them
- [Webmention](https://indieweb.org/webmention) Like/Favourite is  supported and appear underneath posts.
- Collecting [Webmention](https://indieweb.org/webmention) via (webmention.io) then saved to local JSON file.


### Not yet supported

- [POSSE](https://indieweb.org/PESOS) - Syndicating to other providers is currently handled by Zapier. This will be superseded.
- Syndication Endpoint - Mastr Cntrl needs to accept incoming PESOS requests.
- Media Endpoint - Mastrl Cntrl doesn't upload media from external sources yet.
- Bookmarking In theory it is supported. But in practice nothing is being done on this yet.
- Scheduled/Automated updating of webmentions (see above).
- Accepting Webmentions.

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fvipickering%2Fmastr-cntrl.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fvipickering%2Fmastr-cntrl?ref=badge_large)
