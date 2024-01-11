# GraphQL Blog

A simple TypeScript, Node, GraphQL Apollo Server Social Media (blog) application built from scratch. Users may log into application via an external portal, authenticate via json web tokens + password hashing, then create, update and delete posts that may be displayed to non-logged in users. Clientside rendering served via React.

## Notes
- GraphQL API based on Shopify's Internal GraphQL API Design best practices public git repo [here](https://github.com/Shopify/graphql-design-tutorial/blob/master/TUTORIAL.md).
- Uses [Prisma v3](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-3) to connect to an externally hosted [Render](https://render.com/) Postgres database.
- Associated client-side application built with React.js.

## Usage

### Starting the Server
Navigate to `/server` directory. Run `npm start:dev`.

Runs the Apollo Playground in the development mode.<br />
Open [http://localhost:4000](http://localhost:4000) to view it in the browser.


### Starting the Client - `npm start:dev`
Navigate to `/client` directory. Run `npm start`.

Boots up React clientside application.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

