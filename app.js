/*
    requirements
*/
var express =   require('express'),
    cheerio =   require('cheerio'),
    request =   require('request');

var app = express();
app.set('view engine', 'ejs');

/*
    Scrapping : News
*/

let news = []
function ScrapNews() {
    url = 'https://www.who.int/india/news/'
    for (let i = 1; i <= 4; i++) {
        request(url + i, (err, res, HTML) => {
            if (!err && res.statusCode == 200) {
                var $ = cheerio.load(HTML);
                let newsTitle = []
                $('.heading').each((i, el) => {
                    const title = $(el).text();
                    newsTitle.push(title)
                });
                let newsDate = []
                $('.timestamp').each((index, element) => {
                    const date = $(element).text();
                    newsDate.push(date);
                });
                let newsImageLink = []
                $('.background-image').each((index, element) => {
                    var link = $(element).attr('data-image');
                    link = "who.int" + link;
                    newsImageLink.push(link);
                });
                let newsLink = []
                $('.list-view--item a').each((index, element) => {
                    var link = $(element).attr('href');
                    link ='https://who.int'+link
                    newsLink.push(link);
                });
                for (let i = 0; i < newsTitle.length; i++) {
                    news.push({ title : newsTitle[i], date: newsDate[i], image: newsImageLink[i], newslink : newsLink[i]});
                }
            }
        });
    }
}

let numbers = []
function ScrapNumbers() {
    request('https://covidindia.org/', function(err, res, html){
       if (!err && res.statusCode == 200) {
           const $ =  cheerio.load(html)
           let ls = []    
           const table = $('table tr td').each((i, el) => {

               const num = $(el).text()
               ls.push(num)
           })
           // console.log(ls)
           for (var i = 0; i < ls.length; i += 4) {
               numbers.push({ statename: ls[i], confirmed: ls[i + 1], recovery: ls[i + 2], death: ls[i + 3] });
           }
       }
   })
}
let preventions = []
function preventionScrapping(){
    request('https://www.cdc.gov/coronavirus/2019-ncov/prevent-getting-sick/prevention.html', (error, response, HTML)=>{
        if(!error && response.statusCode == 200)
        {
            var $ = cheerio.load(HTML);
            $('.col').each((index, element) => {
                const pre = $(element).find('li').text();
                if(pre != '')
                    preventions.push(pre);
            });
        }
    });
}

/*
 Scrapping : Vaccine
            --Get All
*/
let vaccine = []
let vaccinesPrecedence = []
let howVaccTested
function vaccineScrapping()
{
    request('https://www.theguardian.com/world/ng-interactive/2020/oct/07/covid-vaccine-tracker-when-will-a-coronavirus-vaccine-be-ready', (error, response, HTML) =>{
        if(!error && response.statusCode == 200)
        {
            var $ = cheerio.load(HTML);
            let stage = []
            $('.vax-boxhead').each((index, element) =>{
                const stageInfo = $(element).text();
                stage.push(stageInfo);
            });

            let stageMeaning = []
            $('.vax-text').each((index, element) =>{
                const meaning = $(element).text();
                stageMeaning.push(meaning);
            });
            let countAtStage = []
            $('.vax-bignum').each((index, element) =>{
                const currCount = $(element).text();
                countAtStage.push(currCount);
            });
            
            for(i = 0; i < stage.length; i++)
                vaccine.push({stage : stage[i], mean : stageMeaning[i], count : countAtStage[i]});      
            howVaccTested = $('.vax-info').text();

            $('.vax-name').each((index, element) =>{
                const vaccineResearch = $(element).text().trim();
                vaccinesPrecedence.push(vaccineResearch); 
            });
        }
    });
}


/*
    Fake News / myths
*/
let myths = []
function mythScrapping(){
    request('https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters?gclid=Cj0KCQjw8fr7BRDSARIsAK0Qqr6_kI5t8uPSar1bLxt_BmrruMi3W8_ejiaEhl09KO2ZUUtIgfyblGAaAq2kEALw_wcB', (error, response, HTML) =>{
        if(!error && response.statusCode == 200)
        {
            var $ = cheerio.load(HTML);
            let heading = []
            let content = []
            $('.sf-content-block').each((index, element) =>{
            let head = $(element)
            if(head!=null)
            {
                let facts = head.find('h2').text()
                if(facts != '')
                    heading.push(facts);
            }
            });
            $('.sf-content-block').each((index, element) =>{
                let head = $(element)
                if(head !=null)
                {
                let summary =head.find('p').text().trimLeft()
                if(summary != '')
                    content.push(summary);
                }
            });   
            for(i = 0; i < heading.length; i++)
                myths.push({heading : heading[i], content: content[i]});
        }  
    });
}


/*
    Symptoms : -- Get All
*/


/*
    Routes
*/


// home route
app.get('/error', function(request, response){
    response.render("error");
});


ScrapNumbers()
preventionScrapping()
ScrapNews()
vaccineScrapping()
mythScrapping()

app.get('/', function(request, response){
     response.render("CovidPedia", {number : news});
});

app.listen(3000);