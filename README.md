# Cwcloud CE Web UI

## Git mirrors

* Main mirror: https://gitlab.comwork.io/oss/cwcloud/cwcloud-ui.git
* Github mirror: https://github.com/comworkio/cwcloud-ui.git
* Gitlab mirror: https://gitlab.com/ineumann/cwcloud-ui.git

## Getting started

In order to work on localhost:

```shell
cp .env.dist .env
```

Replace the values inside the `.env`, then:

Use the following values:

```shell
REACT_APP_CWCLOUD_UI_LABEL="CWCLOUD Platform"
REACT_APP_CWCLOUD_UI_URL="cloud.comwork.io"
REACT_APP_APIURL="https://ppd.cloud-api.comwork.io" # you can change with a localhost version or prod version
REACT_APP_APIVERSION="v1"
REACT_APP_EMAIL="cloud@comwork.io"
REACT_APP_DOCURL="https://doc.cloud.comwork.io/docs"
REACT_APP_STRIPE_PUBLIC_KEY="whatever"
REACT_APP_EXTERNAL_LOGO=""
REACT_APP_MATOMO_URL="https://matomo.whatever.com"
REACT_APP_MATOMO_SITE_ID="12345"
REACT_APP_PRICE_UNIT="€"
```

Then:

```shell
docker-compose -f docker-compose-local.yml up --build -d
```

Or if you have Node.js installed on your local machine you can install dependencies and run the project using the following commands:

```shell
npm install
npm run start
```

You'll be able to see the web console on http://localhost:3000

## Using a local API (fullstack dev)

You can use a localhost version of this API following the `README.md` of this repository: https://gitlab.comwork.io/comwork/infrastructure/comwork-cloud-api

And updating this environment variable: `REACT_APP_APIURL=http://localhost:5002`

* Login: `sre-devops@comwork.io`
* Password: `cloud456`

## Unit testing

For unit tests we are using `Jest`. To run unit tests you can run the following command:

```shell
npm run test
```

## Project architecture

```shell
├── src
│ └── assets
│ └── Components
│     ├── AllowCookiesFooter
│     ├── BlocklyWorkspace
│     ├── Cards
│     ├── Charts
│     ├── ChaMessage
│     ├── CollapsibleContent
│     ├── CustomIcon
│     ├── DragDropList
│     ├── Dropdown
│     ├── EditorBox
│     ├── Kubernetes
│     ├── LoadingButton
│     ├── LoadingComponent
│     ├── LoadingSpinner
│     ├── Modal
│     ├── ServiceNotAvailable
│     ├── Sidebar
│     ├── SidebarMenuItem
│     ├── SuggestionsAutoComplete
│     ├── Table
│     ├── TicketReply
│ └── Context
│ └── Hooks
│ └── Pages
│     ├── Dashboard
│     ├── Public
│ └── Tests
│ └── Themes
│ └── utils
│ └── App.js
│ └── index.js
│ └── reportWebVitals.js
│ └── setupTests.js
```

