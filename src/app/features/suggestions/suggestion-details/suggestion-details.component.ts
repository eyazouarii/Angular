import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';  // ← Importer le service

@Component({
  selector: 'app-suggestion-details',
  templateUrl: './suggestion-details.component.html',
  styleUrls: ['./suggestion-details.component.css']
})
export class SuggestionDetailsComponent implements OnInit {
  suggestion: Suggestion | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private suggestionService: SuggestionService  
  ) {}

  ngOnInit(): void {
    
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadSuggestion(id);
  }

  
  loadSuggestion(id: number): void {
    this.suggestionService.getSuggestionById(id).subscribe({
      next: (data) => {
        this.suggestion = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la suggestion', err);
     
        this.router.navigate(['/suggestions']);
      }
    });
  }

  
  deleteSuggestion(): void {
    if (this.suggestion && confirm('Êtes-vous sûr de vouloir supprimer cette suggestion ?')) {
      this.suggestionService.deleteSuggestion(this.suggestion.id).subscribe({
        next: () => {
        
          this.router.navigate(['/suggestions']);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
        }
      });
    }
  }

  
  likeSuggestion(): void {
    if (this.suggestion) {
      this.suggestionService.likeSuggestion(this.suggestion.id).subscribe({
        next: (updatedSuggestion) => {
          this.suggestion = updatedSuggestion;
        },
        error: (err) => {
          console.error('Erreur lors du like', err);
        }
      });
    }
  }

 
  goBack(): void {
    this.router.navigate(['/suggestions']);
  }
}