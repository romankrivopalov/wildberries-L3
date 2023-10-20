import localforage from 'localforage';
import { ProductData } from 'types';

const FV = '__wb-favorite';

class FavoriteService {
  init() {
    this._updCounters();
  }

  async addProduct(product: ProductData) {
    const products = await this.get();
    await this.set([...products, product]);
  }

  async removeProduct(product: ProductData) {
    const products = await this.get();
    await this.set(products.filter(({ id }) => id !== product.id));
  }

  async get(): Promise<ProductData[]> {
    return (await localforage.getItem(FV)) || [];
  }

  async set(data: ProductData[]) {
    await localforage.setItem(FV, data);
    this._updCounters();
  }

  async isInFavorite(product: ProductData) {
    const products = await this.get();
    return products.some(({ id }) => id === product.id);
  }

  private async _updCounters() {
    const products = await this.get();
    const count = products.length >= 10 ? '9+' : products.length;
    const button = document.querySelector('.favorite, .header__buttons')

    if (!count) {
      //@ts-ignore
      button.style.display = 'none'
    } else {
      //@ts-ignore
      button.style.display = 'block'
    }

    //@ts-ignore
    document.querySelectorAll('.js__favorite-counter').forEach(($el: HTMLElement) => ($el.innerText = String(count || '')));
  }
}

export const favoriteService = new FavoriteService();
  