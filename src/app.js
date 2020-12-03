/* 
  
  STATE

*/
import {Spotify} from './spotify.js';
import {UI} from './ui.js';

export const CUMULIO_PLAYLIST = '0GIFfPsuHdZUQGrGvKiXSm';
const spotify = new Spotify();
export const ui = new UI(spotify);

/*********** ADD DASHBOARD OPTIONS ************/

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
};

/* 
  
  CUMUL.IO FUNCTIONS

*/

/*********** LISTEN TO CUSTOM EVENTS AND ADD EXTRAS ************/

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