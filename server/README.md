## MachineLabs server

This is a work in progress prototype of the server powering machinelabs.ai

### Prerequisite

Install docker and pull down the `thoughtram/keras` images.

```
docker pull thoughtram/keras
```

**If you don't have docker you can start the server with the `--dummy-runner` flag.**

### How To

```
git clone <this-repo-url>
npm install   # or yarn install
npm run serve # or npm run serve -- --dummy-runner
```
