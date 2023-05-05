const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
var matches ={};
var teamswon ={};
var idsin2016=[];
var idsin2015=[];
var balls2015={};
var runs2015={};
var eco2015={};
var extrarun2016 ={};
  
 fs.createReadStream(path.resolve(__dirname, 'assets', 'matches.csv'))
       .pipe(csv.parse({ headers: true}))
       .on('error', error => console.error(error))
       .on('data', (row) => {
           var date = new Date(row["date"]);
           var year = date.getFullYear();
           var winner = row["winner"];
           if(!(year in matches)){
               matches[year]=0;
               }
           if(!(winner in teamswon)){
               teamswon[winner]=0;
               }
           if(year==2016){
               idsin2016.push(row["id"]);
               }
           if(year==2015){
                idsin2015.push(row["id"]);
                }
           teamswon[winner]++;
           matches[year]++;
       })
       .on('end', (rowCount) => {
            console.log("Matches palyed per year: ");
            console.log(matches);
            console.log("Matches won per year: ");
            console.log(teamswon);
            //console.log(`Parsed ${rowCount} rows`);
            
       fs.createReadStream(path.resolve(__dirname,'assets','ballbyball.csv'))
            .pipe(csv.parse({headers: true}))
            .on('error', error => console.error(error))
            .on('data', (row) => {
                if(idsin2016.includes(row["id"])){
                      batting=row["batting_team"];
                      if(!(batting in extrarun2016))
                      {
                          extrarun2016[batting]=0;
                          }
                      extrarun2016[batting] = parseInt(extrarun2016[batting]) + parseInt(row["extra_runs"]);
                 }
                 if(idsin2015.includes(row["id"])){
                       bowler=row["bowler"];
                       if(!(bowler in balls2015)){
                           balls2015[bowler]=0;
                           }
                        if(!(bowler in runs2015))
                        {
                            runs2015[bowler]=0;
                            }
                        balls2015[bowler]++;
                        runs2015[bowler]=parseInt(runs2015[bowler])+parseInt(row["total_runs"]);
                  }
               })
               .on('end', (rowCount) => {
                   console.log("Extra runs per team in 2016: ");
                   console.log(extrarun2016);
                   for(var key in balls2015){
                       var ovr=parseInt(balls2015[key])/6;
                       eco2015[key]=parseInt(runs2015[key])/ovr;
                       }
                   let sortedArr = Object.entries(eco2015).sort(function(a,b) {
                       return a[1] - b[1];
                       });
                    let lowestTen = sortedArr.slice(0,10);
                       console.log("Top 10 Economy: ");
                       console.log(lowestTen);
                });
 });                
                       
                                                               
           
           
           
           