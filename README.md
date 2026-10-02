# Yuechen Zhang (Orange) — Academic Homepage

Personal academic homepage for Yuechen Zhang, built from [AcadHomepage](https://github.com/RayeRen/acad-homepage.github.io).

Website: **https://orangecc7.github.io**  
Repository: **orangecc7/orangecc7.github.io**

## Local development

Use Ruby 3.3 and Bundler:

```bash
bundle install
bundle exec jekyll serve --livereload
```

Open `http://127.0.0.1:4000`. Restart Jekyll after changing `_config.yml`.

To verify a production build:

```bash
JEKYLL_ENV=production bundle exec jekyll build
python3 scripts/validate_site.py _site
```

## Update content

| File | Content |
| --- | --- |
| `_config.yml` | Name, email, Google Scholar, GitHub, site URL |
| `_pages/about.md` | Biography and page sections |
| `_data/publications.yml` | Paper titles, venues, author roles, links, and images |
| `_data/education.yml` | Institutions, degrees, majors, schools, dates, and status |
| `_data/projects.yml` | Projects |
| `_data/navigation.yml` | Navigation |
| `assets/css/profile.css` | Colors, typography, and responsive layout |
| `DESIGN.md` | Visual direction, layout, and interaction conventions |

The page uses the reference homepage's `"Trebuchet MS", Helvetica, sans-serif` font stack throughout, a compact academic layout, and publications grouped by research area. The top-left Homepage link is bold. Click a publication figure to view the full original image. Publication resource links include only Paper and Code. The theme button supports light and dark appearances and remembers the visitor's choice.

The education timeline records undergraduate studies in 2023–2027 and planned master's studies in 2027–2030. Update the status when the program begins. The ICLR 2027 and AAAI 2027 submissions are explicitly marked **Under review**.

## Deploy

In the repository's **Settings → Pages**, set **Source** to **GitHub Actions**. The workflow builds and validates pull requests, and deploys pushes to `main` or a manual run on `main`.

The previous blog's custom-domain configuration is removed. The canonical URL is `https://orangecc7.github.io`, with an empty `baseurl` for a user homepage.

## Template and assets

Imported from `RayeRen/acad-homepage.github.io`, commit `2cc1577eeaf2f74dede6d016a70722dbd409ea2f`. The original MIT license is retained in `LICENSE`. The site retains AcadHomepage's sidebar and publication layout, with adapted content, navigation, metadata, styles, and build workflow.

This imports the template into an existing repository. It does not create GitHub's fork relationship or replace the old Git history. The `upstream` remote identifies the template repository.

- RA-Det framework image: [arXiv:2603.01544](https://arxiv.org/html/2603.01544v2).
- CIRA overview image: [arXiv:2609.35002](https://arxiv.org/html/2609.35002v1).
- OTS-Bench framework image: Figure 2 from [arXiv:2603.03714](https://arxiv.org/html/2603.03714v1#S2.F2). The displayed title and AAAI 2027 submission status reflect the author's updated manuscript details.
- WDA-Det and MambaGuard framework images: original diagrams provided by the author, stored as `images/wda-det.png` and `images/mambaguard.png`.
- VoicePrint screenshot: the original [Home screen](https://github.com/orangecc7/Voice/blob/master/figures/fig1.png) from the Voice repository. The image retains the app's original interface; website labels and descriptions are English.
- The portrait is the author-provided `images/self.jpg`, displayed in a circular frame using CSS.
- The browser favicon is the author-provided orange illustration, copied unchanged to `assets/icons/orange.png`; the original mascot remains available for sharing metadata.

### Icons and visual refinement

Six section/research heading icons are the author's chosen PNGs, imported from the sibling `icons/` folder into `assets/icons/headings/`, with fully transparent outer margins cropped away: `news.png`, `publications.png`, `education.png`, `projects.png`, `aigc-detection.png`, and `world-models.png`. Their visible pixels are preserved without resampling; each renders proportionally inside a 24px frame with empty alternative text beside its visible heading. LLM Safety keeps the original hand-authored red devil in `_includes/icons/headings/llm-safety.svg`; the author's unused safety PNG and previous heading illustrations have been removed. `_includes/icon.html` is the central mapping. Only Phosphor Fill SVGs still used by contacts, publication links, theme controls, and the figure dialog are retained; their license is in `assets/icons/phosphor-license.txt`. All icons are served locally from within this repository; the sibling `icons/` folder is not a build or runtime dependency and can be deleted after import.

The sidebar shows only Email / WeChat / QQ as linked labels. WeChat copies `orange_ychen` and QQ copies `3132454640`; each shows a compact 20px-high, white, dark-orange-text capsule to the right of the link, with one continuous 1px dark-orange (`#c34d00`) SVG outline joining the rounded body and left-pointing message tail, which fades away after half a second. If clipboard access is unavailable, the bubble offers a selectable account for manual copying. Email uses `mailto:`. Contact IDs are configured under `author` in `_config.yml`.

## WSDM 2027 workshop

The independent static workshop site is published at [orangecc7.github.io/wsdm2027-agentic_systems/](https://orangecc7.github.io/wsdm2027-agentic_systems/). Its HTML, CSS, JavaScript, images, fonts and licenses live together in `wsdm2027-agentic_systems/`. Jekyll copies the HTML without applying the academic homepage layout. Keep resource paths relative to this directory.

Update these committed files to publish workshop changes through the same Pages workflow. The original `../wsdm27_website` folder is not a build dependency. To check the rendered workshop, run:

```bash
python3 scripts/validate_workshop.py _site
```

