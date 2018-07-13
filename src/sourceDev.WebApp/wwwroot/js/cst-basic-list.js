﻿
//class to represent a list item
function ImageItem(title, description, fullSizeUrl, resizedUrl, thumbnailUrl, linkUrl, sort) {
    var self = this;

    self.Title = ko.observable(decodeEncodedJson(title));
    self.Description = ko.observable(decodeEncodedJson(description));
    self.FullSizeUrl = ko.observable(fullSizeUrl);
    self.ResizedUrl = ko.observable(resizedUrl);
    self.ThumbnailUrl = ko.observable(thumbnailUrl);
    self.LinkUrl = ko.observable(linkUrl);
    self.Sort = ko.observable(sort);

    self.incrementSort = function () {
        self.Sort(self.Sort() + 3);
    }
    self.decrementSort = function () {
        self.Sort(self.Sort() - 3);
    }
    
}

function ItemListViewModel(initialData) {
    var self = this;
    self.hiddenField = document.getElementById("ItemsJson");

    self.handleSortItemChanged = function (sortVal) {
        //console.log(sortVal);
        self.sortItems();   
    }
    
    self.Items = ko.observableArray(ko.utils.arrayMap(initialData, function (item) {
        //console.log(item);
        var item = new ImageItem(item.Title, item.Description, item.ResizedUrl, item.FullSizeUrl, item.ThumbnailUrl, item.LinkUrl, item.Sort);
        item.Sort.subscribe(self.handleSortItemChanged);
        return item;
    }));
    
    self.addItem = function (title, description, fullSizeUrl, resizedUrl, thumbnailUrl, linkUrl, sort) {
        var item = new ImageItem(title, description, fullSizeUrl, resizedUrl, thumbnailUrl, linkUrl, sort);
        item.Sort.subscribe(self.handleSortItemChanged);
        self.Items.push(item)
    }

    self.newItemTitle = ko.observable(null);
    self.newItemDescription = ko.observable(null);
    self.newItemFullSizeUrl = ko.observable(null);
    self.newItemResizedUrl = ko.observable(null);
    self.newItemThumbnailUrl = ko.observable(null);
    self.newItemLinkUrl = ko.observable(null);
    self.newItemSort = ko.observable(3);
   
    self.addNewItem = function () {
        self.addItem(self.newItemTitle(), self.newItemDescription(), self.newItemFullSizeUrl(), self.newItemResizedUrl(), self.newItemThumbnailUrl(), self.newItemLinkUrl(), self.newItemSort());
        self.newItemTitle(null);
        self.newItemDescription(null);
        self.newItemFullSizeUrl(null);
        self.newItemResizedUrl(null);
        self.newItemThumbnailUrl(null);
        self.newItemLinkUrl(null);
        self.newItemSort(3);
    }

    self.removeItem = function (item) { self.Items.remove(item) }

    self.getCssClass = function (index) {
        if (index === 0) { return "carousel-item active"; }
        return "carousel-item";
    }
    
    self.dropZoneSuccess = function (file, serverResponse) {
        //console.log(serverResponse);
        self.newItemFullSizeUrl(serverResponse[0].originalUrl);
        self.newItemResizedUrl(serverResponse[0].resizedUrl);
        self.newItemThumbnailUrl(serverResponse[0].thumbUrl)
    }

    window.DropZoneSuccessHandler = self.dropZoneSuccess;

    self.handleCropSave = function (resizedUrl) {
        self.newItemResizedUrl(resizedUrl);
    }
    window.HandleCropResult = self.handleCropSave;

    self.serverFileSelected = function (url) {
        self.newItemResizedUrl(url);
    }
    window.ServerFileSelected = self.serverFileSelected;
    
    self.currentListState = ko.computed(function () {
        return encodeURIComponent(ko.toJSON(self.Items));
    });
    self.sortItems = function () {
        self.Items.sort(function (a, b) {
            if (a.Sort() < b.Sort()) { return -1; }
            if (a.Sort() > b.Sort()) { return 1; }
            return 0;
        })
    }
}

function decodeEncodedJson(encodedJson) {
    if (encodedJson === null) { return encodedJson; }
    if (encodedJson === undefined) { return encodedJson; }
    var x = encodedJson.replace(/\+/g, " ");
    return decodeURIComponent(x);
}

document.addEventListener("DOMContentLoaded", function () {
    var configElement = document.getElementById("ItemsConfig");
    var initialData = JSON.parse(decodeEncodedJson(configElement.value));
    //console.log(initialData);

    ko.applyBindings(new ItemListViewModel(initialData));

});




