import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // ← IMPORTANT
import { SuggestionsRoutingModule } from './suggestions-routing.module';
import { ListSuggestionComponent } from './list-suggestion/list-suggestion.component';  // ← Chemin local
import { SuggestionDetailsComponent } from './suggestion-details/suggestion-details.component';

@NgModule({
  declarations: [
    ListSuggestionComponent,  // ← Déclaré ici
    SuggestionDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,  // ← Pour ngModel
    SuggestionsRoutingModule
  ]
})
export class SuggestionsModule { }