---
# Leave the homepage title empty to use the site title
title: ""
date: 2025-02-05
type: landing

design:
  # Default section spacing
  spacing: "6rem"

sections: 
  - block: resume-biography-3
    content:
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: admin
      text: ""

      # New Background
      
      # text: |-
      #   <div class="content--canvas"></div>
      #   <style>
      #     .content--canvas {
      #       position: absolute;
      #       top: 0;
      #       left: 0;
      #       width: 100%;
      #       height: 100%;
      #       z-index: -1;
      #     }
      #   </style>
      #   <script src="/background-effect/swirl.bundle.js"></script>
      #   ## About Me

      #   Aloha! I preferred to be called as 'An', like 'An' in 'Android' (British pronunciation). I am a Computer Science student at the University of Hawaii at Manoa, passionate about Natural Language Processing (NLP), Large Language Models (LLMs), Multimodal AI, Human-AI Interaction, AI for Science & Health, and anything about AI and Tech!

      #   🔥 I am currently on my path of research adventure, fueled by an unstoppable curiosity to explore the boundaries of AI and uncover new possibilities! To me, research is more than just finding answers—it's about creating, building, and pioneering breakthroughs that drive real-world impact. It’s a powerful tool to transform ideas into reality, develop AI that serves communities, and shape a future where technology makes a tangible difference. Every challenge is an opportunity to innovate, experiment, and redefine what AI can achieve, and I am ready to dive in, push forward, and contribute to the ever-evolving world of AI! 🚀✨

      # Show a call-to-action button under your biography? (optional)
      button:
        text: Download CV
        url: uploads/resume.pdf

    design:
      css_class: dark

      # Old Background
      background:
        color: black
        image:
          # Add your image background to `assets/media/`.
          filename: stacked-peaks.svg
          filters:
            brightness: 1.0
          size: cover
          position: center
          parallax: false

    # design:
    #   background:
    #     image:
    #       # Name of image in `assets/media/`.
    #       filename: background2.jpg
    #       # filename: stacked-peaks.svg
    #       # Apply image filters?
    #       filters:
    #         # Darken the image? Range 0-1 where 1 is transparent and 0 is opaque.
    #         brightness: 1.0
    #       #  Image fit. Options are `cover` (default), `contain`, or `actual` size.
    #       size: cover
    #       # Image focal point. Options include `left`, `center` (default), or `right`.
    #       position: center
    #       # Use a fun parallax-like fixed background effect on desktop? true/false
    #       parallax: true
    #       # Text color (true=light, false=dark, or remove for the dynamic theme color).
    #       text_color_light: light
      
  - block: markdown
    content:
      title: '📚 My Research'
      subtitle: ''
      text: |-
        My recent research focuses on advancing **Natural Language Processing (NLP), Large Language Models (LLMs), Multimodal AI, and Human-AI Interaction** to tackle impactful challenges in science, health, and accessibility.

        I have worked on:
        - **Neuro-symbolic models** for American Sign Language (ASL) understanding, achieving high performance in isolated sign recognition and laying the groundwork for phoneme-to-sign pipelines.
        - Developing **retrieval-augmented generation (RAG)** systems and Chain-of-Query prompting techniques to enhance reasoning in LLMs.
        - **Chatbot dialog design for improved human performance in domain knowledge discovery**, optimizing conversational AI to facilitate efficient knowledge retrieval, enhance user engagement, and support domain-specific learning.
        - Applying **explainable AI (XAI)** in healthcare, including Autism Spectrum Disorder (ASD) and Attention-Deficit/Hyperactivity Disorder (ADHD) eye-tracking classification using cutting-edge models like Vision Transformers.

        Through my research, I strive to bridge the gap between humans and AI by creating solutions that are inclusive, transparent, and impactful. Collaboration fuels progress, so let’s connect and build something amazing together! 🚀😃
    design:
      columns: '1'
  - block: collection
    id: papers
    content:
      title: Featured Publications
      filters:
        folders:
          - publication
        featured_only: true
    design:
      view: article-grid
      columns: 2
  - block: collection
    content:
      title: Recent Publications
      text: ""
      filters:
        folders:
          - publication
        exclude_featured: false
    design:
      view: citation
  # - block: collection
  #   id: talks
  #   content:
  #     title: Recent & Upcoming Talks
  #     filters:
  #       folders:
  #         - event
  #   design:
  #     view: article-grid
  #     columns: 1
  - block: collection
    id: news
    content:
      title: Recent News
      subtitle: ''
      text: ''
      # Page type to display. E.g. post, talk, publication...
      page_type: post
      # Choose how many pages you would like to display (0 = all pages)
      count: 5
      # Filter on criteria
      filters:
        author: ""
        category: ""
        tag: ""
        exclude_featured: false
        exclude_future: false
        exclude_past: false
        publication_type: ""
      # Choose how many pages you would like to offset by
      offset: 0
      # Page order: descending (desc) or ascending (asc) date.
      order: desc
    design:
      # Choose a layout view
      view: date-title-summary
      # Reduce spacing
      spacing:
        padding: [0, 0, 0, 0]
  # - block: cta-card
  #   demo: true # Only display this section in the Hugo Blox Builder demo site
  #   content:
  #     title: 👉 Build your own academic website like this
  #     text: |-
  #       This site is generated by Hugo Blox Builder - the FREE, Hugo-based open source website builder trusted by 250,000+ academics like you.

  #       <a class="github-button" href="https://github.com/HugoBlox/hugo-blox-builder" data-color-scheme="no-preference: light; light: light; dark: dark;" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star HugoBlox/hugo-blox-builder on GitHub">Star</a>

  #       Easily build anything with blocks - no-code required!
        
  #       From landing pages, second brains, and courses to academic resumés, conferences, and tech blogs.
  #     button:
  #       text: Get Started
  #       url: https://hugoblox.com/templates/
  #   design:
  #     card:
  #       # Card background color (CSS class)
  #       css_class: "bg-primary-700"
  #       css_style: ""
---
