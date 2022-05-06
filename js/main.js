"use strict";

// =========== Essay SPA functionality =========== //

let _essays = [];
let _selectedEssayId;

// fetch all essays from WP
async function getEssays() {
    let response = await fetch("https://blog.debelmose-rideudstyr.dk/wp-json/wp/v2/posts?_embed");
    let data = await response.json();
    console.log(data);
    _essays = data;
    appendEssays(data);
    showLoader(false);
}

getEssays();

// append essays to the DOM
function appendEssays(essays) {
    let htmlTemplate = "";
    for (let essay of essays) {
        htmlTemplate += /*html*/ `
        <article onclick="showDetailView('${essay.id}')">
            <img src="${getFeaturedImageUrl(essay)}">
            <h2>${essay.title.rendered}</h2>
        </article>
    `;
    }
    document.querySelector('#essays-container').innerHTML = htmlTemplate;
}

// get the featured image url
function getFeaturedImageUrl(post) {
    let imageUrl = "";
    if (post._embedded['wp:featuredmedia']) {
        imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
    }
    return imageUrl;
}

function showDetailView(id) {
    const essay = _essays.find(essay => essay.id == id);
    document.querySelector("#detailView h2").innerHTML = essay.title.rendered;
    document.querySelector("#detailViewContainer").innerHTML = /*html*/`
        <img src="${getFeaturedImageUrl(essay)}">
        <article>
            <h1>${essay.title.rendered}</h1>
            <h2>${essay.acf.year}</h2>
            <p>${essay.content.rendered}</p>
            <iframe src="${essay.acf.trailer}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </article>
    `;
    navigateTo("detailView");
}

if (!_selectedEssayId) {
    navigateTo("essays");
}


// =========== Loader functionality =========== //

function showLoader(show = true) {
    let loader = document.querySelector('#loader');
    if (show) {
        loader.classList.remove("hide");
    } else {
        loader.classList.add("hide");
    }
}
