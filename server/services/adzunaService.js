const getAdzunaJobs = async ({
  keyword = "software developer",
  location = "India",
  page = 1,
  resultsPerPage = 20,
}) => {
  try {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    if (!appId || !appKey) {
      throw new Error("Adzuna API credentials are missing");
    }

    const params = new URLSearchParams({
      app_id: appId,
      app_key: appKey,
      results_per_page: String(resultsPerPage),
      what: keyword,
      where: location,
      "content-type": "application/json",
    });

    const url = `https://api.adzuna.com/v1/api/jobs/in/search/${page}?${params}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Adzuna API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Adzuna API error:", error.message);
    throw error;
  }
};

module.exports = {
  getAdzunaJobs,
};