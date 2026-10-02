---
permalink: /
title: "Yuechen Zhang (Orange)"
excerpt: "AI researcher working on AIGC detection and LLM safety, and exploring world models."
author_profile: true
redirect_from:
  - /about/
  - /about.html
---

<section class="intro" id="about-me" aria-labelledby="intro-heading">
  <h1 id="intro-heading">Hi, I'm <span>Orange</span><span class="intro-orange">🍊</span><span class="intro-period">.</span></h1>
  <p>I'm <strong>Yuechen Zhang</strong>, an undergraduate student at Jiangnan University (JNU) (2023–2027). My research interests lie in <strong>AIGC detection</strong> and <strong>LLM safety</strong>, with a focus on detecting AI-generated images and understanding risks in vision-language models.</p>
  <p>I am advised by Associate Professor <a href="{{ site.author.advisor_scholar }}" target="_blank" rel="noopener noreferrer">Li Sun</a> at Beijing University of Posts and Telecommunications (BUPT), where my master's studies are planned for 2027–2030. My master's research will focus on <strong>LLM safety</strong> and exploratory work on <strong>world models</strong>.</p>
  <p>Feel free to get in touch about research or collaboration.</p>
</section>

<section id="news" aria-labelledby="news-heading">
  <div class="section-heading"><h2 id="news-heading">{% include icon.html name="news" %}<span>News</span></h2></div>
  <ul class="news-list">
    <li><time datetime="2026">2026</time><span>We propose <a href="https://arxiv.org/abs/2609.35002" target="_blank" rel="noopener noreferrer">CIRA</a> to uncover risks introduced by visual-token compression in large vision-language models. The paper is under review at <strong>ICLR 2027</strong>.</span></li>
    <li><time datetime="2026">2026</time><span>Recent work in AIGC detection: <a href="#ra-det-title">RA-Det</a> (ICML 2026) and <a href="#wda-det-title">WDA-Det</a> (PRCV 2026).</span></li>
    <li><time datetime="2025">2025</time><span><a href="#mambaguard-title">MambaGuard</a> appeared at PRCV 2025. <a href="https://github.com/orangecc7/MambaGuard" target="_blank" rel="noopener noreferrer">Code is available</a>.</span></li>
  </ul>
</section>

<section id="research" aria-labelledby="research-heading">
  <div class="section-heading"><h2 id="research-heading">{% include icon.html name="research" %}<span>Selected Publications</span></h2></div>
  {% for group in site.data.publications %}
  <div class="research-group" id="{{ group.id }}">
    <h3 class="research-group-title">{% if group.id == "aigc-detection" %}{% include icon.html name="aigc" %}{% else %}{% include icon.html name="safety" %}{% endif %}<span>{{ group.name }}</span></h3>
    {% for paper in group.papers %}
    <article class="paper-box" aria-labelledby="{{ paper.id }}-title">
      <div class="paper-box-image">
        <button class="framework-preview" type="button" data-framework-src="{{ paper.image | relative_url }}" data-framework-name="{{ paper.short_name }}" data-framework-alt="{{ paper.image_alt }}" aria-label="View {{ paper.short_name }} framework" aria-haspopup="dialog">
          <img src="{{ paper.image | relative_url }}" alt="{{ paper.image_alt }}" width="320" height="190" loading="lazy">
          <span class="figure-expand" aria-hidden="true">{% include icon.html name="expand" %}</span>
        </button>
      </div>
      <div class="paper-box-text">
        <h4 id="{{ paper.id }}-title"><a href="{{ paper.paper | default: paper.code }}" target="_blank" rel="noopener noreferrer">{{ paper.title }}</a></h4>
        <div class="paper-meta"><span class="venue{% if paper.status %} venue--review{% endif %}">{{ paper.venue }}</span>{% if paper.status %}<span class="paper-status">{{ paper.status }}</span>{% endif %}<span class="meta-dot" aria-hidden="true">·</span><span>{{ paper.role }}</span></div>
        <p class="paper-summary">{{ paper.summary }}</p>
        <div class="paper-links">
          {% if paper.paper %}<a href="{{ paper.paper }}" target="_blank" rel="noopener noreferrer">{% include icon.html name="paper" %}<span>Paper</span><span class="link-arrow" aria-hidden="true">{% include icon.html name="external" %}</span></a>{% endif %}
          {% if paper.code %}<a href="{{ paper.code }}" target="_blank" rel="noopener noreferrer">{% include icon.html name="code" %}<span>Code</span><span class="link-arrow" aria-hidden="true">{% include icon.html name="external" %}</span></a>{% endif %}
        </div>
      </div>
    </article>
    {% endfor %}
  </div>
  {% endfor %}
  <div class="research-group" id="world-models">
    <h3 class="research-group-title" id="world-models-heading">{% include icon.html name="worlds" %}<span>World Models</span></h3>
    <p class="research-group-note">Currently learning and exploring.</p>
  </div>
</section>

<section id="education" aria-labelledby="education-heading">
  <div class="section-heading"><h2 id="education-heading">{% include icon.html name="education" %}<span>Education</span></h2></div>
  <div class="education-list">
    {% for item in site.data.education %}
    <article class="education-item">
      <div class="education-dates">{{ item.dates }}<span>{{ item.status }}</span></div>
      <div class="education-details">
        <h3><a href="{{ item.url }}" target="_blank" rel="noopener noreferrer">{{ item.institution }}{% if item.abbreviation %} <span class="institution-short">({{ item.abbreviation }})</span>{% endif %}</a></h3>
        <p class="education-program"><span class="education-degree">{{ item.degree }}</span>{% if item.major %}<span class="education-separator" aria-hidden="true"> · </span><span class="education-major">{{ item.major }}</span>{% endif %}</p>
        {% if item.school %}<p class="education-school">{{ item.school }}</p>{% endif %}
      </div>
    </article>
    {% endfor %}
  </div>
</section>

<section id="projects" aria-labelledby="projects-heading">
  <div class="section-heading"><h2 id="projects-heading">{% include icon.html name="projects" %}<span>Projects</span></h2></div>
  {% for project in site.data.projects %}
  <article class="project-item" aria-labelledby="{{ project.id }}-title">
    <div class="project-gallery" aria-label="{{ project.name }} application screenshots">
      {% for screenshot in project.screenshots %}
      <figure class="project-screenshot">
        <a href="{{ screenshot.source }}" target="_blank" rel="noopener noreferrer" aria-label="View original {{ screenshot.label | downcase }} screenshot">
          <img src="{{ screenshot.image | relative_url }}" alt="{{ screenshot.alt }}" width="{{ screenshot.width }}" height="{{ screenshot.height }}" loading="lazy">
        </a>
      </figure>
      {% endfor %}
    </div>
    <div class="project-description">
      <h3 id="{{ project.id }}-title"><a href="{{ project.url }}" target="_blank" rel="noopener noreferrer">{{ project.name }}</a></h3>
      <p class="project-category">{{ project.category }}</p>
      <p>{{ project.description }}</p>
      <p class="project-stack">{{ project.stack }}</p>
      <a class="project-repository" href="{{ project.url }}" target="_blank" rel="noopener noreferrer">{% include icon.html name="github" %}<span>View on GitHub</span><span class="link-arrow" aria-hidden="true">{% include icon.html name="external" %}</span></a>
    </div>
  </article>
  {% endfor %}
</section>
