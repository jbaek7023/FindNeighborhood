var catData = [
	{
		clickCount: 0,
		name: "Tabby",
		currentSource: 'img/22252709_010df3379e_z.jpg',
		people: ['E', 'F', 'G', 'J', 'I']
	},
	{
		clickCount: 0,
		name: 'Jamie',
		currentSource: 'img/434164568_fea0ad4013_z.jpg',
		people: ['S', 'N', 'W', 'J', 'I']
	},
	{
		clickCount: 0,
		name: 'Shobby',
		currentSource: 'img/1413379559_412a540d29_z.jpg',
		people: ['X', 'B', 'G', 'J', 'I']
	},
	{
		clickCount: 0,
		name: 'Dae-gu',
		currentSource: 'img/4154543904_6e2428c421_z.jpg',
		people: ['Z', 'ZW', 'WRDF', 'J', 'I']
	}
]

var Cat = function(data){
	this.clickCount = ko.observable(data.clickCount);
	this.defaultName = ko.observable(data.name);
	this.people = ko.observableArray(data.people);

	this.status = ko.computed(function() {
		if(this.clickCount()<5) {
			return 'just born';
		} else if(this.clickCount()<10) {
			return 'infant';
		} else {
			return 'grown';
		}
	}, this);
	this.currentSource = ko.observable(data.currentSource);
}

var ViewModel = function() {
	self = this;

	this.catList = ko.observableArray([]);

	catData.forEach(function(catItem) {
		self.catList.push(new Cat(catItem));
		//self refer to this. if I try this, I get err, since catData is this.
	});

	this.currentCat = ko.observable(this.catList()[0]);
	
	this.incrementCounter = function() {
		self.currentCat().clickCount(self.currentCat().clickCount()+1);
	};

	this.setCat = function(clickedCat){
		self.currentCat(clickedCat); 
	}
}

ko.applyBindings(new ViewModel());
			