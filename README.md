# JAMstack Instagram API with Netlify
Tutorial: [Using the Instagram API + Serverless Netlify to display your own Photos in 2021](https://harrisonkolor.medium.com/using-the-instagram-api-serverless-netlify-to-display-your-own-photos-in-2021-7923014522d0)

## Facebook API
1. Created Facebook Developer account
    - [Facebook Developer Account](https://developers.facebook.com/apps)
2. Create an App. The article links to the Instagram Overview page but the [Getting Started tutorial](https://developers.facebook.com/docs/instagram-basic-display-api/getting-started) was most useful. This still took some searching to find the [Create App](https://developers.facebook.com/apps/create/) page.
    - Type: Consumer
    - Details: authenticated my FB account
3. Add Instagram Basic Display (clicked "Setup"). After that, things get confusing.
4. Add Instagram Tester (NOT a regular Tester).
5. Verify in Web Instagram Settings.
6. Generate User Token for the Tester account and save to `.env` file.
    - Go to: My Apps > [Your App] > Instagram Basic Display > Generate Token
7. Find user id of Instagram account. Not sure why I need to send the token to get this?
    - From the tutorial: 
        - `https://graph.instagram.com/me?access_token={access_token}`
    - Also tried the URL from [this SO](https://stackoverflow.com/questions/11796349/instagram-how-to-get-my-user-id-from-username) but it didn't return anything that matched the above id.
8. Test the token and id:
    - `https://graph.instagram.com/{user-id}/media?fields=id, caption,link,media_url&access_token={access-token}`

## Netlify Serverless Function
While the above API call works, the token is out in the open. Let's secure it by putting it behind a proxy.
1. Create a Netlify App
2. Deploy a static web page (`index.html` or similar) to consume the proxy API:
    ```
    /.netlify/functions/photo
    ```
3. Add the `INSTAGRAM_TOKEN` and `USER_ID` as environment variables in Netlify: Site Settings > Build & Deploy > Environment Variables
4. Configure the serverless functions directory by adding a `netlify.toml` file to the root of the project and add this code:

    ```
    [functions]
      directory = "functions"
    ```
5. Create a `functions` directory in the root to hold the serverless functions.
6. In the `functions` directory, create a file named `photo.js` and paste the axios API call from the tutorial:

    ```js
    exports.handler = function instagram(event, context, callback) {
      const userId = process.env.USER_ID;
      const token = process.env.IG_TOKEN;
      const url = `https://graph.instagram.com/${userId}/media?fields=id,%20caption,link,media_url&access_token=${token}`;

      axios
        .get(url)
        .then(({ data: { data: posts } }) => {
          callback(null, {
            statusCode: 200,
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify(
              posts.map(i => ({
                id: i.id,
                url: i.media_url,
                caption: i.caption,
              })),
            ),
          })
        })
        .catch((e) => {
          callback(e)
        })
    }
    ```
7. Deploy project to Netlify using GitHub repo.
8. See code in this repo for the final result.
    - Live site: [https://laughing-allen-ca1d0d.netlify.app/](https://laughing-allen-ca1d0d.netlify.app/)