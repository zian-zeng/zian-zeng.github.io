---
title: "Disentangling Complex Questions in LLMs via Multi-Hop Dependency Graphs"
authors:
  - Roland Oruche
  - Alphaeus Dmonte
  - Vani Seth
  - admin  # Zian Zeng
  - Yuanxun Zhang
  - Marcos Zampieri
  - Prasad Calyam
date: "2025-08-27T00:00:00Z"
doi: ""

# Schedule page publish date (NOT publication's date).
publishDate: "2025-01-22T00:00:00Z"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard. 

# article means preprint
# publication_types: ["article"] 

publication_types: ['paper-conference']

# Publication name and optional abbreviated publication name.
publication: "The 34th ACM International Conference on Information and Knowledge Management (CIKM) "
publication_short: "CIKM 2025"

abstract: While Large language models (LLMs) have shown to exhibit remark- able performance in a wide range of NLP tasks, they often struggle to interpret and reason over multi-hop questions in open-domain question answering (ODQA) settings. While popular prompt approaches such as Chain-of-Thought and Plan-and-Solve facilitate more manageable questions for OQDA via task decomposition, these approaches are prone to generating erroneous and redundant intermediate steps in multi-hop queries due to limited capacity for modeling complex entity relationships. In this paper, we intro- duce a novel prompt approach for multi-hop QA viz., MoDeGraph ( Multi-Hop Dependency Graphs), that is designed to steer LLMs to extract and model entity relationships in complex questions. MoDeGraph constructs a dependency graph from LLM-generated entity-relation triples to enable more coherent and human-like multi-step reasoning. Experimental results in knowledge-intensive tasks for multi-hop QA demonstrate our approach produces more coherent and faithful reasoning chains as well as consistent increase in QA performance across several benchmark datasets.

# Summary. An optional shortened abstract.
summary: Addressing interpretion and reasoning over multi-hop questions in open-domain question answering (ODQA) settings, by using MoDeGraph ( Multi-Hop Dependency Graphs).

tags:
- NLP(Large Language Models)
- Question Answering
- Knowledge Graph
- Information Retrieval
- Task Decomposition
- Information Extraction

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
  caption: 'Image credit: [**The Westport Library**](https://westportlibrary.org/wp-content/uploads/2022/04/ASL-box-500-%C3%97-300-px-1-1920x960.png)'
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
