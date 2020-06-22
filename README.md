# BookBook - Capstone Project

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#snapshot/f1bea41a-09fc-4761-9f38-eae81780e7d1)

### Additonal Gitpod Setup Instructions:
1. ```git fetch origin; git reset --hard {repo}```
2. Go to: https://gitpod.io/access-control/ and Manage Gitpod Access 

### Deployment Build Instructions:

- ### Backend Repo
  - mvn package appengine:deploy 

- ### Frontend Repo
  - npm run build
  - gcloud app deploy
  - gcloud app deploy dispatch.yaml
