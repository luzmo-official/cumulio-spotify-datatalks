/* 
  
  STATE

*/
import {Spotify} from './spotify.js';
import {UI} from './ui.js';

export const CUMULIO_PLAYLIST = '0GIFfPsuHdZUQGrGvKiXSm';
const spotify = new Spotify();
export const ui = new UI(spotify);

/*********** ADD DASHBOARD OPTIONS ************/
const dashboards = {
  playlist: 'f3555bce-a874-4924-8d08-136169855807',
  songInfo: 'e92c869c-2a94-406f-b18f-d691fd627d34',
};


const dashboardOptions = {
  dashboardId: dashboards.playlist,
  container: '#dashboard-container',
  loader: {
    background: '#111b31',
    spinnerColor: '#f44069',
    spinnerBackground: '#0d1425',
    fontColor: '#ffffff'
  }
};
/**********************************************/
/* 
  
  START

*/

window.onload = async () => {
  spotify.spotifyParams = getHashParams();
  if (!spotify.spotifyParams.access_token) return ui.setLoginStatus(false);
  spotify.makeSpotifyRequest('https://api.spotify.com/v1/me', 'get')
    .then(response => {
      if (response.error) ui.setLoginStatus(false);
      else ui.setLoginStatus(true, response);
    });

  openPageCumulioFavorites();
};

export const closeSongInfoModal = () => ui.closeSongInfoModal();
export const resetModalWidth = () => ui.resetModalWidth();

export const openPageCumulioPlaylist = async () => {
  ui.openPage('Cumul.io playlist', 'cumulio-playlist');
  const playlistEl = await ui.generatePlaylistSongList({id: CUMULIO_PLAYLIST, name: 'Cumul.io Playlist'});
  const container = document.getElementById('playlists-list');
  container.innerHTML = '';
  container.append(playlistEl);
};

export const openPageMyPlaylists = async () => {
  if (!spotify.user.loggedIn) return window.location.href = '/login';
  ui.openPage('My Playlists', 'my-playlists');
  const playlists = await spotify.getPlaylists();
  const playlistsEl = document.getElementById('playlists-list');
  playlistsEl.innerHTML = '';
  const container = ui.generatePlaylistCards(playlists, window.openPagePlaylist);
  playlistsEl.append(container);
};


export const openPagePlaylist = async (playlist) => {
  ui.openPage(playlist.name || 'Playlist', 'my-playlists');
  const playlistEl = await ui.generatePlaylistSongList(playlist);
  const container = document.getElementById('playlists-list');
  container.innerHTML = '';
  container.append(playlistEl);
};

export const openPageCumulioFavorites = async () => {
  ui.openPage('Cumul.io playlist visualized', 'cumulio-playlist-viz');
  /**************** INTEGRATE DASHBOARD ****************/
  listenToEvents();
  loadDashboard(dashboards.playlist);
};

const loadDashboard = (id, container, key, token) => {
  dashboardOptions.dashboardId = id;
  dashboardOptions.container = container || '#dashboard-container';
  
  if (key && token) {
    dashboardOptions.key = key;
    dashboardOptions.token = token;
  }

  Cumulio.addDashboard(dashboardOptions);
}; 

/* 
  
  CUMUL.IO FUNCTIONS

*/

/*********** LISTEN TO CUSTOM EVENTS AND ADD EXTRAS ************/
const getSong = (event) => {
  let songName;
  let songArtist;
  let songId;
  if (event.data.columns === undefined) {
    songName = event.data.name.id.split('&id=')[0];
    songId = event.data.name.id.split('&id=')[1];
  }
  else {
    songName = event.data.columns[0].value;
    songArtist = event.data.columns[1].value;
    songId = event.data.columns[event.data.columns.length - 1].value;
  }
  return {id: songId, name: songName, artist: songArtist};
};

const listenToEvents = () => {
  Cumulio.onCustomEvent(async (event) => {
    const song = getSong(event);
    if (event.data.event === 'add_to_playlist'){
      await ui.addToPlaylistSelector(song.name, song.id);
    }
    else if (event.data.event === 'song_info') {
      const token = await getDashboardAuthorizationToken({ songId: [song.id] });
      loadDashboard(dashboards.songInfo, '#song-info-dashboard', token.id, token.token);
      await ui.displaySongInfo(song);
    }
  });
};

const getDashboardAuthorizationToken = async (metadata) => {
  try {
    const body = {};
    if (metadata && typeof metadata === 'object') {
      Object.keys(metadata).forEach(key => {
        body[key] = metadata[key];
      });
    }

    /*
      Make the call to the backend API, using the platform user access credentials in the header
      to retrieve a dashboard authorization token for this user
    */
    const response = await fetch('/authorization', {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    });

    // Fetch the JSON result with the Cumul.io Authorization key & token
    const responseData = await response.json();
    return responseData;
  }
  catch (e) {
    return { error: 'Could not retrieve dashboard authorization token.' };
  }
};
/**************************************************************/

/* 
  
  HELPER FUNCTIONS

*/

function getHashParams() {
  const hashParams = {};
  let e;
  const r = /([^&;=]+)=?([^&;]*)/g;
  const q = window.location.hash.substring(1);
  // eslint-disable-next-line no-cond-assign
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}