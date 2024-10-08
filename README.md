# Web Controller for Stream Cam

A production version of this project is available at http://cam.162849.xyz (make sure to use **http, not https**, in order to connect to your Pi.)

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

You can deploy the production build to GitHub Pages with `npm run deploy`.
- Make sure to change script `build` in `package.json` to use your own domain, or remove the CNAME creation command.