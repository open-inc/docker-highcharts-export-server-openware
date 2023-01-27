// @ts-check

const exporter = require("highcharts-export-server");
const express = require("express");
const bodyParser = require("body-parser");

main().catch((error) => {
  console.log(error);

  process.exit(1);
});

async function main() {
  const app = express();

  let timeout;
  let calls = 0;

  //Set up a pool of PhantomJS workers
  exporter.initPool();

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post("/base64", function (req, res) {
    if (timeout) clearTimeout(timeout);

    // try {
    //   if (
    //     req.body.options.plotOptions.series.dataLabels.hasOwnProperty(
    //       "formatter"
    //     )
    //   ) {
    //     req.body.options.plotOptions.series.dataLabels.formatter = function () {
    //       return this.point.weight + " kWh";
    //     };
    //   }
    // } catch (e) {
    //   console.error("Formatter Error:", e);
    // }

    console.log("body:", req.body);

    exporter.export(req.body, function (err, result) {
      if (err) {
        console.error("Highcharts Error:", err);

        res.status(500).send({ data: "" });
      } else {
        res.send(result);
      }

      if (timeout) clearTimeout(timeout);
      if (calls++ >= 10) {
        console.log("Maximum reached. Restarting Service.");

        timeout = setTimeout(function () {
          exporter.killPool();
          process.exit(2);
        }, 1000 * 120);
      }
    });
  });

  app.listen(80);
}
