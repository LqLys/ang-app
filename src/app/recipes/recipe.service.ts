import {Recipe} from './recipe.model';
import {Injectable} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';
import {Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {AddIngredients} from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  recipeSelected = new Subject<Recipe>();

  // private recipes: Recipe[] = [
  //   new Recipe('A Test Recipe',
  //     'Test desc',
  //     'https://static01.nyt.com/images/2015/08/14/dining/14ROASTEDSALMON/14ROASTEDSALMON-articleLarge.jpg',
  //     [new Ingredient('Meat', 1),
  //       new Ingredient('Fries', 20)
  //     ]),
  //   new Recipe('Another Test Recipe',
  //     'Test desc',
  //     'https://static01.nyt.com/images/2015/08/14/dining/14ROASTEDSALMON/14ROASTEDSALMON-articleLarge.jpg',
  //     [
  //       new Ingredient('Buns', 2),
  //       new Ingredient('Meat', 1)
  //     ])
  // ];
  private recipes: Recipe[] = [];

  constructor(private slService: ShoppingListService, private store: Store<fromShoppingList.AppState>) {
  }

  getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
    this.store.dispatch(new AddIngredients(ingredients));
  }

  getRecipe(id: number): Recipe {
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());

  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());

  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }
}
