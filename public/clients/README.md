# Client images

One folder per client, named with the client's `slug` from
`src/data/clients.ts`. Inside it:

```
public/clients/
  acme/
    cover.jpg     <- the grid tile on /services/{slug} (4:3 crop reads best)
    01.jpg
    02.jpg
    03.jpg
    ...
```

`cover.jpg` is the image shown on the client grid tile. `01.jpg`,
`02.jpg`, etc. are the full set of images shown on that client's own
preview page (`/services/{slug}/{clientSlug}`) and in its lightbox —
numbered so their order in the folder matches the order you want them
to appear in, but the actual filenames don't have to be exactly this;
whatever you put in `images` in `clients.ts` is what's used.

## Wiring a client in

Adding the files here doesn't do anything on its own — add a matching
entry in `src/data/clients.ts` that points at them:

```ts
{
  slug: "acme",
  name: "Acme Co.",
  intro: "One or two sentences of context for someone who's never heard of them.",
  services: ["branding", "web-app"], // which service page(s) this client shows up on
  cover: "/clients/acme/cover.jpg",
  images: [
    { src: "/clients/acme/01.jpg", alt: "Acme — brand identity, primary lockup" },
    { src: "/clients/acme/02.jpg", alt: "Acme — packaging system" },
  ],
}
```

`services` uses the slugs from `src/content/services.ts` (`branding`,
`digital-marketing`, `media-production`, `media-activations`,
`web-app`) — a client can be listed under more than one if their work
spans departments.

No image sizing/format requirements beyond: keep them reasonably web-
sized (a few hundred KB each, not multi-megabyte camera originals) —
nothing here resizes or optimizes them for you yet.
