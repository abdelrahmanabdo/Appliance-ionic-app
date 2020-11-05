import { ProductsListingPage } from '../products-listing/products-listing';
import { ProductsProvider } from '../../providers/products/products';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
  providers: [ProductsProvider]
})
export class CategoriesPage {
  categories;
  categories_server_url = "https://app-liance.com/pub/media/catalog/category/";
  dataAvaliable = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private ProductsProvider: ProductsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage');
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.ProductsProvider.getCategories().subscribe((res) => {
      console.log(res)
      res.children_data.forEach(element => {
        this.ProductsProvider.get_category_by_id(element.id).subscribe((category) => {
          console.log(category)
          for (var i = 0; i < category.custom_attributes.length; i++) {
            if (category.custom_attributes[i].attribute_code === "image") {
              console.log(category.custom_attributes[i].value)
              element.image = this.categories_server_url + category.custom_attributes[i].value;
              break;

            } else {
              element.image = "assets/imgs/card-1.jpg";
            }
          }
          this.dataAvaliable = true;

        },
          error => this.dataAvaliable = true);
      });
      this.categories = res;
      console.log(res)
    });
  }


  GoToCategoriesList = (categoryID, categoryName) => {
    console.log("GSGSG")
    this.navCtrl.push("ProductsListingPage", {
      "category_id": categoryID,
      "title": categoryName,
      "brand": false
    })
  }


  back = () => {
    if (this.navCtrl.length() === 1) {
      this.navCtrl.setRoot("TabsPage", { animate: false });

    } else {
      this.navCtrl.pop({ animate: false });

    }
  }
}
