class PaytabsPaymentAuth {
    merchant_email : string ;
    secret_key     : string ;
    site_url       : string ;
    return_url     : string ;
    cms_with_version : string ;
    msg_lang       : string ; 
    merchant_ip    : any ; 


    constructor() {
        this.merchant_email   = "ianees@road9media.com" ;
        this.secret_key       = "O8gWWxsckwV0oxOiQ8YjM4q8RVnsLpCzySwvpZHKwDLUaAc0JajvfKE7G2zrrb003xvtwce2P0X0A91jklPz5tGMvgdXreXvLsZi";
        this.site_url         = "http://road9.space/appliance/index.php";
        this.return_url       = "http://road9.space/appliance/index.php";
        this.cms_with_version = "Magento 2.2.3" ;
        this.msg_lang         = "english"; 
        this.merchant_ip      = "176.58.107.64";
    }
}

export default PaytabsPaymentAuth;