FROM node:22-slim

WORKDIR /app
COPY --chown=node:node package.json server.js index.html script.js styles.css ./
COPY --chown=node:node public ./public

ENV NODE_ENV=production
EXPOSE 3000
USER node
CMD ["node", "server.js"]
