Array.prototype.get = function(text) {
    return this.filter(element => element === text);
};
HTMLElement.prototype.is = function(selector) {
    if(selector.indexOf("#") >= 0) return this.id === selector.replace("#", "");
};
HTMLElement.prototype.isChildOf = function(selector) {
    return $(selector).querySelector(`${this.tagName.toLowerCase()}`) ? true : false;
};
HTMLElement.prototype.has = function(className) {
    return this.classList.contains(className);
};