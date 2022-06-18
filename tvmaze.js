const imgURL = 'http://tinyurl.com/missing-tv';

async function searchShows(query){
    let res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
    let shows = res.data.map(result => {
        let show = result.show;
        return {
            id: show.id,
            name: show.name,
            summary: show.summary,
            image: show.image ? show.image.medium : imgURL
        };
    })
    return shows;
}

//take list of shows and add to dom
populateShows = (shows) => {
    const $showsList = $('#shows-list');
    $showsList.empty();

    for(let show of shows){
        let $item = $(
            `
            <div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
                <div class="card" data-show-id="${show.id}">
                    <div class="card-body">
                        <h5 class="card-title">${show.name}</h5>
                        <p class="card-text">${show.summary}</p>
                    </div>
                </div>
            </div>
            `
        );
        $showsList.append($item);
    }
}

//handle search for submission
$("#search-form").on("submit", async function handleSearch (e) {
    e.preventDefault();
    let query = $("#search-query").val();
    if (!query) return;
  
    $("#episodes-area").hide();
  
    let shows = await searchShows(query);
    populateShows(shows);
});

//given show ID return episodes list: {id, name, season, number}
async function getEpisodes(id) {
    let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
    let episodes = res.data.map(episode => ({
        id: episode.id,
        name: episode.name,
        season: episode.season,
        number: episode.number
    }));
    return episodes;
}

//populate episodes
populateEpisodes = (episodes) => {
    const $episodesList = $('#episodes-list');
    $episodesList.empty();
    for(let episode of episodes){
        let $item = $(
            `
            <li>
                ${episode.name}
                (season ${episode.season}, episode ${episode.number})
          </li>`
        );
        $episodesList.append($item);
    }
    $("#episodes-area").show();
}