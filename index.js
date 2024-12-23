const fs = require("fs");
const path = require("path");
const CONFIG_PATH = path.join(__dirname, "config.json");

let CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH));

const axios = require("axios");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function setConfigValue(key, value) {
  const CONFIG_VARS = JSON.parse(fs.readFileSync(CONFIG_PATH));

  CONFIG_VARS[key] = value;

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(CONFIG_VARS));

  CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH));
}

const getMonthlyReportStatus = async (id) => {
  try {
    const response = await axios.request({
      url:
        "https://api.kampusmerdeka.kemdikbud.go.id/studi/monthly-reports?id_reg_penawaran=" +
        (id || CONFIG.ID),
      method: "get",
      headers: {
        Authorization: "Bearer " + CONFIG.cookie,
      },
    });
    const result = response.data;

    return {
      result,
      msg: "success get 'monthly report' data",
      success: true,
      code: 200,
    };
  } catch (err) {
    let msg = err.message;
    let code = err.status || 500;
    if (err?.response?.data?.error?.message)
      msg = err.response.data.error.message;
    code = err.response.status;

    return {
      msg,
      success: false,
      code,
    };
  }
};

const getFinalReportStatus = async (id) => {
  try {
    const response = await axios.request({
      url:
        "https://api.kampusmerdeka.kemdikbud.go.id/studi/report/final/" +
        (id || CONFIG.ID),
      method: "get",
      headers: {
        Authorization: "Bearer " + CONFIG.cookie,
      },
    });
    const result = response.data;
    const data = result.data;

    let prevData = {};
    if (fs.existsSync("data.json"))
      prevData = JSON.parse(fs.readFileSync("data.json"));

    if (data.status != prevData.status) {
      fs.writeFileSync("data.json", JSON.stringify(data));
    }

    return {
      result,
      status: data.status,
      msg: "success get 'final report' data",
      success: true,
      code: 200,
    };
  } catch (err) {
    let msg = err.message;
    let code = err.status || 500;
    if (err?.response?.data?.error?.message)
      msg = err.response.data.error.message;
    code = err.response.status;

    return {
      msg,
      success: false,
      code,
    };
  }
};

app.all("/", (req, res) => {
  return res.json({
    msg: "service is running..",
    code: 200,
    success: true,
  });
});

app.all("/set", (req, res) => {
  const q = req.query.q || req.body.q || req.headers.q;
  const id = req.query.id || req.body.id || req.headers.id;

  if (id) setConfigValue("ID", id);
  if (q) setConfigValue("cookie", q);

  return res.json({
    msg: "success change config",
    code: 200,
    success: true,
  });
});

app.all("/exec", async (req, res) => {
  const id = req.query.id || req.body.id || req.headers.id;

  const monthlyReport = await getMonthlyReportStatus(id);
  const finalReport = await getFinalReportStatus(id);

  return res.json({
    msg: "success get data!",
    monthlyReport,
    finalReport,
    code: 200,
    success: true,
  });
});

app.all("/monthly", async (req, res) => {
  const id = req.query.id || req.body.id || req.headers.id;

  const monthlyReport = await getMonthlyReportStatus(id);

  return res.json(monthlyReport);
});

app.all("/final", async (req, res) => {
  const id = req.query.id || req.body.id || req.headers.id;

  const finalReport = await getFinalReportStatus(id);

  return res.json(finalReport);
});

app.use((req, res) => {
  return res.json({
    msg: "route not found!",
    code: 404,
    success: false,
  });
});

const PORT = CONFIG.PORT || 3000;
app.listen(PORT, () => {
  console.log("running at http://localhost:" + PORT);
});

setInterval(getFinalReportStatus, 5000);
