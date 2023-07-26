import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';



const tealhollow1Id = 52585950;


async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getListOfClipsFromChannel(channelId, clientId, authorization) {
    let date = new Date();

    let dateUnixFormatToByDayOfWeek = (1000 * 60 * 60 * 24);

    // Week starts and ends on Monday LMAO
    let beginningOfWeek = new Date((Math.trunc(date / dateUnixFormatToByDayOfWeek) - date.getDay() + 1) * dateUnixFormatToByDayOfWeek);
    let endOfWeek = new Date((Math.trunc(date / dateUnixFormatToByDayOfWeek) - date.getDay() + 8) * dateUnixFormatToByDayOfWeek);

    return await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${channelId}&started_at=${beginningOfWeek.toISOString()}&ended_at=${endOfWeek.toISOString()}`, {
	method: 'GET',
	headers: {
		Authorization: `Bearer ${authorization}`,
		'Client-Id': clientId
	}
    }).then(async res => { return await res.json();})
}

(async function main() {
    // Get OAuth2 token  for session
    let oauthURL = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_APP_CLIENT_ID}&client_secret=${process.env.TWITCH_APP_CLIENT_SECRET}&grant_type=client_credentials`;

    let oauthResponse = await fetch(oauthURL, { method: 'POST' }).then(res => {return res.json()});

    oauthURL = '';


    let clips = await getListOfClipsFromChannel(tealhollow1Id, process.env.TWITCH_APP_CLIENT_ID, oauthResponse.access_token);
    console.log(clips);

    let theClip = {view_count: 0, id: null}
    clips.data.forEach(item => {
        if (item.view_count > theClip.view_count) {
            theClip = item;
        }
    });

    if (theClip.id === null) {
        console.log('Could not find clip :(');
    } else {
        console.log(theClip);
    }
})();

