FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm run prisma:generate

RUN pnpm run build

FROM node:alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile --prod --ignore-scripts

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/payments/main"]