require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

const Area = require('../models/Area');
const Incident = require('../models/Incident');
const Resource = require('../models/Resource');
const WeatherData = require('../models/WeatherData');

const INCIDENT_TYPES = ['flood', 'fire', 'road_accident', 'medical_emergency', 'heatwave', 'disease_outbreak', 'other'];
const SEVERITIES = ['low', 'medium', 'high', 'critical'];
const STATUSES = ['reported', 'in_progress', 'resolved', 'closed'];
const RESOURCE_TYPES = ['ambulance', 'rescue_team', 'fire_truck', 'medical_unit', 'police_unit', 'emergency_shelter'];

// Bhopal-area bounding box for realistic-looking coordinates
const LAT_RANGE = [22.9, 23.6];
const LNG_RANGE = [77.0, 77.8];

const randomInRange = (min, max) => Math.random() * (max - min) + min;
const randomInt = (min, max) => Math.floor(randomInRange(min, max + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const weighted = (weights) => {
  // weights: { key: probability }, returns a key
  const r = Math.random();
  let sum = 0;
  for (const [key, weight] of Object.entries(weights)) {
    sum += weight;
    if (r <= sum) return key;
  }
  return Object.keys(weights)[0];
};

async function generateAreas(count = 12) {
  const areas = [];
  for (let i = 0; i < count; i++) {
    const lat = randomInRange(...LAT_RANGE);
    const lng = randomInRange(...LNG_RANGE);
    areas.push({
      name: `Zone ${String.fromCharCode(65 + i)} - ${faker.location.county()}`,
      location: { coordinates: [lng, lat] },
      population: randomInt(15000, 120000),
      populationDensity: randomInt(500, 8000),
      infrastructureCondition: randomInt(1, 5),
      distanceToHospitalKm: parseFloat(randomInRange(0.5, 25).toFixed(1)),
      isSynthetic: true,
    });
  }
  const created = await Area.insertMany(areas);
  console.log(`Created ${created.length} areas`);
  return created;
}

async function generateIncidents(areas, count = 550) {
  const incidents = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const area = pick(areas);
    const type = pick(INCIDENT_TYPES);

    // Higher infrastructure condition / lower density areas skew toward lower severity
    const severityWeights = area.infrastructureCondition >= 4
      ? { low: 0.4, medium: 0.35, high: 0.2, critical: 0.05 }
      : { low: 0.15, medium: 0.3, high: 0.35, critical: 0.2 };
    const severity = weighted(severityWeights);

    const daysAgo = randomInt(0, 730); // spread over last 2 years
    const occurredAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const status = daysAgo < 3 ? pick(['reported', 'in_progress']) : pick(STATUSES);

    // jitter incident location slightly around the area's center
    const [lng, lat] = area.location.coordinates;

    incidents.push({
      area: area._id,
      type,
      severity,
      status,
      location: { coordinates: [lng + randomInRange(-0.05, 0.05), lat + randomInRange(-0.05, 0.05)] },
      populationAffected: randomInt(5, Math.floor(area.population * 0.05)),
      responseTimeMinutes: parseFloat(randomInRange(5, 45).toFixed(1)),
      occurredAt,
      resolvedAt: status === 'resolved' || status === 'closed'
        ? new Date(occurredAt.getTime() + randomInt(1, 6) * 60 * 60 * 1000)
        : null,
      isSynthetic: true,
    });
  }

  const created = await Incident.insertMany(incidents);
  console.log(`Created ${created.length} incidents`);
  return created;
}

async function generateResources(areas, countPerArea = 4) {
  const resources = [];
  for (const area of areas) {
    for (let i = 0; i < countPerArea; i++) {
      const [lng, lat] = area.location.coordinates;
      resources.push({
        type: pick(RESOURCE_TYPES),
        quantity: randomInt(1, 10),
        status: weighted({ available: 0.6, deployed: 0.3, maintenance: 0.1 }),
        currentLocation: { coordinates: [lng + randomInRange(-0.02, 0.02), lat + randomInRange(-0.02, 0.02)] },
        assignedArea: area._id,
        isSynthetic: true,
      });
    }
  }
  const created = await Resource.insertMany(resources);
  console.log(`Created ${created.length} resources`);
  return created;
}

async function generateWeather(areas, daysBack = 60) {
  const weatherRecords = [];
  const now = new Date();

  for (const area of areas) {
    for (let d = 0; d < daysBack; d++) {
      const recordedAt = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
      weatherRecords.push({
        area: area._id,
        recordedAt,
        temperatureC: parseFloat(randomInRange(18, 42).toFixed(1)),
        rainfallMm: parseFloat((Math.random() < 0.3 ? randomInRange(0, 80) : 0).toFixed(1)),
        humidityPercent: parseFloat(randomInRange(30, 90).toFixed(1)),
        windSpeedKmh: parseFloat(randomInRange(2, 35).toFixed(1)),
        condition: pick(['Clear', 'Cloudy', 'Rain', 'Heatwave', 'Storm']),
        isSynthetic: true,
      });
    }
  }
  const created = await WeatherData.insertMany(weatherRecords);
  console.log(`Created ${created.length} weather records`);
  return created;
}

async function run() {
  const wipe = process.argv.includes('--fresh');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  if (wipe) {
    console.log('Wiping existing synthetic + test data...');
    await Promise.all([
      Area.deleteMany({}),
      Incident.deleteMany({}),
      Resource.deleteMany({}),
      WeatherData.deleteMany({}),
    ]);
    console.log('Wiped areas, incidents, resources, weather data');
  }

  const areas = await generateAreas(12);
  await generateIncidents(areas, 550);
  await generateResources(areas, 4);
  await generateWeather(areas, 60);

  console.log('Synthetic data generation complete.');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});