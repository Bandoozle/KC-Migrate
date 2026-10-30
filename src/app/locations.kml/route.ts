export const dynamic = "force-static";

/**
 * Rank Math's local-SEO KML (listed in sitemap_index.xml), copied from
 * www.kosick.com/locations.kml. The WordPress XSL stylesheet line is left out
 * because that file does not exist on this site.
 */
const LOCATIONS_KML = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
	<Document>
		<name>Locations for Kosick Communications</name>
		<open>1</open>
		<Folder>
			<atom:link href="https://www.kosick.com" />
			<Placemark>
				<name><![CDATA[Kosick Communications]]></name>
				<description><![CDATA[Kosick Communications - Vancouver Digital & Media Marketing Agency]]></description>
				<address><![CDATA[Vancouver, Canada]]></address>
				<phoneNumber><![CDATA[+1-604-925-5800]]></phoneNumber>
				<atom:link href="https://www.kosick.com"/>
				<LookAt>
					<altitude>0</altitude>
					<range></range>
					<tilt>0</tilt>
				</LookAt>
				<Point>
				</Point>
			</Placemark>
		</Folder>
	</Document>
</kml>
`;

export function GET() {
  return new Response(LOCATIONS_KML, {
    headers: {
      "Content-Type": "application/vnd.google-earth.kml+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
