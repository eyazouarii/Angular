import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {
  suggestionForm!: FormGroup;
  isEditMode: boolean = false;
  suggestionId?: number;
  
  categories: string[] = [
    'Infrastructure et bâtiments',
    'Technologie et services numériques',
    'Restauration et cafétéria',
    'Hygiène et environnement',
    'Transport et mobilité',
    'Activités et événements',
    'Sécurité',
    'Communication interne',
    'Accessibilité',
    'Autre'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Vérifier si on est en mode édition
    this.suggestionId = this.route.snapshot.params['id'];
    if (this.suggestionId) {
      this.isEditMode = true;
      this.loadSuggestion(this.suggestionId);
    }
  }

  initForm(): void {
    const today = new Date();
    const formattedDate = this.formatDate(today);

    this.suggestionForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[A-Z][a-zA-Z]*$')
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(30)
      ]],
      category: ['', Validators.required],
      date: [{ value: formattedDate, disabled: true }],
      status: [{ value: 'en attente', disabled: true }]
    });
  }

  loadSuggestion(id: number): void {
    this.suggestionService.getSuggestionById(id).subscribe({
      next: (suggestion) => {
        // Remplir le formulaire avec les données existantes
        this.suggestionForm.patchValue({
          title: suggestion.title,
          description: suggestion.description,
          category: suggestion.category,
          date: this.formatDate(new Date(suggestion.date)),
          status: suggestion.status
        });
      },
      error: (err) => {
        console.error('Erreur chargement suggestion', err);
        this.router.navigate(['/suggestions']);
      }
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onSubmit(): void {
    if (this.suggestionForm.valid) {
      const formValue = this.suggestionForm.getRawValue();
      
      const suggestion: Partial<Suggestion> = {
        title: formValue.title,
        description: formValue.description,
        category: formValue.category,
        date: new Date(),
        status: 'en attente',
        nbLikes: 0
      };

      if (this.isEditMode && this.suggestionId) {
        // Mode édition
        this.suggestionService.updateSuggestion(this.suggestionId, suggestion as Suggestion).subscribe({
          next: () => {
            this.router.navigate(['/suggestions', this.suggestionId]);
          },
          error: (err) => {
            console.error('Erreur mise à jour', err);
          }
        });
      } else {
        // Mode création
        this.suggestionService.addSuggestion(suggestion as Suggestion).subscribe({
          next: (newSuggestion) => {
            this.router.navigate(['/suggestions', newSuggestion.id]);
          },
          error: (err) => {
            console.error('Erreur ajout', err);
          }
        });
      }
    }
  }

  get title() { return this.suggestionForm.get('title'); }
  get description() { return this.suggestionForm.get('description'); }
  get category() { return this.suggestionForm.get('category'); }
}