import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  
import { SuggestionsRoutingModule } from './suggestions-routing.module';
import { ListSuggestionComponent } from './list-suggestion/list-suggestion.component';  
import { SuggestionDetailsComponent } from './suggestion-details/suggestion-details.component';
import { SuggestionFormComponent } from './suggestion-form/suggestion-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ListSuggestionComponent,  
    SuggestionDetailsComponent, SuggestionFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,  
      ReactiveFormsModule,
    SuggestionsRoutingModule
  ]
})
export class SuggestionsModule { }