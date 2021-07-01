global class WebServiceLWC {
    
    public static String method = 'GET';

    @AuraEnabled (cacheable=true)
    global static WeatherData performCallout(String location) {

        if(location == null || location == ''){
        Default_City__mdt town = [select City__c from Default_City__mdt];
        location = town.City__c;
        }
        
        API__mdt api = [select Default_API__c from API__mdt];
        String apiWeather = api.Default_API__c;

        Key__mdt apiKey = [select Default_KEY__c from Key__mdt];
        String keyWeather = apiKey.Default_KEY__c;

        String endPoint = apiWeather+location+'&appid='+ keyWeather;

        HTTPRequest request = new HTTPRequest();
        request.setEndpoint(endPoint);
        request.setMethod(method);
        HTTP http = new HTTP();
        HTTPResponse response = http.send(request);
        String body = response.getBody();
        System.JSONParser parser = JSON.createParser(body);
 
        WeatherData weather = new WeatherData();
 
        while (parser.nextToken() != null) {
            if(parser.getCurrentToken() == JSONToken.FIELD_NAME) {
                parser.nextValue();
                if (parser.getCurrentName() == 'temp') {
                    weather.cityTemp = Decimal.valueOf(parser.getText());
                } else if (parser.getCurrentName() == 'name') {
                    weather.cityName = parser.getText();
                } else if (parser.getCurrentName() == 'country') {
                    weather.state = parser.getText();
                } else if (parser.getCurrentName() == 'timezone') {
                    weather.cityTimeZone = Integer.valueOf(parser.getText());
                } else if (parser.getCurrentName() == 'speed') {
                    weather.cityWindSpeed = Decimal.valueOf(parser.getText());
                } else if (parser.getCurrentName() == 'lat') {
                    weather.cityLat = Decimal.valueOf(parser.getText());
                } else if (parser.getCurrentName() == 'lon') {
                    weather.cityLong = Decimal.valueOf(parser.getText());
                } else if (parser.getCurrentName() == 'all') {
                    weather.cityPrecip = Integer.valueOf(parser.getText());
                }
            }
        }
        return weather;
    }
     
    global class WeatherData {
        @AuraEnabled public String cityName;
        @AuraEnabled public Integer cityTimeZone;
        @AuraEnabled public Double cityTemp;
        @AuraEnabled public String state;
        @AuraEnabled public Double cityWindSpeed;
        @AuraEnabled public Double cityLat;
        @AuraEnabled public Double cityLong;
        @AuraEnabled public Integer cityPrecip;
    }
    
}
