import {generateCucumberReport} from "rest-assured-ts";

const {AfterAll, BeforeAll } = require('@cucumber/cucumber');

BeforeAll(async () => {
});

AfterAll(async () => {
  const metaData =  {
    "App Name":"Open Weather",
    "Test Type": "API Automation Test",
    "Platform": "Windows 10",
    "Parallel": "Scenarios",
    "Executed": "Remote"
  };
  const jsonFile: string = "report/cucumber_report.json";
  const jsonOutPutHtml: string = "report/cucumber_report.html";
  generateCucumberReport("bootstrap", jsonFile, jsonOutPutHtml, metaData, true);
});