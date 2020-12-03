# cumulio-spotify-datatalks
[cumulio-spotify](https://github.com/TuanaCelik/cumulio-spotify) repo walk through version for Data Talks 2020

cuMusicalio is an app that integrates a Cumul.io dashboard that displays playlist and song analytics of various playlists and/or a users own playlist of choice if they login to their Spotify account via the app. You can also use the dashboards to add songs to your own Spotify playlists. 

This repo contains the boiled down version of the app which is presented as a live coding session at Data Talks 2020. The full version is at [cumulio-spotify](https://github.com/TuanaCelik/cumulio-spotify). All changes here are made to the `src/app.js` file. Starting with an initial 'skeleton' commit that contains code required for the Spotify API calls, logins and the overall structure of the app, each following commit represents steps to achieve the following:

1. Integrate a dashboard:
    * Add `cumul.io Spotify Playlist` dashboard to application
2. Listen to custom events
3. On `add_to_playlist`:
    * Call `ui.addToPlaylistSelector(name, id)`. This will open a Modal that opens the playlists of the person who has logged in. When a playlist is selected, we make a call to the Spotify API to add selected song ID to be added to the selected playlist ID:
    `POST:  https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=spotify%3Atrack%3A${songId}`
    * (Extra: Add the event to the table chart and see what you get from the event)
4. On `song_info` (for drill-through `Song Info` dashboard)
    * Get new authorization token with metadata to filter on
    * Integrate `Song Info` dashboard in Song Info Modal


### To run:
1. `npm install`
2. Create a `.env` file in the root directory and add the following from your [Cumul.io](https://cumul.io/main) and [Spotify Developer](https://developer.spotify.com/) accounts:
 
 From Cumul.io:
 ```
 CUMULIO_API_KEY=xxx
 CUMULIO_API_TOKEN=xxx
 ```
 From Spotify:
 ```
 SPOTIFY_CLIENT_ID=xxx
 SPOTIFY_CLIENT_SECRET=xxx
 ACCESS_TOKEN=xxx
 REFRESH_TOKEN=xxx
 ```
3. `npm run start`
4. On your browser, go to `http://localhost:3000/` and Login to your Spotify account 🥳

Note: You do not have to rebuild every time you make a change to this once it's running. Just refresh your browser!
