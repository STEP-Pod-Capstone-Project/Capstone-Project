# BookBook - Capstone Project

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/STEP-Pod-Capstone-Project/Capstone-Project)

### Additonal Gitpod Setup Instructions:
- Go to File -> Settings -> Open Preferences
- Search for **tab size** and change it to 2.
- Search for **auto save** and toggle it **on**.

### Deployment Build Instructions:

- ### Backend Repo
  - mvn package appengine:deploy 

- ### Frontend Repo
  - npm run build
  - gcloud app deploy
  - gcloud app deploy dispatch.yaml
