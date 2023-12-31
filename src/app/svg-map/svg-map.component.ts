// svg-map.component.ts

import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';


interface CountryData { //specifying the properties of the object
  name: string;
  capitalCity: string;
  region: { value: string };
  incomeLevel: { value: string };
  longitude: string;
  latitude: string;
}
@Component({
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  selector: 'app-svg-map',
  templateUrl: './svg-map.component.html',
  styleUrls: ['./svg-map.component.css']
})
export class SvgMapComponent implements OnInit{
  countryInfo: CountryData | null = null;


  ngOnInit(): void {
    //mouse functionality-event listerns for mouse behavior
    let svgCountryPaths = document.querySelectorAll<SVGPathElement>('path');

    Array.prototype.forEach.call(svgCountryPaths, (svgCountry: SVGPathElement) => {

      svgCountry.addEventListener('mouseover', (event:MouseEvent)=> {
        const path = event.target as SVGPathElement;
        path.style.fill = ' #ff0000'; //change color on mouseover
        this.loadCountryData(svgCountry);
      });

      svgCountry.addEventListener('mouseleave', (event:MouseEvent)=> {
        const path = event.target as SVGPathElement;
        path.style.fill = '';
      });
      //click event loads country data from api request inserts event listener

    });
  }
  //fetching data from the API
  async loadCountryData(svgCountry: SVGPathElement): Promise<void> { //pathelement is svg data grabbed from the html
    try { //promise void is the return type
      let api: string =
      'https://api.worldbank.org/V2/country/'+svgCountry.id+'?format=json';//adds country id to the api to fetch each country
      let res: Response = await fetch(api);////res is the response from the api
      let data: any =  await res.json(); //res.json() returns a promise, so we need to await it give structure with json
      let dataPath: any = data[1];//datapath is the data from the api,array [1] the json data is in the second array
      //mapping the data to the properties of the object

      if (dataPath && dataPath.length > 0) {//if the data is not empty, then map the data to the properties of the object 
        this.countryInfo = { //countryInfo is the object [0] because it is an array 0 is the first element
          name: dataPath[0].name,
          capitalCity: dataPath[0].capitalCity,
          region: { value: dataPath[0].region.value },//in{} because it is an object
          incomeLevel: { value: dataPath[0].incomeLevel.value },
          longitude: dataPath[0].longitude,
          latitude: dataPath[0].latitude
        };
      }
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  }


}
