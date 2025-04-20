# r/Hurricane App
This app is specifically to be used on r/Hurricane. It automatically updates various parts of the
subreddit with the latest tropical weather data from the National Hurricane Center and/or National
Weather Service.

I have decided to leave the r/hurricane app unlisted and only allowed in the r/Hurricane and
r/HurricaneTracker subs moderated by me, mostly due to the "future plans" I plan to build into the
app that focus solely on enhancing the experience of these two subs specifically! I may team with
the r/TropicalWeather team in the future, which may utilize similar items. Additionally, the
"data disclaimer" is also a concern. I would like to prevent spread of "misinformation" due to
either inaccurate data (due to bugs) or because individuals on other subs not understanding the data
presented (such as the Automatic Tropical Cyclone Forecast).

## Interactive Posts
This app currently provides a single interactive post type:

### Tropical Weather Outlook (TWO) Posts
Provides a custom interactive post type to be used as a pinned post where the community can easily
find the latest Tropical Weather Outlooks, Automatic Tropical Cyclone Forecasts, and Tropical
Cyclone Plan of the Days. Expected to be a pinned post, with occasionally reposted for visibility on
feeds. Frequency of reposts yet to be determined and are manual. Wish to discuss this with the
Devvit community then the r/Hurricane mod team.

### FUTURE - Storm Summary Posts
As the year progresses, I would like to develop an interactive post experience around active named 
storms. This would then also act as our "mega-thread" for providing helpful information along with
post-storm coverage.

### FUTURE - Recon Mission Data Posts
The journey to develop a simple sidebar widget showing the recon flight schedule (which is not
"easily" displayed anywhere I know of) and provide the r/Hurricane sub a place to review recon data
in realtime has lead me to the app today. However, I still have a goal to provide a custom post type
around the realtime display and have an interactive experience with recon data!

## Settings
There are a few different settings to help control aspects of the app:
1. Data Environment - Production uses live data from the National Hurricane Center. Development uses
   the test data API. Default: Production
2. Data Check Frequency (min) - How frequently to check for updates on the summary API.
   Default: 1 min
3. Data API Stale Time (hr) - When to consider the summary API data to be outdated and not displayed
   Default: 12 hours
4. Log Level - Controls the level of logging by the app. Default: Warn
5. Discord Notification URL - (Optional) A Discord channel webhook URL to send alerts to. Must be a
   Discord webhook URL
6. Notification Silence (min) - How long to silence the same notification sent to Discord.
   Default: 30

## Menu Items
This app has a few different menu items to control the data update scheduled job, and to post the
interactive post types.

* **Subreddit Menu > RHurricane - Start Data Updater**  
This menu allows you to start the data updater scheduled job, which starts various update processes.

* **Subreddit Menu > RHurricane - Stop Data Updater**  
This menu allows you to stop the data updater scheduled job.

* **Subreddit Menu > RHurricane - Create Summary Post**  
Creates a new Tropical Weather Outlook (TWO) Interactive Post.

## Future Plans
There are a number of plans for enhancing and adding to this app as the hurricane season progresses:
* Interactive Post Types
  * Add WebView to TWO
  * Add Storm Summary posts
  * Add Recon Data posts
* Various community automations
  * Update sidebar widget text with TWO + Recon (new and old reddit)
  * Update community style or "event mode" (need more training on this)
    * Ideally, enforce stricter rules during "storm times"
  * Update community status / emoji (not yet supported by Devvit)
  * Automated mega-thread creation / enforcement after storms dissipate
  * Would be awesome to analyse image posts for rule-breaking images (i.e. no clear 
    date/coordinates, known common troll posts, etc.)
  * Other various mod pain-points, specific to r/Hurricane (if any)