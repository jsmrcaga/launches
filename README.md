# Rocket Launches Telegram Bot

Powered by [rocketlaunch.live](https://rocketlaunch.live).

Built for the [Cloudflare Developer Summer Challenge](https://challenge.developers.cloudflare.com/?utm_campaign=github-jsmrcaga) 2021

## Prod:

- Front end: [launches.jocolina.com](https://launches.jocolina.com)
- Telegram bot: [@rocket_launches_live_bot](https://t.me/rocket_launches_live_bot)

## Infrastructure

- [Cloudflare Workers](https://developers.cloudflare.com/workers/) are used as the API (both for front end by proxying launches and for Telegram). They are also used as cron scheduled workers to check launches and send messages to subscribed users.
- [Cloudflare Workers KV](https://developers.cloudflare.com/workers/learning/how-kv-works) are used as a storage solution for subscribed users. They will get Telegram messages when an upcoming launch is nearing.
- [Cloudflare Pages](https://developers.cloudflare.com/pages/) are used to host a Next.js website: [launches.jocolina.com](https://launches.jocolina.com)

## Code

The codebase is split in two main directories, `api` and `launches`.

### API
Inside API you will find different files that would together create some sort of backend.

This backend lives inside [Cloudflare Workers](https://developers.cloudflare.com/workers/) and uses [Cloudflare Workers KV](https://developers.cloudflare.com/workers/learning/how-kv-works) as a temporal database.

The mapping for each route can be found in the `tf/api.tf` file, which creates and manages every worker on cloudflare.

## Front

The front end is located in `launches`. It is built on top of [next.js](https://nextjs.org) and deployed to
[Cloudflare Pages](https://developers.cloudflare.com/pages/).
