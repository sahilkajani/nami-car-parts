// API Reference: https://www.wix.com/corvid/reference
// “Hello, World!” Example: https://www.wix.com/corvid/hello-world

import wixData from 'wix-data';
import {local} from 'wix-storage';
import wixLocation from 'wix-location';

const sparePartItemsRepeater = "#sparePartItemsRepeater";

$w.onReady(function () {	

	$w(sparePartItemsRepeater).hide();

	var vehicleIDs = local.getItem("vehicleIDs");

	var spareParts =  searchSpareParts(vehicleIDs)					
					

});

export function searchSpareParts(vehicleId){

	wixData.queryReferenced("Vehicles", vehicleId, "product")
	.then( (results) => {
		if(results.items.length > 0) {

		var labelText = "(" + results.items.length + " found)"
		$w("#resultsCountLabel").text = labelText;
		$w(sparePartItemsRepeater).show();
		$w(sparePartItemsRepeater).data = results.items
		} 
		else {
		$w("#resultsCountLabel").text = "(0 found)"
		$w(sparePartItemsRepeater).hide();
		}
    })
    .catch( (err) => {
     let errorMsg = err;
	 console.log(errorMsg)
    });
}