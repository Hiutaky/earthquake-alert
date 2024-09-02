import fs from "fs/promises";
import path from "path";
import { time } from "../constants";

//uncomment just for development purpose

const response : string = `#EventID|Time|Latitude|Longitude|Depth/Km|Author|Catalog|Contributor|ContributorID|MagType|Magnitude|MagAuthor|EventLocationName|EventType
40271581|2024-08-30T19:23:15.940000|40.831333|14.147833|2.4|SURVEY-INGV-OV#SiSmi||||Md|3.7|--|Campi Flegrei|earthquake
40271671|2024-08-30T19:23:57.460000|40.830833|14.148667|2.4|SURVEY-INGV-OV#SiSmi||||Md|2.0|--|Campi Flegrei|earthquake
40273591|2024-08-31T05:46:56.910000|38.3687|15.3812|114.8|SURVEY-INGV||||ML|2.2|--|Costa Siciliana nord-orientale (Messina)|earthquake
40276151|2024-08-31T11:10:10.920000|38.3098|15.2163|114.4|SURVEY-INGV||||ML|2.0|--|Costa Siciliana nord-orientale (Messina)|earthquake
40277191|2024-08-31T13:24:42.910000|38.305|14.8093|120.5|SURVEY-INGV||||ML|2.1|--|Costa Siciliana nord-orientale (Messina)|earthquake
`

/**
 * TYPES
 */
export type INGV_Metadata = {
  eventId: number;
  time: Date;
  latitude: number;
  longitude: number;
  depth: number;
  author: string;
  magType: "ML";
  magnitude: number;
  locationName: string;
  eventType: "earthquake" | {};
};

type MetadataIndexesSchema = {
  [key: number]: keyof INGV_Metadata;
};

/**
 * CONSTANTS
 */
const DEFAULT_METADATA: INGV_Metadata = {
  author: "demo",
  depth: 0,
  eventId: 0,
  eventType: "earthquake",
  latitude: 0,
  locationName: "",
  longitude: 0,
  magnitude: 0,
  magType: "ML",
  time: new Date(),
};
const MetadataIndexes: MetadataIndexesSchema = {
  0: "eventId",
  1: "time",
  2: "latitude",
  3: "longitude",
  4: "depth",
  5: "author",
  9: "magType",
  10: "magnitude",
  12: "locationName",
  13: "eventType",
};
const BASE_URI = "https://webservices.ingv.it/fdsnws/event/1/query";

const ItalyRange = {
  minlat: "35",
  maxlat: "49",
  minlon: "5",
  maxlon: "20",
};

/**
 * METHODS
 */
const getDefaultQuery = () => {
  const now = new Date();
  const queryParams: Record<string, string> = {
    ...ItalyRange,
    starttime: new Date(now.getTime() - time.ONE_DAY).toISOString(),
    endtime: now.toISOString(),
    minmag: "2",
    maxmag: "10",
    mindepth: "-10",
    maxdepth: "1000",
    minversion: "100",
    orderby: "time",
    format: "text",
    limit: "100",
  };
  return queryParams;
};

const PROCESSED_EARTHQUAKES_FILE = path.join(
  __dirname,
  "processed_earthquakes.json",
);

const INGV = {
  get: async () => {
    const uriQueryParams = new URLSearchParams(getDefaultQuery()).toString();
    const requestUri = `${BASE_URI}?${uriQueryParams}`;
    console.log(requestUri)

    const response = await (await fetch(requestUri)).text();
    if (response !== "") {
      const parsedData = parseResponse(response);
      return await filterAndUpdateProcessedEarthquakes(parsedData);
    } else console.log("empty response");
    return false;
  },
};

async function filterAndUpdateProcessedEarthquakes(
  earthquakes: INGV_Metadata[],
): Promise<INGV_Metadata[]> {
  let processedEarthquakes: number[] = [];
  try {
    const fileContent = await fs.readFile(PROCESSED_EARTHQUAKES_FILE, "utf-8");
    processedEarthquakes = JSON.parse(fileContent);
  } catch (error) {
    // File doesn't exist or is empty, which is fine for the first run
  }

  const newEarthquakes = earthquakes.filter(
    (eq) => !processedEarthquakes.includes(eq.eventId),
  );

  const updatedProcessedEarthquakes = [
    ...newEarthquakes.map((eq) => eq.eventId),
    ...processedEarthquakes,
  ].slice(0, 10);

  await fs.writeFile(
    PROCESSED_EARTHQUAKES_FILE,
    JSON.stringify(updatedProcessedEarthquakes),
  );

  return newEarthquakes;
}

const parseResponse = (raw: string) => {
  const splitted = raw.split(`\n`);
  const result: INGV_Metadata[] = [];
  const validIndexes = Object.keys(MetadataIndexes);
  splitted.map((data, i) => {
    if (i === 0 || data === "") return;
    const splittedRow = data.split("|");
    let measurement: INGV_Metadata = DEFAULT_METADATA;
    splittedRow.map((value, j) => {
      if (validIndexes.indexOf(j.toString()) >= 0) {
        const index = MetadataIndexes[j];
        measurement = {
          ...measurement,
          [index]: String(value),
        };
      }
    });
    result.push(measurement);
  });
  return result.length > 1 ? result.sort( ( a , b ) => a.eventId - b.eventId ) : result;
};

export default INGV;
