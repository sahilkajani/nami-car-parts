// API Reference: https://www.wix.com/corvid/reference
// “Hello, World!” Example: https://www.wix.com/corvid/hello-world

import wixData from 'wix-data';
import {local} from 'wix-storage';
import wixLocation from 'wix-location';


const makeDropdown = "#makeDropdown";
const modelDropdown = "#modelDropdown";
const typeDropdown = "#typeDropdown";
const yearDropdown = "#yearDropdown";

const vehiclesData = wixData.query("Vehicles");

$w.onReady(function () {

	const searchBtn = "#searchButton"; 

	disableDropdowns();
	uniqueDropDown1();

	function disableDropdowns(){
		$w(modelDropdown).disable()
		$w(typeDropdown).disable()
		$w(yearDropdown).disable()
	}

	function uniqueDropDown1 (){
		vehiclesData
		 .limit(1000)
		 .ascending("name")
		 .distinct("name")
		 .then( (results) => {
			let distinctList = buildOptions(results.items);
			$w(makeDropdown).options = distinctList
		});
	}

	function buildOptions(uniqueList) {
        return uniqueList.map(curr => {
            return {label:curr, value:curr};
        });
    }

	$w(makeDropdown).onChange( (event) => {
		vehiclesData
		  .limit(1000)
		  .contains("name", $w(makeDropdown).value)
		  .find()
		  .then( (results) => {
			const uniqueTitles = getUniqueTitlesForModel(results.items);
			$w(modelDropdown).options = buildOptions(uniqueTitles);
		});

		$w(modelDropdown).enable()  

		//reseting values of other dropdowns if they are already selected
		$w(modelDropdown).value = ""
		$w(typeDropdown).value = ""
		$w(yearDropdown).value = "" 
		
		$w(typeDropdown).disable()
		$w(yearDropdown).disable()

	});		


	function getUniqueTitlesForModel(items) {
        const titlesOnly = items.map(item => item.model);
        return [...new Set(titlesOnly)];
    }

	$w(modelDropdown).onChange( (event) => {
		vehiclesData
		  .limit(1000)
		  .contains("model", $w(modelDropdown).value)
		  .find()
		  .then( (results) => {
			const uniqueTitles = getUniqueTitlesForType(results.items);
			$w(typeDropdown).options = buildOptions(uniqueTitles);
		});

		$w(typeDropdown).enable()  

		//reseting values of other dropdowns if they are already selected
		$w(typeDropdown).value = ""
		$w(yearDropdown ).value = "" 
		
		$w(yearDropdown).disable()
	});		

	function getUniqueTitlesForType(items) {
        const titlesOnly = items.map(item => item.type);
        return [...new Set(titlesOnly)];
    }


	$w(typeDropdown).onChange( (event) => {
		vehiclesData
		  .limit(1000)
		  .contains("type", $w(typeDropdown).value)
		  .find()
		  .then( (results) => {
			const uniqueTitles = getUniqueTitlesForYear(results.items);
			$w(yearDropdown).options = buildOptions(uniqueTitles);
		});

		$w(yearDropdown).enable()  

		//reseting values of other dropdowns if they are selected
		$w(yearDropdown).value = ""
	});		

	function getUniqueTitlesForYear(items) {
        const titlesOnly = items.map(item => item.year);
        return [...new Set(titlesOnly)];
    }

})


export async function searchButton_click(event) {

	var vehicleIDs = await getVehicleIDs();

	local.setItem("vehicleIDs", vehicleIDs);

	wixLocation.to("/search-results")

}


export async function getVehicleIDs(){

	var vehicleIDs = [];

	await vehiclesData.contains("name", $w(makeDropdown).value)
				.eq("model", $w(modelDropdown).value)
				.eq("type", $w(typeDropdown).value)
				.eq("year", $w(yearDropdown).value)
				.find()
				.then( (results) => {
					results.items.forEach(function(vehicle){
						vehicleIDs.push(vehicle._id);
					})
					
					return vehicleIDs
				})
				.catch( (err) => {
					let errorMsg = err;
					console.log(errorMsg);
				});

	return vehicleIDs			
}