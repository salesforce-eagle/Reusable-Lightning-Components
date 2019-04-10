({
    doInit: function(component, event, helper) {        
    },
	
    loadSpinner: function(component, event, helper,spinnerCmp) {
		component.set(spinnerCmp, true);
    },
    
    hidespinner: function(component, event, helper,spinnerCmp) {        
        component.set(spinnerCmp, false);

    },
    handleSaveRecord: function(component, event, helper, componentId,callback) {
        console.log('component.find(componentId): '+JSON.stringify(component.find(componentId)));
        /**	
         * 	Iterator will be here- which will iterate over fields that are Checkbox type and Value are null(No onChange fired on field lavel)
         * 	here we will set the value as False and then do saveRecord
         **/
        component.find(componentId).saveRecord(
            ($A.getCallback(function(saveResult) 
                            {
                                console.log('saveResult: '+JSON.stringify(saveResult));
                                if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                                    console.log("Save completed successfully.");
                                    helper.showToast(component, event, helper, "Success","success","The record has been updated successfully.");
                                    helper.modeChanged(component, event, helper, 'read');
                                } else if (saveResult.state === "INCOMPLETE") {
                                    console.log("User is offline, device doesn't support drafts.");
                                    helper.showToast(component, event, helper, "Error!","Error", "User is offline, device doesn't support drafts.");
                                } else if (saveResult.state === "ERROR") {
                                    console.log('Problem saving record, error: ' + JSON.stringify(saveResult.error[0].message));
                                    helper.showToast(component, event, helper, "Error!","Error", JSON.stringify(saveResult.error[0].message));
                                } else {
                                    console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
                                    helper.showToast(component, event, helper, "Error!", "Error","Unknown problem, state: " + saveResult.state + ", error: " + JSON.stringify(saveResult.error.message));
                                }
                                var appEvent = component.getEvent("cmpSaveEvent");
                                event.preventDefault();
                                if(appEvent!=undefined){
                                    appEvent.setParams({
                                        "state" : saveResult.state
                                    });
                                    appEvent.fire();    
                                }
                                
                            })));
        //helper.modeChanged(component, event, helper, 'read');
    },
    
    showToast : function(component, event, helper,title, toastType, toastMessage) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "type" : toastType,
            "message": toastMessage
        });
        toastEvent.fire();
    },
    
    recordUpdated : function(component, event, helper, componentId) {
        
        var changeType = event.getParams().changeType;
        
        if (changeType === "ERROR") { console.log('it is error'); /* handle error; do this first! */ }
        else if (changeType === "LOADED") { /* handle record load */ }
            else if (changeType === "REMOVED") { /* handle record removal */ }
                else if (changeType === "CHANGED") { 
                    console.log('change detected');
                    /* handle record change; reloadRecord will cause you to lose your current record, including any changes you’ve made */ 
                    component.find(componentId).reloadRecord();}
    },
    
    doValueBinding : function(component, event, helper, componentId) {
        //value binding through javascript (not currently supported through template)
        var recordLoadMapping = component.get("v.recordLoadMapping");        
        var referenceKey = component.get("v.fieldApiName");
        if(recordLoadMapping) {
            referenceKey = recordLoadMapping[referenceKey];
        }
        var readFlag = component.get("v.readOnlyFlag");
        if(!readFlag){
            component.find(componentId).set("v.value",
                                            component.getReference('v.currentRecord.'+ referenceKey));
            
            if(component.find(componentId).get("v.checked") != undefined){
                component.find(componentId).set("v.checked",
                                                component.getReference('v.currentRecord.'+ referenceKey));
            }
            console.log('Updated Value: '+JSON.stringify( component.find(componentId).get("v.value")))
        }
        
        var fieldsToDisable = component.get("v.fieldsToDisable");
        if(fieldsToDisable && fieldsToDisable.includes(component.get("v.fieldApiName"))) {
            component.set("v.style", "disabled");
        }
        var reqFlg = component.get("v.requiredFlag");
        var readFlg = component.get("v.readOnlyFlag");
        if(reqFlg && readFlg) {
            component.set("v.style", "customRequired");
        }else if(reqFlg){
            component.set("v.style", "req1");
        }else{
            //do nothing
        }
    },
    
    modeChanged : function (component, event, helper, newMode, name) {
        //var compEvent = component.getEvent("WFModeChanged");
        //var name = component.get('v.cmpName');
        var compEvent = $A.get("e.Devbnd:WFModeChanged");
        compEvent.setParams({"mode" : newMode,
                             "cmpName": name});
        compEvent.fire(); //broadcast the change   
    },
    
    valueChanged : function (component, event, helper, componentId) {
        var myInputField = component.find(componentId);
        
        if (event.getParam('checked') !== undefined) { //fix for checkboxes issue with two-way binding
            myInputField.set("v.value", event.getParam('checked')); 
        } else if (event.getParam('value') instanceof Array) { //fix for lookup field value binding
            myInputField.set("v.value", event.getParam('value')[0]); 
        } else { 
            //others, we don't need to do anything. two way binding works fine for all other data types
        }
        
        var compEvent = $A.get("e.Devbnd:WFInputFieldChanged");
        compEvent.setParams({"changedFieldName" : myInputField.get("v.fieldName"), 
                             "changedFieldValue" : myInputField.get("v.value") });
        
        compEvent.fire(); //broadcast the change   
    },
    
    setMode : function (component, event, helper) {
        if(event.getParam("cmpName") === component.get("v.cmpName")){
        var newMode = event.getParam("mode");
            component.set('v.displayMode', newMode );
      }
    },
    
    somethingChanged : function (component, event, helper, sObjectName) {
        //todo: this is just an example. This logic should be driven by metadata and generically based on sObjectName.
        console.log('Eoorr Logs Generate: '+JSON.stringify(component.get("v.sampleError")));
        var myInputField = component.find("myInputField");
        var changedFieldName = event.getParam("changedFieldName");
        if (sObjectName === "Opportunity" && myInputField.get("v.fieldName") === "Probability" && changedFieldName === "StageName" ) {
            var changedFieldValue = event.getParam("changedFieldValue");
            if (changedFieldValue === "Qualification") {
                $A.util.addClass(myInputField, 'hideInput');
            } else {
                $A.util.removeClass(myInputField, 'hideInput');
            }
        }
    },
    
    /**
         ** Method Name: relatedListNavigation
         ** Function added for nevigate from Object related-list to all records.
         ** Using standard event navigateToRelatedList                                                                                                        
     **/
    relatedListNavigation : function (component, event, helper, relationshipName, parentRecordId) {
        var relatedListEvent = $A.get("e.force:navigateToRelatedList");        
        /** Commented below section as, encountred that there are few Objectrelationship name which are not same as __c to __r.          **/      
        /*var relatedObjectApi;
        if(childObjectName != undefined){
            relatedObjectApi =  childObjectName.replace("__c","__r")
        }*/
        relatedListEvent.setParams({
            "relatedListId": relationshipName,
            //               Need to ensure befor this that our child component is implementing force:hasRecordId, so that will get the record Id by default.
            "parentRecordId": parentRecordId
        });
        relatedListEvent.fire();
    },
    
    callServer : function(component, method, callback, params, storable) {
        var action = component.get(method);
        
        //Set params if any
        if (params) {
            action.setParams(params);
        }
        
        /** Set Storable to support Caching data in lightning
        **  We can have custom caching for do that too as long as we know that our data is Completly static                **/ 
        if (storable) {
            action.setStorable();
        }
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") { 
                // pass returned value to callback function
                callback.call(this,response.getReturnValue());   
            } else if (state === "ERROR") {
                // generic error handler
                var errors = response.getError();
                if (errors) {
                    console.log("Errors", errors);
                    this.showToast({
                        "title": "ERROR IN SERVER CALL",
                        "type": "error",
                        "message": errors
                    });
                    if (errors[0] && errors[0].message) {
                        throw new Error("Error" + errors[0].message);
                    }
                } else {
                    throw new Error("Unknown Error");
                }
            }
        });
        
        $A.enqueueAction(action);
    }
})