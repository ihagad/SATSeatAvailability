export async function fetchAvailableSeats({testDate, zipcode, radius, country = "US"}) {
  const url = `https://aru-test-center-search.collegeboard.org/prod/test-centers?date=${testDate}&zip=${zipcode}&country=${country}`;

  try {
    console.log("Fetching from:", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const allCenters = await response.json();

    // Filter to only those with seat availability
    const available = allCenters.filter(center => center.seatAvailability === true && center.distance <= Number(radius));

    console.log("Available centers:", available);
    return available;

  } catch (error) {
    console.error("Failed to fetch seat availability:", error);
    return [];
  }
}