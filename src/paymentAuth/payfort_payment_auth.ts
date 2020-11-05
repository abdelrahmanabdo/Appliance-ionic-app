import { Observable } from 'rxjs/Observable';
import CryptoJS from 'crypto-js';

class PayfortPaymentAuth {
    access_code  : string ;
    service_command     : string ;
    site_url       : string ;
    return_url     : string ;
    language       : string ; 
    merchant_identifier : string ;
    SHA_Request_Phrase  : string; 
    SHA_Response_Phrase : string ;
    signature : string  = "";
    constructor() {

        this.access_code      = "QnFtmO08pF8uTac7hPN2" ;
        this.service_command  = "SDK_TOKEN";
        this.site_url         = "http://road9.space/appliance/index.php";
        this.return_url       = "http://road9.space/appliance/index.php";
        this.language         = "en"; 
        this.merchant_identifier = "GktRfAGg";
        this.SHA_Request_Phrase = "TESTSHAIN";
        this.SHA_Response_Phrase = "TESTSHAOUT";
    }   

    get_token_generate_signature =  (currency : string, customer_email :string  , merchant_reference : string , device_id : string) : Observable<any> => {
        this.signature = this.SHA_Request_Phrase+"access_code="+this.access_code
                         +"device_id="+device_id+"language="+this.language+"merchant_identifier="+this.merchant_identifier
                         +"service_command="+this.service_command+this.SHA_Request_Phrase ;
                       
                         return CryptoJS.SHA256(this.signature).toString(CryptoJS.enc.Hex);

                        }

    
    tokeninzation_generate_signature = ( merchant_reference , token_name )  => {
        this.signature = this.SHA_Request_Phrase+"access_code="+this.access_code+
                        "language="+this.language+"merchant_identifier="+this.merchant_identifier+"merchant_reference="+merchant_reference+"return_url="+this.return_url+
                        +"service_command=TOKENIZATION"+"token_name"+token_name+this.SHA_Request_Phrase;
                
                         return CryptoJS.SHA256(this.signature).toString(CryptoJS.enc.HEX);
    }
}

export default PayfortPaymentAuth;