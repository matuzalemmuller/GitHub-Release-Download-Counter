# [DISCONTINUED] GitHub Release Download Counter

**Attention: Due to recent changes in GitHub's web layout & API and my lack of spare time to support this extension, I decided to drop support for this addon.**

Browser extension that displays download count of release assets in public GitHub repositories.

![](https://i.imgur.com/rJtkebi.png)

## Installation

* [Firefox](https://addons.mozilla.org/en-US/firefox/addon/gh-release-download-counter/)
* [Google Chrome](https://chrome.google.com/webstore/detail/github-release-download-c/iaeggliaejjcgnfbcjkhaabikhlfekel)

## How it works

The extension identifies that the page is displaying a release and queries the API requesting information about the release. Then, it edits the page to show the download count of each asset. The download count is displayed next to asset size.

## Limitations

Due to [GitHub's API rate limit](https://developer.github.com/v3/#rate-limiting) the maximum number of unauthenticated API requests is of 60 per hour. This means that this extension can only show the download count of assets of up to 60 releases per hour.

This app is intended to be used by small developers who want to see how many times their releases have been downloaded.
