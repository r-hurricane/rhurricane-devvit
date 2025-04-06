# r/Hurricane - Tropical Weather Outlook (TWO) App
This widget is specifically to be used on r/Hurricane. It automatically updates various parts of the
subreddit with the latest tropical weather data from the National Hurricane Center and/or National
Weather Service.

## Tropical Weather Outlook (TWO) Interactive Post
Provides a custom interactive post type to be used as a pinned post that the community can easily
find the latest Tropical Weather Outlooks, Automatic Tropical Cyclone Forecasts, and Tropical
Cyclone Plan of the Days.

## Settings
Provides two settings:
1. Data Environment - Production uses live data from the National Hurricane Center. Development uses
   the test data API.
2. Data Check Frequency (min) - How frequently to check for updates on the summary API.
   Default: 1 min

## Menu Items

* **Subreddit Menu > RHurricane - Start Data Updater**  
This menu allows you to start the data updater scheduled job, which starts various update processes.

* **Subreddit Menu > RHurricane - Stop Data Updater**  
This menu allows you to stop the data updater scheduled job.

* **Subreddit Menu > RHurricane - Create Summary Post**  
Creates a new Tropical Weather Outlook (TWO) Interactive Post.