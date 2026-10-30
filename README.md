# Payload Cloudflare Template

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/payloadcms/payload/tree/3.x/templates/with-cloudflare-d1)

**This can only be deployed on Paid Workers right now due to size limits.** This template comes configured with the bare minimum to get started on anything you need.

## Quick start

This template can be deployed directly to Cloudflare Workers by clicking the button to take you to the setup screen.

From there you can connect your code to a git provider such Github or Gitlab, name your Workers, D1 Database and R2 Bucket as well as attach any additional environment variables or services you need.

## Quick Start - local setup

To spin up this template locally, follow these steps:

### Clone

After you click the `Deploy` button above, you'll want to have standalone copy of this repo on your machine. Cloudflare will connect your app to a git provider such as Github and you can access your code from there.

### Local Development

## How it works

Out of the box, using [`Wrangler`](https://developers.cloudflare.com/workers/wrangler/) will automatically create local bindings for you to connect to the remote services and it can even create a local mock of the services you're using with Cloudflare.

We've pre-configured Payload for you with the following:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/3.x/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

  This is the uploads enabled collection.

### Image Storage (R2)

Images will be served from an R2 bucket which you can then further configure to use a CDN to serve for your frontend directly.

### D1 Database

The Worker will have direct access to a D1 SQLite database which Wrangler can connect locally to, just note that you won't have a connection string as you would typically with other providers.

You can enable read replicas by adding `readReplicas: 'first-primary'` in the DB adapter and then enabling it on your D1 Cloudflare dashboard. Read more about this feature on [our docs](https://payloadcms.com/docs/database/sqlite#d1-read-replicas).

## Working with Cloudflare

Firstly, after installing dependencies locally you need to authenticate with Wrangler by running:

```bash
pnpm wrangler login
```

This will take you to Cloudflare to login and then you can use the Wrangler CLI locally for anything, use `pnpm wrangler help` to see all available options.

Wrangler is pretty smart so it will automatically bind your services for local development just by running `pnpm dev`.

## Local Development Workflow

Local dev D1 is **push-synced, not migration-tracked**. When you change a collection (add/remove/rename a field, add a new collection), the dev server reconciles the local database with your current config automatically — you don't need to create or run a migration to iterate locally. Migrations only matter once, right before you deploy (see [Deployments](#deployments) below).

A few habits that keep this smooth:

- **After editing a collection file or `payload.config.ts`, run `pnpm run dev:reset`.** Payload's admin instance doesn't always pick up config changes via hot-reload on its own — you can end up with the admin UI rendering fields that no longer exist in your source. This script kills whatever's on port 3000 and starts a clean dev server.
- **If local data or schema ever looks wrong/stuck, run `pnpm run dev:reset-db`.** This wipes the local D1 emulation (`.wrangler/state`) so it rebuilds from scratch against your current collection configs on the next `pnpm dev`. It only touches your local sandbox — production D1 is a separate resource, untouched by this. Prefer this over hand-editing the local `.sqlite` file directly; local schema patches drift from what Payload's own push logic expects and cause confusing collisions later.
- **When a field's type or purpose changes (not just its label), give it a new name** rather than reusing the old one — e.g. going from a flat `quote` text field to a `testimonials` relationship. Payload's migration generator has to interactively ask "is this a rename or a new column?" when a name is reused across an incompatible type change, which can't be answered in non-interactive contexts (CI, some agent/automation setups). A fresh name sidesteps the prompt entirely.
- **Keep every `@payloadcms/*` package (and `payload` itself) pinned to the exact same version** — no `^` ranges. A single package drifting a patch version ahead of the rest trips Payload's own dependency check and breaks `payload migrate`, `getPayload()`, and the dev server.

## Deployments

When you're ready to deploy, first make sure you have created your migrations:

```bash
pnpm payload migrate:create
```

Then run the following command:

```bash
pnpm run deploy
```

This will spin up Wrangler in `production` mode, run any created migrations, build the app and then deploy the bundle up to Cloudflare.

That's it! You can if you wish move these steps into your CI pipeline as well.

## Enabling logs

By default logs are not enabled for your API, we've made this decision because it does run against your quota so we've left it opt-in. But you can easily enable logs in one click in the Cloudflare panel, [see docs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/#enable-workers-logs).

### Logger Configuration

This template includes a custom console-based logger compatible with Cloudflare Workers. Payload's default logger uses `pino-pretty`, which relies on Node.js APIs not available in Workers and would cause `fs.write is not implemented` errors.

The custom logger in `payload.config.ts`:

- Routes logs through `console.*` methods which Workers handles correctly
- Outputs JSON-formatted logs for Cloudflare observability
- Only active in production (development uses the default `pino-pretty` for better DX)

You can control the log level via the `PAYLOAD_LOG_LEVEL` environment variable (e.g., `debug`, `info`, `warn`, `error`).

### Diagnostic Channel Errors

If you see "Failed to publish diagnostic channel message" errors in your observability logs, these typically come from the `undici` HTTP client library. The template includes `skipSafeFetch: true` in the Media collection to use native fetch instead of undici for file uploads, which helps reduce these errors.

Cloudflare Workers runs in an [isolated environment that cannot access private IP ranges](https://developers.cloudflare.com/workers-vpc/examples/route-across-private-services/) by default, providing built-in SSRF protection. This makes `skipSafeFetch` safe to use.

## Known issues

### Image resizing

Workers do not support `sharp`, so image resizing features are not available. The Media collection has `crop` and `focalPoint` disabled for this reason, and options like `imageSizes` will not work.

### GraphQL

We are currently waiting on some issues with GraphQL to be [fixed upstream in Workers](https://github.com/cloudflare/workerd/issues/5175) so full support for GraphQL is not currently guaranteed when deployed.

### Worker size limits

We currently recommend deploying this template to the Paid Workers plan due to bundle [size limits](https://developers.cloudflare.com/workers/platform/limits/#worker-size) of 3mb. We're actively trying to reduce our bundle footprint over time to better meet this metric.

This also applies to your own code, in the case of importing a lot of libraries you may find yourself limited by the bundle.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
