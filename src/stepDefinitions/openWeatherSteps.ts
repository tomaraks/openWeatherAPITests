import {Then, When} from "@cucumber/cucumber";
import {restRequest } from "rest-assured-ts";

import chai from 'chai';
import fs from 'fs';
import configJson from '../../testData/config.json';

const expect = chai.expect;
const assert = chai.assert;
const APP_ID = configJson.authKey;

let response: any;
let lat: any;
let lon: any;

When(/^the latitude and longitude of "([^"]*)" are known$/, {timeout: 6 * 5000}, async (city: string) => {

    const headerOptions = JSON.stringify({ "Content-Type": "application/json"});
    response = await restRequest(configJson.baseURL + "geo/1.0/direct?q=" + city + "&appid=" + APP_ID, {
      headerOptions: JSON.parse(headerOptions),
      httpMethod: "GET", timeOut: 20000
    });
    let jsonArray = JSON.parse(response.body);
    lat = jsonArray[0].lat;
    lon = jsonArray[0].lon;
  });

  Then(/^the API should respond with a "([^"]*)" status code$/, {timeout: 6 * 5000}, async (expectedStatusCode: string) => {

    expect(response.statusCode.toString()).to.be.equal(expectedStatusCode,
      `Expected statusCode: ${expectedStatusCode} but actual status code: ${response.statusCode.toString()} `);
  });

  When(/^a request is made to retrieve the 5-day weather forecast$/, {timeout: 6 * 5000}, async () => {

    const headerOptions = JSON.stringify({ "Content-Type": "application/json"});
    response = await restRequest(configJson.baseURL + "data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APP_ID, {
      headerOptions: JSON.parse(headerOptions),
      httpMethod: "GET", timeOut: 20000
    });
  });

  Then(/^the response should contain weather data for 5 days$/, {timeout: 6 * 5000}, async () => {
    let jsonBody = JSON.parse(response.body);
    let list = jsonBody.list;
    let lastDate = list[list.length-1].dt_txt;
    let lastDateArr = lastDate.split(" ")
    let expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + 5);
    let expectDateString = expectedDate.toISOString();
    let subDate = expectDateString.substring(0, expectDateString.indexOf('T'));

    expect(subDate).to.be.equal(lastDateArr[0],
      `Expected date: ${subDate} but actual date is: ${lastDateArr[0]} `);
  });

  Then(/^the daily forecast data should summarize 3-hour data$/, {timeout: 6 * 5000}, async () => {
    let jsonBody = JSON.parse(response.body);
    let list = jsonBody.list;
    let firstDate = list[0].dt_txt;
    let firstDateArray = firstDate.split(" ");
    let firstTime = +firstDateArray[1].substring(0, 2);
  
    for(let i = 1; i< list.length; i++) {
        let newDateArray = list[i].dt_txt.split(" ");
        let newTime = +newDateArray[1].substring(0, 2);
        if(newTime == 0 && firstTime == 21) {
            newTime = 24;
        } else if (newTime == 3) {
            firstTime = 0;
        }
        let diff = newTime - firstTime;
        expect(diff).to.be.equal(3,
            `Expected difference to be: ${3} but actual difference is: ${diff} `);
        firstTime = newTime;        
    }
   
  });

  Then(/^the most dominant wind speed and direction should be included$/, {timeout: 6 * 5000}, async () => {
    let jsonBody = JSON.parse(response.body);
    let list = jsonBody.list;
    
    list.forEach(element => {
        assert.isNotNull(element.wind.speed)
        assert.isNotNull(element.wind.deg)
        assert.isNotNull(element.wind.gust)
    });   
  });

  Then(/^the minimum and maximum temperatures should be included$/, {timeout: 6 * 5000}, async () => {
    let jsonBody = JSON.parse(response.body);
    let list = jsonBody.list;
    
    list.forEach(element => {
        assert.isNotNull(element.main.temp_min)
        assert.isNotNull(element.main.temp_max)
    });   
  });

  Then(/^extract all values that should be rounded down$/, {timeout: 6 * 5000}, async () => {
    let jsonBody = JSON.parse(response.body);
    let list = jsonBody.list;
    let pluginArrayArg = new Array();
    list.forEach(element => {  
        pluginArrayArg.push(JSON.stringify({speed: Math.round(+element.wind.speed)}), JSON.stringify({degree: Math.round(+element.wind.deg)}), JSON.stringify({gust: Math.round(+element.wind.gust)}),
        JSON.stringify({minTemp: Math.round(+element.main.temp_min)}), JSON.stringify({maxTemp: Math.round(+element.main.temp_max)}));
    });   
    let json = JSON.stringify(pluginArrayArg);
    fs.writeFile('myjsonfile.json', json, 'utf8', (err) => {
        if (err) throw err;
       });
  });
  