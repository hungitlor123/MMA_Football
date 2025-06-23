import { Player } from '../../types';
import { API_BASE_URL, API_ENDPOINTS, REQUEST_TIMEOUT } from '../constants/apiConstants';

class PlayersApiService {
  private baseURL = API_BASE_URL;
  private timeout = REQUEST_TIMEOUT;

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async getAllPlayers(): Promise<Player[]> {
    try {
      const url = `${this.baseURL}${API_ENDPOINTS.PLAYERS.LIST}`;
      const response = await this.fetchWithTimeout(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Player[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  }

  async getPlayerById(id: string): Promise<Player> {
    try {
      const url = `${this.baseURL}${API_ENDPOINTS.PLAYERS.DETAILS.replace(':id', id)}`;
      const response = await this.fetchWithTimeout(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Player = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching player:', error);
      throw error;
    }
  }

  async getPlayersByTeam(teamName: string): Promise<Player[]> {
    try {
      const allPlayers = await this.getAllPlayers();
      return allPlayers.filter(player => 
        player.team.toLowerCase() === teamName.toLowerCase()
      );
    } catch (error) {
      console.error('Error fetching players by team:', error);
      throw error;
    }
  }

  async searchPlayers(query: string): Promise<Player[]> {
    try {
      const allPlayers = await this.getAllPlayers();
      return allPlayers.filter(player =>
        player.playerName.toLowerCase().includes(query.toLowerCase()) ||
        player.team.toLowerCase().includes(query.toLowerCase()) ||
        player.position.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching players:', error);
      throw error;
    }
  }
}

export const playersApi = new PlayersApiService(); 