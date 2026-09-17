const defaultZones = [
  { city: 'New York', country: 'United States', zone: 'America/New_York' },
  { city: 'Los Angeles', country: 'United States', zone: 'America/Los_Angeles' },
  { city: 'London', country: 'United Kingdom', zone: 'Europe/London' },
  { city: 'Paris', country: 'France', zone: 'Europe/Paris' },
  { city: 'Tokyo', country: 'Japan', zone: 'Asia/Tokyo' },
  { city: 'Sydney', country: 'Australia', zone: 'Australia/Sydney' },
  { city: 'Dubai', country: 'United Arab Emirates', zone: 'Asia/Dubai' },
  { city: 'São Paulo', country: 'Brazil', zone: 'America/Sao_Paulo' },
  { city: 'Cape Town', country: 'South Africa', zone: 'Africa/Johannesburg' }
];

const allZones = [
  ...defaultZones,
  { city: 'Chicago', country: 'United States', zone: 'America/Chicago' },
  { city: 'Toronto', country: 'Canada', zone: 'America/Toronto' },
  { city: 'Mexico City', country: 'Mexico', zone: 'America/Mexico_City' },
  { city: 'Singapore', country: 'Singapore', zone: 'Asia/Singapore' },
  { city: 'Seoul', country: 'South Korea', zone: 'Asia/Seoul' },
  { city: 'Mumbai', country: 'India', zone: 'Asia/Kolkata' },
  { city: 'Auckland', country: 'New Zealand', zone: 'Pacific/Auckland' },
  { city: 'Berlin', country: 'Germany', zone: 'Europe/Berlin' },
  { city: 'Madrid', country: 'Spain', zone: 'Europe/Madrid' }
];

let zones = [...defaultZones];
const grid = document.querySelector('#clock-grid');
const search = document.querySelector('#search');
const dialog = document.querySelector('#zone-dialog');
const select = document.querySelector('#zone-select');

const timeParts = (date, zone, options) => new Intl.DateTimeFormat('en-US', { timeZone: zone, ...options }).format(date);
const offsetFor = (date, zone) => {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'shortOffset' }).formatToParts(date);
  return parts.find(part => part.type === 'timeZoneName')?.value.replace('GMT', 'UTC') || 'UTC';
};

function render() {
  const query = search.value.trim().toLowerCase();
  const filtered = zones.filter(({ city, country, zone }) => `${city} ${country} ${zone}`.toLowerCase().includes(query));
  grid.innerHTML = filtered.length ? filtered.map(({ city, country, zone }) => `
    <article class="clock-card">
      <div class="card-top"><div><h2 class="city">${city}</h2><p class="country">${country}</p></div><span class="offset">${offsetFor(new Date(), zone)}</span></div>
      <div class="card-time" data-zone="${zone}">--:--:--</div>
      <div class="card-footer"><span>${timeParts(new Date(), zone, { weekday: 'short' })}</span><span>${zone.split('/').pop().replaceAll('_', ' ')}</span></div>
    </article>`).join('') : '<p class="empty">No cities found. Try another search.</p>';
  updateClocks();
}

function updateClocks() {
  const now = new Date();
  document.querySelector('#hero-time').textContent = timeParts(now, Intl.DateTimeFormat().resolvedOptions().timeZone, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  document.querySelector('#hero-date').textContent = timeParts(now, Intl.DateTimeFormat().resolvedOptions().timeZone, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  document.querySelectorAll('.card-time').forEach(clock => { clock.textContent = timeParts(now, clock.dataset.zone, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }); });
}

allZones.forEach(({ city, country, zone }) => {
  const option = document.createElement('option'); option.value = zone; option.textContent = `${city}, ${country}`; select.appendChild(option);
});
document.querySelector('#add-zone').addEventListener('click', () => dialog.showModal());
document.querySelector('#zone-form').addEventListener('submit', event => { event.preventDefault(); const selected = allZones.find(item => item.zone === select.value); if (selected && !zones.some(item => item.zone === selected.zone)) zones.push(selected); dialog.close(); render(); });
search.addEventListener('input', render);
render();
setInterval(updateClocks, 1000);
