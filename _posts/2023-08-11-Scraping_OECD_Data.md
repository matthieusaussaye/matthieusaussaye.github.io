# Web Application: Automation of OECD data extraction

Hello readers, I just coded a little application to help people from market research to get all the data they need by using a simple website.
It could be really useful and replace the scrapping that have to be done by hands so it could be painful.

Here is the schema of what we want to deploy.  I am doing this project for my agency: sigmapulse.ch, you could checkout our projects and don't hesitate to contact us to discuss your projects / issues we could solve with IT and Machine Learning.

![such a lovely place](:Schema.png){:data-align="center"}


To deploy this I will use a simple stack :

	pip install python3.9 requests django pandas


# Step 1 - Create the scrapping function

We will use request package to communicate with the OECD API. Once we have understand how it works, we could starting to code the requests from the URL

	import requests as rq  
	import pandas as pd  
	import re  
	from urllib3.exceptions import InsecureRequestWarning  
	from urllib3 import disable_warnings  
	  
	disable_warnings(InsecureRequestWarning)  
	  
	OECD_ROOT_URL = "http://stats.oecd.org/SDMX-JSON/data"  
	  
	def make_OECD_request(dsname, dimensions, params = None, root_dir = OECD_ROOT_URL):  
	    # OECD API: https://data.oecd.org/api/sdmx-json-documentation/#d.en.330346  
	  
	  if not params:  
        params = {}  
  
    dim_args = ['+'.join(d) for d in dimensions]  
    dim_str = '.'.join(dim_args)  
  
    url = root_dir + '/' + dsname + '/' + dim_str + '/all'  
  
	  print('Requesting URL ' + url)  
	    return rq.get(url = url, params = params, verify=False)  
  
  
 
 
	def create_DataFrame_from_OECD(country = 'CZE', subject = [], measure = [], frequency = 'M',  startDate = None, endDate = None):  

	  response = make_OECD_request('MEI',[[country],subject,measure[frequency]], {'startTime': startDate, 'endTime': endDate, 'dimensionAtObservation': 'AllDimensions'})  
  
    # Data transformation  
  
	  if (response.status_code == 200):  
  
        responseJson = response.json()  
  
        obsList = responseJson.get('dataSets')[0].get('observations')  
  
        if (len(obsList) > 0):  
  
            print('Data downloaded from %s' % response.url)  
  
            timeList = [item for item in responseJson.get('structure').get('dimensions').get('observation') if item['id'] == 'TIME_PERIOD'][0]['values']  
            subjectList = [item for item in responseJson.get('structure').get('dimensions').get('observation') if item['id'] == 'SUBJECT'][0]['values']  
            measureList = [item for item in responseJson.get('structure').get('dimensions').get('observation') if item['id'] == 'MEASURE'][0]['values']  
            obs = pd.DataFrame(obsList).transpose()  
            obs.rename(columns = {0: 'series'}, inplace = True)  
            obs['id'] = obs.index  
            obs = obs[['id', 'series']]  
            obs['dimensions'] = obs.apply(lambda x: re.findall('\d+', x['id']), axis = 1)  
            obs['subject'] = obs.apply(lambda x: subjectList[int(x['dimensions'][1])]['id'], axis = 1)  
            obs['measure'] = obs.apply(lambda x: measureList[int(x['dimensions'][2])]['id'], axis = 1)  
            obs['time'] = obs.apply(lambda x: timeList[int(x['dimensions'][4])]['id'], axis = 1)  
            obs['names'] = obs['subject'] + '_' + obs['measure']  
  
            data = obs.pivot_table(index = 'time', columns = ['names'], values = 'series')  
  
            return(data)  
  
        else:  
  
            print('Error: No available records, please change parameters')  
  
    else:  
  
        print('Error: %s' % response.status_code)  

	def create_DataFrame_from_OECD(country = 'CZE', subject = [], measure = [], frequency = 'M',  startDate = None, endDate = None):  
	   
	 # Data download  
	  response = make_OECD_request('MEI'  
	  , [[country], subject, measure, [frequency]]  
	                                 , {'startTime': startDate, 'endTime': endDate, 'dimensionAtObservation': 'AllDimensions'})  
	  
	    # Data transformation  
	  if (response.status_code == 200):  
	  
	        responseJson = response.json()  
	  
	        obsList = responseJson.get('dataSets')[0].get('observations')  
	  
	        if (len(obsList) > 0):  
	  
	            print('Data downloaded from %s' % response.url)  
	  
	            timeList = [item for item in responseJson.get('structure').get('dimensions').get('observation') if item['id'] == 'TIME_PERIOD'][0]['values']  
	            subjectList = [item for item in responseJson.get('structure').get('dimensions').get('observation') if item['id'] == 'SUBJECT'][0]['values']  
	            measureList = [item for item in responseJson.get('structure').get('dimensions').get('observation') if item['id'] == 'MEASURE'][0]['values']  
	            obs = pd.DataFrame(obsList).transpose()  
	            obs.rename(columns = {0: 'series'}, inplace = True)  
	            obs['id'] = obs.index  
	            obs = obs[['id', 'series']]  
	            obs['dimensions'] = obs.apply(lambda x: re.findall('\d+', x['id']), axis = 1)  
	            obs['subject'] = obs.apply(lambda x: subjectList[int(x['dimensions'][1])]['id'], axis = 1)  
	            obs['measure'] = obs.apply(lambda x: measureList[int(x['dimensions'][2])]['id'], axis = 1)  
	            obs['time'] = obs.apply(lambda x: timeList[int(x['dimensions'][4])]['id'], axis = 1)  
	            obs['names'] = obs['subject'] + '_' + obs['measure']  
	  
	            data = obs.pivot_table(index = 'time', columns = ['names'], values = 'series')  
	  
	            return(data)  
	  
	        else:  
	  
	            print('Error: No available records, please change parameters')  
	  
	    else:  
	  
	        print('Error: %s' % response.status_code)


We will can try the function with a sample to double check its working

	data = create_DataFrame_from_OECD(country = 'USA',  
	                                  frequency = 'M',  
	                                  subject = ['CPGRLE01'],  
	                                  startDate = '2021-Q1',  
	                                  endDate = '2022-Q1')  
	  
	  
	data.to_excel("output.xlsx")

We should receive data from 2021-01 to 2022-03 split by one month.

## Scheduling our tasks with Celery:

We’ll now be leveraging the task scheduling powers of Celery by leaning on the  `beat_schedule`  that comes out of the box. This allows us to register tasks with the scheduling agent for specific times.

[A great reference for scheduling examples can be found in the official documentation](https://docs.celeryproject.org/en/stable/userguide/periodic-tasks.html). I’ve also included a few additional schedule examples in the  `tasks.py`  in my  [GitHub repo](https://github.com/mattdood/web_scraping_example).

## Create the interface with Django:

Install django before

-   [Django](https://www.djangoproject.com/)  — A Python web framework

Create the Django application in the same folder

	 django-admin startproject django_OECD_scraping .

Navigate to the server to see the interfqce

	python manage.py runserver

We’ll now create a URL in  `urls.py`  that we’ll pass our future view to.

	from django.contrib import admin  
	from django.urls import path, include  
	from . import views  
	  
	from django.urls import path  
	from . import views  
	  
	urlpatterns = [  
	    path('', views.index, name='index'),  
	]

We could after create a file views.py

	# django_web_scraping_example/views.py  
	from django.shortcuts import render  
	from django.views import generic  
	from scrapping_OECD import create_DataFrame_from_OECD  
	  
	# Create your views here.  
	def index(request):  
	    context = {}  
	    if request.method == "POST":  
	        country = request.POST.get("country")  
	        frequency = request.POST.get("frequency")  
	        subject = request.POST.get("subject")  
	        start_date = request.POST.get("startDate")  
	        end_date = request.POST.get("endDate")  
	  
			data = scrape_data(country, frequency, subject, start_date, end_date)
	        context["data"] = data  
	  
	    return render(request, 'index.html', context)  
	  
	  
	def scrape_data(country, frequency, subject, start_date, end_date):  
	   data = create_DataFrame_from_OECD(country=country,  
	                                      frequency=frequency,  
	                                      subject=[subject],  
	                                      startDate=start_date,  
	                                      endDate=end_date)  
	  
	    print(f"Scraped data for {country} from {start_date} to {end_date}")  
	    return data.to_excel("output.xlsx")

Next, we’ll create our template directory, base HTML template, and homepage template:

	$ mkdir templates && touch templates/base.html && touch templates/home.html

To register our template files, we'll add our templates directory to Django settings:

	TEMPLATES = [  
    ...  
    'DIRS': ['templates'], # new  
    ...  ]

We add some HTML to put a the option of closing the scrapping parameters on the website, on the page index.html:

	<form method="post">  
	  {% csrf_token %}  
	    <label for="country">Country:</label>  
	 <input type="text" id="country" name="country"><br><br>  
	  
	 <label for="frequency">Frequency:</label>  
	 <input type="text" id="frequency" name="frequency"><br><br>  
	  
	 <label for="subject">Subject:</label>  
	 <input type="text" id="subject" name="subject"><br><br>  
	  
	 <label for="startDate">Start Date:</label>  
	 <input type="text" id="startDate" name="startDate"><br><br>  
	  
	 <label for="endDate">End Date:</label>  
	 <input type="text" id="endDate" name="endDate"><br><br>  
	  
	 <input type="submit" value="Scrape Data">  
	</form>  
	  
	{% if data %}  
	<p>Results: {{ data }}</p>  
	{% endif %}

To collect the data we will create a scraping dedicated page

	$ python manage.py startapp runserver


## Adding our tasks.py:

The tasks outlined within our  `tasks.py`  will be quite similar to the ones included in my previous article. The primary adjustments will be:

-   The save function
-   How we call objects

We’ll begin with the scraping function itself, to illustrate how data will be pulled. The below code block illustrates the entire shared task, with imports specific to this task. Explanations are found below the code.



# Optional - Set-up the Django dashboard

![](https://miro.medium.com/v2/resize:fit:1400/0*eugOv7jnOkihFpEC.png)

	 celery -A tasks worker -l INFO 
	 
-   `celery` — The package we’re calling
-   `worker` — Starting our worker process
-   `-A tasks`  — We want the  `tasks`  app
-   `-l INFO`  — Ensuring we have verbose console logging events

This part is optional, but Celery could be useful to deploy if you want to print on your app the data extracted with a pre-configured granularity. It should be deployed with MLRabits. Really useful for news extraction.

The next step would be to register our tasks with our Celery app, this is as simple as placing `@app.task` above each function.

