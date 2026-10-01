function clean(value) {
  return String(value || "").trim();
}

function key(value) {
  return clean(value).toLowerCase();
}

function uniqueOptions(values) {
  return [...new Set(values.map(clean).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({ value, label: value }));
}

export function normalizeDeliveryZone(record) {
  const attrs = record?.attributes ?? record ?? {};

  return {
    id: record?.id ?? attrs.id,
    name: attrs.name || "",
    pricing_zone: attrs.pricing_zone || "",
    region: attrs.region || "",
    city: attrs.city || "",
    town: attrs.town || "",
    market_name: attrs.market_name || "",
    station_name: attrs.station_name || "",
    region_open: Boolean(attrs.region_open),
    city_open: Boolean(attrs.city_open),
    town_open: Boolean(attrs.town_open),
    active: attrs.active !== false,
  };
}

export function deliveryZoneRules(zones, address = {}) {
  const activeZones = zones.filter((zone) => zone.active);
  const selectedRegion = clean(address.region);
  const selectedCity = clean(address.city);
  const selectedTown = clean(address.town);

  const regionZones = selectedRegion
    ? activeZones.filter((zone) => key(zone.region) === key(selectedRegion))
    : [];
  const cityZones = selectedCity
    ? regionZones.filter((zone) => key(zone.city) === key(selectedCity))
    : [];

  const regionOpen = regionZones.some((zone) => zone.region_open);
  const cityOpen = selectedCity && cityZones.some((zone) => zone.city_open);
  const townOpen = selectedTown && cityZones
    .filter((zone) => key(zone.town) === key(selectedTown))
    .some((zone) => zone.town_open);
  const streetAllowed = Boolean(regionOpen || cityOpen || townOpen);
  const cityFreeText = Boolean(selectedRegion && regionOpen);
  const townFreeText = Boolean(selectedRegion && (regionOpen || cityOpen));

  return {
    regionOptions: uniqueOptions(activeZones.map((zone) => zone.region)),
    cityOptions: regionOpen ? [] : uniqueOptions(regionZones.map((zone) => zone.city)),
    townOptions: regionOpen || cityOpen ? [] : uniqueOptions(cityZones.map((zone) => zone.town)),
    regionOpen,
    cityOpen: Boolean(cityOpen),
    townOpen: Boolean(townOpen),
    cityFreeText,
    townFreeText,
    streetAllowed,
    needsCity: Boolean(selectedRegion && !regionOpen),
    needsTown: Boolean(selectedRegion && selectedCity && !regionOpen && !cityOpen),
  };
}

export function deliveryAddressLine(address) {
  return [
    address.line1,
    address.town,
    address.city,
    address.region,
    "Ghana",
  ].filter(Boolean).join(", ");
}
