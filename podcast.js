// update this to be the RSS URL of the podcast feed
url = "https://www.feeddomain.com/feed-uri-path/";

const fetch = require('node-fetch');
const DOMParser = require('xmldom').DOMParser;

exports.handler = function(context, event, callback) {
	// create the voice response object
	let twiml = new Twilio.twiml.VoiceResponse();
    
    // load the first item from the RSS feed (https://developers.google.com/web/updates/2015/03/introduction-to-fetch)
    fetch(url)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        // end the call and hang up
	    twiml.hangup();
	    callback(null, twiml);
        return;
      }

      // Examine the text in the response
      response.text().then(function(data) {
        
        // create a parser, give it the RSS feed and tell it to parse as XML
        parser = new DOMParser();
        xmlfeed = parser.parseFromString(data,"text/xml");

        // extract the data from within the channel
        const channel = xmlfeed.getElementsByTagName("channel")[0];

        // get the title and description
        podcastTitle = channel.getElementsByTagName("title")[0].textContent;
        podcastDescription = channel.getElementsByTagName("description")[0].textContent;

        console.log(podcastTitle);
        console.log(podcastDescription);

        // Say the welcome text
        twiml.say('Welcome to ' + podcastTitle);
        twiml.say(podcastDescription);

        // get the first item 
        const podcastItem1 = channel.getElementsByTagName("item")[0];

        itemTitle = podcastItem1.getElementsByTagName("title")[0].textContent;
        itemDescription = podcastItem1.getElementsByTagName("itunes:subtitle")[0].textContent;
        itemDurationTotal = podcastItem1.getElementsByTagName("itunes:duration")[0].textContent;

        // use the double not bitwise operator to round to the minutes
        itemDurationMinutes = ~~(itemDurationTotal / 60);
        // use the modulus to get the seconds 
        itemDurationSeconds = itemDurationTotal % 60;

        itemUrl = podcastItem1.getElementsByTagName("enclosure")[0].getAttribute("url");
        
        console.log(itemTitle);
        console.log(itemDescription);
        console.log(itemDurationMinutes);
        console.log(itemDurationSeconds);
        
        // Introduce the item
        twiml.say('You are about to hear ' +itemTitle);
        twiml.say(itemDescription);
        twiml.say('This is ' +itemDurationMinutes+ ' minutes and ' +itemDurationSeconds+ ' seconds');
        twiml.say('Please wait while we load the sound file');
        
        // Play the item
        twiml.play(itemUrl);

        // end the call and hang up
	    twiml.hangup();
	    callback(null, twiml);
        return;
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error', err);
    
    // end the call and hang up
	twiml.hangup();
	callback(null, twiml);
  });
};
