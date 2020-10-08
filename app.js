const { response } = require('express');
/*
    requirements
*/
var express =   require('express'),
    cheerio =   require('cheerio'),
    request =   require('request');

var app = express();

/*
    Scrapping : News
*/

request('https://www.who.int/india/news/4', (err, res, HTML) =>{
    if(!err && res.statusCode == 200)
    {
        var $ = cheerio.load(HTML);
        let newsTitle = []
        $('.heading').each((i,el)=>{
            const title = $(el).text();
            newsTitle.push(title)
        });
        let newsDate = []
        $('.timestamp').each((index, element) =>{
            const date = $(element).text();
            newsDate.push(date);
        });
        let newsImageLink = []
        $('.background-image').each((index, element) => {
            var link = $(element).attr('data-image');
            link = "who.int" + link;
            newsImageLink.push(link);
        });
    }
});


/*
    Scrapping : Numbers => Rudra
    Totals    --  Deaths/Deceased
              --  total cases
              --  cured
*/
request('https://covidindia.org/',(err,res,html)=>{
    if(!err && res.statusCode == 200)
    {
        const $ =cheerio.load(html)
        let ls =[]
        const table =$('table tr td').each((i,el)=>{

            const num =$(el).text()
            ls.push(num)
        })
    }
});



/*
Scrapping : Precautions
            -- Get All
*/


request('https://www.cdc.gov/coronavirus/2019-ncov/prevent-getting-sick/prevention.html', (error, response, HTML)=>{
    if(!error && response.statusCode == 200)
    {
        var $ = cheerio.load(HTML);
        let preventions = []
        $('.col').each((index, element) => {
            const prevention = $(element).find('li').text();
            if(prevention != '')
                preventions.push(prevention);
        });
    }
});



/*
 Scrapping : Vaccine
            --Get All
*/
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
        
        var howVaccTested = $('.vax-info').text();
        
        let vaccinesPrecedence = []
        $('.vax-name').each((index, element) =>{
            const vaccineResearch = $(element).text().trim();
            vaccinesPrecedence.push(vaccineResearch); 
        });
    }
});


/*
    Fake News / myths
*/
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
            let facts =head.find('h2').text()
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
         
    }  
});


/*
    Symtoms : -- Get All
*/


/*
    Routes
*/

// home route

app.get('/', function(request, response){
    response.render("CovidPedia");
});

// case count route

app.get('/cases', function(request, response){
    response.render("caseCount");
});

// precautions

app.get('/precautions', function(request, response){
    response.render("precaution");
});

// symptoms

app.get('/symptoms', function(request, respons){
    response.render('symptom');
});

// Myth / News 

app.get('/mythbusters', function(request, respond){
    response.render('mythbuster');
});

app.listen(3000);


