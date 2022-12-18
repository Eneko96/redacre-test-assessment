FROM mhart/alpine-node:14
ENV NODE_ENV=production
WORKDIR /home/app

COPY . .
RUN mkdir -p home/app



RUN yarn global add @nestjs/cli
RUN yarn install --frozen-lockfile --production
RUN yarn build

EXPOSE 4500

ENTRYPOINT ["node", "dist/main.js"]