# telephonepodcast
I wrote this code during the first COVID lockdown as a function to be pasted into Twilio functions.  I set up a service within Twilio that would invoke the function when someone called a telephone number - the Javascript code would then play the latest MP3 from a podcast over the phone.

For this you will need to set up a Twilio account and know the URL of the RSS feed for the podcast that you wish to play over the phone.  This must be a valid podcast RSS feed - to check the validity of your podcast URL, you can use a validator such as the one provided by Podbase: https://podba.se/validate/.   If your podcast is available on ApplePodcasts or Soundcloud and you don’t know your RSS feed URL, then you can use the handy https://etrssfeed.com tool to find it. 

If the code doesn't work, it may be due to CORs (Cross Origin Requests - see https://javascript.info/fetch-crossorigin for info) - one way to allow requests from sites other than the one that your podcast is hosted on is to update your site's .htaccess file with the below (replace the * with the appropriate Twilio URL)

Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET"
Header set Access-Control-Allow-Headers "Content-Type"
