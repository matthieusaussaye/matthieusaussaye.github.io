---
# multilingual page pair id, this must pair with translations of this page. (This name must be unique)
lng_pair: id_Examples
title: Examples

# post specific
# if not specified, .name will be used from _data/owner/[language].yml
author: Matthieu Saussaye
# multiple category is not supported
category: Machine Learning
# multiple tag entries are possible
tags: [jekyll, sample, example post]
# thumbnail image for post
img: ":lavaux_2000.jpg"
# disable comments on this page
#comments_disable: true

# publish date
date: 2023-09-10 11:97:06 +0200

# seo
# if not specified, date will be used.
#meta_modify_date: 2022-02-10 08:11:06 +0900
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
---

<!-- outline-start -->

> You deployed a Machine Learning algorithm to automate your decisions on a particular use-case.
> You may know that these algorithms decide with an accuracy (probability of predicting the good)
> which is never 100%. In order to maximize this probability,
> the Data Scientist is particularly aware of what we commonly call “overfitting”.
> This article describe a real use-case where we solve overfitting and extract real value business from it.

<!-- outline-end -->

### Overfitting in Machine Learning: Business Implication

{:data-align="center"}

***

### Introduction

When deploying advanced Machine Learning algorithms,
one may know that overfitting remains a notorious challenge for data scientists.
It is really difficult to automate but essential to have a look at because it has strong business implications.

_Overfitting vs Underfitting_

Overfitting, a term coming from the field of machine learning,
describes a situation where a model becomes too complex, learning to perform exceptionally
well on training data while failing to generalize to unseen data.
In contrast, underfitting is a scenario in data science where a data model is unable to capture the relationship between the input and output variables accurately,
generating a high error rate on both the training set and unseen data.
To illustrates these two phenomena we will go use a dataset to predict wine quality.

### Wine quality prediction

You are a respected wine producer, possessing thriving vineyards nestled within the picturesque Lavaux region,
one of the most stunning areas of Switzerland. This region, renowned for its exceptional beauty,
was rightfully listed as a UNESCO World Heritage site in 2007. Here, in this unique terrain,
you create distinguished red wines, embodying the very spirit of this special place.

#### Blockquote

> **William Shakespeare**, Let me not to the marriage of true minds
> Admit impediments. Love is not love
> Which alters when it alteration finds,
> Or bends with the remover to remove.
> O no, it is an ever-fixed mark
> That looks on tempests and is never shaken;
> It is the star to every wand'ring barque,
> Whose worth's unknown, although his height be taken.
> Love's not Time's fool, though rosy lips and cheeks
> Within his bending sickle's compass come;
> Love alters not with his brief hours and weeks,
> But bears it out even to the edge of doom.
> If this be error and upon me proved,
> I never writ, nor no man ever loved.


![such a lovely place](:lavaux_2000.jpg){:data-align="center"}
The beautiful Lavaux vineyards, Lausanne. Image by author{:data-align="center"}

As I am myself living in Lausanne, I am in love with this region,
and particularly fan of the wine tasting we could have with a stunning view !
We will use a dataset which has 12 dimensions and containing the composition & quality of 1599 samples.
It is the kaggle wine quality sample dataset.

#
```python
import plotly
import pandas as pd
from sklearn import tree
from sklearn import metrics
import plotly.graph_objects as go
import numpy as np
from scipy import special,stats
from sklearn import ensemble
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

df = pd.read_csv('winequality-red.csv')

quality_mapping = {
    3: 0,
    4: 1,
    5: 2,
    6: 3,
    7: 4,
    8: 5
}

df.loc[:, 'quality'] = df.quality.map(quality_mapping)
df = df.sample(frac=1).reset_index(drop=True)

df_train = df.head(1000)
df_test = df.tail(599)
```

#### Wine quality Dataset from Kaggle

| fixed acidity | volatile acidity (left align) | residual sugar (right align) | ... | quality |
|---------------|:------------------------------|-----------------------------:|-----|---------|
| 9.4           | 0.68                          |                          2.7 | ... | 3       |
| 7.9           | 0.58                          |                          2.3 | ... | 3       |
| 11.1          | 0.52                          |                          2.7 | ... | 2       |
| 6.2           | 0.3                           |                          3.8 | ... | 4       |
1599 rows x 13 columns: Wine Quality Dataset from Kaggle {:data-align="center"}

In our approach, we predict the quality score of wine samples
(between 0 and 5) by training on 1000 data points and predicting on 599.
First, we use a simple decision tree to illustrate the overfitting process.
The decision tree will break down the training dataset into smaller subsets.
Each internal node of the tree represents a feature and each leaf a prediction.
This model is not complex so it will overfit really fast.
Since our tree is binary, the number of node = features
taken for decision would be 2**d— 1 where d is the max_depth.

```python
train_accs = []
test_accs = []

# init a loop where we dynamically change the value of max_depth
for depth in range(1, 200):
    clf = tree.DecisionTreeClassifier(max_depth=depth)
    clf.fit(df_train[cols], df_train.quality)
    train_predictions = clf.predict(df_train[cols])
    test_predictions = clf.predict(df_test[cols])

    train_acc = metrics.accuracy_score(df_train.quality, train_predictions)
    test_acc = metrics.accuracy_score(df_test.quality, test_predictions)

    # append the accuracies to the lists
    train_accs.append(train_acc)
    test_accs.append(test_acc)

# plot the data
fig = go.Figure()

# Add the train accuracy line trace
fig.add_trace(go.Scatter(x=list(range(0, 30, 1)), y=train_accs, mode='lines', name='train accuracy'))

# Add the test accuracy line trace
fig.add_trace(go.Scatter(x=list(range(0, 30, 1)), y=test_accs, mode='lines', name='test accuracy'))

# Update layout
fig.update_layout(
    title='Train and Test Accuracy vs. max_depth - Decision Tree',
    xaxis_title='max_depth',
    yaxis_title='accuracy',
    legend=dict(x=0, y=1, bgcolor='rgba(255, 255, 255, 0.5)'),
    font=dict(size=15),
    width=800,
    height=500
)

# Show the figure
fig.show()
```
![Train-testing](:decisiontree_overfit.png){:data-align="center"}
Measure of the accuracy with a decision tree, Image by author{:data-align="center"}

Here, we could see that max_depth > 10 corresponds to a very high accuracy
in training (touching values of 100%) but how this is around 55–60% in
the validation set. **This is overfitting**.

In fact, the highest accuracy value in the validation set can be seen at
max_depth = 9, corresponding to 511 nodes. It is the ideal value for this model to not overfit.
But the result is not satisfying. The model does not learn enough on the dataset to create a
satisfying accuracy score on the testing set.

A solution could be to use a more complex mode.
Let’s predict with the **Random forest**. This model average several decision trees model which are trained on random subsets.
It reduces the chance that the model will from noise rather than signal compared to **Decision Tree**.
![Train-testing](:randomforest_overfit.png){:data-align="center"}
Measure of the accuracy with a random forest, Image by author{:data-align="center"}


This difference in accuracy offers direct business implications for the wine producer.


#### Business implications of overfitting

In order to illustrate the direct business implication of avoiding overfitting
for our wine producer, we would clarify some simulation parameters.

- The wine producer in the Lavaux try 500 different batches or barrels samples
just after the harvest period in a way to launch the production of the new wines.

- Each wine sample’s chemical data is collected and used as input
for the predictive model to know if the wine is ready or not.

- The producer’s previous method of quality prediction used is a decision tree model
which produces an accuracy of 60%.

- We simplify the business and assume that the producer experiences
a cost for unsuccessful wine samples that were not predicted around 1000$.

**Now, let’s calculate the potential business impact of overfitting around all the samples:**


#### Cost Savings

**Number of Successful Wine Samples without the Model =
Number of Wine Samples * Accuracy without the Model**


- Number of Unsuccessful Wine Samples with the **DT** = 500 * 0.40 = 200
- Number of Unsuccessful Wine Samples with the **RF** = 500 * 0.32 = 160
- Assuming a cost of $1,000 per unsuccessful wine sample:

We get a total cost saving by solving overfitting of $40,000 for the harvesting period !
This is an impactful Machine Learning development !

It demonstrates the significant impact that accurate predictions can have on the producer’s wine development process,
leading to more profitable operations.

This example is based on a simulation of a wine producer based in the beautiful Lavaux region in Switzerland,
but maybe not representative of every wine producer.

#### Conclusion


When models are “right-fit,” they strike a balance between capturing underlying patterns
in the training data and maintaining generalizability to unseen data.

In our example, we only tuned our ML algorithm but we have a lot to do on the data : feature engineering & feature selection
could have a significant impact too.

Overfitting represents a key challenge in applying machine learning to business scenarios.
By understanding its implications and employing strategies to mitigate it,
businesses can harness the full potential of their data, increasing business value.

Use this repo if you want to experience yourself overfitting
on the wine-quality dataset:

https://github.com/matthieusaussaye/wine_quality_prediction
