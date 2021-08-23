# Top of Mind
## Local development

Install dependencies:

```bash
yarn
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. This uses hardcoded sample
data, versus fetching new post data from LinkedIn.

## Running as a Chrome extension:

```bash
./build.sh
```

Then, follow steps 1-3 on [this page](https://developer.chrome.com/docs/extensions/mv3/getstarted/#manifest) to load the
extension in Chrome. Select the `out/` subdirectory.

In order to update the extension, you need to rebuild and click 'Update' on the Chrome extensions page
(chrome://extensions). Since this is a slower iteration cycle try to use the [Local development](#local-development)
instructions unless you need to modify functionality specific to the Chrome extension (e.g. getting elements from the
DOM, or passing messages from different parts of the extension).