import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {
  suggestionForm!: FormGroup;
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

  // Pour simuler un auto-increment (dans un vrai projet, ce serait fait par le backend)
  private lastId = 4; // À adapter selon votre dernière suggestion

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
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

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onSubmit(): void {
    if (this.suggestionForm.valid) {
      // Récupérer les valeurs du formulaire (y compris les champs désactivés)
      const formValue = this.suggestionForm.getRawValue();
      
      // Créer la nouvelle suggestion
      const newSuggestion: Suggestion = {
        id: ++this.lastId,
        title: formValue.title,
        description: formValue.description,
        category: formValue.category,
        date: new Date(), // Date système
        status: 'en attente',
        nbLikes: 0
      };

      // Récupérer la liste existante du localStorage ou d'un service
      // Pour l'exemple, on va juste afficher dans la console
      console.log('Nouvelle suggestion:', newSuggestion);
      
      // Ici vous devriez ajouter à votre liste de suggestions
      // Via un service partagé entre les composants
      
      // Rediriger vers la liste
      this.router.navigate(['/suggestions']);
    }
  }

  // Getters pour faciliter l'accès aux champs dans le template
  get title() { return this.suggestionForm.get('title'); }
  get description() { return this.suggestionForm.get('description'); }
  get category() { return this.suggestionForm.get('category'); }
}