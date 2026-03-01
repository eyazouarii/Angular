import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';

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

  constructor(
    private suggestionService: SuggestionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSuggestions();
  }

  loadSuggestions(): void {
    this.suggestionService.getSuggestionsList().subscribe({
      next: (data) => {
        this.suggestions = data;
      },
      error: (err) => {
        console.error('Erreur chargement suggestions', err);
      }
    });
  }

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
        console.error('Erreur like', err);
      }
    });
  }

  deleteSuggestion(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette suggestion ?')) {
      this.suggestionService.deleteSuggestion(id).subscribe({
        next: () => {
          // Recharger la liste après suppression
          this.loadSuggestions();
          // Optionnel: rediriger si on est sur la page de détails
          // this.router.navigate(['/suggestions']);
        },
        error: (err) => {
          console.error('Erreur suppression', err);
        }
      });
    }
  }

  addToFavorites(suggestion: Suggestion): void {
    if (!this.favorites.find(fav => fav.id === suggestion.id)) {
      this.favorites.push(suggestion);
    }
  }

  get filteredSuggestions(): Suggestion[] {
    return this.suggestions.filter(suggestion => {
      const matchesSearch = suggestion.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           suggestion.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.selectedCategory || suggestion.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  get categories(): string[] {
    return [...new Set(this.suggestions.map(s => s.category))];
  }
}