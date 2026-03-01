import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Suggestion } from '../../models/suggestion';
import { SuggestionService } from '../../core/services/suggestion.service';

@Component({
  selector: 'app-list-suggestion',
  templateUrl: './list-suggestion.component.html',
  styleUrls: ['./list-suggestion.component.css']
})
export class ListSuggestionComponent implements OnInit {
  suggestions: Suggestion[] = [];
  favorites: Suggestion[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';

  // Injection du service et du router
  constructor(
    private suggestionService: SuggestionService,
    private router: Router
  ) {}

  // ngOnInit pour charger les données au démarrage
  ngOnInit(): void {
    this.loadSuggestions();
  }

  // Méthode pour charger les suggestions depuis le service
  loadSuggestions(): void {
    this.suggestionService.getSuggestionsList().subscribe({
      next: (data) => {
        this.suggestions = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des suggestions', err);
      }
    });
  }

  // Fonction pour liker une suggestion
  likeSuggestion(suggestion: Suggestion): void {
    this.suggestionService.likeSuggestion(suggestion.id).subscribe({
      next: (updatedSuggestion) => {
        // Mettre à jour la suggestion dans la liste
        const index = this.suggestions.findIndex(s => s.id === updatedSuggestion.id);
        if (index !== -1) {
          this.suggestions[index] = updatedSuggestion;
        }
      },
      error: (err) => {
        console.error('Erreur lors du like', err);
      }
    });
  }

  // Fonction pour supprimer une suggestion
  deleteSuggestion(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette suggestion ?')) {
      this.suggestionService.deleteSuggestion(id).subscribe({
        next: () => {
          // Recharger la liste après suppression
          this.loadSuggestions();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
        }
      });
    }
  }

  // Fonction pour ajouter aux favoris
  addToFavorites(suggestion: Suggestion): void {
    if (!this.favorites.find(fav => fav.id === suggestion.id)) {
      this.favorites.push(suggestion);
    }
  }

  // Getter pour filtrer les suggestions
  get filteredSuggestions(): Suggestion[] {
    return this.suggestions.filter(suggestion => {
      const matchesSearch = suggestion.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           suggestion.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.selectedCategory || suggestion.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  // Getter pour obtenir toutes les catégories uniques
  get categories(): string[] {
    return [...new Set(this.suggestions.map(s => s.category))];
  }
}