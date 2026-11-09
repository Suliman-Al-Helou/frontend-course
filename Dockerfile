FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
# تثبيت الأدوات اللازمة
RUN apk add --no-cache python3 py3-pip build-base py3-setuptools git
RUN pip3 install --no-cache-dir --break-system-packages "openai==1.61.0" "git+https://github.com"
EXPOSE 3000
CMD ["npm", "run", "dev"]