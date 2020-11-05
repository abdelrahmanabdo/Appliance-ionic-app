import { IsearchCriteriaModel } from './IsearchCriteria.model';
import { IitemsModel } from './IitemModel.model';


export interface IproductModel {
    "items" : Array<IitemsModel>,
    "search_criteria" : IsearchCriteriaModel,
    "total_count" : number , 
    "custom_attributes" ,
    "type_id" , 
    "extension_attributes",
    "meta_keyword",
    "id"
}

