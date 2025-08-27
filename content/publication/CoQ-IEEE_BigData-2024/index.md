---
title: "Chain-of-Query Prompting for Efficient Small Language Models in Multi-Hop Open-Domain Question Answering"
authors:
  - Rithika Akula
  - Roland Oruche
  - admin  # Zian Zeng
  - Yuanxun Zhang
  - Marcos Zampieri
  - Prasad Calyam
date: "2024-12-15T00:00:00Z"
doi: ""

# Schedule page publish date (NOT publication's date).
publishDate: "2024-12-15T00:00:00Z"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard. 

# article means preprint
# publication_types: ["article"] 

publication_types: ['paper-conference']

# Publication name and optional abbreviated publication name.
publication: "2024 IEEE International Conference on Big Data workshop From Theory to Practice: Workshop on Large Language and Foundation Models"
publication_short: "IEEE Big Data 2024"

abstract: Large Language Models (LLMs) have been shown to exhibit robust performance in multi-hop open-domain question- answering (ODQA), which is often attributed to a large number of parameters and various prompting formats. While smaller language models (LMs) offer a more cost-effective approach for real-world applications, these LMs are often challenged with maintaining factual responses in multi-hop ODQA settings. In this paper, we introduce a novel prompting approach viz., Chain-of-Query (CoQ), that is designed to enhance smaller LMs by decomposing complex queries into context-aware subqueries for robust ODQA in multi-hop settings. Our CoQ prompting approach creates an efficient pipeline that integrates a retriever with LMs for optimizing the retrieval process through multiple query generation, thereby adding external knowledge to the LM with a small amount of context. We validate our CoQ approach on benchmark datasets for multi-hop ODQA against large-scale LMs with state-of-the-art prompting formats. When evaluating our CoQ prompting approach for small-scale and large-scale LMs, the results demonstrate a significant increase in QA performance by up to 5.4% and 11.5%, respectively, thus, making it a valuable advancement for complex QA tasks.

# Summary. An optional shortened abstract.
summary: We introduce Chain-of-Query (CoQ), a novel prompting approach that enhances smaller language models (LMs) in multi-hop open-domain question answering (ODQA) by decomposing complex queries into context-aware subqueries, improving efficiency and factual accuracy. CoQ demonstrates up to 5.4% and 11.5% performance gains for small-scale and large-scale LMs, respectively, on benchmark datasets, making it a valuable solution for complex QA tasks.

tags:
- Chain-of-Thought
- Small Language Models
- Question-Answering
- Information Retrieval

featured: true

links:
- name: 
  url: ''
url_pdf: '#'
url_code: ''
url_dataset: ''
url_poster: ''
url_project: ''
url_slides: ''
url_source: ''
url_video: ''

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  caption: 'Image credit: [**Adobe Stock**](https://stock.adobe.com/search?k=argot)'
  focal_point: ""
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects:
- internal-project

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
slides: ""
---

<!-- This work is driven by the results in my [previous paper](/publication/conference-paper/) on LLMs. -->

<!-- {{% callout note %}}
Create your slides in Markdown - click the *Slides* button to check out the example.
{{% /callout %}}

Add the publication's **full text** or **supplementary notes** here. You can use rich formatting such as including [code, math, and images](https://docs.hugoblox.com/content/writing-markdown-latex/). -->
