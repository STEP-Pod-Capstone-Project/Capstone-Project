# BookBook - Capstone Project

### Deployment Build Instructions:

- ### Backend Repo
  - mvn package appengine:deploy 

- ### Frontend Repo
  - npm run build
  - gcloud app deploy
  - gcloud app deploy dispatch.yaml
