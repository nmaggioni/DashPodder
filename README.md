# DashPodder

A simple WebUI for GPodder to manage your subscriptions and downloaded episodes.

## Screenshots

> Ain't nobody got time for projects without screenshots.

![Your Subscriptions](https://raw.githubusercontent.com/nmaggioni/DashPodder/master/_docs/subscriptions.png)
![Feed Details - list view](https://raw.githubusercontent.com/nmaggioni/DashPodder/master/_docs/feedinfo_list.png)
![Feed Details - table view](https://raw.githubusercontent.com/nmaggioni/DashPodder/master/_docs/feedinfo_table.png)

## Requirements

+ GPodder must be installed and its binary `gpo` must be in _$PATH_.

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

Open [http://localhost:8080](http://localhost:8080) for the frontend; the backend will be running at [http://localhost:3333](http://localhost:3333)

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
