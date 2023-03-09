Feature: OpenWeatherMap Forecast5 API Test Automation

  @SmokeTest
  Scenario: Retrieve 5-day weather forecast for Bangalore
    Given the latitude and longitude of "Bangalore" are known
    And the API should respond with a "200" status code
    When a request is made to retrieve the 5-day weather forecast
    Then the API should respond with a "200" status code
    And the response should contain weather data for 5 days
    And the daily forecast data should summarize 3-hour data
    And the most dominant wind speed and direction should be included
    And the minimum and maximum temperatures should be included
    And extract all values that should be rounded down

  @SmokeTest
  Scenario Outline: Retrieve 5-day weather forecast for a "<location>" location
    Given the latitude and longitude of "<location>" are known
    And the API should respond with a "200" status code
    When a request is made to retrieve the 5-day weather forecast
    Then the API should respond with a "200" status code
    And the response should contain weather data for 5 days
    And the daily forecast data should summarize 3-hour data
    And the most dominant wind speed and direction should be included
    And the minimum and maximum temperatures should be included
    And extract all values that should be rounded down

    Examples:
      | location     |
      | New York     |
      | Los Angeles |
      | Tokyo        |