export interface Suggestion {
    id: number;
  title: string;
  description: string;
  category: string;
  date: Date;
  status: 'acceptée' | 'refusée' | 'en_attente';
  nbLikes: number;
}
