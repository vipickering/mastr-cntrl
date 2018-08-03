# Mastr Cntrl

Mastr Cntrl is the [indieweb](https://indieweb.org) server for [this blog](https://vincentp.me).

## Purpose

Content is routed via this server (hosted on Heroku). Anything POST'ed and accepted to the server is POST'ed to the Github API.

This triggers a webhook that tells ]Netlify](https://netlify.com) to rebuild the [Jekyll site](http://jekyllrb.com) static site.

POST'ed content also triggers a webhook informing Mastr Cntrl to syndicate content to 3rd party providers.

## Support / Roadmap

### Currently Supported

- [PESOS](https://indieweb.org/PESOS) 3rd party content posted on [Instagram](https://www.instagram.com) and [Swarm](https://www.swarmapp.com) is currently aggregated back to the blog via [https://ownyourgram.com] (https://ownyourgram.com) and [https://ownyourswarm.p3k.io](https://ownyourswarm.p3k.io) respectively.
- [PESOS](https://indieweb.org/PESOS) Micro.blog Currently using RSS feed. In future data will be POST'ed directly to the API.
- [PESOS](https://indieweb.org/PESOS) Notes created on [Quill](https://quill.p3k.io) are supported.
- [Webmention](https://indieweb.org/webmention) Webmentions via Twitter and Medium are supported via [Brid.gy](https://brid.gy) and [Webmention.io](https://webmention.io). (Webmention.io will be deprecated once Mastrl Cntrl accepts Webmentions)
- Syndication Endpoint - Mastr Cntrl will supply a list of 3rd party site accounts to syndicated towards. But currently will not action them

### Not yet supported

- Collecting [Webmention](https://indieweb.org/webmention)
- [PESOS](https://indieweb.org/PESOS) - Syndicating to other providers is currently handled by Zapier. This will be superseded soon.
- Syndication Endpoint - Mastr Cntrl needs to accept incoming PESOS requests.
- Media Endpoint - Mastrl Cntrl doesn't upload media from external sources yet.
- Bookmarking In theory it is supported. But in practice nothing is being done on this yet.
- Like/Favourite In theory it is supported. But in practice nothing is being done on this yet.
