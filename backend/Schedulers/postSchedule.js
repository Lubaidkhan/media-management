// scheduler.js
// const axios = require('axios');
const request = require('request');
const schedule = require('node-cron');
const PostModel = require('../models/post'); // Assuming you have a Post model/schema

// Schedule a task to run every minute
// schedule.schedule('* * * * *', async () => {
//   try {
//     // Retrieve scheduled posts that haven't been published yet
//     const scheduledPosts = await PostModel.find({ isPublished: false, scheduledAt: { $lte: new Date() } });
//     // const scheduledPosts = await PostModel.find({ isPublished: false});

//     // Publish each scheduled post
//     for (const post of scheduledPosts) {
//       // Call the publish function passing the post data
//       // await publishPostToSocialMedia(post);
//       // Update the post's published status
//       post.isPublished = true;
//       await post.save();
//     }
//   } catch (error) {
//     console.error('Error in scheduling and publishing posts:', error);
//   }
// });

async function publishPostToSocialMedia(post) {
    try {
      // Authenticate with Facebook and obtain an access token
      const accessToken = 'EAANCZCekpNC0BABeQbSvQYChCUwmzqmkZCCNM8ZBJiSp9WRYvHDiqgZBnPPTO9z0RdGemRakR10SjUkbXmmLsdS9DnZC18AANydRN9rf6Hrv6R349vShc6wRXhEBhlwqkWPeBM6bZB8u2s6jgBrREOh2ENv49SzZBSwgjGIMG0uZBeXwryGPET9D9WR37ZAYGkZB3bRznI6wCWwwZDZD';
  
      // Compose the post content and platform-specific parameters
      const { content, platform } = post;
      const facebookPostData = {
        message: content,
      };
  
      // Make a POST request to the Facebook API to publish the post
    //   await axios.post(`https://graph.facebook.com/me/feed?access_token=${accessToken}`, facebookPostData);
      // await new Promise(function (resolve, reject) {
      //   request({
      //     method: 'POST',
      //     uri: `https://graph.facebook.com/me/feed?access_token=${accessToken}`,
      //   //   headers: Constants.carelineUserHeaders,
      //     body: JSON.stringify(facebookPostData)
      //   }, function (error, response, body) {
      //     if (!error && response.statusCode == 200) {
      //       let res = JSON.parse(body);
      //       if (res.status == true) {
      //         console.log('res', res.data);

    
      //       }
    
      //       //console.log('allusers',allusers);
      //       console.log('get data....');
      //       resolve(body);
      //     } else {
      //       console.log('error===============================', error);
      //       // reject.catch(=>null)
      //       reject(error);
      //     }
      //   });
      // });
  
      console.log('Post published on Facebook:', post);
    } catch (error) {
      console.error('Error publishing post to Facebook:', error);
    }
  }

  const axios = require('axios');
  
  async function checkPermissions(accessToken) {
  try {
      const response = await axios.get(`https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`);

      // Extract the permissions from the response
      const permissions = response.data.data.scopes;
      
      console.log('Permissions:', permissions);
    } catch (error) {
    console.error('Error checking permissions:', error);
  }
}

// Usage: Call the function with the access token you want to check
// const accessToken = 'your_access_token';
const accessToken = 'EAANCZCekpNC0BAG0FO53N6WI1qZBVZCLgtvZAr4Obbdmi7ksNJ9GfuyQuqKooBZATqFPIZA0IDpszC0URtOIKGZAJK9YaZCNo6bswELufd3vuuK20LQxu1DM1YUyExZA4iXfkrcFG9513FMfE9vNXXLXGOLAoovEiLqksKgahIp0Jhs2Wa8nVzAyEB5sGburMhlWUjS2V7Df9ZAew5keks4I6zGwiWCuF6uQo4XHEUn6uEDITcfRRxvZAaO';
// checkPermissions(accessToken);
