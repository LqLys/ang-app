import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {AddIngredient, DeleteIngredient, UpdateIngredient} from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form') slForm: NgForm;

  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService, private store: Store<fromShoppingList.AppState>) {
  }

  ngOnInit() {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.slService.getIngredient(index);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAddItem(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      // this.slService.updateIngredient(this.editedItemIndex, newIngredient);
      this.store.dispatch(new UpdateIngredient({index: this.editedItemIndex, ingredient: newIngredient}));
    } else {
      // this.slService.addIngredient(newIngredient);
      this.store.dispatch(new AddIngredient(newIngredient));

    }
    this.slForm.reset();
    this.editMode = false;
  }

  onClear(): void {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    // this.slService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new DeleteIngredient(this.editedItemIndex));
    this.onClear();
  }
}
