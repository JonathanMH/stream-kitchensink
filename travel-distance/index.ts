import * as fs from 'node:fs';
import * as path from 'node:path';
import { parseString } from '@fast-csv/parse';
import postgres from 'postgres'

const { OPEN_WEATHER_API_KEY, PG_USERNAME, PG_PASSWORD, PG_DATABASE } = process.env;

const sql = postgres({
	host: 'localhost',
	port: 5432,
	database: PG_DATABASE,
	username: PG_USERNAME,
	password: PG_PASSWORD,
})

const TABLE_NAME = 'locations';

async function createTable() {
	await sql`DROP TABLE IF EXISTS ${sql(TABLE_NAME)};`
	await sql`CREATE TABLE ${sql(TABLE_NAME)} (
		city text NULL,
		country text NULL,
		point geography NULL
	); `;
}

type LocationRecord = {
	city: string
	country: string
	longitude?: number
	latitude?: number
	point?: string
}

function createPostGisPoint(longitude, latitude) {
	return `'SRID=4326;POINT(${longitude} ${latitude})'`
}

async function parseCsv(csvContent: string): Promise<LocationRecord[]> {
	return new Promise((resolve, reject) => {
		const parsedRecords: LocationRecord[] = [];
		parseString(csvContent, { headers: true })
			.on('error', error => {
				console.error(error);
				reject(error)
			})
			.on('data', row => {
				parsedRecords.push({ city: row.city, country: row.country })
			})
			.on('end', (rowCount: number) => {
				console.log(`Parsed ${rowCount} rows`)
				resolve(parsedRecords)
			});
	})
}

async function storeRecords(lrs: LocationRecord[]) {
	for (let lr of lrs) {
		await sql.unsafe(`insert into locations (city, country, point) values ('${lr.city}', '${lr.country}', ${lr.point});`)
	}
}

async function addCoordinates(lr: LocationRecord): Promise<LocationRecord | null> {
	console.log('requesting', lr.city, lr.country)
	const BASE_URL = "http://api.openweathermap.org"
	const ENDPOINT = `/geo/1.0/direct?q=${encodeURIComponent(lr.city)},${encodeURIComponent(lr.country)}&appid=${OPEN_WEATHER_API_KEY} `
	let elr;
	try {
		await fetch(`${BASE_URL}${ENDPOINT} `)
			.then(response => {
				return response.json()
			})
			.then(data => {
				if (data.length === 0) {
					console.log('no records for', lr.city)
				}
				elr = { ...lr, longitude: data[0].lon, latitude: data[0].lat, point: createPostGisPoint(data[0].lon, data[0].lat) }
				console.log(elr.point);
			}).catch(e => {
				console.log('request error', e)
			})
		return elr
	} catch (e) {
		return null;
	}
}

async function addLocations(lrs: LocationRecord[]): Promise<LocationRecord[]> {
	const lrwc: LocationRecord[] = [];
	for (let lr of lrs) {
		const withCoordinates = await addCoordinates(lr);
		if (withCoordinates) {
			lrwc.push(withCoordinates);
		}
	}
	return lrwc
}

async function getAccDistance(rlr: LocationRecord): Promise<number> {
	let distanceKm = 0;
	const result = await sql.unsafe(`SELECT city,country,point,
	ROUND(
		ST_Distance(
			ST_SetSRID(ST_MakePoint(${rlr.longitude},${rlr.latitude})::geography, 4326),
			point
		)
	) as distance
	FROM locations;`)

	for (let r of result) {
		distanceKm += Math.round(r.distance / 1000);
	}
	return distanceKm;
}

async function main() {
	const referenceLocation: LocationRecord = {
		city: 'Copenhagen',
		country: 'Denmark',
		longitude: 12.551201126733545,
		latitude: 55.70967558019135,
	};
	referenceLocation.point = createPostGisPoint(referenceLocation.longitude, referenceLocation.latitude)
	const csvContent = fs.readFileSync(path.resolve('data', 'user-locations.csv'), 'utf-8')
	const parsedRecords = await parseCsv(csvContent)
	const recordsWithCoordinates = await addLocations(parsedRecords);
	await createTable();
	await storeRecords(recordsWithCoordinates)
	const combinedDistance = await getAccDistance(referenceLocation)
	console.log(combinedDistance);
}

main()
