// Representative event covers for events without a banner_image in the API.
const makeCover = (photoId, description, photographer, photoUrl, place = 'Illustrative photo') => ({
  src: `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1100&q=82`,
  description,
  photographer,
  photoUrl,
  place,
});

const covers = {
  lamu: makeCover('photo-1711802536772-0ef59886bc1b', 'Lamu waterfront and Swahili town scenery', 'Stanislav Lvovsky', 'https://unsplash.com/photos/a-body-of-water-with-a-bunch-of-houses-on-it-I2JrrXqxsu0', 'Lamu, Kenya'),
  lamuStreet: makeCover('photo-1602094777645-5701b6128003', 'Historic street in Lamu', 'Kennedy Kioli', 'https://unsplash.com/photos/gray-concrete-pathway-between-brown-brick-wall-mL_Y_jZH0jI', 'Lamu, Kenya'),
  coast: makeCover('photo-1633161112703-70b4751e9a97', 'Sailing on the Indian Ocean off Diani Beach', 'Favour Anyula', 'https://unsplash.com/photos/a-sailboat-with-two-people-on-it-in-the-ocean-_riRvDikb-Y', 'Diani Beach, Kenya'),
  camel: makeCover('photo-1778338942045-e87a5d336486', 'Camel festival procession', 'Samuel Adeleke', 'https://unsplash.com/photos/man-in-traditional-attire-rides-camel-laden-with-drums-H2flR6oIMFo'),
  rhino: makeCover('photo-1674909073827-dc923f7cac1c', 'Rhinoceros in open grassland', 'redcharlie', 'https://unsplash.com/photos/a-rhino-grazing-in-a-field-of-dry-grass-n4SeSM7qR-A'),
  runners: makeCover('photo-1769707948199-0ac6f2868e55', 'Runners competing in a road race', 'Justin Lagat', 'https://unsplash.com/photos/group-of-runners-competing-in-a-marathon-race-outdoors-GKBCHlMSvrg'),
  culture: makeCover('photo-1772268337010-03e52e5b9a11', 'Traditional dancers at a cultural celebration', 'Luanda Bauma Primo', 'https://unsplash.com/photos/dancers-in-traditional-attire-perform-outdoors-Mswr-eAflfo'),
  music: makeCover('photo-1778011390422-a4d4bd8936a7', 'A crowd enjoying a live concert', 'Jonathan Ikemura', 'https://unsplash.com/photos/crowd-with-hands-up-at-a-bright-concert-stage-z0R4XB25ozI'),
  conference: makeCover('photo-1776039325240-02916820bfeb', 'Audience at a conference in Nairobi', 'Dwayne joe', 'https://unsplash.com/photos/audience-attentively-listening-during-a-presentation-in-person-conference-presentation-VA9MqBGCYXM', 'Nairobi, Kenya'),
  nairobi: makeCover('photo-1741991110666-88115e724741', 'Nairobi city skyline', 'imsogabriel stock', 'https://unsplash.com/photos/a-cityscape-of-nairobi-kenya-on-a-sunny-day-IaJm3mq0F5o', 'Nairobi, Kenya'),
};

export function getEventCover(event = {}) {
  const title = String(event.title ?? event.event_name ?? '').toLowerCase();
  const venue = String(event.venue ?? '').toLowerCase();
  const category = String(event.Category?.name ?? event.category?.name ?? '').toLowerCase();
  const apiImage = event.banner_image ?? event.bannerImage ?? event.image_url;
  if (apiImage) return { src: apiImage, description: `${event.title ?? event.event_name ?? 'Event'} cover image`, photographer: '', photoUrl: '', place: '' };

  if (title.includes('lamu') || venue.includes('lamu')) return title.includes('painter') ? covers.lamuStreet : covers.lamu;
  if (title.includes('diani') || title.includes('regatta') || title.includes('ngalawa') || venue.includes('diani') || venue.includes('kwale')) return covers.coast;
  if (title.includes('camel')) return covers.camel;
  if (title.includes('rhino')) return covers.rhino;
  if (title.includes('marathon') || title.includes('race')) return covers.runners;
  if (category.includes('music') || title.includes('concert') || title.includes('reggae') || title.includes('sound')) return covers.music;
  if (category.includes('culture') || category.includes('art') || title.includes('cultural') || title.includes('festival')) return covers.culture;
  if (title.includes('conference') || title.includes('summit') || title.includes('technology') || title.includes('tech') || title.includes('ai') || title.includes('data') || title.includes('internet') || title.includes('blockchain')) return covers.conference;
  if (category.includes('business') || title.includes('expo') || title.includes('trade')) return covers.nairobi;
  return covers.nairobi;
}
