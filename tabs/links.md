---
layout: links
# multilingual page pair id, this must pair with translations of this page. (This name must be unique)
lng_pair: id_links

# publish date (used for seo)
# if not specified, site.time will be used.
#date: 2022-03-03 12:32:00 +0000

# for override items in _data/lang/[language].yml
#title: My title
#button_name: "My button"
# for override side_and_top_nav_buttons in _data/conf/main.yml
#icon: "fa fa-bath"

# seo
# if not specified, date will be used.
#meta_modify_date: 2022-03-03 12:32:00 +0000
# check the meta_common_description in _data/owner/[language].yml
#meta_description: ""

# optional
# please use the "image_viewer_on" below to enable image viewer for individual pages or posts (_posts/ or [language]/_posts folders).
# image viewer can be enabled or disabled for all posts using the "image_viewer_posts: true" setting in _data/conf/main.yml.
#image_viewer_on: true
# please use the "image_lazy_loader_on" below to enable image lazy loader for individual pages or posts (_posts/ or [language]/_posts folders).
# image lazy loader can be enabled or disabled for all posts using the "image_lazy_loader_posts: true" setting in _data/conf/main.yml.
#image_lazy_loader_on: true
# exclude from on site search
#on_site_search_exclude: true
# exclude from search engines
#search_engine_exclude: true
# to disable this page, simply set published: false or delete this file
#published: false


# you can always move this content to _data/content/ folder
# just create new file at _data/content/links/[language].yml and move content below.
###########################################################
#                Links Page Data
###########################################################
page_data:
  main:
    header: "My projects & learnings"
    info: "CEO of sigmapulse.ch, the data science agency for ambitious companies which aim for operational excellence, I share here my learnings from my passion for Data Science and entrepreneurship."

  # To change order of the Categories, simply change order. (you don't need to change list order.)
  category:
    - title: "Companies"
      type: id_companies
      color: "gray"
    - title: "Programming"
      type: id_programming
      color: "blue"
    - title: "My path in entrepreneurship"
      type: id_entrepreneurship
      color: "#62b462"
      
  list:
    # programming
    - type: id_programming
      title: "Prevent overfitting in Machine Learning"
      url: "https://medium.com/@saussayematthieu50/overfitting-in-machine-learning-business-implications-71de37b7a90a"
      info: "Explaining how data science could create huge value for businesses."

    # companies
    - type: id_companies
      title: "Founder @ sigmapulse.ch"
      url: "https://sigmapulse.ch/"
      info:  "We help companies extract value from data using artificial intelligence algorithms and tailored dashboard software"
    - type: id_companies
      title: "Co-Founder @ la carte green"
      url: "https://lacartegreen.ch/"
      info: "Help +40 000 students in Lausanne to buy eco-responsible products with the first student sustainable card"

    # talk entrepreneurship
    - type: id_entrepreneurship
      title: "Key speaker for BCV"
      url: "https://www.linkedin.com/posts/bcv_vaud-ucreate3-projets-activity-6991385342201188352-FLzs/"
      info: "BCV, the cantonal bank of Vaud is the main partner of our project la carte green"
    - type: id_entrepreneurship
      title: "Key speaker @ Sustainability 101 talk"
      url: "https://agenda.unil.ch/display/1677070115795"
      info: "I participated to several talks in front of the global sustainability community in Lausanne"
    - type: id_entrepreneurship
      title: "Key speaker @ Entrepreneur Club"
      url: "https://www.linkedin.com/feed/update/urn:li:activity:7074778002621911041/"
      info: "I inspired Lausanne students to launch their own project in sustainability at Entrepreneur club"
    - type: id_entrepreneurship
      title: "Radio Plaisir - Entrepreneurship Podcast"
      url: "https://www.youtube.com/@radioplaisir838"
      info: "Interviewing the top entrepreneur from the Alps region."
---
