TARGET="/Users/sergey/Documents/smart-home/raspberry/pi/docker/buss"

rm -R ${TARGET}/public
cp -R  src/frontend/dist ${TARGET}/public
cp -f src/{index.js,package.json,package-lock.json} ${TARGET}/
cp -f {Dockerfile,docker-compose.yml} ${TARGET}/
