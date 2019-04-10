({
    /**	Added doInit to check New Record Creation	**/
    
    doInit: function(component, event, helper) {
        if(component.get("v.isNewRec") == true){
            component.find("recordCreator").getNewRecord(
                
                component.get("v.sObjectName"),
                null,
                false,
                $A.getCallback(function() {
                    //                    console.log('After In callBack->: '+JSON.stringify(component.get("v.newCpRec")));
                })
            );
            
        }        
    },
    /**	End of doInit	**/
    
    SaveRecordLogic: function(component, event, helper) {
        event.preventDefault();
        //console.log('Sample Record in Generic Section : '+JSON.stringify(component.get("v.simpleRecord")));
        var isCustomsave = component.get("v.customSaveFlag");
        var CheckBooleanforStandardFlag = component.get("v.CheckBooleanforStandardFlag");
        if(isCustomsave)
        {            
            if(CheckBooleanforStandardFlag){
                console.log('Errors To be Captured : '+JSON.stringify(component.get("v.sampleError")));
                if(component.get("v.isNewRec") == true)
                    helper.handleSaveRecord(component, event, helper,"recordCreator");
                else{
                    
                    helper.handleSaveRecord(component, event, helper,"recordEditor");
                }
            }
            var appEvent = component.getEvent("cmpSaveEvent");
            var fields = event.getParam("fields");
            
            appEvent.setParams({
                "recordId":component.get("v.recordId"),
                "fields":fields
            });
            appEvent.fire();
            
        }
        else
        {
            if(component.get("v.isNewRec") == true)
                helper.handleSaveRecord(component, event, helper,"recordCreator");
            else{
                helper.handleSaveRecord(component, event, helper,"recordEditor");
                //console.log('Errors To be Captured : '+JSON.stringify(component.get("v.sampleError")));
            }
        }
    },
    recordUpdated: function (component, event, helper) {
        if(component.get("v.isNewRec") == true)
            helper.recordUpdated(component, event, helper,"recordCreator");
        else
            helper.recordUpdated(component, event, helper,"recordEditor");
    },
    modeChanged :function(component, event, helper) {
        helper.setMode(component, event, helper);
    },
    handleCancel: function(component, event, helper) {
        if(!(component.get("v.isNewRec"))){ component.find("recordEditor").reloadRecord();}
        var appCancelEvent = component.getEvent("cmpCancelEvent");
        appCancelEvent.setParams({
            "recordId":component.get("v.SrecordId")
        });
        appCancelEvent.fire();
        //component.set("v.displayMode", 'read');
    },
    handleRecordUpdated : function(component, event, helper) {
   /* var changeType = event.getParams().changeType;
    else if (changeType === "CHANGED") { 
      //alert('hello');
      component.find("recordCreator").reloadRecord();
     }*/
    }
   /* handleDelete: function(component, event, helper) {
        var appCancelEvent = component.getEvent("cmpCancelEvent");
        appCancelEvent.setParams({
            "recordId":component.get("v.SrecordId")
        });
        appCancelEvent.fire();
    }*/
})