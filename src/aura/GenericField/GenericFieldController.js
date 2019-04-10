({
    doInit : function(component, event, helper) {
        if (component.get("v.displayMode")=="edit") {
            helper.doValueBinding(component, event, helper, "myInputField");
            helper.valueChanged(component, event, helper, "myInputField");
        }
        var disableList = component.get('v.fieldsToDisable');
        var requiredList = component.get('v.requiredFields');
        var allFields = component.get('v.fieldApiName');
        var getdisableList = -1;
        var getReadOnlyList = -1;
        if(disableList)
            getdisableList = disableList.indexOf(allFields);
        if(requiredList)
            getReadOnlyList = requiredList.indexOf(allFields);
        
        if(getdisableList != -1){
            component.set('v.disableEdit',false);
        }else{
            component.set('v.disableEdit',true);
        }
        
        if(getReadOnlyList != -1){
            var findClass = component.find('myInputField')
            if(findClass != undefined)
            {
                var addClassTo = findClass.get("v.fieldName");
                $A.util.addClass(addClassTo, "customRequired");
            }
        }else{
            
        }
        
    },
    valueChanged : function (component, event, helper) {
        helper.valueChanged(component, event, helper, "myInputField");
    },
    somethingChanged : function (component, event, helper) {
        helper.somethingChanged(component, event, helper, component.get("v.sObjectName"));
    },
    clickedOn : function (component, event, helper) {
        var name = component.get("v.cmpName");
        helper.modeChanged(component, event, helper, "edit",name);
    },
    modeChanged :function(component, event, helper) {
        if (component.get("v.cmpName") !== event.getParam("cmpName")) return;
        helper.setMode(component, event, helper);
        var newMode = event.getParam("mode");
        if (newMode == "edit") {
            helper.doValueBinding(component, event, helper, "myInputField");
            helper.valueChanged(component, event, helper, "myInputField");
        }
    },
    handleDynamicRendering : function(component, event, helper) {
        var payload = event.getParam("payload");
        var fields = payload.fields;
        var action = payload.action;
        
        fields.forEach(function(fieldName) {
            var fieldApiName = component.get("v.fieldApiName");
            if(fieldName === fieldApiName) {
                if(action === 'enable') {
                    helper.enableField(component, event, helper);
                }
                else if(action === 'disable') {
                    helper.disableField(component, event, helper);
                }
                else if(action === 'show') {
                    helper.showField(component, event, helper);
                }
                else if(action === 'hide') {
                    helper.hideField(component, event, helper); 
                }
                else if(action === 'null') {
                    helper.nullField(component, event, helper);
                } else if (action === 'blankAndDisable') {
                    helper.blankAndDisable(component, event, helper);
                }
            }
        });
    }
})