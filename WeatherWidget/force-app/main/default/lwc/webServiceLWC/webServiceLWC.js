import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import performCallout from '@salesforce/apex/WebServiceLWC.performCallout';
import weather from '@salesforce/resourceUrl/weather';

export default class WeatherDataLWC extends LightningElement {
    @track location = '';
    @track lat;
    @track long;

    onCityChange(event) {
        this.location = event.target.value;
    }

    @track mapMarkers = [];
    zoomLevel = 10;
    @track result;
    @track value = true;
    @track title;
    @track target;
    @track data;

    showToast() {
        if (this.data == '') {
            const event = new ShowToastEvent({
                title: 'Warning',
                message: 'Uncorect enter town.',
            });
            this.dispatchEvent(event);
        }
    }

    connectedCallback() {
        performCallout().then(data => {
            this.mapMarkers = [{
                location: {
                    Latitude: data['cityLat'],
                    Longitude: data['cityLong']
                },
                title: data['cityName'] + ', ' + data['state'],
            }];
            this.result = data;
        }).catch(err => console.log(err));
        loadStyle(this, weather).then(result => {
            console.log('what is the result?', result);
        }).catch(err => console.log(err));
    }

    get getCityName() {
        if (this.result) {
            return this.result.cityName + ' Information';
        } else {
            return '---'
        }
    }

    get getConvertedTemp() {
        if (this.result) {
            return Math.round((this.result.cityTemp) - 273) + ' deg';
        } else {
            return '--'
        }
    }

    get getCurrentWindSpeed() {
        if (this.result) {
            return this.result.cityWindSpeed + ' mph';
        } else {
            return '--'
        }
    }

    get getCurrentPrecip() {
        if (this.result) {
            return this.result.cityPrecip + " inches"
        } else {
            return '--'
        }
    }

    handleChange(event) {

        if (this.location != null || this.location != '') {
            this.value = event.detail.value;
            performCallout({ location: this.location }).then(data => {
                console.log('error: ' + (JSON.stringify(data)));
                if (JSON.stringify(data) === '{}') {
                    const event = new ShowToastEvent({
                        title: 'Warning',
                        message: 'Uncorect enter town.',
                    });
                    this.dispatchEvent(event);
                } else {
                    this.mapMarkers = [{
                        location: {
                            Latitude: data['cityLat'],
                            Longitude: data['cityLong']
                        },
                        title: data['cityName'] + ', ' + data['state'],
                    }];
                    this.result = data;
                }
            }).catch(err => console.log(err));
        }
    }
}