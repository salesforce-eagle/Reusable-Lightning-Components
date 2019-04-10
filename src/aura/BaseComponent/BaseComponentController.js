({
    callServer : function(component, method, callback, params, setStorable) {
        var action = component.get(method);
        
        //Set params if any
        if (params) {
            action.setParams(params);
        }
        /**	This will be use for Cache the response based on the 
         ** Response Age, Refresh Age, Expireation Age
         **	This might not require for component that involves Data Change	**/
        if(setStorable){
            actions.setStorable();
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
    },
})