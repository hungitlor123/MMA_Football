import { GoogleGenerativeAI } from '@google/generative-ai';
import { Player } from '../../types';

// Note: In production, store API key securely (environment variables, secure storage)
const GEMINI_API_KEY = 'AIzaSyCHzjYWAvRrODHieQ2jOdN4LfWasXVsA74'; // Replace with your actual API key

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async getSimilarPlayers(player: Player, allPlayers: Player[]): Promise<Player[]> {
    try {
      const prompt = `
        Based on this football player profile:
        - Name: ${player.playerName}
        - Team: ${player.team}
        - Position: ${player.position}
        - Age: ${new Date().getFullYear() - player.YoB}
        - Minutes Played: ${player.MinutesPlayed}
        - Passing Accuracy: ${(player.PassingAccuracy * 100).toFixed(1)}%
        - Is Captain: ${player.isCaptain ? 'Yes' : 'No'}

        From this list of available players:
        ${allPlayers.map(p => `${p.playerName} (${p.team}, ${p.position}, Age: ${new Date().getFullYear() - p.YoB})`).join('\n')}

        Suggest 3-5 similar players based on:
        1. Playing position
        2. Age range (±3 years)
        3. Team style/league
        4. Performance level
        5. Playing time

        Return ONLY the exact player names from the list, separated by commas, no additional text or explanation.
        Example format: "Player Name 1, Player Name 2, Player Name 3"
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      // Parse the response to get player names
      const suggestedNames = text.split(',').map((name: string) => name.trim());
      
      // Find matching players from the allPlayers list
      const similarPlayers = allPlayers.filter(p => 
        suggestedNames.some((suggestedName: string) => 
          p.playerName.toLowerCase().includes(suggestedName.toLowerCase()) ||
          suggestedName.toLowerCase().includes(p.playerName.toLowerCase())
        ) && p.id !== player.id // Exclude the original player
      );

      return similarPlayers.slice(0, 4); // Return max 4 similar players
    } catch (error) {
      console.error('Error getting similar players from Gemini:', error);
      
      // Fallback: Simple similarity based on position and age
      const fallbackSimilar = allPlayers.filter(p => 
        p.id !== player.id &&
        (p.position === player.position || 
         Math.abs((new Date().getFullYear() - p.YoB) - (new Date().getFullYear() - player.YoB)) <= 3)
      ).slice(0, 4);
      
      return fallbackSimilar;
    }
  }

  async getPlayerInsights(player: Player): Promise<string> {
    try {
      const prompt = `
        Analyze this football player and provide 2-3 key insights:
        - Name: ${player.playerName}
        - Team: ${player.team}
        - Position: ${player.position}
        - Age: ${new Date().getFullYear() - player.YoB}
        - Minutes Played: ${player.MinutesPlayed}
        - Passing Accuracy: ${(player.PassingAccuracy * 100).toFixed(1)}%
        - Is Captain: ${player.isCaptain ? 'Yes' : 'No'}

        Provide brief, professional insights about:
        1. Playing style and strengths
        2. Performance level
        3. Career stage/potential

        Keep it under 100 words, football analyst style.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error getting player insights:', error);
      return `${player.playerName} is a ${player.position} for ${player.team}. With ${player.MinutesPlayed} minutes played and ${(player.PassingAccuracy * 100).toFixed(1)}% passing accuracy, they show ${player.isCaptain ? 'strong leadership as team captain' : 'solid performance levels'}.`;
    }
  }
}

export const geminiService = new GeminiService(); 