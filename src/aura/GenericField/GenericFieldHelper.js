({
    disableField : function(component, event, helper) {
        var myInputField = component.find("myInputField");
        var style = component.get("v.style");
        if(!style.includes('disabled')) {
            style += ' disabled';
        }
        component.set('v.style', style);
    },
    enableField : function(component, event, helper) {
        var myInputField = component.find("myInputField");
        var style = component.get("v.style");
        if(style.includes('disabled')) {
            style = style.replace('disabled', '');
        }
        component.set('v.style', style);
    },
    showField : function(component, event, helper) {
        component.set("v.showInput", true);
    },
    hideField : function(component, event, helper) {
        component.set("v.showInput", false);
    },
    blankAndDisable : function (component, event, helper) {
       	var myInputField = component.find("myInputField");
        if (myInputField.get('v.value') !== undefined && myInputField.get('v.value')!== '') {
          myInputField.set("v.fieldName", component.get('v.fieldApiName'));
          myInputField.set('v.value', ''); //blanking.
          myInputField.destroy();
          component.set("v.toggler", !component.get('v.toggler'));
          component.set("v.toggler", !component.get('v.toggler'));
          helper.doValueBinding(component, event, helper, "myInputField");
        }
        var style = component.get("v.style");
        if(!style.includes('disabled')) {
            style += ' disabled';
        }
        component.set('v.style', style);
    },
    nullField : function(component, event, helper) {
       	var myInputField = component.find("myInputField");
        myInputField.set("v.fieldName", component.get('v.fieldApiName'));
        myInputField.set('v.value', '');
    }
})