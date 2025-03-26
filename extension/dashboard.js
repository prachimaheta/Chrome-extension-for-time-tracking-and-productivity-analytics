document.addEventListener("DOMContentLoaded", function () {
  console.log("📌 Dashboard Loaded");

  chrome.storage.local.get(["timeData"], function (result) {
      if (chrome.runtime.lastError) {
          console.error("❌ Error fetching time data:", chrome.runtime.lastError);
          return;
      }

      let timeData = result.timeData || {};
      console.log("✅ Fetched Data from Storage:", timeData);

      if (Object.keys(timeData).length === 0) {
          console.warn("⚠ No time tracking data found!");
      }

      let dailyData = processDailyData(timeData);
      let weeklyData = processWeeklyData(timeData);

      console.log("📊 Processed Daily Data:", dailyData);
      console.log("📊 Processed Weekly Data:", weeklyData);

      renderChart("dailyChart", dailyData.labels, dailyData.data, "Daily Time Spent");
      renderChart("weeklyChart", weeklyData.labels, weeklyData.data, "Weekly Time Spent");
  });

  // Function to Process Daily Data
  function processDailyData(data) {
      let today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      let websites = data[today] || {}; 

      let labels = Object.keys(websites);
      let timeSpent = Object.values(websites);

      return { labels: labels, data: timeSpent };
  }

  // Function to Process Weekly Data
  function processWeeklyData(data) {
      let labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      let timeSpent = new Array(7).fill(0);

      Object.keys(data).forEach(date => {
          let dayIndex = new Date(date).getDay(); // 0 (Sunday) to 6 (Saturday)
          timeSpent[dayIndex] += Object.values(data[date]).reduce((a, b) => a + b, 0);
      });

      return { labels: labels, data: timeSpent };
  }

  // Function to Render Charts
  function renderChart(canvasId, labels, data, label) {
      let ctx = document.getElementById(canvasId).getContext("2d");

      if (!labels.length || !data.length) {
          console.warn(`⚠ No data available for ${label}`);
          return;
      }

      new Chart(ctx, {
          type: "bar",
          data: {
              labels: labels,
              datasets: [{
                  label: label,
                  data: data,
                  backgroundColor: "rgba(6, 26, 112, 0.6)"
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false
          }
      });
  }
});
