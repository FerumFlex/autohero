import axios, { AxiosInstance } from "axios"

class API {
  api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async generateHeroName(race: string) {
    const response = await this.api.post('/hero/generate_name', {
      race
    })
    return response.data.name
  }

  async createHero(tx: string) {
    const response = await this.api.post('/hero', {
      tx: tx
    })
    return response.data
  }

  async getEvents() {
    const response = await this.api.get('/events')
    return response.data
  }

  async getHeroesByOwner(wallet: string) {
    const response = await this.api.get(`/hero/owner/${wallet}`)
    return response.data
  }

  async applyEvent(tx: string, event: string) {
    const response = await this.api.post('/events/apply', {
      tx: tx,
      event: event
    })
    return response.data
  }

  async getHeroes() {
    const response = await this.api.get('/hero')
    return response.data
  }
}

const apiInstance = new API()
export default apiInstance
