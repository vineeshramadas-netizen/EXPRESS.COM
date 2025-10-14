FROM node:18-bullseye
WORKDIR /usr/src/app
COPY package.json package-lock.json* .npmrc* ./
COPY apps/web/package.json apps/web/package.json
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "-w", "@express-com/web"]
