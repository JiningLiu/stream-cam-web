# Web Controller for Stream Cam (Legacy)

For use with the [stream-cam-legacy](https://github.com/JiningLiu/stream-cam-legacy/) project, **install with the script found in that project**. The installation steps in the [README](https://github.com/JiningLiu/stream-cam-legacy/blob/dev/README.md) of that project will guide you through installing all software needed.

> ⚠️ A new system is under development... Follow [JiningLiu/stream-cam](https://github.com/JiningLiu/stream-cam) for updates.

## Developing

Once you've installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

The port is exposed by default with the `--host` flag.

## Building

To create a production version of the app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

You can deploy the production build to GitHub Pages with `npm run deploy`.
- Make sure to change script `build` in `package.json` to use your own domain, or remove the CNAME creation command.
