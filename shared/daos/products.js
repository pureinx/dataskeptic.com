import axios from "axios"

export default function getProducts(store) {
	console.log("Get products")
	axios
		.get("https://obbec1jy5l.execute-api.us-east-1.amazonaws.com/prod/products")
		.then(function(result) {
			var products = result.data.Items
			if (products != undefined) {
				store.dispatch({type: "ADD_PRODUCTS", payload: products })
				store.dispatch({type: "SET_PRODUCTS_LOADED", payload: 1 })
				console.log("Loaded products")
			}
		})
		.catch((err) => {
			store.dispatch({type: "FETCH_PRODUCTS_ERROR", playload: err})
		})			
}