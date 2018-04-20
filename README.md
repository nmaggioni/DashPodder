# DashPodder

A simple WebUI for GPodder to manage your subscriptions and downloaded episodes.

## Screenshots

> Ain't nobody got time for projects without screenshots.

![Your Subscriptions](https://raw.githubusercontent.com/nmaggioni/DashPodder/master/_docs/subscriptions.png)
![Feed Details - list view](https://raw.githubusercontent.com/nmaggioni/DashPodder/master/_docs/feedinfo_list.png)
![Feed Details - table view](https://raw.githubusercontent.com/nmaggioni/DashPodder/master/_docs/feedinfo_table.png)

## Requirements

+ GPodder must be installed as system-wide package.
  - Its `gpo` dependency script will be pulled from the [upstream repo](https://github.com/gpodder/gpodder/blob/master/bin/gpo) in order to ensure that the latest episode management functionalities are present. Check [this config file](https://github.com/nmaggioni/DashPodder/blob/master/server/config/gpo.js) to specify a commit's hash to pull or choose to use the script installed at system level anyway.

## Development

```bash
cd client
npm install
npm run dev
```
```bash
cd server
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) for the frontend; the backend will be running at [http://localhost:3333](http://localhost:3333). Beware that the backend will try to serve static content _(e.g.: old manual builds, if present)_ instead of 404'ing. 

## Building / Running

```bash
./build.sh
```

Extract the resulting archive wherever you prefer, it'll only contain the needed and minified assets.

```bash
cd server
npm start
```

Frontend and backend will be bundled and served at [http://localhost:3333](http://localhost:3333).
