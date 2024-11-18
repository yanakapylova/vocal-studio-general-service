# Base image
FROM node:21.5

# Create app directory
WORKDIR /usr/src/server

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Applies seed.ts to database
RUN npx prisma generate
# RUN npx prisma migrate resolve --applied init
# RUN npm run seed

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3008

# Start the server using the production build
CMD ["npm", "run", "start:migrate:seed:prod"]
