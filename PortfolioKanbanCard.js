(function () {
    var Ext = window.Ext4 || window.Ext;


    /**
     * A special cardboard card for use by the PortfolioKanbanApp
     */
    Ext.define('Rally.app.portfolioitem.PortfolioKanbanCard', {
        extend:'Rally.ui.cardboard.ArtifactCard',
        alias:'widget.rallyportfoliokanbancard',

        inheritableStatics:{

            getAdditionalFetchFields:function () {
                return ['Owner', 'FormattedID', 'PercentDoneByStoryCount', 'StateChangedDate', 'DirectChildrenCount', 'Children', 'PortfolioItemType'];
            }

        },

        _hasReadyField:function () {
            return false;
        },

        _hasBlockedField:function () {
            return false;
        },

        buildContent:function () {
            var cardBody = Ext.widget('container', {
                cls:'cardContent'
            });

            cardBody.add({
                xtype:'rallyfieldrenderer',
                field:this.getRecord().getField('_refObjectName'),
                record:this.getRecord()
            });

            var percentDoneByStoryCount = this.getRecord().get('PercentDoneByStoryCount');

            if (percentDoneByStoryCount > 0) {
                var percentDoneField = Ext.widget('rallyfieldrenderer', {
                    field:this.getRecord().getField('PercentDoneByStoryCount'),
                    record:this.getRecord()
                });

                cardBody.add(percentDoneField);
            }

            // Our new functionalily is created here
			cardBody.add(this._childrenRenderer());
			

            var stateChangedDate = this.getRecord().get('StateChangedDate');
            var timeInState = Math.floor((((new Date().getTime()) - stateChangedDate.getTime()) / (1000 * 60 * 60 * 24)));
            var timeInStateStr;
            if (timeInState === 1) {
                timeInStateStr = timeInState + ' day';
            } else if (timeInState < 21) {
                timeInStateStr = timeInState + ' days';
            } else {
                timeInStateStr = Math.floor(timeInState / 7) + " weeks";
            }

            if (timeInState > 0) {
                cardBody.add({
                    xtype:'component',
                    cls:'timeInState',
                    renderTpl:'{timeInState} in this column',
                    renderData:{
                        timeInState:timeInStateStr
                    }
                });
            }

            return cardBody;
        },
		
        
        // New code added to create child structures in the card
		_childrenRenderer:function() {
			    var output = Ext.widget('container');
				var directChildrenCount = this.getRecord().get('DirectChildrenCount');
				
				if (directChildrenCount > 0) {  
					
					this.children = this.getRecord().get('Children');
					if (this.children.length != directChildrenCount) {
						this.children = this.getRecord().get('UserStories');
					} 
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
				return output;
		},
		
		_buildCountLabel:function(directChildrenCount) {
		    if (this.children.length > 0) { //then the children are also PIs
    			var childrenType = this.children[0].PortfolioItemType._refObjectName;
    			return Ext.util.Format.plural(this.children.length, childrenType);
    		} else { //the children are user stories
    		    if (this.children.length == 1) {
    		        return countLabel = '1 user story';
    		    } else {
    			    return countLabel = directChildrenCount + ' user stories';    
    		    }
    		}
    		
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

	    }}

    });

}());
