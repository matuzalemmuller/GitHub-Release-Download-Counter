# GitHub Release Download Counter

*Hosted at [GitHub](https://github.com/matuzalemmuller/GitHub-Release-Download-Counter) and mirrored to [GitLab](https://gitlab.com/matuzalemmuller/GitHub-Release-Download-Counter).*

## Description

Browser extension that displays download count of release assets in public GitHub repositories.

Download count is displayed next to asset size.

![](https://i.imgur.com/rJtkebi.png)

## Limitations

Due to [GitHub's API rate limit](https://developer.github.com/v3/#rate-limiting) the maximum of unauthenticated requests is of 60 per hour. This means that this extension will only show the download count of assets of up to 60 releases per hour.