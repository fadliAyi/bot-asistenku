class KeywordUserInput {
    constructor(context) {
        this.context = context;
    }

    get price() {
        return this.searchPrice()[0];
    }

    get item() {
        return this.searchItem();
    }

    searchPrice() {
        let {text} = this.context.message;
        let priceRegex = /\d+(.\d{1,})/g;
        let result = priceRegex.exec(text);  
        return result;
    }

    searchItem() {
        let {text} = this.context.message;
        let resultRegPrice = this.searchPrice();
        return text.substr(0, resultRegPrice.index-1);
    }
}

module.exports = KeywordUserInput;
