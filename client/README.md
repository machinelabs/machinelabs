# MachineLabs Client

This is work in progress that will eventually evolve into machinelabs.ai

![machinelabs](https://cloud.githubusercontent.com/assets/521109/20974120/79025332-bc9b-11e6-9606-57d029c20b68.gif)


## How to work on the app

**1. [Setup the server](https://github.com/machinelabs/machinelabs-server/blob/master/README.md)**

If you just want to run the app against the staging system, you can skip this part. Note that to work on actual features you usually have to start your own server though.

**2. Clone this repository** 

**3. Add an `environment.personal.ts` file with your custom firebase configuration**

Note, if you want to run the app against the staging system you can skip this part.

**4. Run the app**

```
npm install
ng serve --env=personal
```

