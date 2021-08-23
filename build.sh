# https://dev.to/alexbh/using-next-js-to-create-a-browser-extension-chrome-firefox-490h

yarn build

cp manifest.json ./out
cp contentScript.js ./out
mv ./out/_next ./out/next
cd ./out && grep -rli '_next' * | xargs -I@ sed -i '' 's/_next/next/g' @;
