# base node image
FROM node:20-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /myapp

ADD package.json package-lock.json setupDatabase.js setupTestDatabase.js ./
RUN npm install --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json package-lock.json setupDatabase.js setupTestDatabase.js ./
RUN npm prune --production

# Build the app
FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
# COPY /myapp/setupDatabase.js /myapp/setupDatabase.js
# COPY /myapp/setupTestDatabase.js /myapp/setupTestDatabase.js
# COPY /myapp/db /myapp/db

RUN mkdir /myapp/db
RUN node setupDatabase.js
RUN node setupTestDatabase.js

ADD . .

# Finally, build the production image with minimal footprint
FROM base

ENV PORT="8080"
ENV NODE_ENV="production"

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/test /myapp/test
COPY --from=build /myapp/db /myapp/db
COPY --from=build /myapp/index.js /myapp/index.js
COPY --from=build /myapp/setupDatabase.js /myapp/setupDatabase.js
COPY --from=build /myapp/setupTestDatabase.js /myapp/setupTestDatabase.js

RUN npm start
