# GitHub Release Download Counter

*Hosted at [GitHub](https://github.com/matuzalemmuller/GitHub-Release-Download-Counter) and mirrored to [GitLab](https://gitlab.com/matuzalemmuller/GitHub-Release-Download-Counter).*

## Description

Browser extension that displays download count of release assets in public GitHub repositories.

Download count is displayed next to asset size.

![](https://i.imgur.com/rJtkebi.png)

## Limitations

Due to [GitHub's API rate limit](https://developer.github.com/v3/#rate-limiting) the maximum number of unauthenticated API requests is of 60 per hour. This means that this extension can only show the download count of assets of up to 60 releases per hour.

This app is intended to be used by small developers who want to see how many times their releases have been downloaded.