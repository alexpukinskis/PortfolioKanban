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
		
		_childrenRenderer:function() {
			    var output = Ext.widget('container');
				var directChildrenCount = this.getRecord().get('DirectChildrenCount');
				if (directChildrenCount > 0) {
					var children = this.getRecord().get('Children');
					var childrenType = children[0].PortfolioItemType._refObjectName;
					
					var countLabel = Ext.util.Format.plural(directChildrenCount, childrenType);

					output.add({
		                xtype:'component',
		                cls:'numberOfChildren',
		                renderTpl:countLabel,
						renderData:{
							childCount:directChildrenCount
						},
						listeners: {
					        click: {
					        	element: 'el',
					        	fn: Ext.bind(this._toggleChildrenVisibility, this, [children])
					         },
					         scope: this
					     }
		            });		

					
				}
				return output;
		},
		
		_toggleChildrenVisibility:function(children) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i];
			    if (child.State) {
					var state = child.State._refObjectName;
				} else {
					var state = 'Not Started';
				}
				console.log(this);
				this.down('#card').add({
	                xtype:'component',
	                cls:'childlabel',
	                renderTpl:'{childName} ({childState})<br>',
					renderData:{
						childName: child._refObjectName,
						childState: state							
					}
	            });		

			}
		}


    });

}());
