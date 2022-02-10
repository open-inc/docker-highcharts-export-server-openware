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

  app.use(bodyParser.json({ limit: "50mb", extended: true }));
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post("/base64", function (req, res) {
    try {
      if (
        req.body.options.plotOptions.series.dataLabels.hasOwnProperty(
          "formatter"
        )
      ) {
        req.body.options.plotOptions.series.dataLabels.formatter = function () {
          return this.point.weight + " kWh";
        };
      }
    } catch (e) {
      console.log(e);
    }

    //req.body = "{options:{title:{text:''},series:[{keys:['from','to','weight'],data:[['Gesamt','Werk A',2],['Gesamt','Werk B',4],['Gesamt','Werk C',1],['Gesamt','Werk D',2],['Werk A','Anlage 1',2],['Werk B','Anlage 2',1],['Werk B','Anlage 3',3],['Werk C','Anlage 4',1],['Werk D','Anlage 5',1],['Werk D','Anlage 6',1]],type:'sankey',name:''}],exporting:{buttons:{contextButton:{enabled:false}}},credits:{enabled:false},plotOptions:{series:{colorByPoint:true,colors:['#1E90FF','#DCDCDC','#C0C0C0','#808080','#778899','#B0C4DE','#808080','#708090','#696969','#A9A9A9','#D3D3D3'],dataLabels:{enabled:true,formatter:function(){returnthis.point.weight+' kWh';},borderRadius:4,backgroundColor:'rgba(255, 255, 255, 0.7)',shadow:false,style:{fontWeight:'bold',textOutline:'0px',color:'#000'}}}}}}";

    exporter.export(req.body, function (err, result) {
      if (timeout) clearTimeout(timeout);
      if (calls++ >= 10) {
        console.log("Maximum reached. Restarting Service.");

        timeout = setTimeout(function () {
          exporter.killPool();
          process.exit(2);
        }, 1000 * 120);
      }

      res.send(result);
    });
  });

  app.listen(80);
}
