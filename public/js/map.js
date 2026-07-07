maptilersdk.config.apiKey = mapAPIKey;

const coordinates = (typeof listingCoordinates !== 'undefined' && Array.isArray(listingCoordinates) && listingCoordinates.length === 2)
    ? listingCoordinates
    : [77.209, 28.6139];

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: coordinates,
    zoom: 9
});

new maptilersdk.Marker({ color: '#ff385c' })
    .setLngLat(coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 }).setHTML(
            `<h4>${listingLocation || 'Location'}</h4><p>Exact coordinates: ${coordinates.join(', ')}</p>`
        )
    )
    .addTo(map);
