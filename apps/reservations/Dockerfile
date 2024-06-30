FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install
RUN npm install prisma @prisma/client

COPY . .

RUN npm run prisma:generate
RUN npm run build

FROM node:alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --only=production

COPY --from=development /usr/src/app/dist ./dist

COPY --from=development /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=development /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=development /usr/src/app/libs/common/src/prisma/schema ./libs/common/src/prisma/schema

CMD ["node", "dist/apps/reservations/main"]
