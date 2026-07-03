import axios from "axios";

export const analyzeWebsite = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required.",
      });
    }

            const apiKey = process.env.PAGESPEED_API_KEY;

            const query = new URLSearchParams();

        query.append("url", url);
        query.append("key", apiKey);

        query.append("category", "performance");
        query.append("category", "accessibility");
        query.append("category", "best-practices");
        query.append("category", "seo");

        const response = await axios.get(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${query.toString()}`,
        {
            timeout: 180000,
        }
        );
        console.log(
        "Categories:",
        Object.keys(response.data.lighthouseResult.categories)
        );

    console.log("Status:", response.status);
    console.log("Runtime Error:", response.data.lighthouseResult?.runtimeError);
    console.log("Categories:", response.data.lighthouseResult?.categories);

    const categories = response.data.lighthouseResult?.categories;

    if (!categories) {
      return res.status(500).json({
        success: false,
        message: "No Lighthouse categories returned.",
      });
    }

    res.status(200).json({
      performance: {
        id: "performance",
        title: "Performance",
        score: Math.round((categories.performance?.score ?? 0) * 100),
      },
      accessibility: {
        id: "accessibility",
        title: "Accessibility",
        score: Math.round((categories.accessibility?.score ?? 0) * 100),
      },
      bestPractices: {
        id: "best-practices",
        title: "Best Practices",
        score: Math.round((categories["best-practices"]?.score ?? 0) * 100),
      },
      seo: {
        id: "seo",
        title: "SEO",
        score: Math.round((categories.seo?.score ?? 0) * 100),
      },
    });
  }catch (error) {

  if (error.code === "ECONNABORTED") {
    return res.status(408).json({
      success: false,
      message:
        "The website took too long to analyze. Please try another website or try again later.",
    });
  }

  console.error("========== PAGE SPEED ERROR ==========");

  if (error.response) {
    console.dir(error.response.data, { depth: null });

    return res.status(500).json({
      success: false,
      message:
        error.response.data.error?.message ||
        "Google PageSpeed returned an error.",
    });
  }

  console.error(error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};