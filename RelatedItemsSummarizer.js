(function () {
    var Ext = window.Ext4 || window.Ext;

    /**
     * Summarizes a set of related items and allows you to expand the list
     * in place on a card.
     */
    Ext.define('Rally.app.RelatedItemsSummarizer', {
        extend: 'Ext.Container',
        alias:'widget.relateditemssummarizer',
        
        config: {
            record: undefined
        },
        
        constructor:function(config){
            this.callParent(arguments);
            this._renderSummary();
        },
        
        _renderSummary:function() {
			    var output = Ext.widget('container');
				var directChildrenCount = this.getRecord().get('DirectChildrenCount');
				if (directChildrenCount > 0) {  

					this._specifyChildrenCollection();
					output.add({
		                xtype:'component',
		                cls:'numberOfChildren',
						itemId:'childrenCountContainer',
		                html: this._buildCountLabel(directChildrenCount),
						listeners: {
					        click: {
					        	element: 'el',
					        	fn: Ext.bind(this._toggleChildrenVisibility, this)
					         },
					         scope: this
					     }
		            });	
		           output.add({
		                xtype:'container',
		                cls:'childrenContainer',
						itemId:'childrenContainer',	
		            });

				}
				this.add(output);
		},

		_specifyChildrenCollection:function() {
		  	if (this.getRecord().get('Children').length > 0) {
	            this.children = this.getRecord().get('Children');
		  	} else {
				this.children = this.getRecord().get('UserStories');		  	    
		  	}		  
		},

		_childrenTypeLabel:function() {
		    if (this.children[0].PortfolioItemType) {
		        return this.children[0].PortfolioItemType._refObjectName;
		    } else {
		        if (this.children.length == 1) {
		            return 'user story';
		        } else {
		            return 'user storie'; // Ext pluralize is dumb
		        }
		    }
		},

		_buildCountLabel:function(directChildrenCount) {
    		return Ext.util.Format.plural(this.children.length, this._childrenTypeLabel());
		},

		// when label is clicked here is where the work is done to build and display or turn off the child card list
		_toggleChildrenVisibility:function(children) {
			this.childrenContainer = this.down('#childrenContainer')
			var expanded = this.childrenContainer.down('.component');
			if (expanded) {
				this.childrenContainer.removeAll();
				return;
			}
			this._renderChildren();
		},


		// 
		_renderChildren:function() {
				for (var i = 0; i < this.children.length; i++) {
			    	var child = this.children[i];
    			    if (child.State) {
    					var state = child.State._refObjectName;
    				} else if (child.ScheduleState) {
    					var state = child.ScheduleState;
    				} else {
    					var state = 'not on board';
    				}
    				var childURL = Rally.util.Navigation.createRallyDetailUrl(child);
    				this.childrenContainer.add({
    	                xtype:'component',
    	                cls:'childlabel',
    	                renderTpl: '<a href="{childURL}" target="_top">{childName}</a> ({childState})<br>',
    					renderData:{
    						childName: child._refObjectName,
    						childURL: childURL,
    						childState: state							
    					}
    	            });		
	            }
	    }
        
    });
    
})();