import { genUUID } from "../utils/helpers";

class Analytics {
	async sendEventRoute() {
		this.sendEvent({
			type: 'route',
			payload: {
				url: window.location.pathname,
			},
			timestamp: Date.now(), 
		})
	}

	async sendViewCard(productProperties: any, secretKey: string) {
		this.sendEvent({
			type: productProperties.log ? 'viewCardPromo' : 'viewCard',
			payload: {
				...productProperties, secretKey: secretKey
			},
			timestamp: Date.now(), 
		})
	}

	async sendAddToCard(productProperties: any) {
		this.sendEvent({
			type: 'addToCard',
			payload: {
				...productProperties
			},
			timestamp: Date.now(), 
		})
	}

	async sendPurchase(productsList: any) {
		const orderId = genUUID()
		const productsTotalPrice = productsList.reduce((acc: any, product: any) => (acc += product.salePriceU), 0);
		const productsId = productsList.map((product: any) => product.id);

		this.sendEvent({
			type: 'purchase',
			payload: {
				orderId: orderId,
				totalPrice: productsTotalPrice,
				productIds: productsId
			},
			timestamp: Date.now(), 
		})
	}

	private checkStatusRequest(res: any) {
    if (res.ok) return res.json()

    return Promise.reject(res.status)
  }

	private async sendEvent(payload: any) {
		fetch('/api/sendEvent', {
      method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
      body: JSON.stringify(payload),
    })
		.then(res => this.checkStatusRequest(res));
	}
}

export const analyticService = new Analytics()